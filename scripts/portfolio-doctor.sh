#!/usr/bin/env bash
# portfolio-doctor.sh — repo health + public-safety gate.
#
# This repo is PUBLIC. The doctor must fail before any change that could leak a
# secret, expose private topology, or break the build. Run it before committing.
# AGENTS.md / CLAUDE.md require it.
set -euo pipefail

root="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$root"

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

say "portfolio doctor"
say "root: $root"

# --- Canonical files ----------------------------------------------------------
require_file AGENTS.md
require_file CLAUDE.md
require_file README.md
require_file package.json
require_file astro.config.mjs
require_file .gitignore

# --- AGENTS.md carries the locked-in cracked-dev-workflow block ---------------
if grep -q "BEGIN RYAN CRACKED DEV WORKFLOW" AGENTS.md \
  && grep -q "END RYAN CRACKED DEV WORKFLOW" AGENTS.md; then
  ok "AGENTS.md carries the cracked-dev-workflow block"
else
  err "AGENTS.md is missing the locked-in cracked-dev-workflow block"
fi

# CLAUDE.md must point to the same rules as AGENTS.md (symlink or identical).
if [[ -L CLAUDE.md ]]; then
  ok "CLAUDE.md -> $(readlink CLAUDE.md)"
else
  warn "CLAUDE.md is not a symlink to AGENTS.md (Claude Code may read divergent rules)"
fi

# --- Captain stack ------------------------------------------------------------
check_tool git required
check_tool node required
check_tool npm required
check_tool rg optional
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
if git status --short --branch >"$git_status_tmp" 2>/dev/null; then
  say "git:"
  sed 's/^/  /' "$git_status_tmp"
else
  warn "not a git repo or git status unavailable"
fi

# --- Public-safety scan -------------------------------------------------------
# This repo is public. Scan committed/trackable content for secrets and private
# topology. Captain-stack pointers inside AGENTS.md / CLAUDE.md are intentional
# operational references (audited by check-captain-stack.sh) and are exempted
# from the private-path scan only; the secret scan has no exemptions.
if command -v rg >/dev/null 2>&1; then
  say "public-safety scan:"

  secret_patterns=(
    'sk-[A-Za-z0-9_-]{20,}'
    'sk-ant-[A-Za-z0-9_-]{20,}'
    'OPENAI_API_KEY|ANTHROPIC_API_KEY|AWS_SECRET_ACCESS_KEY|GITHUB_TOKEN|SLACK_BOT_TOKEN|STRIPE_SECRET_KEY'
    'BEGIN (RSA|OPENSSH|EC|DSA|PGP) PRIVATE KEY'
    'xox[baprs]-[A-Za-z0-9-]+'
    'AKIA[0-9A-Z]{16}'
    'ghp_[A-Za-z0-9]{36,}'
    'gho_[A-Za-z0-9]{36,}'
  )
  for pattern in "${secret_patterns[@]}"; do
    scan_tmp="$(mktemp "${TMPDIR:-/tmp}/portfolio-secret.XXXXXX")"
    tmp_files+=("$scan_tmp")
    if rg -n --hidden \
        --glob '!.git' --glob '!.git/**' --glob '!node_modules/**' \
        --glob '!.astro/**' --glob '!dist/**' \
        --glob '!scripts/portfolio-doctor.sh' \
        "$pattern" . >"$scan_tmp"; then
      err "possible secret leaked: $pattern"
      sed 's/^/  /' "$scan_tmp"
    fi
  done

  path_scan_tmp="$(mktemp "${TMPDIR:-/tmp}/portfolio-path.XXXXXX")"
  tmp_files+=("$path_scan_tmp")
  # Private absolute paths outside the intentional captain-stack pointer files.
  if rg -n --hidden \
      --glob '!.git' --glob '!.git/**' --glob '!node_modules/**' \
      --glob '!.astro/**' --glob '!dist/**' \
      --glob '!AGENTS.md' --glob '!CLAUDE.md' \
      --glob '!scripts/portfolio-doctor.sh' --glob '!.gitignore' \
      '/Users/|/home/|C:\\Users\\' . >"$path_scan_tmp"; then
    warn "possible private local path (review; OK if sanitized example):"
    sed 's/^/  /' "$path_scan_tmp"
    # Paths are a soft warning for a public repo: fail only on obvious private
    # topology (brain/vault/private project internals), not on docs/examples.
    if rg -n '/Users/ryan|/home/ryan|vault/|/brain/' "$path_scan_tmp" >/dev/null 2>&1; then
      err "private topology path leaked outside AGENTS.md/CLAUDE.md"
    fi
  fi

  env_tmp="$(mktemp "${TMPDIR:-/tmp}/portfolio-env.XXXXXX")"
  tmp_files+=("$env_tmp")
  if rg -n --hidden \
      --glob '!.git' --glob '!.git/**' --glob '!node_modules/**' \
      --glob '!.gitignore' --glob '!AGENTS.md' --glob '!CLAUDE.md' \
      '(^|[^.[:alnum:]_])\.env(\.|$)' . >"$env_tmp"; then
    err ".env reference outside allowed files:"
    sed 's/^/  /' "$env_tmp"
  fi
else
  warn "ripgrep unavailable; skipped content scan (install rg for full gate)"
fi

# --- Build gate (opt-out, runs by default once dependencies exist) ------------
if [[ -f package.json ]]; then
  if [[ -d node_modules ]]; then
    if [[ "${PORTFOLIO_DOCTOR_SKIP_BUILD:-0}" == "1" ]]; then
      warn "build skipped (PORTFOLIO_DOCTOR_SKIP_BUILD=1)"
    else
      say "build + type check:"
      if npm run check >/tmp/portfolio-doctor-check.log 2>&1 \
        && npm run build >/tmp/portfolio-doctor-build.log 2>&1; then
        ok "npm run check + npm run build passed"
      else
        err "build or check failed (see /tmp/portfolio-doctor-{check,build}.log)"
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
