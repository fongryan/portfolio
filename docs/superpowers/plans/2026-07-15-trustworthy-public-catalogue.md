# Trustworthy Public Catalogue Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a useful, accurate, public-safe portfolio whose product claims and production deployment are guarded by one deterministic proof command.

**Architecture:** Extend the existing Astro content collection with explicit access and proof metadata, keep rendering static and zero-JS, reduce machine endpoints to the same public projection, and make one serialized repo-native proof command authoritative in local, GitHub, and Vercel contexts.

**Tech Stack:** Astro 7, TypeScript, Tailwind CSS 4, Node test runner, shell proof orchestration, GitHub Actions, Vercel static hosting.

---

## Chunk 1: Public boundary and catalogue contract

### Task 0: Reconcile live overlapping work

**Files:**

- Inspect: `scripts/catalogue-contract.test.mjs`
- Inspect: `src/pages/apps/[slug].astro`
- Inspect: `package.json`

- [ ] Attribute commit `94ec941` and preserve it as an explicit input.
- [ ] Confirm there is no uncommitted third-party work before each edit batch.
- [ ] Replace, rather than silently overwrite, its live-only CTA contract with
      the approved access-based contract.
- [ ] Execute all tasks sequentially in the existing `main` checkout; do not
      commit or push an intermediate red state.

### Task 1: Write the public-catalogue regression contract

**Files:**

- Modify: `scripts/catalogue-contract.test.mjs`
- Modify: `package.json`

- [ ] Invert the current provider-policy assertions so forbidden fields must be
      absent, then add assertions for the Girl Math product URL, homepage-safe
      navigation, required access/proof metadata, access-based CTAs, and the
      retired invocation route.
- [ ] Run the test and confirm it fails against the current public projection.
- [ ] Keep tests deterministic; do not call production from the unit suite.

### Task 2: Remove misplaced private-owner implementation surfaces

**Files:**

- Delete: `docs/superpowers/plans/2026-07-13-ai-product-catalogue-platform.md`
- Delete: `docs/superpowers/plans/2026-07-13-therese-marketing-operator-platform.md`
- Delete: `docs/superpowers/specs/2026-07-13-therese-marketing-operator-design.md`
- Delete: `docs/agents/girl-math-runtime.md`
- Delete: `docs/agents/portfolio-hermes-runtime.md`
- Delete: `scripts/invoke-girl-math.mjs`
- Delete: `scripts/invoke-girl-math.test.mjs`
- Delete: `src/pages/agents/girl-math.md.ts`
- Modify: `README.md`
- Modify: `docs/product-catalogue-public-foundation.md`

- [ ] Confirm the existing Brain catalogue/operator projects and authenticated
      App architecture owner contain the durable private material; stop with an
      exact blocker if any owner is missing.
- [ ] Record that current-tree deletion does not retract public Git history and
      does not authorize history rewriting.
- [ ] Reduce the public foundation document to public metadata, proof, access,
      and control-plane boundaries.
- [ ] Remove the portfolio-owned private runtime invocation command.
- [ ] Run the public-catalogue test and confirm the forbidden-surface assertions
      pass while product-truth assertions remain red.

## Chunk 2: Product truth and visitor usefulness

### Task 3: Add access and proof metadata

**Files:**

- Modify: `src/content.config.ts`
- Modify: `src/content/apps/girl-math.md`
- Modify: `src/components/StatusBadge.astro`
- Modify: `src/lib/apps.ts`
- Modify: `src/pages/agents/portfolio.json.ts`
- Modify: `src/pages/agents/portfolio.md.ts`

- [ ] Add the `beta` status, the exact access/proof enums from the design,
      non-future ISO verification dates, HTTPS URL validation, CTA labels capped at
      40 characters, and one-to-three highlights capped at 90 characters.
- [ ] Enforce the exact status/proof compatibility matrix and test impossible
      combinations such as `planned + public-live` and `live + not-yet-proven`.
- [ ] Point Girl Math to `https://girl-math.armalo.ai` and describe the public
      board versus personalized private beta without claiming live seat inventory.
- [ ] Make machine endpoints emit the same catalogue truth and nothing about
      private provider mutation policy.
- [ ] Run the contract test and confirm the product/machine assertions pass.

### Task 4: Improve homepage, detail page, and navigation

**Files:**

- Modify: `src/components/AppCard.astro`
- Modify: `src/components/SiteHeader.astro`
- Modify: `src/pages/index.astro`
- Modify: `src/pages/apps/[slug].astro`
- Create: `src/pages/404.astro`

