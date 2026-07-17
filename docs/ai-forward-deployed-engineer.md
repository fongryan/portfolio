# AI Forward Deployed Engineer

## Purpose of this document

This document defines a public, provider-neutral operating model for Armalo's
planned AI Forward Deployed Engineer offer. It explains what the product is,
who it serves, how an engagement works, what good delivery requires, how risk
is controlled, and how success is measured.

It is also a truth boundary. This is a researched product definition, not proof
that Armalo has already delivered the service. The public catalogue must keep
the offer marked planned and not yet proven until a real engagement supports a
stronger claim.

## What an AI FDE is

A Forward Deployed Engineer works close to a customer's real operating
environment. The role crosses discovery, product thinking, software
engineering, integration, deployment, adoption, and feedback to the core
product. The engineer is accountable for getting from an important problem to
a system people use in production.

An **AI Forward Deployed Engineer** can mean two related things in the current
market:

1. a human forward deployed engineer specializing in AI systems; or
2. an AI agent that performs parts of forward deployed engineering through
   natural-language instructions and permissioned tools.

Armalo's offer deliberately combines both. A human FDE remains accountable for
the customer relationship, problem selection, architecture, risk, review, and
outcome. AI agents accelerate bounded parts of investigation, implementation,
testing, documentation, and operations.

This hybrid definition avoids two weak extremes:

- **consulting without ownership**, where a team delivers slides or prototypes
  and leaves the customer to cross the production gap; and
- **autonomy without accountability**, where an agent can change systems but no
  qualified person owns scope, safety, or whether the result helps the business.

## What current practice teaches

Several current operating models converge on the same core principles.

OpenAI describes human FDEs as owning discovery, technical scoping, system
design, build, production rollout, adoption, measurable workflow impact, and
eval-driven feedback. Its Deployment Company starts with a focused diagnostic,
selects a small number of priority workflows, and connects models to customer
data, tools, controls, and business processes.

Palantir describes Forward Deployed Engineering as a tight feedback loop
between demanding customer environments and core product engineering. Its AI
FDE product adds permission-aware tools, controlled context, visible actions,
closed-loop work, modes and skills, and sandboxed changes before merge.

Stripe's current FDE model moves professional services behind the keyboard:
engineers build production applications directly with users, bridge technical
and executive stakeholders, and turn customer work into reusable tooling and
product feedback.

Anthropic's production guidance emphasizes evaluation of agent outcomes, tool
use, traces, and repeated trials rather than judging only the final answer.
OpenAI's agent guidance emphasizes selecting workflows that genuinely need
reasoning, establishing eval baselines, using layered guardrails, and handing
control to humans on failures or high-risk actions.

NIST's AI Risk Management Framework adds a lifecycle discipline: govern, map,
measure, and manage risk rather than treating safety as a launch checklist.

Together, these patterns suggest that the differentiator is not merely faster
coding. A credible AI FDE offer must combine proximity to the workflow,
production ownership, constrained agent authority, evaluation, adoption,
measured outcomes, and a learning path back into reusable product.

## Who it is for

### AI startups

AI startups often have a strong core capability but face a gap between a
generic product and a strategic customer's operating reality. An FDE can:

- integrate the product with customer data, identity, tools, and controls;
- discover exceptions that do not appear in a sales demo;
- keep one-off requests from becoming permanent product forks;
- turn field patterns into reusable connectors, evals, and product primitives;
- create production proof that improves enterprise sales; and
- shorten the feedback loop between customers and model/product teams.

The engagement is a poor fit if it is merely unlimited custom development for
one customer with no product learning or reuse path.

### Technology and software companies

Established software teams may have engineers and model access but lack a
single owner for cross-functional deployment. An FDE can:

- select a high-value internal or customer-facing workflow;
- coordinate product, engineering, security, legal, operations, and users;
- build the minimum application and integration layer;
- establish evals and observability;
- lead a controlled pilot; and
- transfer a proven operating pattern to the permanent team.

The engagement is a poor fit when the company already has clear ownership,
stable requirements, and a conventional software backlog that does not need
embedded discovery.

### Small businesses

Small businesses do not need an enterprise transformation program. They need a
carefully chosen operational improvement that works with limited time, data,
and technical capacity. Strong candidates include:

