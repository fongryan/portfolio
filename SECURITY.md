# Security policy

The portfolio is a public static site that mirrors the canonical
catalogue in `src/content/apps/` and links the live mini-app
subdomains. Security here is mostly about supply chain hygiene (the
npm dependency tree and the Hetzner deployment pipeline on the Armalo
vibe box) and the response headers the static site itself ships.

## Supported versions

The portfolio tracks `main` and ships from the latest commit. There
is no LTS branch; security patches land on `main` and ship via
`scripts/deploy-vibe.sh --apply` once `npm run proof` passes on the
local box. The current commit is the latest "Ready" production deploy
listed by `hetzner-axi status` / `vercel ls --prod` (the Vercel
project is being archived — see `infra/handoff.md`).

## Reporting a vulnerability

For security findings, open a GitHub issue with the `security`
label, or email `security@armalo.ai` if you would rather keep the
disclosure private. The repo is public, so the issue route is the
default; the email route is for issues that affect a deployed
surface before a patch is available.

Please include:

- The vulnerable surface (e.g. a specific URL, a specific dependency).
- Reproduction steps, including any lockfile or commit hash you saw.
- Whether the issue is exploitable against `output: "static"` or
  only against a future SSR configuration.
- Your disclosure preference: public GitHub issue, GitHub Security
  Advisory (private), or off-channel.

The GHSA-v2hh-gcrm-f6hx / GHSA-2p49-hgcm-8545 / GHSA-4g3v-8h47-v7g6
advisories from 2026-07-21 / 22 are good examples of the format
Dependabot will surface and the policy `scripts/portfolio-deps-security.test.mjs`
will guard against re-introducing.

## Response timeline

- **Acknowledgement**: within one business day.
- **Triage**: within three business days. For CVSS >= 7.0 or
  actively-exploited issues, triage is within 24 hours.
- **Patch and deploy**: the canonical fix path is a dependency
  bump (direct floor in `package.json` or `overrides` for
  transitives), a green `npm run proof`, a merge to `main`, and
  `./scripts/deploy-vibe.sh --apply` to ship the new `dist/` to the
  vibe box. The proof gate includes the regression guard
  `scripts/portfolio-deps-security.test.mjs` so the patch cannot
  regress.

## Disclosure preference

Coordinated disclosure is preferred. Default window is 90 days from
acknowledgement, in line with the Google / Project Zero practice
for supply-chain issues. The repo is small and the deploy surface
is a static CDN, so we can usually patch in under a week; the
window is more for downstream consumers who mirror the catalogue.

## Current status

The `npm audit` on the resolved tree is clean (`found 0
vulnerabilities` as of commit `5f43656`). The Dependabot scanner
still has the three GHSAs from 2026-07-21 / 22 marked `state=open`
because the scanner re-runs asynchronously; the substantive
evidence the fix is in is the lockfile (astro 7.1.3, svgo 4.0.2,
fast-uri 3.1.4), `npm audit` clean, and the auto-PR closure by
Dependabot itself. The `scripts/portfolio-deps-security.test.mjs`
regression guard will fail any future regen that re-introduces one
of those vulnerable ranges, so this status holds the moment the
next `npm run proof` ships.

For questions or to verify the current state, the most reliable
mechanism is:

    npm run proof
    PORTFOLIO_VERIFY_PRODUCTION=1 npm test
    curl -I https://portfolio.armalo.ai/