- [ ] Make header section links homepage-relative.
- [ ] Replace repository-mechanics copy with visitor-facing Ryan/Armalo copy.
- [ ] Show product access and proof on cards and detail pages.
- [ ] Make the primary CTA use the content-defined label and product URL when
      access is not `unavailable`; remove the Hermes invocation-contract link.
- [ ] Add a restrained branded 404 with a route back to the catalogue.
- [ ] Run Astro check/build and inspect desktop/mobile output.

## Chunk 3: Discoverability and runtime hardening

### Task 5: Add generated-site metadata and route contracts

**Files:**

- Modify: `astro.config.mjs`
- Modify: `src/layouts/Base.astro`
- Create: `src/pages/robots.txt.ts`
- Create: `src/pages/sitemap.xml.ts`
- Create: `scripts/site-output.test.mjs`
- Modify: `vercel.json`

- [ ] Set `https://portfolio-peach-sigma-85.vercel.app` as the default site
      origin with an env override for a future custom domain.
- [ ] Emit canonical, Open Graph, and Twitter metadata; do not add JSON-LD or
      any other script block under the strict zero-script CSP.
- [ ] Generate robots and sitemap responses from the same site origin and
      content collection.
- [ ] Assert the exact CSP, frame, MIME, referrer, and permissions headers from
      the design without introducing client JavaScript.
- [ ] Move the homepage's inline grid style into the stylesheet and assert that
      generated HTML contains no inline style attributes or script elements.
- [ ] Build, run the output test, and confirm it would have failed on the old
      output.

## Chunk 4: Deterministic promotion proof

### Task 6: Build one concurrency-safe proof command

**Files:**

- Create: `scripts/portfolio-proof.sh`
- Create: `scripts/performance-budget.test.mjs`
- Modify: `scripts/portfolio-doctor.sh`
- Modify: `.prettierrc.json`
- Modify: `package.json`
- Modify: `.no-mistakes.yaml`
- Modify: `vercel.json`

- [ ] Make the Prettier config valid and add `format:check`.
- [ ] Add aggregate `test`, `budget`, and `proof` scripts.
- [ ] Serialize Astro-mutating proof runs with a bounded lock and unique logs.
- [ ] Use a portable atomic-directory lock with a 120-second timeout, PID-based
      stale-lock recovery, explicit timeout error, and `trap` cleanup; do not rely
      on `flock`.
- [ ] Assert homepage HTML plus blocking CSS stays below 50 KB and no client JS
      is generated.
- [ ] Make Vercel run the same proof command.
- [ ] Run exactly: formatting, deterministic tests, Astro check, one build,
      output contracts, budget, then
      `PORTFOLIO_DOCTOR_SKIP_BUILD=1 ./scripts/portfolio-doctor.sh`; leave `dist/`
      intact and set Vercel `buildCommand` to `npm run proof`.
- [ ] Run two proof commands concurrently and require both to pass.
- [ ] Test that a stale lock is recovered and a live lock times out with the
      documented message.

### Task 7: Add GitHub enforcement and align workflow docs

**Files:**

- Create: `.github/workflows/ci.yml`
- Modify: `README.md`
- Modify: `GOALS.md`
- Modify: `LOOPS.md`
- Modify: `scripts/portfolio-doctor.sh`
- Modify: `.gitignore`

- [ ] Run `npm run proof` on push to `main` and pull requests with pinned Node
      and `npm ci`.
- [ ] Align workflow guidance with direct-main plus repo-native proof.
- [ ] Remove duplicate ignore rules and make AGENTS/CLAUDE equivalence a valid
      inheritance state.
- [ ] Run the captain-stack audit and full proof.

## Chunk 5: Ship and production proof

### Task 8: Review, publish, and verify

**Files:**

- Review all changed public files.

- [ ] Run a spec-compliance review, then a code-quality review; resolve all
      actionable findings.
- [ ] Create a safety ref, commit the coherent wave, and push `main`.
- [ ] Enable GitHub secret/security protections and block branch deletion/force
      pushes without requiring PR-only delivery.
- [ ] Confirm the GitHub workflow is green.
- [ ] Deploy the exact `main` tree to Vercel production.
- [ ] Browser-test `/`, `/apps/girl-math`, `/agents/portfolio.json`,
      `/robots.txt`, `/sitemap.xml`, and an unknown route at desktop and mobile
      widths.
- [ ] Follow the Girl Math CTA to the verified product surface.
- [ ] Run Lighthouse and inspect canonical/social metadata plus security
      headers.
- [ ] Record the proof and residual risks in the captain packet.
