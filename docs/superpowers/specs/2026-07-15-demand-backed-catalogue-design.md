# Demand-backed AI catalogue design

## Outcome and scope

Turn the homepage from flat inventory into a strategic product shelf:

1. a ranked ten-product **business AI** shortlist grounded in current commercial
   offer, traction, and adoption evidence;
2. a separate consumer product lab so the catalogue still serves people as well
   as companies;
3. a complete catalogue in which every category remains visible; and
4. a public research route that separates market demand from operator offer
   mechanics.

The research establishes demand in the market. It does not establish Armalo
customers, revenue, retention, or product-market fit. Every new product remains
`planned`, `unavailable`, and `not-yet-proven` until product-specific evidence
supports promotion.

## Reproducible research method

- As-of date: 2026-07-15.
- Evidence window: 2025-01-01 through 2026-07-15.
- Scope: English-language US and global commercial business-AI market.
- Each ranked product requires at least one primary commercial signal, such as
  public pricing, paid-seat growth, usage billing, ARR, or a named paid rollout,
  plus one primary or authoritative adoption/outcome signal.
- Candidate universe: commercially available workflow AI in customer service,
  back-office operations, voice, sales, enterprise knowledge, finance,
  marketing production, software engineering, legal work, and clinical
  administration with a public commercial signal in the evidence window and a
  bounded studio implementation path. Exclude foundation models, general chat,
  hardware, pure infrastructure, unbounded transformation consulting,
  autonomous medical diagnosis, autonomous money movement, and security or AI
  governance products that are better treated as cross-cutting controls.
- Score each candidate from 1–5 on buyer urgency, repeatability, time-to-value,
  implementation feasibility, compliance safety, and proofability.
- Weight all six dimensions equally and compute `total` as their integer sum,
  with a maximum of 30. Sort by `total` descending, then apply the tie-breakers
  below. The shared module retains every dimension and the computed total.
- Break ties by higher buyer urgency, shorter time-to-value, lower regulatory
  risk, and stronger Armalo delivery fit.
- Market sources support the ranking. Creator/operator sources support only the
  attributed offer mechanics. Every source carries an accessed date.

The exact scores remain in the shared data module so the ranking can be
reproduced and revised without rewriting the page.

## Single source of truth

Create `src/lib/demand-catalogue.ts` with typed records containing:

- rank, slug, buyer, job, packaging, score, risk;
- at least two market evidence links with label, URL, evidence kind, and
  accessed date;
- operator pattern, attributed operator, ethical adaptation, and primary links;
- consumer-lab slugs and scope label.

The homepage and research route must both consume this module. The homepage
must not maintain a second slug list.

## Ranked business demand shortlist

1. `email-customer-service` — customer-service resolution
2. `document-operations-agent` — document and back-office workflows
3. `voice-customer-service` — reception, scheduling, and calls
4. `ai-qualifier` — lead qualification and follow-up
5. `internal-knowledge-assistant` — enterprise search and role copilots
6. `finance-operations-assistant` — AP, AR, reconciliation, and close
7. `marketing-campaign-studio` — governed creative production
8. `software-engineering-copilot` — governed coding-agent workflows
9. `legal-advice-assistant` — legal research and review support
10. `clinical-documentation-assistant` — ambient and administrative drafting

Five records already exist; create these five market records:

- `src/content/apps/document-operations-agent.md`
- `src/content/apps/finance-operations-assistant.md`
- `src/content/apps/marketing-campaign-studio.md`
- `src/content/apps/software-engineering-copilot.md`
- `src/content/apps/clinical-documentation-assistant.md`

The consumer lab uses the existing `ai-stylist`, `personal-tutor`,
`personal-finance-assistant`, and `girl-math` families. It is explicitly
unranked because this research pass found weaker comparable commercial evidence
than for the business list.

## Operator-pattern products and canonical-family rules

Create three distinct planned products and consolidate one discovered concurrent family:

- `business-constraint-finder.md` — evidence-linked business diagnosis, not
  general knowledge search;
