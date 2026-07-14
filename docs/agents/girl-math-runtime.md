# Girl-Math Hermes runtime contract

This is the public-safe runtime boundary for the first Armalo catalogue
product. Girl-Math is one product under Armalo AI LLC; it is not the identity of
the portfolio catalogue.

## Invocation owner

The portfolio owns the product metadata and human-readable contract. The
Armalo application runtime owns authentication, tenant permissions, Hermes
execution, streaming, rate limits, traces, and billing-related policy.

The local direct path is:

```sh
npm run invoke:girl-math -- "Draft a product or marketing work item"
```

It requires private environment variables:

- `ARMALO_HERMES_URL` — approved Armalo runtime invocation endpoint.
- `ARMALO_HERMES_TOKEN` — short-lived or secret-manager-provided bearer token.

Never commit either value. Do not call the endpoint from browser code.

## Warm-runtime requirement

The desired UX is low time-to-first-token. The production owner should prove,
outside this public repo, that the canonical Hermes sidecar has readiness,
capacity, request tracing, and an agreed warm-capacity policy. A static
portfolio build cannot turn ECS capacity on or keep it warm, and this repo does
not claim that it has done so.

## Product flexibility

The agent key is product-scoped (`girl-math`) so another Armalo product can use
the same runtime contract without becoming Girl-Math-branded. Future products
should receive their own stable key and public-safe contract.
