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

## Current implementation receipt — 2026-07-13

The canonical app branch `codex/therese-marketing-operator-canonical` now has
source/local proof for the deterministic first slice:

- Tenant-scoped briefs, hypotheses, copy variants, image/video references,
  packages, action requests, receipts, and learning records.
- A fake creative provider and fake Meta adapter. The approved fake runner
  executes brief → four copy variants → image/video references → approved fake
  Meta test → proxy metrics → next-test learning.
- Draft-only Stripe product batches with explicit fake receipts.
- Plaid reconciliation receipts that preserve `transferStatus: not_attempted`.
- An authenticated workspace Marketing surface with an honest empty state and
  approval/provider-proof display, plus an authenticated deterministic preview
  route that renders the generated package and learning receipt.

This is not deployed, live-provider, or business/financial proof. No real Meta,
image/video, Stripe, Plaid, transfer, or cash-out mutation has been performed.
The local authenticated runtime preview and authenticated gateway replay are
proven. The commerce boundary now includes a bounded Stripe product/price batch
tool with provider idempotency, separate activation approval, receipt closure,
and a provider-native user-bank transfer contract that rejects Armalo/platform
destinations. The next gate is separately approved sandbox/live provider
verification.

### Current implementation receipt — 2026-07-13 (commerce hardening)

- App commits `9655110`, `9f3908d`, and `0c77984` contain the campaign replay,
  commerce safety, and approval-scope slices.
- Gateway proof covers marketing receipt append → server attribution → room
  replay and rejects a cross-workspace marketing event.
- Launch approvals now bind to the exact brief/package, provider account,
  audience fingerprint, budget, and test window; changed or expired inputs fail
  closed in the deterministic loop and the replay event preserves that scope.
- Stripe pack proof covers bounded batch creation for products/prices with
  company/vertical metadata and deterministic provider idempotency keys; it does
  not activate checkout.
- Transfer intents require an explicit approval id and provider-native
  user-bank payout semantics; Plaid remains visibility/reconciliation only.
- Transfer limits, beneficiary verification, provider reconciliation, and
  Plaid payout-arrival evidence now close over the exact transfer intent;
  execution remains disabled without external authority and approval.
- Workspace-wide type-check is 53/53 green; affected contract/integration
  suites are green. No-mistakes remains occupied by unrelated active runs, so
  no promotion or external publication has occurred.
- Hosted audit on 2026-07-14 found `app.armalo.ai/api/marketing/preview` returns
  404 and `/workspace/demo` redirects to authenticated `/start`; deployed
  runtime proof is therefore not established.

### Task 1: Establish campaign and experiment entities

**Files:** canonical domain/schema owner in the `app` repository; matching domain tests.

- [x] Define versioned `Brief`, `Hypothesis`, `Variant`, `Asset`, `Experiment`, `Observation`, and `Learning` records with organization/workspace/actor scope.
- [x] Define `ActionRequest`, `Approval`, `ProviderRun`, and `Receipt` states.
- [x] Add idempotency and unknown-outcome states to external mutations.
- [x] Write and run focused tests for tenant isolation, lineage, and provider proof boundaries; stale approval invalidation and timeout recovery remain open.
- [x] Implement the minimum state transitions and run the narrow suite.

### Task 2: Add deterministic fake providers

**Files:** provider-neutral creative fake, Meta preflight/draft fake, adapter contract tests.

- [x] Model image/video outputs with provenance and review warnings.
- [ ] Model Meta validation, draft creation, metrics snapshots, pause, and idempotent retry behavior beyond the deterministic fake loop.
- [x] Make every fake receipt explicit about what it does not prove about live provider state.
- [x] Run contract tests before any real credential-bearing integration.

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

- [x] Support product templates, prices, company/vertical metadata, bounded draft batches, and lifecycle receipts.
- [x] Require a separate approval contract for activation; material price-change policy remains open.
- [x] Keep Stripe live proof separate from fake-provider proof.

### Task 9: Design Plaid visibility and transfer boundary

**Files:** future private finance module and provider contracts; blocked-transfer tests.

- [x] Model Plaid as account/transaction visibility and reconciliation.
- [x] Identify the authorized transfer rail separately; do not equate Plaid balance visibility with cash-out.
- [x] Require contract-enforced limits, beneficiary verification, idempotency, confirmation, and reconciliation before enabling transfers; runtime/provider enablement remains open because no authorized external account is available.

## Chunk 5: Promotion and handoff

### Task 10: Validate the complete slice

- [x] Run source/type/test proof in the owning `app` checkout.
- [ ] Run authenticated browser proof in the deployed environment when available; local browser proof is complete.
- [ ] Run provider proof only with explicitly bounded credentials and approval.
- [ ] Run portfolio checks after any public catalogue change.
- [ ] Run `no-mistakes axi run --intent "Ship the Therese campaign learning loop with explicit approval, tenant isolation, and honest provider proof"` before promotion.
- [x] Record receipts, blockers, and next owner in Brain; Firstmate/no-mistakes promotion remains externally occupied.
## Local review gate receipt (2026-07-14)

Review and approval are now distinct. Review generates the deterministic
copy/image/video package and pending approval scope; execution requires the
exact package id plus approval id and records fake Meta/learning receipts only
after approval. This is a public-safe source receipt, not hosted, provider, or
business proof.

The local browser journey caught a client identity mismatch and verified the
repair: the reviewed brief id now persists across approval, so the exact-package
guard accepts only the reviewed campaign. No provider mutation occurred.

Portfolio re-audit (2026-07-14): `./scripts/portfolio-doctor.sh` passed the
public-safety scan, `npm run check`, and `npm run build`. Existing dirty public
catalogue changes were preserved and not staged or published.
Commerce operator seam (2026-07-14): the canonical app now exposes a single
tenant-scoped Commerce surface and `/api/commerce/preview`. It can draft a
bounded multi-product Stripe catalog, reconcile fake Plaid visibility, and
display a proposed transfer as non-executable until beneficiary verification,
human approval, provider payout, and reconciliation. No external mutation is
claimed.

Hosted preview receipt (2026-07-14): the canonical branch deployed through the
existing Vercel `app` project at
https://app-cgd3f6cma-ryanrfonggmailcoms-projects.vercel.app. Production alias
promotion remains gated by the active no-mistakes run; no bypass was used.

Hosted start-flow repair (2026-07-14): `ARMALO_ROOM_TOKEN_SECRET` was present
in Vercel Production but omitted from Turborepo's environment contract.
`turbo.json` now declares the auth/runtime variables globally, and the existing
encrypted room-token secret is present in Vercel Preview as well. The corrected
Preview deployment reached Ready at
https://app-113vxmpnj-ryanrfonggmailcoms-projects.vercel.app. Production reached
Ready and promoted `https://app.armalo.ai`. The secret value was not stored in
this public repository. No provider or financial mutation occurred.

Canonical production re-promotion (2026-07-14): a later unrelated deployment
had replaced the alias with an older workspace surface. The canonical branch
was re-promoted through the existing Vercel `app` project; deployment
`dpl_GEsexZBeWVepCpQQHUkNQrZ8Nv5G` reached Ready and owns
https://app.armalo.ai. Chrome proof reached the Armalo workspace through
`/start`. Fresh web tests, type-check, build, and portfolio doctor passed. No
provider or financial mutation occurred.
