# Market-led AI Catalogue Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Polish the public catalogue with a researched ten-product commercial shortlist and four missing planned product families.

**Architecture:** Extend the Astro content schema with optional commercial-priority metadata and traceable research references, render the ranked shortlist from the same content collection, and preserve the complete grouped shelf below it. Use catalogue contract tests to keep rank uniqueness, honest maturity, public research, and human/machine projection parity enforceable.

**Tech Stack:** Astro 7, TypeScript, Zod, Markdown/YAML content, Tailwind CSS, Node test runner.

---

## Chunk 1: Contract and source implementation

### Task 0: Preserve the dirty checkout

**Files:**

- Inspect only: all existing modified and untracked files

- [ ] **Step 1: Capture repository state**

Run `git status --short --branch` and `git diff --stat` before edits. The
checkout already contains overlapping work in catalogue tests, `AppCard.astro`,
`index.astro`, package files, and product records.

- [ ] **Step 2: Inspect every overlapping diff before patching**

Never replace whole dirty files. Apply narrow patches and format only named
files. Do not stage or commit pre-existing work through broad `git add`.

### Task 1: Define the failing commercial-priority contract

**Files:**

- Modify: `scripts/catalogue-contract.test.mjs`

- [ ] **Step 1: Add a test that loads the ten expected entries**

Assert the exact slug, name, priority, category, planned maturity, unavailable
access, not-yet-proven proof, non-empty buyer hypothesis, and one to four stable
research references for priorities 1-10.

- [ ] **Step 2: Assert ranks are unique and contiguous**

Sort the ten numeric ranks and compare with `[1,2,3,4,5,6,7,8,9,10]`.

- [ ] **Step 3: Assert schema and projections consume priority metadata**

Require the JSON and Markdown projection source files to contain the new
contract. UI and research assertions belong to Task 4 so this slice can reach
GREEN before those surfaces are implemented.

- [ ] **Step 4: Run RED**

Run:

```bash
node --test --test-name-pattern="commercial shortlist" scripts/catalogue-contract.test.mjs
```

Expected: fail because the new content records and priority fields are absent.

### Task 2: Extend the content contract

**Files:**

- Modify: `src/content/app-schema.ts`
- Modify: `src/lib/portfolio-markdown.ts`
- Modify: `src/pages/agents/portfolio.json.ts`

- [ ] **Step 1: Add optional schema fields**

Add `commercialPriority` as integer 1-10, `buyerHypothesis` as a bounded
single-line string, and `researchRefs` as one to four bounded stable IDs.

- [ ] **Step 2: Add both fields to JSON and Markdown projections**

Use `null` in JSON and `Not prioritized` in Markdown for unranked products.
Bump the JSON projection schema from `armalo.portfolio.catalogue.v3` to
`armalo.portfolio.catalogue.v4` and assert the exact version in tests.

### Task 3: Create and rank product records

**Files:**

- Create: `src/content/apps/ai-customer-service-desk.md`
- Create: `src/content/apps/ai-attribution-remarketing.md`
- Create: `src/content/apps/ai-digital-product-studio.md`
- Create: `src/content/apps/expert-knowledge-assistant.md`
- Modify: `src/content/apps/hermes-revenue-agents.md`
- Modify: `src/content/apps/ai-dialer.md`
- Modify: `src/content/apps/hermes-ai-crm.md`
- Modify: `src/content/apps/internal-knowledge-assistant.md`
- Modify: `src/content/apps/ai-forward-deployed-engineer.md`
- Modify: `src/content/apps/ai-stylist.md`

- [ ] **Step 1: Create the four planned entries**

Give each a concrete buyer, outcome, boundary, delivery modes, offer shapes,
and no live or business-result claim.

- [ ] **Step 2: Add the exact priority, hypothesis, and references to all ten entries**

Follow the ranked table in the design spec.

- [ ] **Step 3: Run GREEN for the source contract**

Run:

```bash
node --test --test-name-pattern="commercial shortlist" scripts/catalogue-contract.test.mjs
```

Expected: PASS with zero failures. Correct implementation failures without
weakening the assertions.

## Chunk 2: Generated-output RED and catalogue polish

### Task 4: Add generated-output coverage before UI work

**Files:**

- Modify: `scripts/site-output.test.mjs`
- Modify: `scripts/catalogue-contract.test.mjs`

- [ ] **Step 1: Extend the strict public product key contract**

Add `commercialPriority`, `buyerHypothesis`, and `researchRefs` to
`publicProductKeys`, and require `armalo.portfolio.catalogue.v4`.

- [ ] **Step 2: Add the shortlist output test**

Require the shortlist heading, priorities 01-10 in order, links to every
product, and priority metadata in JSON and Markdown.

- [ ] **Step 3: Add UI source and research contract tests**

In `scripts/catalogue-contract.test.mjs`, require `AppCard`, the homepage, and
detail route to conditionally render `commercialPriority` and
`buyerHypothesis`. Require the public research note to resolve every
`researchRefs` ID and include this canonical source registry, accessed
2026-07-15:

- `ai-acquisition-services-2025` —
  `https://www.aiacquisition.com/blog/top-5-most-profitable-ai-services-our-clients-are-selling`
- `acquisition-acq-ai` — `https://ai.acquisition.com/`
- `monetise-product-terms` — `https://www.monetise.com/policy/terms`
- `client-acquisition-build-release` — `https://book.clientacquisition.io/new`
- `cook-ai-native-agency` — `https://webby.trycook.ai/`
- `hyros-attribution-remarketing` — `https://hyros.ai/`
- `menlo-enterprise-ai-2025` —
  `https://menlovc.com/wp-content/uploads/2025/12/menlo_ventures_enterprise_ai_report-2025-121925.pdf`
