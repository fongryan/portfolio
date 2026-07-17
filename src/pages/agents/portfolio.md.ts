<<<<<<< HEAD
import { getApps } from "../../lib/apps";
import { renderCatalogueProductMarkdown } from "../../lib/portfolio-markdown";

export async function GET() {
  const apps = await getApps();
  const products = apps
    .map(({ id, data }) => renderCatalogueProductMarkdown(id, data))
    .join("\n\n");

const body = `# Armalo public product catalogue

Machine-readable JSON: /agents/portfolio.json

This surface contains public catalogue metadata only. Access describes how a
visitor can use a product; proof names the strongest verified public claim;
the flywheel stage names where the product sits in the studio's build,
launch, acquire, monetize, compound loop.

${products}

## Hermes authority boundary

This public surface contains metadata only. Hosted Armalo Hermes may use it to
recall products, compare public positioning, and draft campaign or commerce
proposals. Tenant-scoped work routes through the authenticated Armalo control
plane at https://app.armalo.ai.

Draft copy, creative briefs, product proposals, and experiment plans are
non-mutating. Meta Ads writes, campaign activation, spend or budget changes,
Stripe activation, refunds, payouts, and credential changes require explicit
human approval. The portfolio never contains credentials, customer data,
campaign spend, provider state, Stripe secrets, or financial account data.
`;

  return new Response(body, {
=======
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
>>>>>>> codex/portfolio-hermes-catalogue
    headers: { "content-type": "text/markdown; charset=utf-8" },
  });
}
