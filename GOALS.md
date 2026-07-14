# Portfolio Goals

Declarative, living goals for the portfolio hub. Each goal is actionable,
measurable, and timeboxed. Agents should tune these over time (add, sharpen,
retire) as the site matures. Keep goals public-safe: no private URLs, no
secrets, no internal-only context.

Format: `[state] goal — owner/surface — measure — by when`.

States: `active`, `stretch`, `done`, `retired`.

## Product

- [active] Ship a non-vibe-coded portfolio hub that links all live Armalo
  mini-app subdomains — src/pages/index.astro + src/content/apps — a homepage
  a senior designer would not be embarrassed by — before the next mini-app
  launches.
- [active] Keep the public portfolio aligned with the private Armalo product
  catalogue without leaking internal strategy —
  docs/product-catalogue-public-foundation.md + src/content/apps — every public
  entry has explicit proof status and an `app.armalo.ai` destination when used.
- [active] Keep the hub under a 50 KB first-load budget on the homepage (no
  client JS for static content) — astro build output — Lighthouse 100 /
  best-practices + 95+ performance — continuous.
- [stretch] Add a per-mini-app detail route that shows the product story,
  stack, and live link without coupling the portfolio to any mini-app's
  internal data — src/pages/apps/[slug].astro — only when a second mini-app is
  live.

## Workflow

- [active] Every non-trivial change routes through Firstmate or the repo's
  declared owner surface, never a sidecar queue — AGENTS.md — zero competing
  TODO surfaces — continuous.
- [active] Every shippable change passes no-mistakes with intent recorded —
  .no-mistakes.yaml — 100% of merged PRs carry an intent — continuous.
- [active] Lavish review artifacts are always opened and polled; dead Lavish
  sessions are always repaired or reported — LOOPS.md — zero silently-broken
  Lavish sessions — continuous.
- [active] The public-safety doctor runs green before every commit —
  scripts/portfolio-doctor.sh — zero secret/private-topology leaks —
  continuous.

## Self-Improvement

- [active] Turn any instruction repeated twice into a loop, skill, test, guard,
  or Firstmate backlog item — LOOPS.md + skills/ — at least one new durable
  improvement per meaningful work unit — continuous.
- [stretch] Maintain a small, opinionated design-token set (typography scale,
  spacing, one accent) that any agent can reuse without re-deriving taste —
  src/styles/tokens.css — tokens referenced by every layout — before adding a
  third page.
