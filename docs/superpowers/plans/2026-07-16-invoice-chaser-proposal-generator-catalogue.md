# Invoice Chaser and Proposal Generator Catalogue Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add two evidence-honest Armalo catalogue products—Invoice Chaser and Proposal Generator—and document the current buyers, market patterns, and bounded Hermes goal/task operating contract behind them.

**Architecture:** Keep the portfolio static and content-driven. Each product is one `src/content/apps` record validated by the existing catalogue schema and projected automatically to human and machine catalogue routes. A public-safe research and operating document explains buyer demand, product boundaries, metrics, and how authenticated Armalo can later dispatch bounded Hermes work without putting customer state or execution authority in the public repo.

**Tech Stack:** Astro content collections, Markdown frontmatter, Node test runner, existing portfolio proof scripts.

---

## Chunk 1: Catalogue contract and product records

### Task 1: Specify the two products in the catalogue contract

**Files:**

- Modify: `scripts/catalogue-contract.test.mjs`
- Test: `scripts/catalogue-contract.test.mjs`

- [ ] Record the current baseline: the full file is already red because the separate in-progress AI Forward Deployed Engineer test references absent files. Do not edit or absorb that lane.
- [ ] Add one isolated test per product so each red/green cycle can be attributed independently:

```js
test("Invoice Chaser is a bounded planned quote-to-cash product", async () => {
  const entry = await read("src/content/apps/invoice-chaser.md");
  assert.match(entry, /name:\s*["']Invoice Chaser["']/);
  assert.match(entry, /status:\s*planned/);
  assert.match(entry, /access:\s*unavailable/);
  assert.match(entry, /proof:\s*not-yet-proven/);
  for (const audience of [
    "Freelancers",
    "Agencies",
    "Professional services firms",
    "Finance teams",
  ]) {
    assert.match(entry, new RegExp(audience));
  }
  assert.match(entry, /overdue|paid faster|cash flow/i);
  assert.match(entry, /approval|escalat|dispute/i);
  assert.match(entry, /docs\/ai-products-buyers-and-hermes-quote-to-cash\.md/);
  assert.doesNotMatch(
    entry,
    /(?:is|now|currently) (?:live|deployed|generally available)/i,
  );
});
```

```js
test("Proposal Generator is a bounded planned quote-to-cash product", async () => {
  const entry = await read("src/content/apps/proposal-generator.md");
  assert.match(entry, /name:\s*["']Proposal Generator["']/);
  assert.match(entry, /status:\s*planned/);
  assert.match(entry, /access:\s*unavailable/);
  assert.match(entry, /proof:\s*not-yet-proven/);
  for (const audience of [
    "Agencies",
    "Consultancies",
    "Freelancers",
    "Sales teams",
  ]) {
    assert.match(entry, new RegExp(audience));
  }
  assert.match(entry, /proposal|scope|pricing|close/i);
  assert.match(entry, /approval|review|authoritative/i);
  assert.match(entry, /docs\/ai-products-buyers-and-hermes-quote-to-cash\.md/);
  assert.doesNotMatch(
    entry,
    /(?:is|now|currently) (?:live|deployed|generally available)/i,
  );
});
```

- [ ] Run `node --test --test-name-pattern='Invoice Chaser' scripts/catalogue-contract.test.mjs` and confirm `ENOENT` for `invoice-chaser.md`.
- [ ] Run `node --test --test-name-pattern='Proposal Generator' scripts/catalogue-contract.test.mjs` and confirm `ENOENT` for `proposal-generator.md`.

### Task 2: Add Invoice Chaser

**Files:**

- Create: `src/content/apps/invoice-chaser.md`
- Test: `scripts/catalogue-contract.test.mjs`

- [ ] Add this complete schema-valid frontmatter, then write the bounded body beneath it:

```yaml
name: "Invoice Chaser"
status: planned
access: unavailable
proof: not-yet-proven
flywheel: build
lastVerified: "2026-07-15"
category: "Accounts receivable"
description: "A policy-aware receivables agent that follows up on overdue invoices, preserves customer context, and escalates disputes or sensitive cases for review."
year: 2026
order: 42
tags: ["invoicing", "collections", "cash flow"]
audiences:
  ["Freelancers", "Agencies", "Professional services firms", "Finance teams"]
deliveryModes: ["hosted", "custom-build", "dfy", "licensed"]
offerModes: ["pilot", "team", "agency", "enterprise"]
salesPosition: "Recover time and cash without turning every overdue invoice into an awkward manual chase or an unreviewed automated threat."
owner: "Armalo AI"
platform: "Dedicated Hermes Agent workflows"
ctaLabel: "Request a pilot"
highlights:
  - "Prioritizes overdue work from approved invoice and customer state."
  - "Drafts or schedules policy-based reminders with escalation boundaries."
  - "Tracks replies, disputes, promises, and payment evidence before closing work."
```

- [ ] Use exactly four audiences: freelancers, agencies, professional-services firms, and finance teams. Treat bookkeeping as a role within those buyers, not a fifth schema value.
- [ ] Describe invoice-state ingestion, policy-based reminders, dispute/relationship escalation, payment reconciliation, and evidence receipts without claiming live integrations or autonomous legal collection.
- [ ] If `hosted` appears as a delivery mode, state that all delivery modes are intended packaging, not current availability.
- [ ] Run `node --test --test-name-pattern='Invoice Chaser' scripts/catalogue-contract.test.mjs` and confirm pass.
- [ ] Commit only the test and Invoice Chaser files after the isolated test is green.

