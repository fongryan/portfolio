# Demand-backed AI Catalogue Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add eight evidence-gated AI product records, upgrade two canonical product families, publish a ranked business-demand shelf and consumer lab, guarantee complete category visibility, and ship a cited public strategy brief.

**Architecture:** `src/lib/demand-catalogue.ts` is the typed source of truth for ranking, evidence, operator patterns, and consumer-lab slugs. `src/lib/catalogue-groups.ts` owns deterministic category grouping. The homepage and research route consume those modules; Markdown content remains the product catalogue authority.

**Tech Stack:** Astro content collections, TypeScript, Zod, Markdown/YAML, Node test runner, Tailwind CSS.

---

## Chunk 1: Red contracts

### Task 1: Preserve the live checkout and write failing tests

**Files:**

- Create: `scripts/demand-catalogue-contract.test.mjs`
- Create: `scripts/demand-catalogue-output.test.mjs`
- Modify: `package.json`

- [ ] **Step 1: Snapshot the shared dirty seams**

Run `git status --short --branch`, then inspect the live diffs for
`package.json`, `src/pages/index.astro`, and `src/content/apps/ai-qualifier.md`.
The branch contains concurrent uncommitted catalogue work. Re-read these diffs
immediately before each patch. Never replace shared arrays or scripts wholesale;
append or make the smallest local edit. Do not stage, commit, format, or rewrite
unrelated changes.

- [ ] **Step 2: Add the source contract**

Create `scripts/demand-catalogue-contract.test.mjs` with tests named:

- `demand catalogue has ten ranked evidence-backed business products`
- `new demand products stay planned bounded and canonical`
- `catalogue groups merge variants and retain every product exactly once`
- `demand research keeps market evidence separate from operator mechanics`
- `homepage and research share the typed demand catalogue`

Import `businessDemandProducts`, `consumerLabSlugs`, and `operatorPatterns` from
`src/lib/demand-catalogue.ts`; import `buildCatalogueGroups` and
`preferredCatalogueCategories` from `src/lib/catalogue-groups.ts`.

The ranking test asserts ranks `1..10`, ten unique slugs, six integer score
dimensions from 1–5, at least two sources per rank, at least one `offer` or
`commercial-traction` source and one `adoption` source, accessed date `2026-07-15`, and catalogue files for every
slug. It asserts this exact order:

```js
[
  "email-customer-service",
  "document-operations-agent",
  "voice-customer-service",
  "ai-qualifier",
  "internal-knowledge-assistant",
  "finance-operations-assistant",
  "marketing-campaign-studio",
  "software-engineering-copilot",
  "legal-advice-assistant",
  "clinical-documentation-assistant",
];
```

The product test checks these records:

```text
document-operations-agent.md
finance-operations-assistant.md
marketing-campaign-studio.md
software-engineering-copilot.md
clinical-documentation-assistant.md
business-constraint-finder.md
ai-digital-product-studio.md -> upgraded canonical family
revenue-intelligence-platform.md
lead-recovery-operator.md
agency-ai-workbench.md -> name: AI Agency Operating System
```

Every record must parse through `appSchema` and be
`planned/unavailable/not-yet-proven/build`. Test the safety terms required by
the design in the applicable records: confidence/exception, payment/money
movement, copyright/claim, review before merge/deploy, clinician,
diagnosis/treatment, licensed, attribution, incrementality, consent, opt-out,
tenant, and approval.

The grouping test uses fixtures with `Revenue operations`,
`Revenue Operations`, `Sales Operations`, `Financial Intelligence`, and two
punctuation-different labels that slugify identically. It asserts preferred
labels, case-insensitive merge, deterministic unknown append, collision-safe
IDs, and each fixture ID exactly once.

The research-source test requires all five operator names, methodology, B2B
scope, consumer lab, no-affiliation language, accessed date, ethical adaptation,
and explicit separation of attribution from experimentally verified
incrementality.

The shared-source test reads `src/pages/index.astro` and
`src/pages/research/demand-backed-ai-catalogue.astro` and asserts that both
import `businessDemandProducts` and `consumerLabSlugs` from
`../lib/demand-catalogue` or the correct relative equivalent; the research page
must additionally import `operatorPatterns`. It rejects any second literal list
containing the ten ranked slugs in either page.

- [ ] **Step 3: Add the generated-output contract before implementation**

Create `scripts/demand-catalogue-output.test.mjs` with tests named:

- `homepage renders the ranked business shelf consumer lab and every product`
- `demand research route ships cited zero-script claim-honest output`
- `new demand products ship in detail JSON and Markdown surfaces`

