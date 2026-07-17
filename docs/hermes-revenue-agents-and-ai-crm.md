# Hermes Revenue Agents, AI CRM, and Financial Intelligence

This document records the public-safe product direction for a family of
dedicated Hermes Agents sold by Armalo. It is deeper than the portfolio cards,
but it is still a public document: it contains no credentials, customer data,
private runtime topology, unpublished pricing, or claim that an unverified
workflow is live.

## The commercial thesis

Many high-ticket businesses do not have a lead-volume problem first. They have a
response-time, qualification, scheduling, follow-up, and context problem. Human
sales labor is expensive and inconsistent when the work is repetitive. A good
agent can make that layer cheaper per hour while preserving the parts that
actually create margin: better qualification, more attended calls, faster
follow-up, and a clean handoff to a closer.

The product is not “a chatbot that sells.” It is a set of operational agents
that can do bounded work, record what happened, and escalate when the next move
requires judgment, permission, or a regulated decision. Armalo’s advantage is
the combination of Hermes execution, CRM state, approval boundaries, and proof
of the resulting business action.

## Product family

### 1. Hermes Revenue Agents

This is the front-line family for high-ticket products and services:

- **Inbound setter:** responds to a qualified inquiry, gathers missing context,
  and routes the lead to the right next step.
- **Outbound setter:** works an approved list and message policy, personalizes
  within known facts, and stops on opt-out or uncertainty.
- **Qualification agent:** applies a buyer-defined rubric for fit, urgency,
  budget range, authority, and problem severity.
- **Calendar setter:** proposes available windows through an approved calendar
  integration, confirms timezone and attendance expectations, and records the
  booking outcome.
- **Dialer agent:** initiates or assists approved calls, follows a bounded
  script, captures disposition, and escalates when the conversation leaves its
  authority.
- **Follow-up agent:** manages the next touch based on explicit state rather
  than repeatedly sending generic nudges.
- **Closer support agent:** prepares a concise account brief, objection map,
  proposal draft, and next-action checklist for a human closer or an approved
  closing workflow.

These are separable offers, but they should share identity, consent, lead
context, and outcome state. A customer should be able to start with one setter
and add calendar, dialing, follow-up, or closing support without creating a
second disconnected CRM.

### 2. Hermes AI CRM

The CRM is the system of record around the agents. Its minimum useful object is
not just a contact row; it is an evidence-bearing lead state:

1. what the business knows about the lead;
2. where the information came from;
3. what the agent proposed;
4. what a human approved, if approval was required;
5. what the channel actually accepted or delivered;
6. how the lead responded;
7. what the next state and owner are.

This matters commercially. If an agent can send messages but cannot tell the
operator whether the message was approved, queued, delivered, replied to,
booked, or closed, the apparent automation is not a dependable revenue system.
The CRM should make those distinctions visible and exportable.

### 3. Hermes Financial Adviser

This is the financial-intelligence branch: research, monitoring, scenario
comparison, risk framing, and decision journaling. The name is intentionally
ambitious, but the public promise must remain precise. Unless the product has
the relevant permissions, disclosures, suitability controls, and licensed
oversight, it is decision support—not a human financial adviser and not a
guarantee of investment performance.

## What already exists in Armalo

The current Armalo codebase provides useful foundations for this direction:

- CRM-oriented lead records, assignment, status, and activity concepts;
- approval-gated outreach flows that distinguish a proposed action from an
  approved action and from a successfully delivered action;
- outbound-policy and public-copy validation around sensitive communication;
- appointment, reservation, and reminder-oriented workflow patterns;
- company-operating-system concepts for CRM, sales outcomes, and agent work;
- Armalo FI foundations for financial data, market reasoning, risk controls, and
  explicit fail-closed execution.

These are foundations, not proof that the complete catalogue products are
already sellable. The productization work still needs named customer contracts,
real integrations, representative evaluations, runtime verification, and
business evidence.

## Trust and operating boundaries

The revenue agents should never invent pricing, availability, product claims,
customer history, financial results, or appointment confirmations. They should
have explicit stop conditions for ambiguity, opt-out, missing authorization,
regulated advice, and requests outside the configured offer.

Sensitive actions should follow a visible state machine:

`drafted -> approved -> queued -> accepted by channel -> delivered -> replied -> booked -> outcome recorded`

The CRM must not skip states merely because an upstream job was queued. A
successful API request is not the same as a delivered message, and a booked
calendar event is not the same as an attended or qualified sales call.

For financial workflows, add a separate boundary:

`research -> assumptions captured -> scenario reviewed -> human decision -> permitted execution -> reconciliation`

No public copy should imply autonomous regulated advice or guaranteed returns.

## Unit economics and margin design

The margin thesis is strong when the agent handles repeatable work at a lower
variable cost than a human hour while the offer is priced against business
outcomes and operational reliability. It is weak when the system merely shifts
cost into expensive model calls, telephony, integrations, support, and failure
recovery.

Track economics by workflow, not only by account:

- cost per attempted contact;
- cost per qualified conversation;
- cost per booked meeting;
- attendance rate and reschedule rate;
- human review minutes per successful opportunity;
- channel, model, telephony, and integration cost;
- customer-specific onboarding and support cost;
- conversion from booked meeting to accepted opportunity;
- gross margin after retries, refunds, and exception handling.

The offer can be packaged as a pilot, team deployment, agency deployment,
enterprise deployment, or commission-linked arrangement. Public catalogue copy
should not publish prices until the cost model and service boundary are real.

## Proof ladder

Each product should graduate through the existing catalogue proof levels:

1. **Not yet proven:** product thesis and design only.
2. **Source tested:** contracts, state transitions, and safety rules pass local
   tests with deterministic fixtures.
3. **Runtime verified:** the intended integration and agent route work in a
   controlled environment with real transport evidence.
4. **Publicly verified:** a public destination demonstrates the promised
   visitor-facing behavior.
5. **Business verified:** real customer usage supports the commercial claim.

The catalogue entries currently remain at the first level by design. That is
more credible than presenting a broad product family as live because adjacent
Armalo components already exist.

## Recommended launch sequence

Start with one narrow, high-ticket motion rather than launching every role at
once:

1. qualification plus calendar setting for one buyer type;
2. CRM state and approval receipts;
3. follow-up with explicit stop conditions;
4. dialer support after consent, telephony, and recording boundaries are proven;
5. closer support after the handoff brief is reliable;
6. financial intelligence as a separate, compliance-aware product line.

The first success metric is not “the agent sent many messages.” It is a
traceable chain from approved lead to qualified conversation to attended meeting
to a useful human or customer outcome.

## Catalogue language rules

Use “dedicated Hermes Agent” to describe the intended operating model. Use
“planned,” “pilot,” or “decision support” when proof is incomplete. Avoid
“fully autonomous closer,” “guaranteed appointments,” “licensed adviser,”
“instant revenue,” and similar claims unless a specific product, jurisdiction,
and proof packet support them.

The public portfolio is the catalogue and proof surface. Authenticated Armalo
surfaces own customer configuration, credentials, approval policy, campaign
state, financial state, and Hermes operations.
