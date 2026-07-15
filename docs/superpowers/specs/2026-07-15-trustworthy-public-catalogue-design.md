# Trustworthy Public Catalogue Design

**Status:** Approved for autonomous execution under Ryan's standing approval.

## Goal

Turn the portfolio from a technically clean scaffold into a trustworthy public
catalogue: every product link reaches the product, every claim names its access
and proof level, every public machine surface contains catalogue truth only,
and every production build is blocked by deterministic safety and quality
checks.

## Current evidence

- The production homepage is fast, semantic, and ships no client JavaScript.
- Live Lighthouse reports 100 for accessibility, best practices, and SEO.
- Girl Math has a verified public surface at `https://girl-math.armalo.ai`, but
  the portfolio currently sends visitors to the generic Armalo control plane.
- Detail-page header anchors point at sections that do not exist on detail
  pages.
- Product maturity, public access, and proof are collapsed into one status.
- The public machine manifest includes operator/provider policy that belongs in
  authenticated owner surfaces.
- Production omits canonical and social metadata, robots, sitemap, and a
  branded 404.
- Direct pushes to public `main` have no GitHub workflow, aggregate proof gate,
  or executable performance budget.
- The public tree contains implementation plans for private operator systems;
  their canonical owners already exist outside this repository.

## Approaches considered

### A. Trust, boundary, and usefulness wave — selected

Correct product truth, remove misplaced private-owner implementation material,
add explicit access/proof metadata, improve visitor copy and product detail,
reduce machine endpoints to catalogue truth, and install deploy/CI proof.

This has the best combination of immediate visitor value, safety, leverage, and
verifiable completion.

### B. Expand the catalogue immediately

Adding more cards would make the site look broader, but no additional product
currently has an approved public projection packet in this repository. Shipping
speculative status or private/admin destinations would weaken trust.

### C. Visual redesign first

The existing design is restrained, accessible, fast, and coherent. Its largest
problem is thin or incorrect product truth, not typography or animation. A
redesign would consume effort without fixing the conversion and safety gaps.

## Public product contract

Each product entry must expose:

- `status`: maturity (`live`, `beta`, `wip`, or `planned`);
- `access`: how a visitor can use it now;
- `proof`: strongest public claim that has actually been verified;
- `lastVerified`: date of that verification;
- `url`: the product-specific public destination;
- `ctaLabel`: an honest action label;
- a concise description and no more than three highlights.

The vocabularies are closed and testable:

- `access`: `public`, `sign-in`, `private-beta`, `waitlist`, or `unavailable`;
- `proof`: `not-yet-proven`, `source-tested`, `runtime-verified`,
  `public-live`, or `business-verified`;
- `lastVerified`: ISO `YYYY-MM-DD`, never future-dated;
- `url`: HTTPS and product-specific whenever access is not `unavailable`;
- `ctaLabel`: nonempty and no longer than 40 characters;
- `highlights`: one to three strings, each no longer than 90 characters.

A CTA renders only when an HTTPS URL exists and access is not `unavailable`.
Maturity and access remain separate: a beta may expose a useful public surface
while keeping personalized capability gated.

Valid maturity/proof pairs are:

- `planned`: `not-yet-proven` only;
- `wip`: `not-yet-proven` or `source-tested`;
- `beta`: `source-tested`, `runtime-verified`, or `public-live`;
- `live`: `public-live` or `business-verified`.

Contract tests reject every other combination.

`beta` means a real public or sign-in surface exists while some personalized or
operational capability remains gated. It must not imply general availability.

## Human surface

The homepage introduces Ryan as a builder of focused Armalo products, leads to
the product catalogue, and gives each card a clear access/proof signal. It does
not explain repository mechanics to visitors.

The Girl Math detail page explains:

- the public reference board is available to browse;
- personalized points math is a private beta;
- reference sweet spots are not live seat availability;
- the primary action goes directly to Girl Math.

