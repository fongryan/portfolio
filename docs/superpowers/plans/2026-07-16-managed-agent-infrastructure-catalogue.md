# Managed Agent Infrastructure Catalogue Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the three approved managed-agent infrastructure offers as deep, claim-honest public catalogue products.

**Architecture:** Model each offer as an independent Astro content entry so the existing homepage, detail routes, sitemap, and machine projections inherit it automatically. Add one public thesis for shared positioning and dedicated source/output contracts for the family.

**Tech Stack:** Astro content collections, YAML frontmatter, Markdown, Node test runner.

---

## Chunk 1: Catalogue contract and records

### Task 1: Define the failing source contract

**Files:**

- Create: `scripts/managed-agent-infrastructure-contract.test.mjs`
- Modify: `package.json`

- [ ] Assert the three slugs, names, planned truth fields, shared category, and distinct value propositions.
- [ ] Assert the public operating thesis and preferred catalogue category exist.
- [ ] Run the focused test and confirm it fails because the records do not exist.

### Task 2: Add the catalogue family

**Files:**

- Create: `src/content/apps/managed-agent-workspaces.md`
- Create: `src/content/apps/agent-skill-library.md`
- Create: `src/content/apps/byok-agent-cloud.md`
- Create: `docs/managed-agent-infrastructure.md`
- Modify: `src/lib/catalogue-groups.ts`

- [ ] Add schema-valid, public-safe content for all three offers.
- [ ] Document the shared product boundary, composition, safety model, and proof ladder.
- [ ] Add `Managed agent infrastructure` to preferred category order.
- [ ] Run the focused source contract and confirm it passes.

## Chunk 2: Generated output and full proof

### Task 3: Define and satisfy the output contract

**Files:**

- Create: `scripts/managed-agent-infrastructure-output.test.mjs`
- Modify: `package.json`

- [ ] Assert all three products appear in JSON and Markdown machine surfaces.
- [ ] Assert all three detail pages render their correct names and honest proof state.
- [ ] Assert the homepage contains the new category and links each product once in the shelf.
- [ ] Build and run the focused output test.

### Task 4: Validate the complete public surface

- [ ] Run `npm run format:check`.
- [ ] Run `npm run proof`.
- [ ] Run `bash ../check-captain-stack.sh`.
- [ ] Inspect the homepage and all three detail routes in a real browser at desktop and narrow viewport widths.
- [ ] Review the final diff for public-safety boundaries and unrelated-work preservation.