The first reads `dist/index.html` and `dist/agents/portfolio.json`, asserts rank
markers `01` through `10`, the exact ranked links in order, all four consumer
links, and every JSON product slug exactly once in the full shelf. The second
reads the generated research route and asserts the five operator names, ten
market rankings, primary links, no affiliation, and no script. The third drives
this exact table through detail HTML, parsed JSON, and Markdown:

```js
[
  ["document-operations-agent", "Document Operations Agent"],
  ["finance-operations-assistant", "Finance Operations Assistant"],
  ["marketing-campaign-studio", "Marketing Campaign Studio"],
  ["software-engineering-copilot", "Software Engineering Copilot"],
  ["clinical-documentation-assistant", "Clinical Documentation Assistant"],
  ["business-constraint-finder", "Business Constraint Finder"],
  ["ai-digital-product-studio", "AI Digital Product Studio"],
  ["revenue-intelligence-platform", "Revenue Intelligence Platform"],
  ["lead-recovery-operator", "Lead Recovery Operator"],
];
```

For each row, assert exactly one JSON record, exactly one Markdown heading/slug,
and `planned`, `unavailable`, and `not-yet-proven` in both machine projections.
Also assert `agency-ai-workbench` displays `AI Agency Operating System` and its
detail contains tenant, acceptance-test, and approval boundaries.

- [ ] **Step 4: Wire tests into canonical scripts**

Narrowly append `scripts/demand-catalogue-contract.test.mjs` to `npm test` and
`scripts/demand-catalogue-output.test.mjs` to `test:output` in `package.json`.
Preserve the concurrent `js-yaml` dependency and every existing script input.

- [ ] **Step 5: Verify RED**

Run:

```bash
node --test scripts/demand-catalogue-contract.test.mjs
node --test scripts/demand-catalogue-output.test.mjs
```

Expected: source tests fail with `ERR_MODULE_NOT_FOUND` for
`demand-catalogue.ts`; output tests fail with `ENOENT` for the research route or
a new product detail route.

## Chunk 2: Typed evidence and catalogue records

### Task 2: Add the single source of truth and bounded product content

**Files:**

- Create: `src/lib/demand-catalogue.ts`
- Create: `src/lib/catalogue-groups.ts`
- Create: eight files under `src/content/apps/`
- Modify: `src/content/apps/agency-ai-workbench.md`
- Modify: `src/content/apps/ai-digital-product-studio.md`
- Modify narrowly: five existing ranked product bodies only when the required
  safety boundary is absent

- [ ] **Step 1: Implement the typed data module**

Use these public interfaces:

```ts
export type DemandEvidence = {
  label: string;
  url: `https://${string}`;
  kind: "offer" | "commercial-traction" | "adoption";
  accessed: "2026-07-15";
};

export type DemandProduct = {
  rank: number;
  slug: string;
  buyer: string;
  job: string;
  packaging: string;
  score: {
    urgency: number;
    repeatability: number;
    timeToValue: number;
    feasibility: number;
    complianceSafety: number;
    proofability: number;
  };
  total: number;
  risk: string;
  evidence: DemandEvidence[];
};

export type OperatorPattern = {
  operator: string;
  companies: string[];
  mechanic: string;
  armaloProducts: string[];
  ethicalAdaptation: string;
  sources: Array<{
    label: string;
    url: `https://${string}`;
    accessed: "2026-07-15";
  }>;
};
```

Export `businessDemandProducts`, `consumerLabSlugs`, `operatorPatterns`, and
`demandBackedSlugs`. Use this exact score matrix; `total` is the equal-weight
sum and ties preserve the published order:

| Rank |   U |   R |   T |   F |   S |   P | Total |
| ---: | --: | --: | --: | --: | --: | --: | ----: |
|    1 |   5 |   5 |   5 |   4 |   4 |   5 |    28 |
|    2 |   5 |   5 |   4 |   4 |   4 |   5 |    27 |
|    3 |   5 |   5 |   5 |   4 |   3 |   4 |    26 |
|    4 |   5 |   5 |   5 |   4 |   2 |   4 |    25 |
|    5 |   4 |   5 |   4 |   4 |   4 |   4 |    25 |
|    6 |   5 |   5 |   4 |   4 |   2 |   4 |    24 |
|    7 |   4 |   5 |   5 |   5 |   2 |   3 |    24 |
|    8 |   4 |   5 |   4 |   3 |   4 |   3 |    23 |
|    9 |   4 |   4 |   3 |   3 |   2 |   4 |    20 |
|   10 |   5 |   5 |   4 |   2 |   1 |   1 |    18 |

Map ranks to these exact sources. Every row uses accessed `2026-07-15`; the
first URL is `offer` or `commercial-traction`, the second is `adoption` unless the label says
otherwise:

1. `https://www.salesforce.com/agentforce/pricing/` and
   `https://support.zendesk.com/hc/en-us/articles/5352026794010-About-automated-resolutions-for-AI-agents`.
