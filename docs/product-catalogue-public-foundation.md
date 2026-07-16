# Public Product Catalogue Foundation

This repository is Armalo’s public product shelf: a long, scannable catalogue
of AI product families that a buyer, agency partner, or commissioned seller can
understand without needing access to private operations.

The catalogue is intentionally not the fulfillment system and not the campaign
manager. It is the stable public index that makes the offer legible.

## Product model

One Markdown entry under `src/content/apps/` is one canonical product family.
The entry can be sold through many audience lenses without duplicating the
product into separate pages or allowing marketing copy to fork the underlying
truth.

Each entry contains:

- `name`, `category`, `description`, `year`, `tags`: the public identity;
- `audiences`: who the product is for;
- `deliveryModes`: whether it can be hosted, custom-built, done for you,
  licensed, or partner-delivered;
- `offerModes`: public packaging shapes such as pilot, team, agency,
  enterprise, or commission sales;
- `salesPosition`: the concise outcome-led reason a seller should lead with;
- `status`, `access`, `proof`, `lastVerified`: maturity and evidence truth;
- `highlights`: three or fewer defensible things the product can do;
- `url`, `ctaLabel`: an external destination only when one is actually public.

The catalogue may list planned inventory. `planned + not-yet-proven +
unavailable` means “sellable product concept to qualify and scope,” not “live
product,” “available seat,” “working integration,” or “guaranteed outcome.”

## The commercial split

The public surface owns product positioning. A private Armalo control plane
should own the mutable commercial layer:

| Layer       | Owns                                                                                | Public here? |
| ----------- | ----------------------------------------------------------------------------------- | ------------ |
| Catalogue   | Product family, audience, packaging shape, proof, access, public copy               | Yes          |
| Marketing   | Funnel variants, audience copy, Meta ad sets, landing-page experiments, attribution | No           |
| Sales       | Seller assignment, commission rules, lead ownership, proposals, close state         | No           |
| Fulfillment | Tuning brief, integrations, tenant setup, QA, launch, support, renewal              | No           |
| Runtime     | Hermes tuning, provider bindings, credentials, permissions, usage, audit            | No           |

This creates the desired handoff: a sales operator can sell from the catalogue,
then fulfillment receives a structured product/package selection rather than a
marketing transcript. The same product record can support direct sales, agency
resale, commission sales, or done-for-you delivery without making the public
portfolio a private CRM or runtime control plane.

## Funnels without catalogue sprawl

The private system should model a funnel as a reference to a product family,
not as a new product:

```text
ProductFamily
  -> AudiencePreset
  -> OfferPackage
  -> FunnelVariant
  -> Campaign / seller link
  -> Lead
  -> Qualified opportunity
  -> Sold package
  -> Fulfillment brief
```

An `AudiencePreset` can change the lead sentence, proof order, objections,
call-to-action, and packaging language. It must not change the product’s
canonical maturity, proof, access, or runtime authority. A `FunnelVariant`
belongs in the private operator surface because it may contain spend, targeting,
conversion data, unpublished claims, or customer-specific strategy.

## Product families currently represented

The initial shelf covers customer-service assistants for voice, SMS, WhatsApp,
and email; personal finance; tutoring; legal workflows; lead qualification;
internal knowledge; automated trading research; sports betting intelligence;
and an agency workbench. Girl Math remains the only currently public-live
product surface in this checkout.

The product list is inventory, not a promise that every family is complete.
Before changing a product from `planned`, attach a real destination, access
decision, proof level, verification date, and visitor-facing CTA.

## Public machine surfaces

`/agents/portfolio.json` and `/agents/portfolio.md` project the same public
catalogue truth for machine readers. They must never contain:

- internal operator identities or invocation instructions;
- campaign strategy, ad spend, pricing experiments, commissions, or funnel
  performance;
- credentials, customer data, financial state, or private runtime topology;
- claims of live trading, legal advice, regulated financial advice, guaranteed
  sports outcomes, or working integrations without attached proof.

## Fulfillment handoff contract

When the private system later turns a sale into delivery, the handoff should
carry only the minimum structured facts needed to build:

1. product family and version;
2. audience and sold offer package;
3. customer outcome and approved scope;
4. channel, integrations, and data boundaries;
5. tuning and brand inputs;
6. human approval, escalation, QA, launch, and support requirements;
7. owner, due dates, and proof obligations.

The handoff is not a license to silently add credentials, send messages, trade,
give legal or financial advice, or mutate a customer system. Those actions need
their own authenticated runtime authority and approval gates.

## Adding a product

Add a Markdown entry only when its public positioning is specific enough for a
seller to use and honest enough for a buyer to trust. Keep private pricing,
campaign variants, customer research, operator playbooks, and Hermes runtime
instructions in their authenticated owner systems. This public repository is a
catalogue and proof surface, never a private strategy vault.
