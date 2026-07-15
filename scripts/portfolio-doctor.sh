#!/usr/bin/env bash
# portfolio-doctor.sh — repo health + public-safety gate.
#
# This repo is PUBLIC. The doctor must fail before any change that could leak a
# secret, expose private topology, or break the build. Run it before committing.
# AGENTS.md / CLAUDE.md require it.
set -euo pipefail

root="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$root"
git_mode=0
if [[ "$(git rev-parse --is-inside-work-tree 2>/dev/null || true)" == "true" ]]; then
  git_mode=1
fi

fail=0
tmp_files=()

cleanup() {
  if [[ "${#tmp_files[@]}" -gt 0 ]]; then
    rm -f "${tmp_files[@]}"
  fi
}
trap cleanup EXIT

say()  { printf '%s\n' "$*"; }
ok()   { say "ok: $*"; }
warn() { say "warn: $*"; }
err()  { say "error: $*"; fail=1; }

require_file() {
  if [[ -f "$1" ]]; then ok "found $1"; else err "missing $1"; fi
}

check_tool() {
  local name="$1" required="${2:-optional}"
  if command -v "$name" >/dev/null 2>&1; then
    ok "tool $name -> $(command -v "$name")"
  elif [[ "$required" == "required" ]]; then
    err "required tool missing: $name"
  else
    warn "optional tool missing: $name"
  fi
}

files_equal() {
  node -e '
    const fs = require("node:fs");
    const [left, right] = process.argv.slice(1);
    process.exit(fs.readFileSync(left).equals(fs.readFileSync(right)) ? 0 : 1);
  ' "$1" "$2"
}

say "portfolio doctor"
say "root: $root"

# --- Canonical files ----------------------------------------------------------
require_file AGENTS.md
require_file CLAUDE.md
require_file README.md
require_file package.json
require_file astro.config.mjs
if [[ "$git_mode" -eq 1 ]]; then
  require_file .gitignore
else
  ok "archive mode does not require .gitignore"
fi
require_file scripts/portfolio-proof.sh
require_file .github/workflows/ci.yml

# --- AGENTS.md carries the locked-in cracked-dev-workflow block ---------------
if grep -q "BEGIN RYAN CRACKED DEV WORKFLOW" AGENTS.md \
  && grep -q "END RYAN CRACKED DEV WORKFLOW" AGENTS.md; then
  ok "AGENTS.md carries the cracked-dev-workflow block"
else
  err "AGENTS.md is missing the locked-in cracked-dev-workflow block"
fi

# CLAUDE.md must point to the same rules as AGENTS.md (symlink or identical).
if [[ -L CLAUDE.md ]]; then
  claude_target="$(readlink CLAUDE.md 2>/dev/null || true)"
  if [[ "$claude_target" == "AGENTS.md" ]] && files_equal AGENTS.md CLAUDE.md; then
    ok "CLAUDE.md -> AGENTS.md"
  else
    err "CLAUDE.md symlink target must be exactly AGENTS.md"
  fi
elif files_equal AGENTS.md CLAUDE.md; then
  ok "CLAUDE.md is identical to AGENTS.md"
else
  err "CLAUDE.md must be a symlink to or identical with AGENTS.md"
fi

# --- Captain stack ------------------------------------------------------------
check_tool git required
check_tool node required
check_tool npm required
check_tool rg optional
check_tool find required
check_tool treehouse optional
check_tool no-mistakes optional
check_tool lavish-axi optional
check_tool gh-axi optional
check_tool chrome-devtools-axi optional
check_tool tasks-axi optional
check_tool quota-axi optional
check_tool gnhf optional
check_tool wheelhouse optional

# --- Git status snapshot ------------------------------------------------------
git_status_tmp="$(mktemp "${TMPDIR:-/tmp}/portfolio-git-status.XXXXXX")"
tmp_files+=("$git_status_tmp")
if [[ "$git_mode" -eq 0 ]]; then
  ok "archive mode: no Git status available"
elif git status --short --branch >"$git_status_tmp" 2>/dev/null; then
  say "git:"
  sed 's/^/  /' "$git_status_tmp"
else
  warn "not a git repo or git status unavailable"
fi

