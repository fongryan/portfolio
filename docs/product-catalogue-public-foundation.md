# AI Product Catalogue: Public-Safe Foundation

> Status: architecture foundation only. Internal catalogue strategy, pricing,
> customer research, launch experiments, and operator instructions live in the
> private Brain/Obsidian project, not in this public repository.

## Purpose

The portfolio repo is the public, content-first index of Armalo products. It
should eventually help a visitor understand what exists and reach the relevant
product surface without becoming the system of record for private product
strategy.

The system of record for discovering, provisioning, building, and using products
is `app.armalo.ai`. It is the enterprise coding cloud launchpad: the place where
an authorized user enters a workspace, selects a product or capability bundle,
scaffolds it, connects approved integrations, and sees the resulting agent in
operation.

## Boundary

This repository may contain:

- public product names and concise descriptions;
- public status labels such as planned, in development, or live;
- public-safe categories and links;
- stable capability vocabulary;
- non-sensitive platform architecture;
- documentation that helps future agents add a product entry consistently.

This repository must not contain:

- unreleased pricing or packaging decisions;
- customer lists, private ICP research, ad audiences, or campaign performance;
- provider credentials, phone numbers, email addresses, API keys, or tokens;
- private Therese/Hermes operating instructions;
- private Brain excerpts or customer conversation content;
- unsupported claims that an integration or autonomous action is live.

## Catalogue model

The public catalogue is a projection of a deeper private capability graph.
Product entries should eventually be backed by these concepts:

| Entity | Public-safe meaning |
| --- | --- |
| Product | A named customer-facing agent or bundle |
| Capability | A reusable function such as research, qualification, scheduling, or follow-up |
| Channel | A communication or work surface such as voice, SMS, email, or calendar |
| Integration | A provider or system connection, shown only when status is verified |
| Workspace | The authorized environment where a product is configured and used |
| Proof status | The strongest evidence available: planned, built, tested, live, or verified |

## Therese marketing operator slice

The first private operator capability is a campaign learning loop: brief,
hypotheses, copy and image/video variants, Therese review, scoped approval,
Meta preflight/test execution, metrics, and the next learning. The complete
design and implementation sequence lives in
[`docs/superpowers/specs/2026-07-13-therese-marketing-operator-design.md`](./superpowers/specs/2026-07-13-therese-marketing-operator-design.md)
and [`docs/superpowers/plans/2026-07-13-therese-marketing-operator-platform.md`](./superpowers/plans/2026-07-13-therese-marketing-operator-platform.md).

This public repo documents the capability boundary only. Private campaign
briefs, ad audiences, creative provenance, provider credentials, performance
data, Stripe mutations, Plaid connections, balances, and transfer records must
remain in the authenticated control plane and its private owner surfaces.

The portfolio grid should remain a fast index. Product configuration, identity,
permissions, runtime state, traces, billing, and customer data belong behind the
authenticated `app.armalo.ai` gateway or the product's own approved subdomain.

## Capability families

The catalogue is intentionally broad, but its public taxonomy should stay
legible:

- Customer success and support
- Voice and phone operations
- SMS and approved messaging operations
- Email and inbox operations
- Scheduling, appointment setting, and follow-up
- Lead generation, qualification, and sales operations
- Research, planning, and strategy
- Executive and personal assistance
- Personal training and coaching
- Commerce, Shopify, Amazon FBA, and marketplace operations
- Business automation and custom agent workspaces

Customer-success products are cross-channel by design. A product may combine
voice, SMS, approved messaging, email, calendar, and CRM actions while preserving
one customer identity, conversation timeline, consent record, task state, and
human-escalation path.

## `app.armalo.ai` platform relationship

`app.armalo.ai` is the gateway and control plane, not merely another catalogue
entry. Its future responsibilities are:

1. authenticate the operator and resolve organization/workspace permissions;
2. browse products and compare capabilities;
3. provision a product from a versioned scaffold;
4. connect and validate integrations;
5. configure policies, channels, goals, and approval requirements;
6. run and observe agents with visible activity and receipts;
7. surface customer, conversation, appointment, and outcome state;
8. manage seats, usage, deployments, and support boundaries when commercial
   features are ready.

Subdomains may be used for focused product experiences, but they should inherit
identity, workspace, product version, event, and permission contracts from the
platform owner rather than becoming unrelated mini-sites.

## Product-entry contract

Every future public entry should answer, in plain language:

- What does it do?
- Who is it for?
- Which job does it own?
- What channels or systems does it use?
- What is its current proof status?
- Where does an authorized user go to use or provision it?

Descriptions should be specific, calm, and defensible. Do not call an agent
autonomous, live, integrated, or outcome-producing until the relevant proof gate
exists.

## Public-safe evolution path

1. Keep this portfolio hub static and fast.
2. Add verified product entries as products become real.
3. Add detail routes only when the second real product justifies the information
   architecture.
4. Link product use and provisioning to `app.armalo.ai`.
5. Keep private catalogue strategy and marketing choices in Brain/Obsidian.
6. Promote internal positioning into public copy only after an explicit marketing
   decision and public-safety review.

## Related private owner surface

The internal system of record is the Brain project page
`armalo-product-catalogue` and its companion platform proposal. This public file
is intentionally a boundary and implementation contract, not the complete
business plan.
