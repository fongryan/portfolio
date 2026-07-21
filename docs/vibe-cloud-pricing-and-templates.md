# Vibe-Cloud Pricing and Starter Templates: The Second Revenue Lane

Status: strategy draft, 2026-07-21. Owner: Armalo AI. This document frames how
Armalo App's usage pricing and starter-template catalogue are meant to work
once shipped. It is a strategy statement, not a revenue or feature claim —
proof discipline on the catalogue (status, access, proof, flywheel stage)
still governs every public claim, and nothing here is live pricing until the
product record at `/apps/armalo-app` says so.

## The one-line thesis

**Armalo App competes on margin, not always on sticker price — and a
premium starter-template catalogue is a second, near-zero-COGS revenue lane
riding the same workspace.** Usage-based credits fund the agent/compute cost
of building; one-time template purchases monetize the curated starting
points people build from, independent of usage.

## Why usage pricing, not seat pricing

Most of the field (Replit, Lovable, Bolt.new, Base44, v0) bills a mix of
monthly seats and metered usage credits against a frontier-model backend.
Armalo App's agent/compute stack is materially cheaper per unit of work than
a frontier-model backend, which changes the pricing question from "match the
competitor's number" to "price for margin, then decide how much of the
margin advantage to pass through as a lower price."

Comparable evidence, evaluated 2026-07-21:

| Product      | Entry plan | Included usage                  | Effective unit price                  |
| ------------ | ---------- | ------------------------------- | ------------------------------------- |
| Base44       | $16/mo     | 100 messages                    | ~$0.13–0.16/message                   |
| Lovable      | $25/mo     | 100–250 credits (daily accrual) | ~$0.10–0.25/credit                    |
| v0 (Vercel)  | $20/mo     | $20 credits, tiered by model    | opaque, model-tier dependent          |
| Bolt.new     | $20/mo     | 13M tokens                      | ~$1.54/M tokens (~$0.46/typical turn) |
| Replit Agent | $25/mo     | effort-based checkpoints        | $0.10–$5+/checkpoint, high variance   |

Armalo App's own agent/compute cost per unit of work sits well below what a
frontier-model-backed competitor pays for the same unit, which is the entire
basis for the pricing plan below rather than a claim about what any
competitor's actual margin is.

## The pricing plan

- **Free tier**: a bounded number of credits, enough to build and deploy one
  small app. Funnel, not revenue — matches the field's universal free-tier
  pattern.
- **Subscription tier**: a monthly credit allotment priced to sit inside the
  field's existing $16–$25/mo entry-plan band, so it reads as normal rather
  than needing to justify itself on price alone.
- **Effort-weighted credit burn**: light edits cost less than heavy
  multi-step builds, metered by agent time and sandbox time and shown before
  the work runs. This is a deliberate response to the field's own visible
  failure mode — flat-rate or opaque effort billing (Replit Agent 3, most
  visibly) produces user-reported bill shock. Predictable, pre-quoted credit
  cost is a product differentiator, not just a billing detail.
- **Top-up credits**: priced at a modest premium over the subscription rate,
  standard practice across the field.

## The second lane: premium starter templates

Comparable evidence that this is a real, standalone business rather than a
feature idea:

- Dedicated SaaS boilerplate products (e.g. ShipFast, MakerKit) sell $200–650
  one-time for source code the buyer could, in principle, read and rebuild
  themselves. Buyers are paying for time saved and a proven-correct starting
  point, not for lock-in — the same thing a curated Armalo starter template
  would sell.
- Design-tool marketplaces (e.g. Framer's Creator Program) show a healthy
  price band for individual templates in the tens to low hundreds of dollars,
  and that creators will supply templates at scale when the revenue share is
  fair.
- Independent, unofficial shops already sell premium starter templates for
  other vibe-coding platforms back to those platforms' own users — direct
  evidence of unmet demand sitting on top of the exact category Armalo
  competes in.

Planned structure:

- **Free scaffolds**: basic auth/DB/deploy starters — acquisition, not
  revenue.
- **Pro templates**: vertical-specific, polished starting points, priced as a
  one-time purchase in the tens of dollars.
- **Flagship templates**: fully-wired verticals (billing, multi-tenant,
  admin panel, integrations pre-configured) priced one-time in the low
  hundreds of dollars — the same value proposition as a SaaS boilerplate,
  scoped to a single vertical.
- **Templates are priced in cash, not credits.** A template is a content
  purchase, not metered usage; keeping it a separate line item keeps both the
  buyer's mental model and the accounting clean, and template revenue carries
  materially better margin than credit revenue because it has no per-unit
  agent or sandbox cost.
- **Creator marketplace is a later phase**, opened only once Armalo's own
  templates have demonstrated demand — a marketplace with supply and no
  proven demand is wasted surface area.

## Honesty constraints on this framing

The site's proof rules apply to this document, not just the catalogue
entries:

- No credit pricing, template catalogue, or checkout flow is live. This
  document describes a plan; the product record at `/apps/armalo-app`
  remains the source of truth for what is actually shipped, and its `status`,
  `proof`, and `flywheel` fields govern what can be claimed publicly.
- Comparable pricing cited above is publicly published vendor pricing, not
  Armalo revenue or margin data, and does not establish Armalo pricing,
  adoption, or a completed purchase for any tier described here.
- Any subsidized or promotional backend pricing Armalo uses internally to
  reach the cost structure described above is a launch-phase input to
  margin, not a permanent assumption; steady-state pricing should be
  evaluated against standard published rates before being treated as durable
  economics.

## The metric that matters

This plan succeeds in this order, and should be tracked in this order:

1. Credit pricing ships with effort-weighting live from day one (not bolted
   on after a bill-shock incident, per the field's own cautionary example).
2. First template sale, independent of subscription revenue.
3. Template revenue margin confirmed near 100% (no material agent/sandbox
   cost per sale).
4. Template catalogue breadth becomes a stated reason a workspace converts
   from free to paid, not just an upsell after the fact.

Until (2) is true, template monetization stays framed as plan and hypothesis
here, per the catalogue's proof discipline.
