# Therese Marketing Operator Platform Design

> Status: approved direction; implementation begins with the campaign learning
> loop described below. This document is public-safe architecture, not a private
> operating manual, credential store, or claim that provider actions are live.

## Mission

Give Therese a calm, capable marketing-operator workspace while Ryan remains
the developer and platform owner. The system should turn a plain-language
brief into campaign hypotheses, copy variants, image/video concepts, reviewable
ad packages, controlled Meta experiments, and a durable learning record. It
should be useful to one household first while preserving clean tenant
boundaries for future companies and verticals.

The portfolio is the public catalogue and proof surface. `app.armalo.ai` is the
authenticated build-and-operate control plane: it owns workspaces, connected
providers, policy, deployments, event receipts, and capability composition. A
future marketing workspace may be showcased in the portfolio, but its private
campaign data, audiences, credentials, financial records, and operator notes do
not belong in this repository.

## Roles and authority

| Role | Owns | Does not silently own |
| --- | --- | --- |
| Ryan / developer | platform, integrations, schemas, deploys, policies, runtime reliability | publishing ads, changing money movement rules without review |
| Therese / marketer | briefs, audience hypotheses, positioning, copy/creative selection, experiment decisions | infrastructure, secrets, unrestricted financial transfers |
| Agent workers | research, drafting, variant generation, comparison, reporting, recommendations | irreversible provider mutations or unsupported claims |
| Approval owner | explicit approval for the next irreversible action | retroactive approval of an already executed action |

The product must show who is acting, for which workspace, against which provider
account, with what approval state. Every external mutation gets an idempotency
key, request receipt, provider response, and rollback or pause path where the
provider supports one.

## First golden loop: campaign learning

```text
Brief -> hypotheses -> copy/creative variants -> Therese review
      -> approval gate -> Meta test -> metrics ingest -> learning record
      -> next brief / next variant set
```

### Brief and hypothesis

Therese starts with a short form or conversational prompt containing the
product/workspace, offer, audience hypothesis, channel, geography, budget
guardrails, brand voice, required disclosures, success event, and test window.
The brief is versioned; editing it creates a new version rather than changing
the input behind an experiment.

The agent turns the brief into a few falsifiable hypotheses. Each states the
audience belief, message angle, offer framing, creative direction, primary
metric, guardrail metric, and why the test can teach something. The system
should prefer meaningfully different angles over dozens of near-duplicates and
surface missing inputs before generation.

### Copy generation

Each variant is structured: hook/headline, primary text, description, CTA,
angle/hypothesis ID, audience and placement assumptions, claim/compliance
notes, model/provider metadata, human edits, and version history. Therese can
compare variants, pin a favorite, request a targeted rewrite, or combine
approved fragments. The system preserves the reason for revisions so results
remain interpretable.

### Image and video generation

Creative generation produces an asset brief first, then assets with a visual
concept, shot/scene list, aspect ratios, prompts and negative constraints,
product/brand references, provenance, captions/on-screen text/voiceover, rights
and disclosure notes, and review status. Assets remain drafts until Therese
selects them and the approval policy allows the intended placement. A rendered
asset is not automatically safe to publish.

### Review, approval, and Meta execution

The review surface is a gallery and comparison table showing copy, creative,
hypothesis, estimated production cost, warnings, and intended test cell.
Approval is scoped: draft generation, creative package, Meta campaign mutation,
budget/test window, and pause/stop are separate actions. Approval expires or is
invalidated when material inputs change.

Meta begins in preflight/draft mode. Validation covers account/page
permissions, creative formats, budget limits, audience constraints, naming,
and idempotency. Live execution is a separate capability with its own
permission. The adapter records submitted packages, provider IDs, timestamps,
status transitions, spend limits, and pause commands. Without a live receipt,
the UI says “not proven,” never “published.”

### Metrics and learning

