# Public Product Catalogue Boundary

> This repository is a public product surface. Private strategy, customer data,
> runtime instructions, credentials, and operator policy belong in their
> authenticated owner systems.

## Purpose

The portfolio helps a visitor understand which Armalo products exist, how they
can be accessed, and what level of proof supports each public claim. It is a
static catalogue, not a control plane or private system of record.

## Public product contract

Each product entry contains only public-safe catalogue metadata:

- a name, category, description, year, and concise highlights;
- maturity status: `live`, `beta`, `wip`, or `planned`;
- access: `public`, `sign-in`, `private-beta`, `waitlist`, or `unavailable`;
- proof: `not-yet-proven`, `source-tested`, `runtime-verified`, `public-live`,
  or `business-verified`;
- the date that proof was last verified;
- an HTTPS product destination and honest call to action when available.

Maturity, access, and proof are separate. A beta can expose a useful public
surface while keeping personalized features gated. A public destination does
not imply that every feature is generally available.

## Public machine surfaces

`/agents/portfolio.json` and `/agents/portfolio.md` project the same public
catalogue truth for machine readers. They must not contain:

- internal operator identities or invocation instructions;
- provider-specific mutation or approval policy;
- campaign strategy, spend, pricing experiments, or performance data;
- credentials, customer data, financial state, or private runtime topology.

The portfolio does not own private product invocation clients. Product runtime
contracts remain with the product and authenticated Armalo control plane.

## Adding a product

Add a Markdown entry under `src/content/apps/` only after its public destination,
access level, proof level, verification date, and visitor-facing copy are known.
Claims must remain calm, specific, and defensible. Reference or research data
must not be presented as real-time availability.

Removing private-owner material from the current public tree does not remove it
from existing Git history. History rewriting is intentionally outside this
repository's normal promotion workflow.
