# Portfolio Hermes runtime contract

The public portfolio is a catalogue and proof surface. The authenticated
Armalo app is the control plane. Hermes is the internal hosted operator that
Therese can reach through the Armalo dashboard chat; it is not embedded into
the public site and does not receive public-site credentials.

## Public catalogue surfaces

- `/agents/portfolio.md` — human-readable operator contract.
- `/agents/portfolio.json` — metadata-only product manifest.

The manifest is safe for Hermes to read because it excludes private campaign
strategy, customer data, provider state, secrets, ad spend, and financial
accounts. Product-specific operations belong in `app.armalo.ai`.

## Hermes operating modes

Hermes may recall catalogue products and prepare copy, creative, Meta Ads, and
Stripe proposals. Existing Armalo typed skills own provider behavior:

- Meta Ads: tenant-scoped intelligence, preview proof, approval, mutation,
  readback, rollback, and learning receipts.
- Commerce: Stripe-first product and checkout proposals; activation and payout
  remain separate approved mutations.
- Plaid: account/transaction visibility and reconciliation only. Plaid does not
  itself authorize cash-out.

Every consequential action must return an explicit approval requirement before
it can mutate an external provider. No live provider action is implied by a
public catalogue read.

## ECS placement

Callers must use the authenticated hosted Hermes relay, not a hard-coded task,
IP, or local sidecar. The relay may be backed by the existing Armalo admin-swarm
ECS service and can move without changing this contract. Runtime placement and
credentials are configured privately in the Armalo deployment environment.
