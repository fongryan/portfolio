# Armalo Product Catalogue: Sales-to-Fulfillment Plan

## Decision

Armalo will sell a catalogue of proprietary Hermes Agent tunings as product
families. The catalogue is the public shelf; marketing and selling are
configurable private layers; fulfillment is a separate delivery lane. This
allows Ryan to sell direct, support commission sellers, sell to agencies in
bulk, and deliver done-for-you implementations without making each sales
experiment a new product or forcing the builder to own the sales motion.

The canonical Taste Decide record is `td-portfolio-catalogue-20260715`.

## What the catalogue is for

The portfolio should let a seller scroll through recognizable business jobs,
choose a buyer type, understand the offer shape, and start a conversation. It
should answer “what can Armalo sell?” quickly.

It should not answer private questions such as:

- what a campaign spent or converted;
- what commission a specific seller earns;
- which customer credentials or provider account are bound;
- what an unpublished funnel says;
- whether a trading, betting, legal, or financial workflow is approved for use;
- how Hermes is tuned internally or how a customer tenant is operated.

## Product families

The first catalogue wave is deliberately broad but coherent:

| Family                                         | Example buyer                          | Strong first package                                   |
| ---------------------------------------------- | -------------------------------------- | ------------------------------------------------------ |
| Voice, SMS, WhatsApp, email service assistants | Service businesses and support teams   | Narrow pilot around one queue or channel               |
| Personal finance assistant                     | Consumers, educators, fintech partners | Education and planning pilot with explicit boundaries  |
| Personal tutor                                 | Families, schools, education brands    | Learner or classroom pilot                             |
| Legal workflow assistant                       | Legal teams and businesses             | Research/document workflow pilot with qualified review |
| Lead qualification assistant                   | B2B companies and agencies             | One offer, one qualification path                      |
| Internal knowledge assistant                   | Operations and enterprise teams        | One team, one source corpus, one measurable workflow   |
| Automated trading agent                        | Traders, funds, research teams         | Paper/shadow research before any execution authority   |
| Sports betting intelligence                    | Fans, media, data teams                | Research and thesis inspection, no outcome guarantees  |
| Agency AI workbench                            | Agencies and consultancies             | Repeatable white-label or partner delivery motion      |

## Operating architecture

The private system should keep four records separate:

### Product family

The stable object from the public catalogue. It has a purpose, audience
families, delivery modes, proof/access state, canonical capability boundaries,
and a version. Marketing can reference it; fulfillment can implement it.

### Audience preset

A reusable buyer lens: segment, job-to-be-done, pains, proof order, objections,
language, CTA, and qualification questions. Presets are presentation and
qualification data, not new product truth.

### Offer package

A sellable commercial shape: pilot, team, agency, enterprise, partner, or
commission route. Private pricing, margin, discount authority, seller split,
and contract terms belong here.

### Fulfillment brief

The sold package translated into work: owner, scope, integrations, data
boundary, Hermes tuning inputs, QA checks, approvals, launch criteria, support
and renewal plan. This is the seam between “closed” and “built.”

## Seller workflow

1. Seller starts in the public catalogue and selects a product family.
2. Seller opens a private audience preset or creates a qualified variant.
3. Seller selects a package shape appropriate to the buyer.
4. The system records the seller, referral or commission path, and lead owner.
5. A proposal uses approved copy and a package-specific scope.
6. On close, the system freezes the sold product/package version.
7. Fulfillment receives a structured brief and starts its own checklist.
8. Delivery evidence, launch status, support, and renewal are tracked outside
   the public portfolio.

This preserves a clean organizational split: one person can build and tune,
another can market and sell, and the handoff remains machine-readable.

## Automation boundary

The long-term automated loop can generate audience-specific drafts, landing
page variants, Meta ad copy, seller links, follow-up sequences, qualification
summaries, and fulfillment briefs. Automation must remain bounded by the owner
surface:

- public catalogue changes require source review and repo proof;
- ad spend, pricing, commissions, payouts, and external sends require private
  approvals and auditability;
- customer credentials and runtime actions require authenticated tenant
  authority;
- regulated, high-risk, or irreversible actions require explicit human gates;
- no generated copy may upgrade planned proof into a live claim.

## Build order

### Phase 1 — catalogue inventory (this portfolio)

- Keep one content-driven record per product family.
- Add audience, delivery, and offer metadata.
- Make the homepage long, grouped, and easy to scan.
- Project the same truth to machine-readable endpoints.
- Keep all planned products explicitly unproven and unavailable.

### Phase 2 — private commercial layer (Armalo control plane)

- Add audience presets, offer packages, funnel variants, and seller attribution.
- Add versioned copy and approval status.
- Add lead, opportunity, commission, and handoff records.
- Make product/package selection the only bridge into fulfillment.

### Phase 3 — fulfillment operations

- Generate implementation briefs from sold packages.
- Track Hermes tuning, integrations, QA, launch, support, and renewal.
- Add proof receipts that can later upgrade catalogue access or maturity.

### Phase 4 — automated growth loop

- Draft and test marketing variants per audience.
- Attribute leads and sales back to product, audience, package, and seller.
- Promote only proven copy, proof, and offer paths.
- Feed measured outcomes back into prioritization without leaking private data
  into the public portfolio.

## Acceptance contract

The portfolio wave is successful when:

- a seller can scroll through at least ten product families and understand the
  intended buyer and offer shape for each;
- each product has one canonical page and does not fork for every funnel;
- the page clearly says what is planned versus public-live;
- a reader can understand how catalogue, sales, marketing, and fulfillment are
  separated;
- machine endpoints emit the same public-safe truth;
- `npm run check`, `npm run build`, `npm test`, and `npm run doctor` pass;
- no private operational data, credentials, spend, commissions, or runtime
  instructions enter this public repository.
