# AI Product Catalogue Platform Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Establish a private-first product catalogue and a public-safe portfolio foundation for selling and operating a broad platform of AI agents through `app.armalo.ai`.

**Architecture:** `app.armalo.ai` is the enterprise coding cloud launchpad, infrastructure owner, scaffolding surface, and authenticated gateway into catalogue products. The catalogue is a capability graph rather than a flat app list: reusable channels, integrations, memories, policies, workflows, and agent roles compose into customer-facing products. Private strategy and GTM truth live in Brain/Obsidian; the public portfolio exposes only safe product metadata and links.

**Tech Stack:** Astro 7, Markdown content collections, TypeScript, Armalo app platform, Brain/Obsidian Markdown, Hermes/Firstmate orchestration, channel providers such as Vapi/Twilio, Gmail/Outlook, SMS, calendars, and future commerce integrations.

---

## Chunk 1: Documentation foundation

### Task 1: Create the public-safe catalogue contract

**Files:**
- Create: `docs/product-catalogue-public-foundation.md`
- Modify: `README.md`
- Modify: `GOALS.md`
- Modify: `LOOPS.md`

- [ ] Document the public/private boundary, catalogue entities, safe metadata, and the relationship between the portfolio hub and `app.armalo.ai`.
- [ ] Document the platform contract without publishing pricing, private positioning, customer lists, credentials, or internal marketing playbooks.
- [ ] Add a durable repo goal and catalogue-maintenance loop.
- [ ] Run `npm run check` and `npm run build`.
- [ ] Run `./scripts/portfolio-doctor.sh` and inspect the diff for private leakage.

### Task 2: Create the private canonical project page

**Files:**
- Create: private Brain vault `30_Projects/armalo-product-catalogue.md`
- Modify: private Brain vault `30_Projects/armalo.md`

- [ ] Record the current product thesis, state, ownership, boundaries, and next actions using Brain schema.
- [ ] Link the catalogue project to Armalo, the app launchpad, agent operations, and marketing/operator surfaces.
- [ ] Append a dated decision timeline sourced to Ryan's direct instruction.
- [ ] Run Brain lint and repair any canonical-page or broken-link failures.

## Chunk 2: Private catalogue strategy

### Task 3: Write the internal catalogue and commercial architecture

**Files:**
- Create: private Brain `proposals/armalo-product-catalogue-platform-2026-07-13.md`

- [ ] Define product taxonomy across personal, professional, business, commerce, and platform/operator agents.
- [ ] Define product-card fields: buyer, job, capability, channels, integrations, autonomy, proof, pricing hypothesis, maturity, and expansion path.
- [ ] Define membership, seats, usage, managed service, and custom-deployment packaging hypotheses as experiments, not final pricing.
- [ ] Define the `app.armalo.ai` control-plane model: catalogue discovery, provisioning, workspace, agent runtime, observability, billing boundary, and support.
- [ ] Define the customer-success and communications substrate: inbound/outbound voice, SMS, iMessage where permitted, email, calendar, booking, follow-up, identity, consent, routing, and unified conversation state.
- [ ] Define Therese + Hermes collaboration, marketing feedback loops, ads, lead capture, qualification, outreach, and human approval gates.
- [ ] Define launch sequencing, wedge criteria, proof gates, risks, and open decisions.

### Task 4: Create the private agent/operator recall pack

**Files:**
- Create: private Brain vault `80_Agents/armalo-product-catalogue-operator.md`

- [ ] Give future Hermes and marketing agents a machine-readable operating contract for catalogue recall and product selection.
- [ ] Require evidence-backed claims, current maturity labels, explicit integration status, and no invented capabilities.
- [ ] Define safe actions: recommend, draft, qualify, schedule, send, call, provision, and report; separate approval-required actions from autonomous actions.
- [ ] Define the handoff between catalogue strategy, marketing experiments, app provisioning, customer success, and proof.

## Chunk 3: Validation and handoff

### Task 5: Validate and record the work

**Files:**
- Modify: Firstmate/Brain owner surfaces as required by the active task queue.

- [ ] Run `npm run check`, `npm run build`, and `./scripts/portfolio-doctor.sh` in the portfolio repo.
- [ ] Run the Brain repository's `npm run lint:brain` and `npm run validate` gates.
- [ ] Run `npm run brain -- wiki-lint` if available and record any pre-existing warnings separately from new failures.
- [ ] Verify `git diff --check` in both repositories.
- [ ] Record the exact files, proof output, remaining blockers, and next highest-leverage implementation slice in Brain/Obsidian.
