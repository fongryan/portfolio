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
#     ./scripts/deploy-vibe.sh --apply            # rsync dist/ to vibe, restart container
#
# The --apply half never executes on its own — the call sites that flip dry-run
# off live in `infra/handoff.md` and are T1+ / human-gated per AWS-OPS.md
# "Mutations are dry-run by default". This script only ever mutates the local
# dist/ upload + the named container on vibe; it never touches Route53, the
# Caddyfile, or any other armalo.ai-shared resource.
#
# Required env:
#   PORTFOLIO_VIBE_HOST       vibe box IP (default 5.78.90.97 — the prod cluster)
#   PORTFOLIO_VIBE_USER       ssh user (default root)
#   PORTFOLIO_VIBE_SSH_KEY    ssh key path (default ~/.ssh/armalo-hetzner-test)
#   PORTFOLIO_VIBE_DIST       remote dist path (default /opt/portfolio/dist)
#   PORTFOLIO_VIBE_CONTAINER  container name (default armalo-portfolio-web)
set -euo pipefail

HOST="${PORTFOLIO_VIBE_HOST:-5.78.90.97}"
USER="${PORTFOLIO_VIBE_USER:-root}"
KEY="${PORTFOLIO_VIBE_SSH_KEY:-$HOME/.ssh/armalo-hetzner-test}"
REMOTE_DIST="${PORTFOLIO_VIBE_DIST:-/opt/portfolio/dist}"
CONTAINER="${PORTFOLIO_VIBE_CONTAINER:-armalo-portfolio-web}"
APPLY=0
[[ "${1:-}" == "--apply" ]] && APPLY=1

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
log "dist size on disk  $(du -sh dist | cut -f1)"
log "dry-run            $([[ $APPLY -eq 1 ]] && echo no || echo yes)"

if [[ $APPLY -eq 0 ]]; then
  log "dry-run: would ssh + rsync dist/ -> $HOST:$REMOTE_DIST"
  log "dry-run: would restart container $CONTAINER if present"
  log "use --apply to execute"
  exit 0
fi

log "ensuring remote dist path exists"
"${SSH[@]}" "mkdir -p $REMOTE_DIST"

log "syncing dist/ -> $HOST:$REMOTE_DIST"
"${RSYNC[@]}" dist/ "${USER}@${HOST}:${REMOTE_DIST}/"

log "restarting container $CONTAINER (if present)"
"${SSH[@]}" "docker ps --format '{{.Names}}' | grep -q '^${CONTAINER}\$' && docker restart ${CONTAINER} || echo 'container absent; the operator must run infra/vibe-container.sh first'"

log "smoke test from box"
"${SSH[@]}" "curl -s -o /dev/null -w 'local http %{http_code} %{size_download}b\\n' http://127.0.0.1:3030/ || echo 'local probe failed; is the container running?'"

log "done"