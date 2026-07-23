#!/usr/bin/env bash
# scripts/deploy-vibe.sh — Deploy the portfolio dist to the Armalo vibe Hetzner box.
#
# Replaces the Vercel auto-deploy path. Pairs with:
#   - infra/vibe-caddy.patch      (the Caddyfile addition for portfolio.armalo.ai)
#   - infra/vibe-container.sh     (the docker run that boots armalo-portfolio-web)
#   - infra/route53-portfolio.json (the Route53 A record for portfolio.armalo.ai)
#
# Run LOCALLY after `npm run build`:
#     ./scripts/deploy-vibe.sh                    # dry-run (prints what would happen)
#     ./scripts/deploy-vibe.sh --apply            # rsync + restart + smoke-test gate
#     ./scripts/deploy-vibe.sh --apply --no-smoke  # skip the post-deploy smoke gate
#                                                 # (only for the first interactive run;
#                                                 #  CI / non-interactive deploys must keep
#                                                 #  the smoke gate enabled)
#
# The --apply half runs the dist upload + container restart. It also runs
# scripts/portfolio-production-smoke.test.mjs against the live URL by default,
# so a broken deploy fails the deploy. The smoke gate is opt-out via
# --no-smoke, but CI / batch deploys must keep it on.
#
# This script only ever mutates the local dist/ upload + the named container
# on vibe; it never touches Route53, the Caddyfile, or any other
# armalo.ai-shared resource.
#
# Required env:
#   PORTFOLIO_VIBE_HOST       vibe box IP (default 5.78.90.97 — the prod cluster)
#   PORTFOLIO_VIBE_USER       ssh user (default root)
#   PORTFOLIO_VIBE_SSH_KEY    ssh key path (default ~/.ssh/armalo-vibe-test — the
#                              key already on this box's known_hosts for the
#                              armalo-vibe host alias; use hetzner-axi ssh
#                              in CI instead, which manages its own config)
#   PORTFOLIO_VIBE_DIST       remote dist path (default /opt/portfolio/dist)
#   PORTFOLIO_VIBE_CONTAINER  container name (default armalo-portfolio-web)
#   PORTFOLIO_PRODUCTION_URL  live URL the smoke gate probes (default
#                              https://portfolio.armalo.ai/)
set -euo pipefail

HOST="${PORTFOLIO_VIBE_HOST:-5.78.90.97}"
USER="${PORTFOLIO_VIBE_USER:-root}"
KEY="${PORTFOLIO_VIBE_SSH_KEY:-$HOME/.ssh/armalo-vibe-test}"
REMOTE_DIST="${PORTFOLIO_VIBE_DIST:-/opt/portfolio/dist}"
CONTAINER="${PORTFOLIO_VIBE_CONTAINER:-armalo-portfolio-web}"
PRODUCTION_URL="${PORTFOLIO_PRODUCTION_URL:-https://portfolio.armalo.ai/}"
APPLY=0
SMOKE=1
for arg in "$@"; do
  case "$arg" in
    --apply) APPLY=1 ;;
    --no-smoke) SMOKE=0 ;;
    --help|-h)
      sed -n '4,30p' "$0"; exit 0 ;;
  esac
done

if [[ ! -f dist/index.html ]]; then
  echo "error: dist/index.html missing — run \`npm run build\` first" >&2
  exit 2
fi

SSH=(ssh -i "$KEY" -o StrictHostKeyChecking=accept-new "${USER}@${HOST}")
RSYNC=(rsync -az --delete -e "ssh -i $KEY -o StrictHostKeyChecking=accept-new")

log() { printf '\033[36m[vibe-deploy]\033[0m %s\n' "$*"; }

log "target host       $HOST"
log "target dist path   $REMOTE_DIST"
log "container name     $CONTAINER"
log "smoke probe URL    $PRODUCTION_URL"
log "dist size on disk  $(du -sh dist | cut -f1)"
log "dry-run            $([[ $APPLY -eq 1 ]] && echo no || echo yes)"
log "smoke gate         $([[ $SMOKE -eq 1 ]] && echo on || echo off)"

if [[ $APPLY -eq 0 ]]; then
  log "dry-run: would ssh + rsync dist/ -> $HOST:$REMOTE_DIST"
  log "dry-run: would restart container $CONTAINER if present"
  log "dry-run: would smoke-test against $PRODUCTION_URL"
  log "use --apply to execute"
  exit 0
fi

log "ensuring remote dist path exists"
"${SSH[@]}" "mkdir -p $REMOTE_DIST"

log "syncing dist/ -> $HOST:$REMOTE_DIST"
"${RSYNC[@]}" dist/ "${USER}@${HOST}:${REMOTE_DIST}/"

log "restarting container $CONTAINER (if present)"
"${SSH[@]}" "docker ps --format '{{.Names}}' | grep -q '^${CONTAINER}\$' && docker restart ${CONTAINER} || echo 'container absent; the operator must run infra/vibe-container.sh first'"

log "local probe"
"${SSH[@]}" "curl -s -o /dev/null -w 'local http %{http_code} %{size_download}b\\n' http://127.0.0.1:3030/ || echo 'local probe failed; is the container running?'"

if [[ $SMOKE -eq 1 ]]; then
  log "post-deploy smoke gate -> $PRODUCTION_URL"
  if PORTFOLIO_PRODUCTION_URL="$PRODUCTION_URL" \
     PORTFOLIO_VERIFY_PRODUCTION=1 \
     PORTFOLIO_SKIP_NPM_AUDIT=1 \
     node --test scripts/portfolio-production-smoke.test.mjs; then
    log "smoke gate OK"
  else
    echo "[vibe-deploy] ERROR: smoke gate failed against $PRODUCTION_URL" >&2
    echo "[vibe-deploy] the dist upload + container restart already happened" >&2
    echo "[vibe-deploy] inspect the live URL, fix the regression, redeploy" >&2
    exit 3
  fi
else
  log "smoke gate SKIPPED (--no-smoke); the deploy is not gated"
fi

log "done"