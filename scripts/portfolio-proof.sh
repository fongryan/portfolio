#!/usr/bin/env bash
# portfolio-proof.sh — the canonical local, CI, and Vercel promotion gate.
set -euo pipefail

root="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$root"

lock_dir="${PORTFOLIO_PROOF_LOCK_DIR:-$root/.portfolio-proof.lock}"
lock_timeout="${PORTFOLIO_PROOF_LOCK_TIMEOUT_SECONDS:-120}"
stale_grace="${PORTFOLIO_PROOF_LOCK_STALE_GRACE_SECONDS:-2}"
lock_owned=0
owner_dir="$lock_dir/owner.$$"
claim_sequence=0

say() { printf '%s\n' "$*"; }

if ! [[ "$lock_timeout" =~ ^[0-9]+$ ]] || [[ "$lock_timeout" -lt 1 ]]; then
  printf 'error: PORTFOLIO_PROOF_LOCK_TIMEOUT_SECONDS must be a positive integer\n' >&2
  exit 2
fi
if ! [[ "$stale_grace" =~ ^[0-9]+$ ]] || [[ "$stale_grace" -lt 1 ]]; then
  printf 'error: PORTFOLIO_PROOF_LOCK_STALE_GRACE_SECONDS must be a positive integer\n' >&2
  exit 2
fi

path_mtime() {
  stat -c %Y "$1" 2>/dev/null || stat -f %m "$1" 2>/dev/null
}

claim_stale_owner() {
  local stale_owner="$1" stale_kind="$2" stale_pid="${3:-}"
  local claim_dir="${lock_dir}.stale-claim.$$.$claim_sequence"
  claim_sequence=$((claim_sequence + 1))

  # Moving the exact owner entry, rather than the shared lock pathname, is the
  # compare-and-claim step. A replacement owner has a different entry and can
  # never be removed by this waiter.
  if ! mv "$stale_owner" "$claim_dir" 2>/dev/null; then
    return 1
  fi

  if [[ "$stale_kind" == "dead" ]] && kill -0 "$stale_pid" 2>/dev/null; then
    # PID reuse happened between observation and claim. Restore the owner while
    # the containing lock directory still exists, then treat it as live.
    mv "$claim_dir" "$stale_owner"
    return 1
  fi

  if rmdir "$lock_dir" 2>/dev/null; then
    rm -rf "$claim_dir"
    if [[ "$stale_kind" == "dead" ]]; then
      say "recovered stale proof lock from PID $stale_pid"
    else
      say "recovered stale proof lock with malformed PID"
    fi
    return 0
  fi

  # Another owner entry appeared before rmdir. Delete only the entry already
  # claimed as stale; never remove the shared lock or the replacement owner.
  rm -rf "$claim_dir"
  return 1
}

cleanup() {
  if [[ "$lock_owned" -eq 1 ]] && [[ -d "$owner_dir" ]]; then
    rmdir "$owner_dir" 2>/dev/null || true
    rmdir "$lock_dir" 2>/dev/null || true
  fi
}
trap cleanup EXIT
trap 'exit 129' HUP
trap 'exit 130' INT
trap 'exit 143' TERM

started_at=$SECONDS
while true; do
  if mkdir "$lock_dir" 2>/dev/null; then
    if mkdir "$owner_dir" 2>/dev/null; then
      lock_owned=1
      break
    fi
    rmdir "$lock_dir" 2>/dev/null || true
    printf 'error: could not record portfolio proof lock owner PID %s\n' "$$" >&2
    exit 1
  fi

  holder_pid=""
  owner_kind="missing"
  owner_path=""
  shopt -s nullglob dotglob
  lock_entries=("$lock_dir"/*)
  shopt -u nullglob dotglob

  if [[ "${#lock_entries[@]}" -eq 1 ]]; then
    owner_path="${lock_entries[0]}"
    owner_name="$(basename "$owner_path")"
    if [[ -d "$owner_path" && "$owner_name" =~ ^owner\.([0-9]+)$ ]]; then
      holder_pid="${BASH_REMATCH[1]}"
      owner_kind="valid"
    else
      owner_kind="malformed"
    fi
  fi

  if [[ "$owner_kind" == "valid" ]] && ! kill -0 "$holder_pid" 2>/dev/null; then
    if claim_stale_owner "$owner_path" dead "$holder_pid"; then
      continue
    fi
  fi

  if [[ "$owner_kind" != "valid" ]]; then
    lock_mtime="$(path_mtime "$lock_dir" || true)"
    now="$(date +%s)"
    if [[ "$lock_mtime" =~ ^[0-9]+$ ]] \
      && [[ $((now - lock_mtime)) -ge "$stale_grace" ]]; then
      if [[ "$owner_kind" == "missing" ]]; then
        if rmdir "$lock_dir" 2>/dev/null; then
          say "recovered stale proof lock with missing PID"
          continue
        fi
      else
        if claim_stale_owner "$owner_path" malformed; then
          continue
        fi
      fi
    fi
  fi

  elapsed=$((SECONDS - started_at))
  if [[ "$elapsed" -ge "$lock_timeout" ]]; then
    if [[ "$holder_pid" =~ ^[0-9]+$ ]]; then
      printf 'error: timed out after %ss waiting for portfolio proof lock (held by PID %s)\n' \
        "$lock_timeout" "$holder_pid" >&2
    else
      printf 'error: timed out after %ss waiting for portfolio proof lock (holder PID unavailable)\n' \
        "$lock_timeout" >&2
    fi
    exit 1
  fi
  sleep 1
done

say "portfolio proof lock acquired (PID $$)"

if [[ "${PORTFOLIO_PROOF_LOCK_ONLY:-0}" == "1" ]]; then
  hold_seconds="${PORTFOLIO_PROOF_LOCK_HOLD_SECONDS:-0}"
  if ! [[ "$hold_seconds" =~ ^[0-9]+$ ]]; then
    printf 'error: PORTFOLIO_PROOF_LOCK_HOLD_SECONDS must be a non-negative integer\n' >&2
    exit 2
  fi
  if [[ "$hold_seconds" -gt 0 ]]; then
    sleep "$hold_seconds"
  fi
  say "portfolio proof lock-only check passed"
  exit 0
fi

say "[1/7] formatting"
npm run format:check

say "[2/7] deterministic tests"
npm test

say "[3/7] Astro diagnostics"
npm run check

say "[4/7] production build"
npm run build

say "[5/7] generated-output contracts"
npm run test:output

say "[6/7] performance budget"
npm run budget

say "[7/7] public-safety doctor"
PORTFOLIO_DOCTOR_SKIP_BUILD=1 ./scripts/portfolio-doctor.sh

say "ok: portfolio proof completed; dist/ is ready to publish"
