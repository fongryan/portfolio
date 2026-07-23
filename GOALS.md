# Portfolio Goals

Declarative, living goals for the portfolio hub. Each goal is actionable,
measurable, and timeboxed. Agents should tune these over time (add, sharpen,
retire) as the site matures. Keep goals public-safe: no private URLs, no
secrets, no internal-only context.

Format: `[state] goal — owner/surface — measure — by when`.

States: `active`, `stretch`, `done`, `retired`.

## Flywheel

- [active] Run the catalogue as the strategy board for the studio's revenue
  flywheel (build → launch → acquire → monetize → compound) —
  src/pages/flywheel.astro + src/content/app-schema.ts — every product carries
  a schema-enforced, evidence-gated stage; zero stages ahead of proof —
  continuous.
- [active] Move Girl Math one flywheel stage forward on evidence: from launch
  to acquire once real users hold the surface up and a paid campaign has a
  clear job — src/content/apps/girl-math.md — stage promoted with an updated
  lastVerified date, or the blocker named in the private operating system —
  next review of the board.
- [active] Keep every dollar-shaped fact (spend, revenue, conversion, ROAS)
  out of this public repo; the board tracks stage and proof only —
  scripts/portfolio-doctor.sh + docs/flywheel-operating-model.md — zero
  private funnel numbers in any commit — continuous.

## Product

- [active] Keep the Invoice Chaser and Proposal Generator quote-to-cash
  catalogue truth evidence-gated — product records + public research route —
  planned, unavailable, and not-yet-proven until product-specific source,
  runtime, and business receipts justify promotion — continuous.
- [active] Ship a non-vibe-coded portfolio hub that links all live Armalo
  mini-app subdomains — src/pages/index.astro + src/content/apps — a homepage
  a senior designer would not be embarrassed by — before the next mini-app
  launches.
- [active] Keep the public portfolio aligned with the private Armalo product
  catalogue without leaking internal strategy —
  docs/product-catalogue-public-foundation.md + src/content/apps — every public
  entry has explicit access and proof status plus a verified product-specific
  public destination when actionable — continuous.
- [active] Keep the hub under a 50 KB first-load budget on the homepage (no
  client JS for static content) — astro build output — Lighthouse 100 /
  best-practices + 95+ performance — continuous.
- [done] Add a per-mini-app detail route that shows the product story,
  stack, and live link without coupling the portfolio to any mini-app's
  internal data — src/pages/apps/[slug].astro — shipped with the first verified
  public catalogue entry.

## Workflow

- [active] Every non-trivial change routes through Firstmate or the repo's
  declared owner surface, never a sidecar queue — AGENTS.md — zero competing
  TODO surfaces — continuous.
- [active] Every shippable change passes the same deterministic repo-native
  proof locally and in Vercel — `npm run proof` — 100% of production builds are
  proof-gated; GitHub Actions remains disabled until Ryan directly approves
  reactivation after the owner billing gate is healthy — continuous.
- [active] Keep committed deployment configuration inside the proof contract
  even when generated Vercel surfaces stay outside the normal formatter —
  `scripts/check-vercel-format.mjs` + `npm run format:vercel` — committed
  `vercel.json` format drift fails before deployment — continuous.
- [active] Lavish review artifacts are always opened and polled; dead Lavish
  sessions are always repaired or reported — LOOPS.md — zero silently-broken
  Lavish sessions — continuous.
- [active] The public-safety doctor runs as the final phase of every canonical
  proof — scripts/portfolio-doctor.sh — zero secret/private-topology leaks —
  continuous.

## Security

- [active] Keep the resolved npm tree free of known-vulnerable ranges —
  scripts/portfolio-deps-security.test.mjs + package.json overrides —
  zero high or critical vulnerabilities per `npm audit`; the test
  guard fails any future regen that re-introduces a known range —
  continuous.
- [active] Keep Vercel locked to npm and the upload free of foreign
  package-manager artifacts — .github/dependabot.yml +
  scripts/portfolio-deps-security.test.mjs +
  scripts/portfolio-deploy-contract.test.mjs — no pnpm-lock.yaml,
  yarn.lock, or .pnpm-store/ can land in a Vercel upload; the
  2026-07-15 to 2026-07-21 Error streak was caused by this slipping
  — continuous.
- [active] Keep the static-site response headers pinned to the
  approved security policy — vercel.json +
  scripts/portfolio-deploy-contract.test.mjs +
  scripts/portfolio-production-smoke.test.mjs — CSP, X-Frame-Options
  DENY, X-Content-Type-Options nosniff, Referrer-Policy
  strict-origin-when-cross-origin, Permissions-Policy camera/mic/
  geolocation/payment/usb disabled, HSTS includeSubDomains preload
  — continuous.
- [active] Maintain the responsible-disclosure policy and the
  current-status ledger — SECURITY.md — every external report gets
  an acknowledgement within one business day and a triage within
  three business days; CVSS >= 7.0 issues get triage within 24
  hours — continuous.
- [stretch] Wire the production smoke test into the Vercel deploy
  hook so the catalogue + headers contract is checked on every
  production push, not only on demand — Vercel Deploy Hook + a
  small runner that exec's `PORTFOLIO_VERIFY_PRODUCTION=1 npm test
scripts/portfolio-production-smoke.test.mjs` — before the next
  mini-app launch.

## Self-Improvement

- [active] Maintain a versioned, digest-pinned starter bundle for every product
  we make reusable — `docs/PORTFOLIO-STARTER-SYSTEM.md` + `starters/` — every
  published starter has a manifest, Hermes pack, acceptance command, and proof
  status — continuous.

- [active] Turn any instruction repeated twice into a loop, skill, test, guard,
  or Firstmate backlog item — LOOPS.md + skills/ — at least one new durable
  improvement per meaningful work unit — continuous.
- [stretch] Maintain a small, opinionated design-token set (typography scale,
  spacing, one accent) that any agent can reuse without re-deriving taste —
  src/styles/tokens.css — tokens referenced by every layout — before adding a
  third page.