- lead intake, enrichment, qualification, and follow-up;
- customer-service triage and reply drafting;
- appointment scheduling, reminders, and missed-appointment recovery;
- quote or proposal preparation;
- invoice, receipt, and document processing;
- daily operating summaries and exception alerts;
- internal procedure lookup; and
- review, referral, or reactivation workflows.

The engagement should favor configured services and simple integrations where
they are sufficient. Bespoke agent architecture is not a virtue if a reliable
deterministic automation solves the problem more cheaply.

### Brick-and-mortar businesses

Local operators often have fragmented systems and little spare management
attention. The first workflow should be easy to observe and supervise. Examples
include:

- recovering missed calls and web inquiries;
- preparing appointment or estimate intake for staff review;
- sending approved reminders and follow-ups;
- summarizing shift, booking, sales, or inventory exceptions;
- routing customer questions to the right person; and
- turning recurring staff knowledge into an approved answer source.

The system must respect the pace and ergonomics of frontline work. A workflow
that requires staff to maintain a second source of truth or constantly correct
the agent is not a successful deployment.

## When to use an AI FDE

A candidate workflow is promising when most of these are true:

- it has a named business owner;
- it occurs often enough to learn from and measure;
- delay, inconsistency, or manual coordination has a meaningful cost;
- inputs or decisions contain ambiguity that simple rules handle poorly;
- the required data and tools can be accessed lawfully and safely;
- a human can define acceptable outcomes and review edge cases;
- the workflow can be piloted without betting the business;
- success can be measured against a baseline; and
- the resulting pattern could be reused or maintained.

An AI FDE should recommend conventional software, rules, process changes, or no
build when those are the better answer.

## When not to use an AI FDE

Do not start with:

- a vague mandate to "add AI everywhere";
- an irreversible or high-stakes action with no approval boundary;
- a workflow nobody owns;
- inaccessible, unlawfully sourced, or unusably poor data;
- a one-off task with no learning or reuse value;
- a problem that can be solved reliably with a form, rule, report, or existing
  SaaS feature;
- a request to remove humans before the system has earned trust; or
- a deployment whose economics cannot plausibly beat the current process.

## Engagement lifecycle

### Phase 0: qualification

The customer and FDE establish:

- executive or owner sponsor;
- workflow owner and frontline participants;
- business problem and why it matters now;
- systems and data likely to be involved;
- risk class and prohibited actions;
- procurement, security, or compliance constraints;
- target pilot window; and
- what decision the pilot must enable.

Output: a short qualification record and a go, reshape, or no-go decision.

### Phase 1: workflow diagnostic

The FDE observes the real process rather than relying only on a process map.
The team samples normal cases, exceptions, handoffs, workarounds, delays,
rework, and failure recovery.

Output:

- current-state workflow map;
- user and system inventory;
- baseline volume, time, cost, quality, or conversion measures;
- exception taxonomy;
- risk and authority map; and
- ranked opportunity list.

### Phase 2: select one wedge

Choose one workflow using value, feasibility, risk, learning, and adoption—not
novelty. Define a narrow end-to-end outcome such as "qualified inquiries reach
an owner with a complete brief within five minutes" rather than "build a sales
agent."

Output:

- problem statement;
- target outcome and baseline;
- in-scope and out-of-scope cases;
- acceptance criteria;
- human approval and escalation points;
- budget and latency envelope; and
- pilot cohort.

### Phase 3: data, tool, and authority design

Map every source and action:

- what the system may read;
- what it may write;
- what it may only draft;
- what requires human approval;
- what it must never do;
- which identity it acts under;
- how permissions are scoped;
- what is logged;
- how secrets are stored and rotated; and
- how access is revoked.

Output: architecture, threat model, data map, permission matrix, and rollback
plan.

### Phase 4: representative prototype

Prototype against representative, permissioned cases. Test the hardest
assumption first: model capability, retrieval quality, system integration,
workflow ergonomics, or economics.

The prototype is not production evidence. It exists to reject weak directions
early and shape the evaluation set.

Output: prototype, risk findings, initial eval set, and build decision.

### Phase 5: production build

Use normal software engineering discipline:

- explicit interfaces and schemas;
- least-privilege authentication and authorization;
- deterministic code around probabilistic model calls;
- idempotency for retried actions;
- timeouts, budgets, and bounded retries;
- durable state where work spans time;
- structured events and traces;
- user-visible status and escalation;
- test environments and sandboxed changes; and
- versioned prompts, tools, models, policies, and evals.