Metrics normalize into experiment-level observations while preserving raw
provider references. A learning record separates what was planned, what ran,
what the provider reported, what changed in the business funnel, what remains
unknown, and the next recommended test. The agent must not declare a winner
from incomplete attribution, early noise, or proxy metrics without labeling the
inference.

## Platform modules

### Marketing workspace

Owns briefs, brand/voice references, offer library, audience hypotheses,
campaigns, experiments, creative assets, approvals, and learning records.

### Creative factory

Owns provider-agnostic asset requests and image/video adapters. It exposes
provenance and review state instead of hard-coding one vendor.

### Experiment ledger

Owns hypothesis IDs, test cells, variant lineage, metrics snapshots, decisions,
and learnings. This is the durable flywheel: every result improves the next
brief without turning weak data into false certainty.

### Provider gateway

Owns scoped Meta and future-channel connections. Secrets stay in the
authenticated control plane. Provider calls are policy-checked, logged, and
replay-safe.

### Product factory (next commerce slice)

Creates reusable product definitions, prices, tax/shipping metadata, checkout
links, entitlements, and lifecycle status through Stripe adapters. Bulk creation
can use templates and draft batches, but activation and price changes require
explicit approval and idempotent receipts.

### Money realization (later finance slice)

Plaid is a connection and account-data layer, not by itself a universal cash-out
rail. The design distinguishes account linking, balance/transaction
observation, reconciliation, payout destination, and an actual transfer rail.
Any transfer requires an authorized rail, dual control or explicit confirmation,
limits, beneficiary verification, idempotency, and reconciliation. “Visible in
Plaid” is not the same as “cash moved.”

## Tenant and data model boundary

Every record carries `organization_id`, `workspace_id`, `actor_id`, and a
version or event timestamp. Provider connections are scoped to an organization
and purpose; they are never shared through public catalogue content.

Suggested aggregate:

`Organization -> Workspace -> Brand -> Offer -> Brief -> Hypothesis -> Variant -> Asset -> Experiment -> Observation -> Learning`

External mutations are represented as `ActionRequest -> Approval -> ProviderRun
-> Receipt`, with an explicit state machine and no implicit “success” state.

## Error and safety behavior

- Missing provider access: show the exact missing permission/configuration and leave the action in draft.
- Stale approval: require re-approval when budget, audience, creative, or copy changes materially.
- Provider timeout: mark the run unknown, reconcile before retrying, and reuse the idempotency key.
- Partial success: show each provider object and allow bounded repair.
- Generated-content warning: block publishing until reviewed.
- Financial ambiguity: stop; do not infer available cash or successful transfer.
- Cross-tenant access attempt: fail closed and emit an audit event.

## Proof gates

1. Source proof: schemas, adapters, permissions, and tests exist.
2. Local integration proof: deterministic fakes exercise draft-to-learning.
3. Deployed runtime proof: authenticated browser journey works and emits receipts.
4. Provider proof: sandbox or bounded live action is confirmed by provider response.
5. Business proof: spend, conversion, revenue, and cash movement reconcile against authoritative records over time.

The portfolio displays only the strongest verified status. “Planned” or “in
development” is correct while private runtime proof is still being collected.

## Sequencing and acceptance

1. Brief, structured variants, creative gallery, approvals, and local ledger.
2. Meta preflight/draft adapter, then bounded live test execution.
3. Metrics ingestion, attribution caveats, learning records, and iteration.
4. Stripe product/pricing factory with draft-first bulk creation.
5. Plaid visibility and reconciliation; select a transfer rail separately before any cash-out claim.
6. Multi-tenant packaging, delegated roles, usage metering, and public proof pages.

The first slice is accepted when Therese can create and revise a brief without
code, compare and annotate copy/creative packages with lineage, approve a
bounded package, and produce a deterministic draft-to-learning receipt. Meta
live publishing must be visibly separate from local/draft proof, and no private
campaign, financial, credential, or customer data may enter the public portfolio.
