# Hermes Revenue Agents Catalogue Implementation Plan

> **For agentic workers:** This bounded content change is intentionally public-safe. Do not add credentials, private runtime topology, customer data, or unsupported live claims.

**Goal:** Add public catalogue coverage for dedicated Hermes revenue agents, AI CRM, and financial decision-support products, backed by a deep functionality and positioning document.

**Architecture:** Keep the portfolio as a static public catalogue. Add one content entry per product family using the existing maturity/access/proof contract, and document deeper product boundaries and existing Armalo functionality in a public-safe Markdown strategy document. Do not turn the portfolio into a control plane.

**Tech Stack:** Astro content collections, Markdown frontmatter, repository-native Node tests, `npm run proof`.

---

## Chunk 1: Public catalogue entries

**Files:**

- Create: `src/content/apps/hermes-revenue-agents.md`
- Create: `src/content/apps/hermes-ai-crm.md`
- Create: `src/content/apps/hermes-financial-adviser.md`

- [ ] Add three entries with honest planned/unavailable/not-yet-proven states.
- [ ] Describe appointment setters, calendar setters, dialers, qualifiers, closers, CRM workflows, and financial decision support without promising unsupported live access.
- [ ] Keep each entry within the existing schema limits.

## Chunk 2: Deep product and functionality document

**Files:**

- Create: `docs/hermes-revenue-agents-and-ai-crm.md`

- [ ] Document the product suite, buyer, agent roles, workflow boundaries, unit-economics thesis, trust requirements, proof ladder, risks, and launch sequence.
- [ ] Map claims to existing Armalo functionality at a capability level, including CRM lead state, approval-gated outreach, appointment/reminder patterns, and financial research/decision-support foundations.
- [ ] Explicitly separate existing functionality, planned productization, and unverified claims.

## Chunk 3: Verification

- [ ] Run `npm test`.
- [ ] Run `npm run check`.
- [ ] Run `npm run build`.
- [ ] Run `./scripts/portfolio-doctor.sh`.
- [ ] Inspect the final diff for private data and unsupported public-live claims.
