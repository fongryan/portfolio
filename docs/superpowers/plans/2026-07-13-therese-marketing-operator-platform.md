# Therese Marketing Operator Platform Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first Therese-facing campaign learning loop as a private,
tenant-aware capability of `app.armalo.ai`, while keeping this public portfolio
as a safe catalogue and proof surface.

**Architecture:** Start with provider-neutral campaign entities and deterministic
fake adapters. Add the Therese review/approval experience over versioned briefs,
copy variants, creative assets, experiments, observations, and learnings. Add
Meta through an explicit preflight/draft boundary first; later add bounded live
execution. Stripe and Plaid are separate follow-on modules.

**Tech Stack:** Existing `app.armalo.ai` tenant/authorization/runtime contracts,
TypeScript schemas and tests, provider adapters, image/video generation
interfaces, and the portfolio Astro catalogue for public-safe metadata only.

---

## Chunk 1: Domain contract and proof model

### Task 1: Establish campaign and experiment entities

**Files:** canonical domain/schema owner in the `app` repository; matching domain tests.

- [ ] Define versioned `Brief`, `Hypothesis`, `Variant`, `Asset`, `Experiment`, `Observation`, and `Learning` records with organization/workspace/actor scope.
- [ ] Define `ActionRequest`, `Approval`, `ProviderRun`, and `Receipt` states.
- [ ] Add idempotency and unknown-outcome states to external mutations.
- [ ] Write failing tests for tenant isolation, lineage, stale approvals, and provider timeout recovery.
- [ ] Implement the minimum state transitions and run the narrow suite.

### Task 2: Add deterministic fake providers

**Files:** provider-neutral creative fake, Meta preflight/draft fake, adapter contract tests.

- [ ] Model image/video outputs with provenance and review warnings.
- [ ] Model Meta validation, draft creation, metrics snapshots, pause, and idempotent retry behavior.
- [ ] Make every fake receipt explicit about what it does not prove about live provider state.
- [ ] Run contract tests before any real credential-bearing integration.

## Chunk 2: Therese operator experience

### Task 3: Build the brief-to-variant workflow

**Files:** authenticated marketing workspace route in `app`, brief form, variant comparison components, browser/component tests.

- [ ] Let Therese create, edit, version, and reuse a brief.
- [ ] Display hypotheses beside copy and creative variants.
- [ ] Add pin, annotate, targeted rewrite, and lineage actions.
- [ ] Make uncertainty, missing inputs, claims warnings, and provider state visible.
- [ ] Verify empty, loading, retry, unauthorized, and normal journeys as Therese would use them.

### Task 4: Build approval and preflight review

**Files:** scoped approval panel, action receipt/timeline view, approval journey tests.

- [ ] Require approval for the exact package, account, audience, budget, and test window.
- [ ] Invalidate approval when material inputs change.
- [ ] Show the next irreversible action and blast radius before confirmation.
- [ ] Prove draft mode never calls live publish endpoints.

## Chunk 3: Meta and learning flywheel

### Task 5: Add Meta preflight/draft adapter

**Files:** Meta adapter interface/implementation in `app`, provider configuration docs, fake/sandbox tests.

- [ ] Validate account/page permissions, creative format, naming, budget, placement, audience constraints, and disclosures.
- [ ] Record provider IDs and receipts without claiming live publication unless confirmed.
- [ ] Add pause and bounded repair for partial or unknown outcomes.

### Task 6: Add metrics and learning records

**Files:** experiment ledger owner in `app`, learning summary view, incomplete-attribution tests.

- [ ] Normalize observations while preserving raw references.
- [ ] Separate proxy metrics from business outcomes.
- [ ] Generate a next-test recommendation linked to the prior hypothesis.
- [ ] Label inference, insufficient data, and business truth separately.

## Chunk 4: Public catalogue and later commerce slices

### Task 7: Publish a public-safe product entry

**Files:** `portfolio/src/content/apps/` entry only after runtime proof; public catalogue docs.

- [ ] Add only public capability, maturity, and verified route information.
- [ ] Do not publish campaign results, private strategy, customer data, or credentials.
- [ ] Run `npm run check`, `npm run build`, and `./scripts/portfolio-doctor.sh`.

### Task 8: Design Stripe product factory contract

**Files:** future private commerce module and provider contract; draft-first bulk creation tests.

- [ ] Support product templates, prices, entitlements, tax/shipping metadata, draft batches, activation, and lifecycle receipts.
- [ ] Require approval for activation and material price changes.
- [ ] Keep Stripe live proof separate from fake-provider proof.

### Task 9: Design Plaid visibility and transfer boundary

**Files:** future private finance module and provider contracts; blocked-transfer tests.

- [ ] Model Plaid as account/transaction visibility and reconciliation.
- [ ] Identify the authorized transfer rail separately; do not equate Plaid balance visibility with cash-out.
- [ ] Require limits, beneficiary verification, idempotency, confirmation, and reconciliation before enabling transfers.

## Chunk 5: Promotion and handoff

### Task 10: Validate the complete slice

- [ ] Run source/type/test proof in the owning `app` checkout.
- [ ] Run authenticated browser proof in the deployed environment when available.
- [ ] Run provider proof only with explicitly bounded credentials and approval.
- [ ] Run portfolio checks after any public catalogue change.
- [ ] Run `no-mistakes axi run --intent "Ship the Therese campaign learning loop with explicit approval, tenant isolation, and honest provider proof"` before promotion.
- [ ] Record receipts, blockers, and next owner in Brain/Firstmate.
