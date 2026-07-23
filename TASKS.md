# TASKS

Living backlog for the portfolio repo. Last full sweep: 2026-07-23
after the 5f43656 security fix and the catalogue-grid commit
894a80a shipped. Each task carries a status, owner surface, and the
specific evidence that proves it done.

## Open

### Verify Dependabot auto-closes alerts after push

- Status: pending (async)
- Owner: GitHub Dependabot (re-scan after push)
- Evidence: `gh api repos/fongryan/portfolio/dependabot/alerts?state=open`
  returns `[]` for the three GHSAs closed in 5f43656.
- Notes: As of 2026-07-23T06:13Z (13 minutes after the 5f43656 push
  and ~12 minutes after the 67b7412 hardening push) the alerts were
  still `state=open` with `updated_at` from 2026-07-21/22. The
  Dependabot re-scan runs on a schedule (default ~hourly) and is
  not directly triggerable from the public REST API. The
  `replay` endpoint (`/dependabot/alerts/<n>/replay`) returns 404
  for this repo. The substantive evidence that the fix is in is:
  (a) `npm audit` returns 0 vulnerabilities, (b) the lockfile
  contains the patched versions, (c) Dependabot itself auto-closed
  the three auto-PRs (#2, #3, #4) on push, which only happens when
  the scanner no longer sees a vulnerable manifest, (d)
  `vercel ls --prod` shows the new deploy as `● Ready`. Recheck
  hourly; if still open after 4h, dismiss manually with reason
  `fixed` and a link to 5f43656.

### Close the three Dependabot auto-PRs as superseded

- Status: done
- PRs: #2 (astro-7.1.0), #3 (fast-uri-3.1.4), #4 (svgo-4.0.2)
- Evidence: `gh api repos/fongryan/portfolio/pulls/<n> --jq .state`
  returns `closed` for all three, with comments pointing at 5f43656
  posted (comment IDs 5055078619 / 5055078758 / 5055078898).
- Notes: Dependabot auto-closed the three PRs at 05:54-05:55 UTC
  on the first push (5f43656). I added the supersession comments
  on the second pass to leave the audit trail explicit.

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
- 67b7412 - regression guard for the security fix:
  scripts/portfolio-deps-security.test.mjs (7 tests including a
  parser self-check), docs/security/dependency-updates.md policy,
  TASKS.md backlog, README + AGENTS.md discoverability. `npm test`
  is now 65/65 (was 58/58).
- Three Dependabot auto-PRs (#2, #3, #4) auto-closed by the
  scanner on the 5f43656 push, with comments pointing at the
  commit posted afterward.

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
