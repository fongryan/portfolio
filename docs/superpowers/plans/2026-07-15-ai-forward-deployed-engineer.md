# AI Forward Deployed Engineer Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a deeply documented, truthful hybrid AI Forward Deployed Engineer offer to the public Armalo catalogue.

**Architecture:** Add one content-driven product record so existing human and machine catalogue projections inherit the offer automatically. Add one public research and operating-model document, and protect maturity, positioning, and documentation with a focused catalogue contract test.

**Tech Stack:** Astro content collections, Markdown, Zod, Node test runner

---

## Chunk 1: Catalogue contract and content

### Task 1: Write the catalogue contract

**Files:**

- Modify: `scripts/catalogue-contract.test.mjs`

- [ ] Add a test that requires the AI FDE content record, hybrid positioning,
      broad audience, planned proof state, and deep-document link.
- [ ] Run the focused test and confirm it fails because the entry is absent.

### Task 2: Add the public product record

**Files:**

- Create: `src/content/apps/ai-forward-deployed-engineer.md`

- [ ] Add schema-valid catalogue metadata.
- [ ] Explain the hybrid human-plus-agent accountability model.
- [ ] Cover selection, discovery, build, eval, rollout, adoption, and handoff.
- [ ] Link the deep public operating-model document.
- [ ] Run the focused test and confirm it passes.

## Chunk 2: Deep documentation and proof

### Task 3: Document the offer deeply

**Files:**

- Create: `docs/ai-forward-deployed-engineer.md`

- [ ] Document market pattern, buyer fit, engagement lifecycle, deliverables,
      reference architecture, evals, security, governance, measurement,
      commercial shapes, anti-patterns, and source notes.
- [ ] Keep external research claims linked and Armalo claims truthful.

### Task 4: Validate the repository

**Files:**

- Verify only

- [ ] Run `npm test`.
- [ ] Run `npm run check`.
- [ ] Run `npm run build`.
- [ ] Run `npm run doctor`.
- [ ] Run `npm run proof`.
- [ ] Verify every external research link resolves to the intended official
      source.
- [ ] Inspect the final diff for public-safety and unrelated changes.