### Task 3: Add Proposal Generator

**Files:**

- Create: `src/content/apps/proposal-generator.md`
- Test: `scripts/catalogue-contract.test.mjs`

- [ ] Add this complete schema-valid frontmatter, then write the bounded body beneath it:

```yaml
name: "Proposal Generator"
status: planned
access: unavailable
proof: not-yet-proven
flywheel: build
lastVerified: "2026-07-15"
category: "Revenue operations"
description: "A proposal workflow agent that turns approved deal context into reviewable scope, pricing, proof, and next steps without inventing commercial terms."
year: 2026
order: 41
tags: ["proposals", "sales", "documents"]
audiences: ["Agencies", "Consultancies", "Freelancers", "Sales teams"]
deliveryModes: ["hosted", "custom-build", "dfy", "licensed"]
offerModes: ["pilot", "team", "agency", "enterprise"]
salesPosition: "Move from discovery to a buyer-ready proposal faster while keeping scope, pricing, claims, and acceptance under accountable review."
owner: "Armalo AI"
platform: "Dedicated Hermes Agent workflows"
ctaLabel: "Request a pilot"
highlights:
  - "Builds drafts from approved CRM, discovery, offer, and proof sources."
  - "Keeps scope, pricing, claims, and terms visible for accountable review."
  - "Tracks versions, buyer engagement, acceptance, and fulfillment handoff."
```

- [ ] Use exactly four audiences: agencies, consultancies, freelancers, and sales teams. Treat professional services as the broader category rather than a fifth schema value.
- [ ] Describe approved-source drafting, scope/pricing review, versioning, buyer engagement, acceptance, and handoff without claiming live signature/payment integrations.
- [ ] If `hosted` appears as a delivery mode, state that all delivery modes are intended packaging, not current availability.
- [ ] Run `node --test --test-name-pattern='Proposal Generator' scripts/catalogue-contract.test.mjs` and confirm pass.
- [ ] Commit only the Proposal Generator files after the isolated test is green.

## Chunk 2: Research and autonomous Hermes contract

### Task 4: Document what buyers are purchasing now

**Files:**

- Create: `docs/ai-products-buyers-and-hermes-quote-to-cash.md`

- [ ] Summarize current demand signals from recent survey and marketplace research.
- [ ] Separate buyers into microbusiness/freelancer, agency/consultancy, SMB/service operator, finance/AR team, mid-market sales team, and enterprise function.
- [ ] Rank product wedges by urgency, budget owner, time-to-value, and proof burden.
- [ ] Cite primary or direct sources and label vendor claims as vendor claims.
- [ ] Explain why Invoice Chaser and Proposal Generator are complementary quote-to-cash wedges rather than generic chatbots.

### Task 5: Specify Hermes goals and tasks

**Files:**

- Modify: `docs/ai-products-buyers-and-hermes-quote-to-cash.md`
- Modify: `GOALS.md`

- [ ] Define one goal contract per product with inputs, task graph, approvals, stop conditions, deterministic proof, retry/lease behavior, and outcome metrics.
- [ ] Describe the public-safe conceptual interfaces—task plan, independent goal gate, materialization rule, tenant scope, lease/fencing, capability scope, and evidence receipt—without publishing private topology or claiming product deployment.
- [ ] State that the design was checked against the existing Armalo runtime modules at a capability level; do not include internal file paths, local absolute paths, private URLs, tenant identifiers, runtime topology, credentials, provider bindings, or private operational policy.
- [ ] Add one public-safe active catalogue goal covering quote-to-cash product accuracy and evidence.

## Chunk 3: Generated output and proof

### Task 6: Update output expectations

**Files:**

- Modify: `scripts/site-output.test.mjs`

- [ ] Preserve every existing tracked and untracked catalogue record. The tracked branch has 13 records and the present dirty tree has 16; a concurrent AI-FDE lane may add a seventeenth. Do not hard-code 18 or 19.
- [ ] Replace the brittle hard-coded homepage total assertion with a count derived from the generated machine catalogue, while still asserting readable spacing and one available product.
- [ ] Add output assertions that parse `/agents/portfolio.json`, check Invoice Chaser and Proposal Generator have `planned + unavailable + not-yet-proven`, confirm both names appear in `/agents/portfolio.md`, and read both generated detail routes.
- [ ] Build the site and run `npm run test:output`.
- [ ] Confirm both product detail routes and both machine catalogue entries are generated.

### Task 7: Run full proof

**Files:**

- Verify only.

- [ ] Run `npm run proof` as the canonical gate; it includes formatting, tests, check, build, generated-output tests, budget, and doctor.
- [ ] Run `git diff --check`.
- [ ] Run `bash ../check-captain-stack.sh` and confirm the portfolio AGENTS/CLAUDE inheritance checks.
- [ ] Inspect the final diff and public-safety language.
- [ ] Attach completion evidence to the private Taste decision record; do not copy the private decision identifier into public product or research content.