- upgrade the existing `ai-digital-product-studio.md` — licensed expertise to
  validated product and launch assets, distinct from ongoing campaign production;
- `revenue-intelligence-platform.md` — event, attribution, and outcome
  measurement, distinct from the relationship/pipeline record in Hermes AI CRM;
- `lead-recovery-operator.md` — consented follow-up for already-known stalled
  leads, distinct from net-new sourcing, qualification, and setting.

Do not create a duplicate agency product. Update the existing
`agency-ai-workbench.md` record in place to `AI Agency Operating System`, keeping
its canonical slug and making software, installation, managed operation,
tenant isolation, and client approvals explicit.

This produces eight new records plus two canonical-family upgrades.

## Required product boundaries

- Email support: refund, account, and sending actions remain approval-gated.
- Voice: consent, recording disclosure, emergency handoff, and no autonomous
  cold calling.
- Qualification and recovery: authorized contacts, opt-out enforcement,
  non-discriminatory rubrics, and no fabricated evidence.
- Knowledge: permission-aware retrieval, citations, and retention controls.
- Finance: prepare/reconcile only; no payment or money movement without explicit
  authorization and segregation of duties.
- Marketing: claim substantiation, copyright/likeness review, and human approval
  before publication or spend changes.
- Software: tests and human review before merge or deploy.
- Legal: qualified professional review, source provenance, and no legal advice
  claim.
- Clinical: clinician review, patient/privacy controls, and no diagnosis,
  treatment, or autonomous chart finalization.
- Revenue intelligence: first-party/consented data, attribution clearly
  separated from causal incrementality, and no autonomous budget changes.
- Digital products and expert knowledge: licensed source material, no identity
  impersonation, and demand treated as a hypothesis until tested.

## Homepage architecture

- Keep the restrained, zero-script visual system.
- Lead with expensive jobs and measurable outcomes, not generic AI capability.
- Add a ranked business-demand section before the full shelf and an unranked
  consumer-lab line, both sourced from the shared typed module.
- Generate category navigation through a tested grouping helper. Normalize case
  and whitespace, use preferred public labels, append unknown categories
  deterministically, and create collision-safe section IDs. Every product must
  render exactly once.

## Research route

Create `/research/demand-backed-ai-catalogue/` with:

- the methodology and explicit B2B ranking scope;
- per-rank buyer, job, packaging, score, risk, and claim-to-source mapping;
- a separate consumer-lab section;
- attributed offer mechanics from Alex Hormozi/Acquisition.com, Jordan Lee/AI
  Acquisition, Serge Gatari/Cook.ai, Iman Gadzhi/Educate/Monetise/Flozy, and
  Alex Becker/HYROS;
- accessed dates and direct primary links for every attributed mechanic;
- no-affiliation language, ethical adaptation rules, and the distinction among
  observed attribution, modeled attribution, and experimentally verified
  incrementality.

## Validation contract

- Source tests fail before the data module, grouping helper, product records,
  research route, and homepage sections exist.
- The business-demand list contains exactly ten unique existing slugs, ranks
  1–10, scores six bounded dimensions, and carries the required source mix.
- All eight new records and both upgraded canonical records satisfy the shared schema,
  canonical-family rules, honest maturity, and product-specific safety text.
- Homepage and research route consume the same exported objects.
- Category helper tests prove case-insensitive merging, preferred labels,
  deterministic unknown appending, collision-safe IDs, and exactly-once product
  assignment.
- Generated output contains every ranked product once, every product in one
  category, all eight new detail routes, and both upgrades in JSON and
  Markdown with planned/unavailable/not-yet-proven truth.
- Generated output also verifies that `agency-ai-workbench` displays as
  `AI Agency Operating System` and preserves its tenant, acceptance-test, and
  approval boundaries.
- Tests prohibit affiliation claims, copied operator product names in Armalo
  records, market-demand claims without citations, and causal claims from
  attribution alone.
- Formatting, tests, Astro check, build, output tests, performance budget, and
  public-safety doctor pass, except for precisely reported unrelated concurrent
  blockers.