Output: deployable system, infrastructure/configuration, tests, eval harness,
and operational documentation.

### Phase 6: controlled pilot

Start with shadow, draft-only, read-only, or approval-required operation as the
risk warrants. Make failures visible. Sample both successes and failures.
Keep a direct path for users to correct or escalate.

Output: pilot results, incident and exception log, adoption feedback, measured
outcomes, and a go, iterate, narrow, or stop decision.

### Phase 7: rollout and adoption

Expand by cohort, capability, or authority only when evidence supports it.
Train users on what the system does, what it does not do, and how to recover.
Track actual usage rather than equating deployment with adoption.

Output: rollout record, training, support path, service objectives, and updated
runbooks.

### Phase 8: transfer or managed operation

Every engagement ends with an explicit ownership state:

- customer-owned and transferred;
- jointly operated for a defined period;
- productized into a maintained Armalo offer; or
- retired with data and access handled according to agreement.

Output: code/configuration disposition, owner map, runbooks, access revocation,
backlog, and learning report.

## Core deliverables

A serious engagement should leave durable artifacts, not only a working demo:

1. workflow diagnostic and baseline;
2. scoped outcome and acceptance criteria;
3. data, integration, and permission map;
4. architecture and decision record;
5. working production system or bounded pilot;
6. evaluation suite and results;
7. observability, cost, and usage instrumentation;
8. security, approval, and incident controls;
9. deployment, rollback, and support runbooks;
10. user training and adoption guidance;
11. handoff and ownership packet; and
12. reusable pattern and product-feedback report.

## Reference architecture

A provider-neutral AI FDE deployment usually has these layers:

### Experience layer

The place where work is requested and reviewed: an existing application,
inbox, ticket queue, dashboard, messaging channel, browser surface, or a small
purpose-built interface.

### Workflow controller

The deterministic owner of state, steps, retries, timeouts, approvals, and
completion. The model may choose among allowed tools, but the controller
enforces policy and records durable progress.

### Model and instruction layer

Versioned model selection, system instructions, task context, structured
outputs, and routing. Start with the strongest suitable model to establish a
baseline, then optimize cost and latency against evals.

### Tool layer

Narrow, typed, permissioned interfaces to customer systems. Tools should expose
business-safe actions rather than raw unrestricted credentials or broad shell
access whenever possible.

### Data and context layer

Approved operational data, retrieval sources, schemas, freshness information,
and provenance. The system should know which sources are authoritative and how
stale or conflicting data is handled.

### Evaluation layer

Representative tasks, repeated trials, graders, outcome checks, policy tests,
and regression gates. Evaluation versions should travel with model, prompt,
tool, and policy versions.

### Observability and audit layer

Structured events, tool calls, approvals, outcomes, errors, latency, cost,
model/version identity, and incident breadcrumbs. Sensitive reasoning content
should not be logged indiscriminately.

### Identity and policy layer

Authentication, tenant isolation, authorization, secret management, retention,
human approvals, rate limits, and revocation.

## Evaluation and proof

The unit of success is the workflow outcome, not whether an answer sounds
plausible.

### Build the eval set from reality

Include:

- common successful cases;
- high-value cases;
- known historical failures;
- ambiguous inputs;
- missing or conflicting data;
- permission failures;
- tool errors and timeouts;
- unsafe or prohibited requests;
- escalation cases; and
- adversarial inputs relevant to the surface.

### Grade multiple dimensions

Measure:

- final environment state or business outcome;
- factual and policy correctness;
- tool selection and arguments;
- respect for permissions and authority;
- escalation behavior;
- trace efficiency and unnecessary actions;
- latency and cost;
- consistency across repeated trials; and
- regression against the current production baseline.

### Keep proof layers separate

- **Source proof:** code, tests, and configuration exist.
- **Runtime proof:** the deployed system works in its real environment.
- **Adoption proof:** intended users actually use it successfully.
- **Business proof:** the agreed workflow metric improves.

No lower layer should be described as a higher one.

## Security and authority

The hybrid AI FDE must be designed around bounded authority.

### Least privilege

Grant only the data and actions required for the selected workflow. Prefer
short-lived, scoped credentials and customer-controlled identities. Separate
read, draft, approve, and execute permissions.

### Human approval

Irreversible, regulated, safety-critical, and high-value actions always require
explicit approval from an accountable human. Evidence may expand autonomy only
for bounded, reversible actions inside a documented policy. Approval must be
meaningful: the reviewer should see the proposed action, relevant context,
expected effect, and recovery path.