2. `https://knowledge-base.rossum.ai/help/docs/understanding-rossums-data-extraction-billing` and
   `https://www.uipath.com/ai/ai25-awards/winners`.
3. `https://www.twilio.com/en-us/products/conversational-ai/pricing` and
   `https://investors.twilio.com/static-files/9a8a8a89-565a-4a5b-b11d-21ef45eede70`.
4. `https://www.salesforce.com/news/stories/how-salesforce-uses-agentforce-sales/`
   (adoption signal) and
   `https://www.salesforce.com/agentforce/pricing/` (commercial offer).
5. `https://www.glean.com/jp/press/glean-achieves-100m-arr-in-three-years-delivering-true-ai-roi-to-the-enterprise`
   and the Microsoft earnings URL above.
6. `https://www.bill.com/product/pricing` and
   `https://www.bill.com/product/ai`; add
   `https://www.thomsonreuters.com/en/press-releases/2025/april/from-incubation-to-integration-generative-ai-adoption-nearly-doubles-as-professional-services-reach-crossroads`
   as adoption.
7. `https://www.canva.com/newsroom/news/introducing-canva-business/` and
   `https://news.adobe.com/news/2025/09/global-enterprises-embrace-adobe-ai-innovations-power-growth`.
8. `https://docs.github.com/en/copilot/concepts/billing/organizations-and-enterprises`
   and the Microsoft earnings URL above.
9. `https://legal.thomsonreuters.com/en/c/compare-cocounsel-plans-for-your-legal-team`
   and the Thomson Reuters survey URL above.
10. `https://learn.microsoft.com/en-us/industry/healthcare/dragon-admin-center/concepts/dragon-copilot-licenses`
    and `https://www.ama-assn.org/practice-management/digital-health/2-3-physicians-are-using-health-ai-78-2023`.

Create `operatorPatterns` with these primary sources:

- Hormozi: `https://ai.acquisition.com/`, `https://vantage.acquisition.com/`,
  `https://www.acquisition.com/workshop-ai-accelerator`.
- Jordan Lee: `https://www.aiacquisition.com/platform`,
  `https://www.aiacquisition.com/blog/ai-agency`,
  `https://www.aiacquisition.com/terms-of-service`.
- Serge Gatari: `https://trycook.ai/`, `https://webby.trycook.ai/`,
  `https://trycook.ai/terms`.
- Iman Gadzhi: `https://www.monetise.com/waitlist`,
  `https://www.flozy.com/`,
  `https://educate.io/archives/terms-and-conditions`.
- Alex Becker: `https://hyros.com/`, `https://hyros.com/air`,
  `https://hyros.com/agency`.

- [ ] **Step 2: Implement deterministic category grouping**

Create:

```ts
export const preferredCatalogueCategories: string[];
export function buildCatalogueGroups<
  T extends {
    id: string;
    data: { category: string };
  },
>(apps: T[]): Array<{ id: string; label: string; apps: T[] }>;
```

Normalize case and repeated whitespace for grouping; use a preferred label when
its normalized key matches; append unknown normalized keys alphabetically;
slugify IDs and suffix collisions `-2`, `-3`; never drop or duplicate an app.

- [ ] **Step 3: Create eight records and upgrade the canonical digital studio**

Use the shared schema, lastVerified `2026-07-15`, and these contracts:

| Slug                             | Name                             | Category                | Order | Core boundary                                          |
| -------------------------------- | -------------------------------- | ----------------------- | ----: | ------------------------------------------------------ |
| document-operations-agent        | Document Operations Agent        | Business operations     |    76 | field confidence and human exception queue             |
| finance-operations-assistant     | Finance Operations Assistant     | Finance operations      |    44 | no payment or money movement without approval          |
| marketing-campaign-studio        | Marketing Campaign Studio        | Marketing production    |    66 | claims, copyright, likeness, publish/spend approval    |
| software-engineering-copilot     | Software Engineering Copilot     | AI engineering services |    16 | tests and human review before merge/deploy             |
| clinical-documentation-assistant | Clinical Documentation Assistant | Healthcare operations   |    86 | clinician finalizes; no diagnosis/treatment            |
| business-constraint-finder       | Business Constraint Finder       | Business strategy       |    12 | evidence-linked advice; no autonomous changes          |
| ai-digital-product-studio        | AI Digital Product Studio        | Creator commerce        |    65 | upgrade existing family; licensed content; test demand |
| revenue-intelligence-platform    | Revenue Intelligence Platform    | Data intelligence       |    91 | consented events; attribution is not causation         |
| lead-recovery-operator           | Lead Recovery Operator           | Revenue operations      |    56 | known consented leads, opt-out, send approval          |

