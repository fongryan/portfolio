# infra/handoff.md — operator packet for the portfolio.armalo.ai migration.

This packet is the work breakdown a T1+ agent or the owner needs to execute
to move the portfolio off Vercel and onto the Armalo vibe Hetzner box. The
portfolio repo side is already done: `scripts/deploy-vibe.sh` ships `dist/`
over SSH, and the proof gate (`npm run proof`) is green on commit `6eabe5c`.

## Why this is a T1+ / human-gated handoff

Per `AWS-OPS.md` "Mutations are dry-run by default" and "Creation gate":

- Route53 changes on `armalo.ai` are `ROOT_DOMAIN_OK`-gated and are T1+
  (Sonnet / codex) or human-gated. The persistent markers
  (`AWS_SPEND_OK=1`, `ROOT_DOMAIN_OK=1`) waive re-asking but do not
  waive the lane contract.
- The Caddyfile on `vibe` (`/root/Caddyfile.unified`) is bind-mounted
  read-only into the serving container; editing it is a serving-
  container mutation.
- Booting `armalo-portfolio-web` on `vibe` is a `docker run` on a
  prod cluster.

This file names exactly what to do and how to verify each step.

## Pre-flight

```sh
hetzner-axi guard vibe       # must say GUARD OK
hetzner-axi resources vibe   # disk < 90%; warn if 86%+ (already there)
hetzner-axi status          # vibe watchdog overall:ok
```

If `guard` returns `GUARD HOLD`, stop and resolve with whoever owns the
session (per INFRA-OPS.md rule 1).

## Step 1 — DNS (Route53)

Apply the A record. The change-batch JSON is at
`infra/route53-portfolio.json`. Hosted zone ID is
`Z052129738FEO6BQJEN9J` (the `armalo.ai.` zone).

```sh
cd "$PORTFOLIO_REPO"        # the working copy on the operator's machine
aws route53 change-resource-record-sets \
  --hosted-zone-id Z052129738FEO6BQJEN9J \
  --change-batch file://"$PORTFOLIO_REPO/infra/route53-portfolio.json"
```

Verify:

```sh
aws route53 list-resource-record-sets \
  --hosted-zone-id Z052129738FEO6BQJEN9J \
  --query "ResourceRecordSets[?Name == 'portfolio.armalo.ai.']" \
  --output table
aws-axi dns portfolio.armalo.ai
```

Expected: one `A` record with value `5.78.90.97`; `aws-axi dns` returns
`http=200` once Caddy + the container are live.

## Step 2 — Caddy on vibe

Append the block in `infra/vibe-caddy.patch` to `/root/Caddyfile.unified`,
then reload Caddy inside the container:

```sh
hetzner-axi ssh vibe "cat $PORTFOLIO_REPO/infra/vibe-caddy.patch >> /root/Caddyfile.unified"
hetzner-axi ssh vibe 'docker exec armalo-caddy-unified caddy reload --config /etc/caddy/Caddyfile'
```

Verify:

```sh
hetzner-axi ssh vibe 'docker logs armalo-caddy-unified --since 1m --lines 30'
# Should show "reloading config" without errors.
```

## Step 3 — Container on vibe

Copy the static-server script to the box and run it:

```sh
hetzner-axi ssh vibe 'mkdir -p /opt/portfolio/dist'
# Build the dist locally (already done — see step 4) and rsync over.
# Then boot the container:
hetzner-axi ssh vibe 'bash -s' < "$PORTFOLIO_REPO/infra/vibe-container.sh"
```

Verify:

```sh
hetzner-axi containers vibe | grep armalo-portfolio-web
# Should show restart_policy=unless-stopped and started_at = now.
hetzner-axi ssh vibe 'curl -sSI http://127.0.0.1:3030/'
# Should return HTTP 200 + the security headers from the nginx.conf.
```

## Step 4 — Upload the build

```sh
cd "$PORTFOLIO_REPO"
npm run build                   # already green; rebuild only if dist/ is stale.
./scripts/deploy-vibe.sh --apply
```

This rsyncs `dist/` to `/opt/portfolio/dist/` on vibe and (if the container
is already running) restarts it so the long-cache headers pick up the new
hashed assets. The `--apply` flag is what flips the dry-run off; the
script exits 0 with no side effects if `--apply` is omitted.

## Step 5 — End-to-end verification

```sh
# DNS:
aws-axi dns portfolio.armalo.ai
# Should return dns=OK, http=200, t=~0.05s.

# Headers + catalogue:
curl -sSI https://portfolio.armalo.ai/
curl -sS https://portfolio.armalo.ai/ | grep -oE 'href="/apps/[a-z0-9-]+"' | sort -u | wc -l
# 41.

# Production smoke test (env-gated, runs the same assertions as CI):
cd "$PORTFOLIO_REPO"
PORTFOLIO_PRODUCTION_URL=https://portfolio.armalo.ai \
  PORTFOLIO_VERIFY_PRODUCTION=1 PORTFOLIO_SKIP_NPM_AUDIT=1 \
  node --test scripts/portfolio-production-smoke.test.mjs
```

Expected: 4/4 pass against `https://portfolio.armalo.ai/`. If any fails, the
smoke test prints the exact missing header or product.

## Step 6 — Disconnect Vercel

The Vercel auto-deploy fires on every push to `main`. After the
`portfolio.armalo.ai` cutover it should stop:

1. Open https://vercel.com/ryanrfonggmailcoms-projects/portfolio/settings/git
2. Either disconnect the GitHub integration (Settings → Git → Disconnect)
   or archive the project (Settings → General → Archive Project).
3. `vercel ls --prod` should stop producing new deploys after the next push.

This step is owner-only — Vercel-side, no API path that I (or any agent
on this box) can hit without a personal token.

## Step 7 — Update portfolio repo

Once the live cutover is verified, the repo can move `vercel.json` to a
marker file noting the off-Vercel move. Don't delete it outright until
Step 6 is done — Vercel reads `vercel.json` to decide how to build, and an
empty file could trigger its framework detector to fall back to defaults.

After Step 6, the cleanup is:

```sh
cd "$PORTFOLIO_REPO"
git rm vercel.json
# Update README + AGENTS.md to drop the Vercel deployment language.
# Update TASKS.md to mark "Verify portfolio.armalo.ai cutover" done.
```

The `PORTFOLIO_REPO` env var is the absolute path of the working copy on
the operator's machine — set it once at the top of the session:

```sh
export PORTFOLIO_REPO="$HOME/workspace/portfolio"
```

## Rollback

If the cutover fails any of the verification steps:

1. `hetzner-axi ssh vibe 'docker exec armalo-caddy-unified caddy reload --config /etc/caddy/Caddyfile'`
   with the previous Caddyfile (drop the `portfolio.armalo.ai { ... }` block
   before reloading).
2. `hetzner-axi ssh vibe 'docker rm -f armalo-portfolio-web'`
3. `aws route53 delete-resource-record-sets --hosted-zone-id Z052129738FEO6BQJEN9J --change-batch <inverse-of-route53-portfolio.json>`
   (same shape, `Action: DELETE`).
4. The portfolio remains reachable at
   `https://portfolio-peach-sigma-85.vercel.app/` while Vercel still
   serves it.
