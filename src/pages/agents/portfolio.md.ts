const contract = `# Armalo portfolio catalogue — Hermes contract

Public surface: product metadata only.
Private control plane: https://app.armalo.ai
Machine-readable catalogue: /agents/portfolio.json
Operator: hosted Armalo Hermes, explicitly labeled admin-only.

Hermes may use this surface to recall products, compare public positioning,
draft campaign briefs, and prepare Stripe or Meta Ads proposals. It must route
all tenant-scoped work through the Armalo control plane and existing typed skill
governance.

The public portfolio never contains credentials, customer data, campaign
strategy, ad spend, provider state, Stripe secrets, payout instructions, or
financial account data.

## Authority boundary

- Read catalogue metadata: allowed.
- Draft copy, image/video briefs, product proposals, and experiment plans:
  allowed as non-mutating work.
- Meta Ads writes, campaign activation, spend/budget changes, Stripe product
  activation, refunds, payouts, or credential changes: approval-required.
- Plaid is visibility/reconciliation only; it is not a cash-out rail.

The canonical Hermes invocation endpoint and bearer token are intentionally
absent from this public repository. Use the authenticated Armalo relay through
the internal dashboard chat.
`;

export function GET() {
  return new Response(contract, {
    headers: { "content-type": "text/markdown; charset=utf-8" },
  });
}