Each body is public-safe, names no outside operator or trademark, and links to
`/research/demand-backed-ai-catalogue/`.

- [ ] **Step 4: Upgrade the canonical agency family in place**

In `agency-ai-workbench.md`, keep the slug but rename it
`AI Agency Operating System`. Preserve current audiences and packaging; sharpen
copy around reusable software, fixed installation, managed operation, tenant
isolation, client-owned permissions, acceptance tests, and approval-gated
external actions. Do not add `ai-agency-operating-system.md`.

- [ ] **Step 5: Tighten existing ranked boundaries without rewriting them**

Append only missing sentences to:

- `email-customer-service.md`: sends, refunds, account changes need approval;
- `voice-customer-service.md`: consent/recording, emergency handoff, no cold calls;
- `ai-qualifier.md`: authorized contacts, opt-out, nondiscriminatory rubric;
- `internal-knowledge-assistant.md`: permission-aware retrieval and citations;
- `legal-advice-assistant.md`: qualified review and source provenance.

Re-read each live file before patching, especially concurrent
`ai-qualifier.md`. Append; do not replace its narrative.

- [ ] **Step 6: Verify data, product, and grouping GREEN**

Run:

```bash
node --test --test-name-pattern="demand catalogue has|new demand products stay|catalogue groups merge" scripts/demand-catalogue-contract.test.mjs
```

Expected: these three tests pass. The research/shared-page tests remain red
until Task 3 by design.

## Chunk 3: Research route and homepage

### Task 3: Render one evidence model into both public surfaces

**Files:**

- Create: `src/pages/research/demand-backed-ai-catalogue.astro`
- Modify narrowly: `src/pages/index.astro`

- [ ] **Step 1: Build the research route from typed data**

Import all three typed datasets. Render methodology, B2B scope, per-rank links
and risks, consumer lab, five operator patterns, and ethical adaptations. State:

- Armalo is not affiliated with the named people or companies.
- Their pages document offers, not typical customer results.
- Market demand does not prove Armalo demand.
- Attribution, forecast, and verified incrementality are different proof classes.

External links use `target="_blank" rel="noopener noreferrer"`. Keep zero client
script and reuse the existing layout/tokens.

- [ ] **Step 2: Patch the homepage without replacing concurrent work**

Re-read its live diff. Import the typed demand data and grouping helper. Resolve
slugs against `apps`; throw during build when any ranked slug is missing. Replace
only fixed-group derivation with the helper.

Before `#work`, add heading `What buyers already pay for`, label
`Business demand · ranked 2026-07-15`, rank markers `01`–`10`, existing
`AppCard` instances, consumer line `Consumer product lab`, and a link to the
research route. Keep every full-shelf product exactly once. Do not edit the
concurrently changed `AppCard.astro`.

- [ ] **Step 3: Verify all source contracts GREEN**

Run `node --test scripts/demand-catalogue-contract.test.mjs`. Expected: every
source contract passes, including shared-module imports and research claims.

- [ ] **Step 4: Build and verify generated GREEN**

Run:

```bash
npm run build
node --test scripts/demand-catalogue-output.test.mjs
```

Expected: build exits 0 and every new output test passes.

## Chunk 4: Proof and review

### Task 4: Verify without swallowing concurrent failures

- [ ] Format only new files and exact scoped files; never run whole-repo write
      formatting.
- [ ] Run `npm run proof`.
- [ ] If concurrent work blocks it, run `npm test`, `npm run check`,
      `npm run build`, `npm run test:output`, `npm run budget`, and
      `./scripts/portfolio-doctor.sh` separately and report exact blockers.
- [ ] Run `git diff --check` and the captain-stack audit described by `AGENTS.md`.
- [ ] Search generated homepage, research, all eight new detail routes and both upgrades, JSON, and
      Markdown for expected slugs and maturity truth.
- [ ] Complete independent spec-compliance and code-quality reviews. Never claim
      full proof while any canonical gate is red.