- `mckinsey-state-ai-2025` —
  `https://www.mckinsey.com/~/media/mckinsey/business%20functions/quantumblack/our%20insights/the%20state%20of%20ai/2025/the-state-of-ai-how-organizations-are-rewiring-to-capture-value_final.pdf`

- [ ] **Step 4: Run RED**

Run:

```bash
npm run build
node --test --test-name-pattern="commercial shortlist" scripts/site-output.test.mjs
```

Also run:

```bash
node --test --test-name-pattern="market-led research" scripts/catalogue-contract.test.mjs
```

Expected: both commands FAIL because the shortlist UI and research note are not
implemented.

### Task 5: Render the shortlist

**Files:**

- Modify: `src/pages/index.astro`
- Modify: `src/components/AppCard.astro`
- Modify: `src/pages/apps/[slug].astro`

- [ ] **Step 1: Derive sorted priorities from `apps`**

Filter entries with `commercialPriority`, sort ascending, and require ten via
the source contract.

- [ ] **Step 2: Add the restrained shortlist section**

Render two-digit rank, linked product name, buyer hypothesis, and category above
the complete shelf.

- [ ] **Step 3: Add priority context to cards and detail pages**

Render only when present; do not displace maturity, access, proof, or flywheel.

- [ ] **Step 4: Add missing categories**

Add `Marketing intelligence`, `Creator commerce`, and `Knowledge products` to
the fixed group order.

### Task 6: Write the public research and strategy note

**Files:**

- Create: `docs/market-led-ai-product-catalogue.md`

- [ ] **Step 1: Document verified operator patterns**

Implement the exact Task 4 source registry. Cover AI Acquisition,
Acquisition.com, Monetise, ClientAcquisition/Cook AI, and HYROS using stable
source IDs, titles/operators, primary URLs, publication/access dates, supported
claims, confidence, limitations, and careful claim attribution.

- [ ] **Step 2: Document market evidence and Armalo inference**

Use Menlo Ventures and McKinsey to explain the category selection while
stating that their evidence does not prove demand for Armalo specifically.
Require the literal correction `HYROS, not Hyrox`, a non-affiliation statement,
an earnings-claim limitation, and the sentence `Willingness to pay for these
Armalo products remains unproven.`

- [ ] **Step 3: Document packaging and sequencing**

Define diagnostic, pilot, implementation, recurring optimization, licensed,
and partner paths, plus the next validation step for every product.

## Chunk 3: GREEN and final verification

### Task 7: Run generated-output GREEN

**Files:**

- Modify: `scripts/site-output.test.mjs`

- [ ] **Step 1: Build and run GREEN**

Run:

```bash
npm run build
node --test --test-name-pattern="commercial shortlist" scripts/site-output.test.mjs
node --test --test-name-pattern="market-led research" scripts/catalogue-contract.test.mjs
```

Expected: all commands PASS with zero failures.

### Task 8: Verify the complete public surface

**Files:**

- Verify: all scoped files above

- [ ] **Step 1: Format scoped files**

Run Prettier only on changed catalogue, page, test, spec, plan, and research
files so unrelated dirty work is not rewritten.

Run:

```bash
npx prettier --write \
  scripts/catalogue-contract.test.mjs scripts/site-output.test.mjs \
  src/content/app-schema.ts src/lib/portfolio-markdown.ts \
  src/pages/agents/portfolio.json.ts src/components/AppCard.astro \
  'src/pages/apps/[slug].astro' src/pages/index.astro \
  src/content/apps/ai-customer-service-desk.md \
  src/content/apps/ai-attribution-remarketing.md \
  src/content/apps/ai-digital-product-studio.md \
  src/content/apps/expert-knowledge-assistant.md \
  src/content/apps/hermes-revenue-agents.md src/content/apps/ai-dialer.md \
  src/content/apps/hermes-ai-crm.md \
  src/content/apps/internal-knowledge-assistant.md \
  src/content/apps/ai-forward-deployed-engineer.md \
  src/content/apps/ai-stylist.md docs/market-led-ai-product-catalogue.md \
  docs/superpowers/specs/2026-07-15-market-led-ai-catalogue-design.md \
  docs/superpowers/plans/2026-07-15-market-led-ai-catalogue.md
```

Expected: only the named files are formatted.

- [ ] **Step 2: Run repository proof**

Run:

```bash
npm run proof
bash ../check-captain-stack.sh
```

Expected: both exit 0; the captain-stack audit reports `ok workspace AGENTS.md`
and `ok workspace CLAUDE.md` for portfolio.

- [ ] **Step 3: Run browser QA**

Start `npm run dev -- --host 127.0.0.1 --port 4321`, open
`http://127.0.0.1:4321/` with `chrome-devtools-axi`, inspect at 1440x900 and
390x844, and verify links, hierarchy, overflow, and honest status labels.

- [ ] **Step 4: Attach taste proof**

Record `execution.completed` and `proof.attached` events against
`td-portfolio-market-led-ai-catalogue-20260715` with fresh hashes and command
evidence.

- [ ] **Step 5: Commit only if scope is isolatable**

Because target files contain pre-existing changes, do not stage a whole
overlapping file merely to satisfy a checkpoint. If each chunk can be isolated
without including unrelated work, make a scoped commit after its GREEN proof.
Otherwise leave the verified changes uncommitted and report the exact dirty
ownership boundary.
