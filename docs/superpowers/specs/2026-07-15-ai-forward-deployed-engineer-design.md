# AI Forward Deployed Engineer Catalogue Design

## Decision

Add a public catalogue family called **AI Forward Deployed Engineer**. The
offer is hybrid: an AI engineering agent does bounded research, implementation,
testing, and operational work while an accountable human engineer owns
discovery, technical judgment, approvals, customer communication, and outcomes.

## Audience

The same product family must be legible to four buyer groups without forking
into separate products:

- AI startups that need customer-specific integrations and productionization;
- technology and software companies adopting agents inside existing systems;
- small businesses that need a practical workflow automated end to end;
- local and brick-and-mortar operators whose systems may be fragmented across
  email, spreadsheets, point-of-sale, scheduling, CRM, and messaging tools.

## Public catalogue contract

The catalogue card and detail page will describe the job, audience, delivery
shape, and outcome discipline. It will be marked `planned`, `unavailable`, and
`not-yet-proven` until there is evidence that supports a stronger claim. The
page will not expose customer data, credentials, internal prompts, private
infrastructure, pricing, or deployment instructions.

## Offer lifecycle

1. Diagnose the operation and select one high-value workflow.
2. Define a baseline, target outcome, authority boundary, and failure policy.
3. Map data, tools, users, permissions, and integration constraints.
4. Prototype in an isolated environment using real representative cases.
5. Build evals around outcomes, tool behavior, safety, and regressions.
6. Pilot with human review and explicit escalation paths.
7. Roll out gradually with observability, adoption support, and incident
   ownership.
8. Transfer documentation, runbooks, tests, and ownership to the customer or a
   continuing managed-service lane.

## Research basis

The positioning synthesizes current public practice from OpenAI's Forward
Deployed Engineering role and Deployment Company, Palantir's human and AI FDE
methods, Stripe's agent-augmented FDE model, Anthropic's agent-evaluation
guidance, OpenAI's agent deployment guidance, and NIST's AI risk-management
framework. Source claims will be linked and clearly separated from Armalo's
unproven offer claims.

## Acceptance criteria

- A new Markdown content record validates through the existing Astro schema.
- The record appears automatically in human and machine catalogue surfaces.
- A deep public document explains fit, lifecycle, deliverables, controls,
  measurement, anti-patterns, and source basis.
- A contract test prevents removal or accidental maturity inflation.
- The rendered homepage, detail page, and both machine projections contain the
  same slug, audience, and truthful planned proof state.
- External research links resolve to the intended first-party sources.
- Repo tests, check, build, doctor, and proof pass.