### Sandboxed change

Code, configuration, data transformations, and workflow edits should be tested
in branches, previews, sandboxes, or isolated environments before promotion.
The agent must not merge or deploy merely because it generated a change.

### Transparent tool use

Users and operators need visibility into what the agent read, which tools it
called, what changed, what requires approval, and what failed. Visibility
should be useful and privacy-aware, not a dump of hidden reasoning.

### Layered controls

Combine model-level guidance with deterministic validation, authentication,
authorization, input/output constraints, policy checks, rate and cost limits,
monitoring, human review, and ordinary application security.

### Fail closed

When identity, permission, policy, required data, or outcome verification is
missing, the system should stop, draft, or escalate rather than silently widen
authority.

### Lifecycle governance

Use a continuous govern-map-measure-manage loop. Revisit risk when the model,
tools, data, user population, authority, or business impact changes.

## Human and AI responsibility split

### The human FDE owns

- customer trust and communication;
- workflow selection and scope;
- architecture and trade-offs;
- risk classification and authority design;
- review of consequential changes;
- stakeholder alignment and adoption;
- incident accountability;
- outcome interpretation; and
- transfer or continued-operation decisions.

### AI agents can accelerate

- codebase and system reconnaissance;
- documentation and data-map drafting;
- integration mapping;
- implementation and refactoring;
- test and eval generation;
- shadow testing and diagnostics;
- trace and failure analysis;
- runbook and training-material drafting;
- repetitive migration work; and
- structured reporting.

### AI agents must not independently own

- commercial commitments;
- undisclosed scope expansion;
- access to unapproved customer data;
- irreversible production changes;
- legal, safety, or compliance acceptance;
- claims that a deployment succeeded; or
- the final judgment that a business outcome was achieved.

## Measuring value

Choose a small set of measures before building.

### Operational measures

- cycle time;
- backlog age;
- throughput;
- response time;
- first-pass completion;
- error or rework rate;
- escalation rate;
- staff interruption load; and
- system availability.

### Commercial measures

- qualified-lead rate;
- speed to lead;
- appointment or demo conversion;
- quote turnaround;
- recovery of missed inquiries;
- renewal or reactivation;
- revenue influenced; and
- cost to serve.

### Adoption measures

- eligible users active;
- eligible workflow volume processed;
- override and correction rate;
- user trust or satisfaction;
- repeated voluntary use; and
- time until the permanent owner can operate the system.

### Engineering measures

- eval pass rate and variance;
- incident frequency and severity;
- rollback frequency;
- latency and model/tool cost;
- integration reliability;
- permission or policy violations; and
- time to diagnose and recover.

Measure displacement as well as improvement. Faster drafting is not valuable if
review, correction, or downstream coordination consumes the saved time.

## Commercial shapes

The public catalogue supports several offer shapes without publishing private
pricing or pretending they are already available.

### Diagnostic

A short engagement that maps workflows, establishes a baseline, ranks use
cases, defines risk boundaries, and recommends build, buy, automate, or stop.

### Focused pilot

One workflow, one owner, representative cases, a bounded integration, an eval
suite, a controlled cohort, and a decision packet. This is the recommended
starting point for most buyers.

### Embedded team engagement

A human FDE and agent-augmented delivery lane work alongside a product or
engineering team across multiple related deployments while feeding reusable
patterns into the customer's platform.

### Small-business implementation

A tightly scoped, done-for-you workflow using existing tools where possible,
with simple training, visible approvals, and a clear support or handoff path.

### Agency or partner delivery

Armalo supplies the AI FDE method and implementation capability while a trusted
agency or operator owns the client relationship. Product truth, customer
authority, attribution, and support ownership must remain explicit.

### Ongoing managed operation

Continued monitoring, evaluation, adaptation, and incident ownership after a
successful pilot. This must have clear service boundaries and must not become
unlimited unpriced custom development.

## Delivering across company sizes

The method stays consistent while the implementation scales.

