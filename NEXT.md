# NEXT.md — deep full TODO list for the next agent

Live state on 2026-07-23, after the contrast-fix and smoke-gated
deploy cycle. Read this first if you're picking the portfolio back up.

## Where we are

- `https://portfolio.armalo.ai/` is live, served by `armalo-portfolio-web`
  (nginx:alpine, `--restart unless-stopped`, dist bind-mounted RO) on
  the Armalo vibe Hetzner box (5.78.90.97) behind the unified Caddy.
- TLS via Let's Encrypt (ACME through Caddy); cert auto-renews.
- The Vercel project is disconnected (`vercel git disconnect --yes`)
  and just serves a stale build at
  `portfolio-peach-sigma-85.vercel.app`. Deletion is owner-only.
- The deploy path is `bash scripts/deploy-vibe.sh --apply` from the
  portfolio repo root. It rsyncs `dist/`, restarts the container, and
  runs `PORTFOLIO_VERIFY_PRODUCTION=1 npm test
scripts/portfolio-production-smoke.test.mjs` against the live URL
  as a deployment gate.
- 12 commits on `main` this session: 894a80a → 5f43656 → 67b7412 →
  cf58bad → 6eabe5c → 1ac4663 → 74fc882 → 19bc4de → e872e25 → 9679036
  → e9131ed → bad22a5.
- 23/73 contract tests pass locally; 4/4 live smoke tests pass;
  0 fail.

## Open work, ranked by impact

1. **Vercel project removal** (owner-only). The disconnected Vercel
   project still bills a small amount for the stale build. Log in
   at https://vercel.com/ryanrfonggmailcoms-projects/portfolio and
   delete, or run `vercel login && vercel project remove portfolio`
   in an interactive terminal. Documented in `TASKS.md`
   "Disconnect the Vercel project".
2. **Dependabot alert closure** (async, no action). The 3 GHSAs from
   2026-07-21 are still showing `state=open` from the previous scan.
   The substantive evidence the fix is in is `npm audit` clean and
   the live production smoke test 4/4. Recheck hourly; dismiss
   manually if still open after 4h.
3. **Root-owned npm cache collision** (workstation hygiene). The file
   at `~/.npm/_cacache/content-v2/sha512/73/15/8d3deb029d009...` is
   owned by root, so `npm install` against the default cache fails
   with `EACCES`. The `/tmp/npm-cache-portfolio` workaround is the
   standing fix; a one-time `sudo rm` of the offending path closes
   the issue permanently. See `docs/security/dependency-updates.md`.
4. **Agent lane: restore the Vercel CLI auth**. The session
   accidentally ran `vercel logout` mid-investigation, clearing the
   keychain entry. Re-auth needs browser OAuth. Not blocking any
   portfolio work; only blocks direct Vercel-API calls from this
   session.
5. **Visual regression suite**. The contrast regression guard
   (`scripts/site-output.test.mjs`) is good at catching the
   specific 2026-07-23 failure mode. A more general "render the
   homepage and snapshot the computed styles for every visible
   element" suite (Puppeteer + axe-core) would catch other contrast
   / a11y regressions on future restyles. Out of scope unless the
   owner asks.

## Hardened invariants (don't break these without thinking)

- The `armalo-portfolio-web` container on vibe runs nginx:alpine with
  the custom `nginx.conf` baked by `infra/vibe-container.sh`. The
  default.conf is removed in the same script because
  `default.conf` won the `:80` listener conflict on the first cutover
  and silently overrode the add_header directives.
- The Caddyfile on vibe lives at `/root/Caddyfile.unified` (bind-mounted
  read-only into the caddy container at `/etc/caddy/Caddyfile`).
  Apply changes by appending to the host file and reloading via
  `docker exec armalo-caddy-unified caddy reload --config
/etc/caddy/Caddyfile`.
- `infra/vibe-caddy.patch` is the canonical patch for the
  portfolio.armalo.ai block; the operator packet in
  `infra/handoff.md` documents how to re-apply if Caddy config
  ever needs to be regenerated.
- `vercel.json` is an inert sentinel. The active deployment config
  lives in `infra/`. Do not resurrect the live config in
  `vercel.json` — `scripts/portfolio-deploy-contract.test.mjs`
  asserts `headers: []` and a buildCommand that announces the
  off-Vercel move.
- `--color-ink` and `--color-paper` are the only two color tokens
  that the catalogue contrast depends on. They MUST be declared at
  `:root` in the light-mode baseline and MUST be re-declared inside
  `@media (prefers-color-scheme: dark) { :root { ... } }` for the
  dark override. A naked `@theme` inside the media query is the bug
  that caused the 2026-07-23 regression and is caught by the
  contrast guard in `scripts/site-output.test.mjs`.

## How to re-deploy

```sh
cd "$PORTFOLIO_REPO"   # the portfolio working copy
npm run proof          # 7/7 phases green locally
git push origin main   # if there are new commits
bash scripts/deploy-vibe.sh --apply
# The script does the rsync + container restart + smoke gate. If the
# smoke gate fails, the deploy is incomplete; the script exits 3
# with a clear "inspect the live URL, fix the regression, redeploy"
# message.
```

For a one-off edit to the nginx.conf or Caddyfile, see
`infra/handoff.md` step 2-3. Don't re-run the full handoff packet
after the first cutover — the patch is already in place; just edit
the relevant file on the box and reload.

## What the user observed that drove the 2026-07-23 contrast fix

> "the text in https://portfolio.armalo.ai/ is hard to read.
> [Image] there isn't enough contrast in the text to read it clearly"

The screenshot showed the catalogue cards with white background and
near-white text (the dark-mode ink value clobbering the light-mode
default). The fix: `src/styles/global.css` now uses `:root { ... }`
inside the `@media (prefers-color-scheme: dark)` block instead of a
nested `@theme { ... }`, so the dark-mode tokens are properly
media-scoped. The next deploy (already shipped) put the fix on
`https://portfolio.armalo.ai/`.

## Files that matter for the next session

- `src/styles/global.css` — design tokens. Light mode at `:root`,
  dark mode inside `@media (prefers-color-scheme: dark) { :root { ... } }`.
- `astro.config.mjs` — `site: process.env.PORTFOLIO_SITE_URL ?? "https://portfolio.armalo.ai/"`.
- `infra/handoff.md` — operator packet for the off-Vercel move.
- `infra/vibe-caddy.patch` — Caddy block for portfolio.armalo.ai.
- `infra/vibe-container.sh` — `armalo-portfolio-web` `docker run`.
- `infra/route53-portfolio.json` — Route53 UPSERT A record.
- `scripts/deploy-vibe.sh` — dry-run by default; `--apply` deploys
  with the smoke gate.
- `scripts/portfolio-production-smoke.test.mjs` — 4-test env-gated
  live-URL gate.
- `scripts/portfolio-deps-security.test.mjs` — npm-overrides
  regression guard.
- `scripts/portfolio-deploy-contract.test.mjs` — infra/-shaped
  deployment contract.
- `scripts/site-output.test.mjs` — catalog/site/output contract,
  including the contrast regression guard.
- `docs/security/dependency-updates.md` — npm security policy.
- `TASKS.md` — current state of all task lanes.
