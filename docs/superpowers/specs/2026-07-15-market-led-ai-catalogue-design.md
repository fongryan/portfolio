# Market-led AI catalogue design

## Decision

Turn the catalogue from a flat inventory into two layers:

1. a ranked, ten-product `Build-to-sell shortlist` that communicates Armalo's
   current commercial priorities; and
2. the complete product shelf, which remains the canonical inventory of every
   planned, beta, and live product family.

The shortlist is an Armalo strategy, not a claim that an independent market
research firm ranked these exact products. Each ranked entry must therefore use
the labels `Commercial priority` and `Our buyer hypothesis`, not `market rank`,
`best-selling`, `buyer signal`, or revenue language.

Taste decision: `td-portfolio-market-led-ai-catalogue-20260715`.

## Research synthesis

The market evidence supports five reusable commercial patterns:

- outcome-led, niche-specific implementation rather than generic AI consulting;
- modular systems that can be sold as a pilot, recurring managed service,
  licensed product, or agency/partner package;
- proprietary knowledge turned into a bounded advisor;
- revenue infrastructure that joins prospecting, qualification, follow-up,
  calling, CRM state, attribution, and remarketing; and
- education, software, coaching, and community combined into one product
  system for creators or experts.

Named operators are research inputs, not brands to imitate publicly. Catalogue
copy must not imply endorsement, affiliation, copied technology, typical
earnings, or parity with their results.

## Ranked shortlist

| Priority | Product                      | Primary buyer                                      | Job purchased                                      |
| -------: | ---------------------------- | -------------------------------------------------- | -------------------------------------------------- |
|        1 | Hermes Revenue Agents        | high-ticket sales teams and agencies               | create more qualified sales conversations          |
|        2 | AI Customer Service Desk     | support and operations teams                       | resolve routine demand and protect human attention |
|        3 | AI Dialer                    | local services and call-based sales teams          | respond, qualify, and hand off calls quickly       |
|        4 | Hermes AI CRM                | founders, agencies, and sales teams                | keep pipeline context and follow-up accountable    |
|        5 | Internal Knowledge Assistant | professional-services and operations teams         | answer from approved company knowledge             |
|        6 | AI Forward Deployed Engineer | software companies and operating businesses        | carry one workflow into reliable production        |
|        7 | AI Attribution & Remarketing | paid-growth teams and ecommerce operators          | connect spend to revenue and improve follow-up     |
|        8 | AI Digital Product Studio    | creators, educators, and agencies                  | turn expertise into a sellable product system      |
|        9 | Expert Knowledge Assistant   | experts, educators, and membership businesses      | make a trusted body of knowledge interactive       |
|       10 | AI Stylist                   | consumers, stylists, retailers, and fashion brands | narrow wardrobe and shopping decisions             |

## Data contract

Add three optional fields to catalogue entries:

- `commercialPriority`: an integer from 1 through 10;
- `buyerHypothesis`: a concise, single-line Armalo inference explaining why the
  product is on the shortlist;
- `researchRefs`: one to four stable source IDs that resolve in the public
  research note.

The fields are optional because the full catalogue is intentionally broader
than the current shortlist. Tests, not the per-entry schema, enforce that
shortlist ranks are unique and contiguous from 1 through 10.

All three fields must appear in the JSON and Markdown machine projections. The
JSON schema version moves from `armalo.portfolio.catalogue.v3` to `v4`; this is
an additive contract change, but the explicit version prevents silent consumer
drift. Ranked cards and detail pages should show the priority and hypothesis
without changing the honest maturity, access, proof, or flywheel contracts.

## New product families

Create four planned entries:

- `ai-customer-service-desk`: the parent bundle above the existing email, SMS,
  voice, and WhatsApp modules. The bundle is bought when a customer needs one
  policy, knowledge, routing, and reporting layer across channels; each module
  remains separately buyable for a narrower deployment;
- `ai-attribution-remarketing`: an evidence-led paid-growth and visitor
  follow-up system inspired by the category HYROS occupies, without copying its
  product or claims;
- `ai-digital-product-studio`: a creator/expert product workflow spanning
  research, synthesis, packaging, launch assets, and delivery;
- `expert-knowledge-assistant`: a source-grounded advisor built from an
  expert's approved materials, with clear identity and advice boundaries.

All four use `planned`, `unavailable`, `not-yet-proven`, and `build`.

## Homepage design

Insert the shortlist between the flywheel strip and the complete shelf. Keep
the existing restrained editorial system: rules, typography, white space, and
no gradients or decorative badges.

Each shortlist row contains:

- two-digit priority;
- product name and link;
- buyer hypothesis;
- category.

The complete shelf remains grouped by category below. Add the three missing
groups: `Marketing intelligence`, `Creator commerce`, and `Knowledge products`.

## Research note

Add `docs/market-led-ai-product-catalogue.md` as the public source and inference
record. It must:

- state what each source actually offers;
- separate source claims from Armalo conclusions;
- correct `Hyrox` to `HYROS`;
- explain the ten-product selection and packaging model;
- include source URLs and access dates; and
- state that willingness to pay for Armalo's planned products remains unproven.

Every source record must include a stable ID, source title/operator, primary
URL, publication date when available, access date, supported claim,
confidence, and limitation. Primary sources are required where available.
Promotional revenue or earnings claims may describe an operator's positioning,
but they cannot count as evidence that a category has independent buyer demand.
Each ranked product must resolve at least one `researchRefs` ID and the note must
label the resulting shortlist conclusion as Armalo inference.

## Verification

- Source contract test proves exactly ten unique priorities, the expected
  products, honest maturity, new categories, resolvable research references,
  v4 projections, and public research.
- Generated-output test proves all ten render in priority order and appear in
  JSON and Markdown projections.
- `npm run proof` proves format, tests, check, build, output, budget, and doctor.
- Browser QA checks desktop and mobile layout and verifies that the shortlist
  adds hierarchy without overwhelming the full shelf.

## Non-goals

- No deployment or publication.
- No claim that Armalo has sold or delivered these products.
- No cloning of names, trademarks, UI, source code, proprietary prompts, or
  earnings claims.
- No pricing promises before buyer interviews and delivery-cost proof.
- No replacement of the complete catalogue with only the shortlist.