Global header links always return to homepage sections. Unknown routes render a
small branded recovery page.

## Machine surface

`/agents/portfolio.json` and its Markdown companion expose only public product
metadata, access, proof, verification date, and public destinations. They do
not publish internal operator identities, provider-specific mutation policy,
private invocation instructions, credentials, customer data, financial state,
or campaign strategy.

The portfolio does not own a private Girl Math invocation client. That runtime
contract stays with Girl Math and the authenticated Armalo control plane.

## Discoverability and security

`https://portfolio-peach-sigma-85.vercel.app` is the current canonical origin,
overridable by `PORTFOLIO_SITE_URL` for a future custom domain. A domain migration
changes the environment/source default and the metadata contract in one green
commit. Every HTML page emits canonical, Open Graph, and Twitter metadata. The
site publishes robots and sitemap routes. JSON-LD is deliberately deferred:
the strict no-inline-script CSP is more valuable for this small catalogue than
structured data that would require an inline-script exception or per-route CSP
hash management.

Vercel serves the following static-site baseline:

- `Content-Security-Policy: default-src 'self'; base-uri 'self'; form-action
'self'; frame-ancestors 'none'; object-src 'none'; script-src 'none'`;
- `X-Frame-Options: DENY`;
- `X-Content-Type-Options: nosniff`;
- `Referrer-Policy: strict-origin-when-cross-origin`;
- `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(),
usb=()`.

The CSP is required because this is a zero-JavaScript static site and can use a
strict same-origin policy without runtime exceptions. Existing inline style
attributes move into the stylesheet, and output tests require zero inline style
attributes and zero script elements.

## Proof architecture

`npm run proof` is the canonical local, CI, and Vercel gate. It acquires a
portable atomic-directory lock with a 120-second timeout, removes a stale lock
whose recorded process no longer exists, and always releases its owned lock via
`trap`. It then runs exactly:

1. formatting validation;
2. deterministic unit/contract tests;
3. Astro type diagnostics;
4. production build;
5. generated-output metadata and route assertions;
6. the 50 KB first-load budget and zero-client-JavaScript assertion;
7. `PORTFOLIO_DOCTOR_SKIP_BUILD=1 ./scripts/portfolio-doctor.sh`.

The successful command leaves `dist/` intact for Vercel to publish. Vercel's
`buildCommand` is exactly `npm run proof`.

GitHub Actions runs the same command for pushes to `main` and pull requests.
GitHub prevents branch deletion and force pushes without requiring PR ceremony.

## Failure behavior

- Missing or malformed access/proof metadata fails the content build or tests.
- Forbidden provider/operator fields in the public manifest fail contract
  tests.
- Missing canonical/social metadata, robots, sitemap, or branded 404 fails
  generated-output tests.
- A first-load payload over 50 KB or any generated client JavaScript fails the
  budget gate.
- Concurrent proof runs serialize rather than corrupting shared Astro output.
- A failed proof blocks Vercel production output.

## Sequencing

1. Public-boundary cleanup and catalogue contract tests.
2. Product truth, navigation, visitor copy, and detail-page usefulness.
3. Metadata, routes, headers, and generated-output tests.
4. Deterministic aggregate proof and GitHub Actions.
5. GitHub safety settings, production deployment, and live browser proof.

Catalogue expansion follows only when another product owner supplies a verified
public destination, access level, proof level, and public-safe description.

All work executes sequentially in the existing `main` checkout under the
workspace's direct-main policy. No intermediate red state is committed or
pushed. The externally landed `94ec941` product-link gate is preserved as an
attributed input and intentionally superseded by the richer access contract.
The wave is committed only after the complete proof is green.

The private catalogue and operator designs were confirmed in their existing
Brain and authenticated App owner surfaces before current-tree cleanup. This
change removes only public working-tree copies; it does not claim to retract
content already present in public Git history. History rewriting is a separate,
destructive decision and is out of scope.