| Dimension     | Startup                        | Software company                       | Small or local business                 |
| ------------- | ------------------------------ | -------------------------------------- | --------------------------------------- |
| First wedge   | Strategic customer workflow    | Cross-functional internal workflow     | One recurring operational bottleneck    |
| Integration   | Product API, customer stack    | Identity, data platform, internal apps | Existing SaaS, inbox, phone, sheet, POS |
| Primary owner | Founder or product lead        | Product/engineering/operations lead    | Owner or general manager                |
| Proof         | Adoption plus product learning | Runtime, adoption, and business metric | Time, response, conversion, or capacity |
| Delivery bias | Reusable product primitive     | Governed platform pattern              | Simple configured system                |
| Handoff       | Core product team              | Permanent internal owner               | Owner, manager, or managed service      |

## Anti-patterns

### The chatbot demo

A conversational front end with no workflow ownership, tools, evals, or
adoption path. It demonstrates model fluency, not business change.

### The transformation mandate

A broad program with no selected workflow, baseline, owner, or stop condition.
It accumulates strategy activity without producing a production wedge.

### The custom-development trap

Every customer request becomes bespoke code with no shared interface, reusable
pattern, or maintenance owner. FDE learning must flow back into product.

### The autonomous-production shortcut

An agent receives broad credentials and direct deployment authority before its
tools, evals, approval boundary, and rollback path are proven.

### The model-only diagnosis

Every failure is blamed on the model. Real deployments also fail at identity,
data freshness, retrieval, tools, networks, application code, permissions,
adoption, and ownership seams.

### The vanity metric

Messages sent, summaries generated, or tokens consumed are reported as value
without showing a better workflow outcome.

### The permanent pilot

A system remains in supervised limbo without an explicit promote, narrow,
transfer, operate, or retire decision.

### The replacement promise

The service is sold as headcount removal before the workflow is understood or
the system has earned trust. Capacity, quality, speed, and growth are safer
starting outcomes.

## Public proof ladder

Armalo should advance this catalogue entry only when evidence supports it:

1. **Planned / not yet proven** — researched operating model and scope exist.
2. **Work in progress / source tested** — implementation and tests exist for a
   specific pilot, without a production claim.
3. **Beta / runtime verified** — the real system works in its intended runtime
   for a bounded cohort.
4. **Beta or live / public live** — a customer-safe product surface is
   reachable and accurately described.
5. **Live / business verified** — measured customer or business outcomes
   support the public claim.

Customer confidentiality can limit what is public, but it cannot justify
inflating the proof state.

## Research sources

Primary and first-party sources used to shape this operating model:

- [OpenAI Forward Deployed Engineer role](https://openai.com/careers/forward-deployed-engineer-%28fde%29-nyc-new-york-city/): end-to-end deployment ownership, adoption, workflow impact, and feedback to product and research.
- [OpenAI Deployment Company announcement](https://openai.com/index/openai-launches-the-deployment-company/): focused diagnostics, priority workflows, embedded delivery, integration with data/tools/controls, change management, and measurable results.
- [OpenAI practical guide to building agents](https://openai.com/business/guides-and-resources/a-practical-guide-to-building-ai-agents/): workflow selection, model/tool/instruction foundations, eval baselines, layered guardrails, and human intervention.
- [Palantir architecture overview](https://www.palantir.com/docs/foundry/architecture-center/overview): Forward Deployed Engineering as a field-to-core-product feedback method.
- [Palantir AI FDE announcement](https://www.palantir.com/docs/foundry/announcements/2026-03): controlled context, closed-loop operation, permission inheritance, visible tool use, modes/skills, and sandbox testing.
- [Stripe Forward Deployed Engineer, Professional Services role](https://stripe.com/jobs/listing/forward-deployed-engineer-professional-services/8055050): direct customer co-development, secure production applications, cross-functional delivery, and reusable tooling that scales across accounts.
- [Anthropic, Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents): tasks, trials, graders, traces, outcomes, harnesses, and lifecycle regression testing.
- [NIST AI Resource Center](https://airc.nist.gov/): the AI Risk Management Framework and voluntary lifecycle guidance for trustworthy AI.
- [NIST Generative AI Profile](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf): cross-sector generative-AI risks and govern/map/measure/manage actions.
- [U.S. Small Business Administration, AI for small business](https://www.sba.gov/business-guide/manage-your-business/ai-small-business): starting small, testing for value, weighing benefits and risks, and applying AI to practical operating needs.

## Catalogue maintenance rule

Review this document and the catalogue entry when the public offer, evidence,
delivery model, or referenced sources materially change. Preserve the public
boundary: patterns and interfaces may be public; customer data, credentials,
private pricing, internal operational topology, and unverifiable outcome claims
may not.
