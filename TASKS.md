# TASKS

Living backlog for the portfolio repo. Last full sweep: 2026-07-23
after the 5f43656 security fix and the catalogue-grid commit
894a80a shipped. Each task carries a status, owner surface, and the
specific evidence that proves it done.

## Open

### Verify Dependabot auto-closes alerts after push

- Status: pending
- Owner: GitHub Dependabot (re-scan after push)
- Evidence: `gh api repos/fongryan/portfolio/dependabot/alerts?state=open`
  returns `[]` for the three GHSAs closed in 5f43656.
- Notes: As of 2026-07-23T05:54Z (3 minutes after push) the alerts
  were still `state=open`; GitHub re-scans asynchronously. If they
  are still open after ~1 hour, run `gh api -X POST
repos/fongryan/portfolio/dependabot/alerts/<n>/restore` is not
  available — instead re-push the lockfile to nudge the scanner, or
  dismiss manually with a reason of "fixed".

### Close the three Dependabot auto-PRs as superseded

- Status: pending
- PRs: #2 (astro-7.1.0), #3 (fast-uri-3.1.4), #4 (svgo-4.0.2)
- Action: comment on each pointing at commit 5f43656, then close.
- Evidence: `gh api repos/fongryan/portfolio/pulls/<n> --jq .state` returns
  `closed` for all three, with a comment that names 5f43656.
- Notes: The auto-PRs were created from the scanner's view of the
  pre-fix lockfile; once 5f43656 lands, the PRs are obsolete. Closing
  them rather than merging keeps the dependency history linear and
  avoids two-PR races on the next Dependabot cycle.

### Wire the deps-security test into the README's Commands list

- Status: pending
- Owner: src/pages
- Surface: `README.md` Commands section (around line 75-90)
- Action: add a one-line note that `npm test` now also runs
  `scripts/portfolio-deps-security.test.mjs`, so the test entry in
  `package.json` is the source of truth and the README mirrors it.
- Evidence: README's Commands section lists the test command and
  mentions the deps-security guard.

### Decide on the local-cache collision

- Status: pending
- Owner: workstation (root-owned cache file)
- Surface: `~/.npm/_cacache/content-v2/sha512/73/15/8d3deb...` (one
  specific root-owned entry; full path in the cache-collision note).
- Action: either `sudo rm` the poisoned cache entry once, or document
  the `npm install --cache /tmp/npm-cache-portfolio` workaround as
  the standing fix.
- Evidence: `npm install` succeeds against the default cache without
  `EACCES` on the offending file.

### Investigate the production-deploy error streak (7/8 - 7/21)

- Status: pending
- Owner: portfolio CI
- Surface: `vercel ls --prod` shows 8 consecutive `● Error` production
  deploys between 2026-07-15 and 2026-07-21, all username
  `ryanrfong-2985`, durations 6-32s.
- Action: pull the failed build logs for one of the Errors and check
  the `npm run proof` exit. If the proof gate was failing inside
  Vercel, the local proof needs a smoke run that exercises the same
  Vercel-side conditions (env vars, Node version).
- Evidence: `vercel ls --prod` shows no new `● Error` deploys after
  the catalogue-grid and security-fix commits; at least three
  consecutive `● Ready` deploys in a row.

### Decide the portfolio.armalo.ai hosting path

- Status: pending (dismissed question in this session)
- Owner: AWS-OPS / Vercel
- Surface: `portfolio.armalo.ai` does not exist in Route53 (verified
  via `aws-axi dns portfolio.armalo.ai` -> no records, no ALB match).
- Action: pick one of (a) Vercel custom domain attached to the
  existing portfolio project with a Route53 CNAME, (b) AWS ECS +
  CloudFront in front of a new `armalo-app-web`-style target group,
  (c) S3 + CloudFront for a static-only path. The current
  `astro.config.mjs:10-12` already reads `PORTFOLIO_SITE_URL` for
  the custom-domain swap.
- Evidence: `curl -I https://portfolio.armalo.ai/` returns
  `HTTP 200` with a Vercel or AWS response and serves the same
  `dist/index.html` content as `portfolio-peach-sigma-85.vercel.app`.

### Add a Dependabot configuration file

- Status: pending
- Owner: `.github/dependabot.yml`
- Action: even with GitHub Actions disabled, Dependabot YAML
  configuration is independent of Actions and is the only way to
  silence the scanner's `pnpm-lock.yaml` artifacts. The
  `pnpm-lock.yaml` alert (#4) auto-fired earlier because the scanner
  saw a stale file in some scan window; the file is not in the repo
  but the alert only went away because Dependabot auto-dismissed its
  own fix.
- Evidence: `gh api repos/fongryan/portfolio/dependabot/alerts?state=all`
  shows zero alerts in `state=open`, and the only `state=fixed`
  alert is the long-resolved #4.

## Done (this session)

- 5f43656 - patch 3 Dependabot advisories (astro 7.0.7->7.1.3,
  svgo 4.0.1->4.0.2, fast-uri 3.1.3->3.1.4). `npm audit` clean,
  Vercel production deploy verified.
- 894a80a - render all 41 products in the homepage catalogue grid.
  27/27 generated-output contracts pass, homepage 87 KB / 96 KB
  budget, public-safety doctor clean.
- scripts/portfolio-deps-security.test.mjs - regression guard with
  7 tests; wired into `npm test` so it runs as part of `npm run proof`.
- docs/security/dependency-updates.md - canonical policy for how
  transitive overrides are added and how new advisories are ingested.

## Won't fix (out of scope)

- **GitHub Actions re-enablement.** The owner billing gate is closed.
  Do not add runnable workflows or re-enable Actions without direct
  owner approval. Source: AGENTS.md "GitHub Actions remains
  intentionally disabled while the owner billing gate is closed".
- **Astro SSR migration.** The portfolio is `output: "static"`. The
  XSS advisory in GHSA-4g3v-8h47-v7g6 only affects
  `output: "server"` and `prerender = false` routes. Moving the
  portfolio to SSR is a separate, much larger project; the patch
  floor we set in package.json handles the dep either way.
- **`svgo removeScripts` opt-in.** The vulnerable plugin is disabled
  by default. Enabling it would be a behavior change with no current
  call site, so we take the patch and leave the plugin off.