# --- Public-safety scan -------------------------------------------------------
# This repo is public. Build a NUL-safe scan set from Git's tracked files plus
# untracked, nonignored files. Explicit paths keep force-tracked ignored files
# visible to the scanner while local ignored files (including node_modules)
# stay out. The scanner uses required Node instead of assuming deployment
# archives provide a host-installed ripgrep binary.
say "public-safety scan:"

  raw_files_tmp="$(mktemp "${TMPDIR:-/tmp}/portfolio-files-raw.XXXXXX")"
  tmp_files+=("$raw_files_tmp")

  if [[ "$git_mode" -eq 1 ]]; then
    tracked_ignored_tmp="$(mktemp "${TMPDIR:-/tmp}/portfolio-tracked-ignored.XXXXXX")"
    tmp_files+=("$tracked_ignored_tmp")
    if git ls-files -z -ci --exclude-standard >"$tracked_ignored_tmp"; then
      if [[ -s "$tracked_ignored_tmp" ]]; then
        err "tracked files match ignore rules:"
        while IFS= read -r -d '' file; do
          say "  $file"
        done <"$tracked_ignored_tmp"
      fi
    else
      err "could not enumerate tracked files that match ignore rules"
    fi

    if ! {
      git ls-files -z --cached
      git ls-files -z --others --exclude-standard
    } >"$raw_files_tmp"; then
      err "could not enumerate current Git files for public-safety scan"
    fi
  else
    say "archive mode: scanning uploaded filesystem files"
    if ! find . \
        \( -type d \( \
          -name .git -o -name node_modules -o -name .astro \
          -o -name dist -o -name .vercel -o -name .output \
          -o -name .cache -o -name coverage -o -name build \
          -o -name .no-mistakes -o -name .treehouse \
          -o -name .firstmate -o -name .lavish \
        \) -prune \) -o \
        \( -type f -o -type l \) -print0 >"$raw_files_tmp"; then
      err "could not enumerate uploaded filesystem files for public-safety scan"
    fi
  fi

  secret_scan_files=()
  path_scan_files=()
  env_scan_files=()
  while IFS= read -r -d '' file; do
    file="${file#./}"
    if [[ -L "$file" ]]; then
      symlink_target="$(readlink "$file" 2>/dev/null || true)"
      if [[ "$file" == "CLAUDE.md" && "$symlink_target" == "AGENTS.md" ]] \
        && files_equal AGENTS.md CLAUDE.md; then
        continue
      fi
      err "symlink is not public-safe: $file -> $symlink_target"
      continue
    fi
    [[ -f "$file" ]] || continue
    case "$file" in
      node_modules/* | .astro/* | dist/*) continue ;;
    esac

    if [[ "$file" != "scripts/portfolio-doctor.sh" ]]; then
      secret_scan_files+=("$file")
    fi
    case "$file" in
      AGENTS.md | CLAUDE.md | scripts/portfolio-doctor.sh | .gitignore) ;;
      *) path_scan_files+=("$file") ;;
    esac
    case "$file" in
      AGENTS.md | CLAUDE.md | .gitignore) ;;
      *) env_scan_files+=("$file") ;;
    esac
  done <"$raw_files_tmp"

  scan_files() {
    local output_file="$1" pattern="$2"
    shift 2
    if [[ "$#" -eq 0 ]]; then
      return 1
    fi
    local scan_status=0
    PORTFOLIO_SCAN_PATTERN="$pattern" node - "$@" >"$output_file" <<'NODE' \
      || scan_status=$?
const fs = require("node:fs");

let pattern;
try {
  pattern = new RegExp(process.env.PORTFOLIO_SCAN_PATTERN);
} catch (error) {
  console.error(`invalid public-safety pattern: ${error.message}`);
  process.exit(2);
}

let matched = false;
for (const file of process.argv.slice(2)) {
  let contents;
  try {
    contents = fs.readFileSync(file, "utf8");
  } catch (error) {
    console.error(`could not scan ${file}: ${error.message}`);
    process.exitCode = 2;
    continue;
  }
  const lines = contents.split(/\r?\n/);
  for (let index = 0; index < lines.length; index += 1) {
    if (pattern.test(lines[index])) {
      console.log(`${file}:${index + 1}:${lines[index]}`);
      matched = true;
    }
  }
}

if (process.exitCode !== 2) {
  process.exitCode = matched ? 0 : 1;
}
NODE
    if [[ "$scan_status" -eq 0 ]]; then
      return 0
    fi
    if [[ "$scan_status" -gt 1 ]]; then
      err "public-safety scanner failed while scanning current files"
      return 2
    fi
    return 1
  }

  secret_patterns=(
    'sk-[A-Za-z0-9_-]{20,}'
    'sk-ant-[A-Za-z0-9_-]{20,}'
    'OPENAI(_API)?_KEY|ANTHROPIC(_API)?_KEY|AWS_SECRET_ACCESS(_KEY)?|GITHUB(_TOKEN|_KEY)|SLACK_BOT(_TOKEN|_KEY)|STRIPE_SECRET(_KEY)?'
    'BEGIN (RSA|OPENSSH|EC|DSA|PGP) PRIVATE KEY'
    'xox[baprs]-[A-Za-z0-9-]+'
    'AKIA[0-9A-Z]{16}'
    'ghp_[A-Za-z0-9]{36,}'
    'gho_[A-Za-z0-9]{36,}'
  )
  for pattern in "${secret_patterns[@]}"; do
    scan_tmp="$(mktemp "${TMPDIR:-/tmp}/portfolio-secret.XXXXXX")"
    tmp_files+=("$scan_tmp")
    if scan_files "$scan_tmp" "$pattern" "${secret_scan_files[@]}"; then
      err "possible secret leaked: $pattern"
      sed 's/^/  /' "$scan_tmp"
    fi
  done

  path_scan_tmp="$(mktemp "${TMPDIR:-/tmp}/portfolio-path.XXXXXX")"
  tmp_files+=("$path_scan_tmp")
  # Private absolute paths outside the intentional captain-stack pointer files.
  if scan_files "$path_scan_tmp" '/Users/|/home/|C:\\Users\\' \
      "${path_scan_files[@]}"; then
    warn "possible private local path (review; OK if sanitized example):"
    sed 's/^/  /' "$path_scan_tmp"
    # Paths are a soft warning for a public repo: fail only on obvious private
    # topology (brain/vault/private project internals), not on docs/examples.
    if grep -En '/Users/ryan|/home/ryan|vault/|/brain/' "$path_scan_tmp" >/dev/null 2>&1; then
      err "private topology path leaked outside AGENTS.md/CLAUDE.md"
    fi
  fi

  env_tmp="$(mktemp "${TMPDIR:-/tmp}/portfolio-env.XXXXXX")"
  tmp_files+=("$env_tmp")
  if scan_files "$env_tmp" '(^|[^.A-Za-z0-9_])\.env(\.|$)' \
      "${env_scan_files[@]}"; then
    err ".env reference outside allowed files:"
    sed 's/^/  /' "$env_tmp"
  fi

ok "public-safety scanner completed"

# --- Build gate (proof can skip this already-completed phase) -----------------
if [[ -f package.json ]]; then
  if [[ -d node_modules ]]; then
    if [[ "${PORTFOLIO_DOCTOR_SKIP_BUILD:-0}" == "1" ]]; then
      ok "check + build already completed by canonical proof"
    else
      say "build + type check:"
      check_log="$(mktemp "${TMPDIR:-/tmp}/portfolio-doctor-check.XXXXXX")"
      build_log="$(mktemp "${TMPDIR:-/tmp}/portfolio-doctor-build.XXXXXX")"
      tmp_files+=("$check_log" "$build_log")
      if npm run check >"$check_log" 2>&1 \
        && npm run build >"$build_log" 2>&1; then
        ok "npm run check + npm run build passed"
      else
        err "build or check failed"
        say "check output:"
        sed 's/^/  /' "$check_log"
        say "build output:"
        sed 's/^/  /' "$build_log"
      fi
    fi
  else
    warn "node_modules missing; run 'npm install' to enable the build gate"
  fi
fi

if [[ "$fail" -eq 0 ]]; then
  ok "doctor completed"
else
  err "doctor found issues"
fi
exit "$fail"
