# AI Stylist catalogue entry design

## Decision

Add one canonical `AI Stylist` product family to the public Armalo catalogue.
Frame it first as a personal style concierge for consumers, with a secondary
white-label path for retailers and fashion brands. Keep the product at planned
maturity with unavailable access and not-yet-proven proof.

## Alternatives considered

1. Consumer-only outfit helper. Clear and approachable, but unnecessarily
   narrows future packaging.
2. Retailer-only merchandising assistant. Commercially legible, but loses the
   direct human benefit that makes the product immediately understandable.
3. Personal style concierge with partner packaging. Recommended because it
   keeps the card concrete while supporting both direct and business buyers.

## Catalogue contract

- Name: `AI Stylist`
- Category: `Personal style`
- Homepage: add `Personal style` to the fixed category group list so the entry
  appears on the visible catalogue shelf
- Maturity: planned, unavailable, not yet proven, build stage
- Audiences: consumers, personal stylists, retailers, and fashion brands
- Jobs: understand wardrobe and preferences, assemble outfits, narrow shopping
  choices, and support partner-specific experiences
- Safety boundary: recommendations are guidance; purchasing, inventory access,
  returns, and brand integrations require an explicit implementation
- Visual scope: no new component or layout; reuse the existing content-driven
  catalogue card and detail page

## Verification

Add a catalogue contract test before the entry. The test must fail while the
entry is absent, then pass once the Markdown content satisfies the shared
schema and honest-maturity constraints. Verify the product is reachable from
the homepage, receives its generated detail route, and appears in both public
machine projections. Run the catalogue test, full test suite, Astro check,
production build, repository doctor, and captain-stack audit.

## Taste decision

Decision ID: `taste:portfolio-ai-stylist:2026-07-15`.

The measurable outcome is one schema-valid AI Stylist catalogue entry whose
copy serves direct and partner audiences without claiming a live product.
