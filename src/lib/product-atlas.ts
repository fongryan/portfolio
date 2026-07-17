/**
 * A broad, public-safe inventory of buildable AI offers. These are category
 * hypotheses, not claims that every item is live. Hermes is the fulfillment
 * brain behind the implementation lane; each offer still needs its own proof.
 */
export type AtlasProduct = {
  slug: string;
  category: string;
  name: string;
  buyer: string;
  job: string;
  package: string;
  rank: number;
  moneyScore: number;
  scaleScore: number;
  hermesScore: number;
  priorityScore: number;
  revenueModel: string;
  features: string[];
  icp: {
    company: string;
    buyer: string;
    trigger: string;
    disqualifier: string;
  };
  marketing: {
    positioning: string;
    channels: string[];
    proofAsset: string;
    expansion: string;
  };
};

type Seed = [name: string, buyer: string, job: string, packageShape: string];

const categorySeeds: Array<[category: string, seeds: Seed[]]> = [
  [
    "Revenue and sales",
    [
      [
        "Inbound lead responder",
        "SMB sales teams",
        "Answer new enquiries and route qualified opportunities",
        "Inbox pilot with response SLAs and approval rules",
      ],
      [
        "Appointment setter",
        "High-ticket services",
        "Turn qualified interest into attended meetings",
        "Calendar-setting workflow with consent and handoff evidence",
      ],
      [
        "AI qualifier",
        "Revenue operations",
        "Apply a buyer-owned qualification rubric",
        "Scored conversations with opt-out and disposition logs",
      ],
      [
        "AI dialer",
        "Local and inside-sales teams",
        "Run approved call lists with escalation",
        "Consent-aware voice pilot with call review queue",
      ],
      [
        "Proposal builder",
        "Agencies and consultancies",
        "Turn discovery notes into scoped proposals",
        "Template-driven proposal desk with human sign-off",
      ],
      [
        "Quote follow-up agent",
        "Trades and professional services",
        "Recover quotes that went quiet",
        "Timed follow-up sequences with stop conditions",
      ],
      [
        "Renewal risk agent",
        "Subscription businesses",
        "Find accounts likely to churn and prepare outreach",
        "Renewal dashboard with evidence-backed next actions",
      ],
      [
        "Partner recruitment agent",
        "Channel businesses",
        "Source, qualify, and onboard partners",
        "Partner pipeline with approved outreach and tasks",
      ],
      [
        "Sales call coach",
        "Sales managers",
        "Turn calls into coaching moments and next steps",
        "Consent-aware transcript review and scorecards",
      ],
      [
        "Revenue intelligence desk",
        "Founders and CROs",
        "Explain pipeline movement and forecast risk",
        "CRM-connected weekly briefing with traceable metrics",
      ],
    ],
  ],
  [
    "Customer service",
    [
      [
        "Support inbox agent",
        "Support leaders",
        "Draft and route answers across a shared inbox",
        "Human approval queue with macros and citations",
      ],
      [
        "Voice receptionist",
        "Clinics, trades, and local services",
        "Answer routine calls and schedule appointments",
        "Disclosure-first voice receptionist with warm transfer",
      ],
      [
        "SMS service desk",
        "Field-service operators",
        "Handle two-way customer updates by text",
        "Opt-in messaging workflow with escalation",
      ],
      [
        "WhatsApp concierge",
        "Retail and hospitality teams",
        "Resolve questions in a familiar channel",
        "Business-hours assistant with handoff and audit trail",
      ],
      [
        "Returns assistant",
        "E-commerce operators",
        "Guide returns and exceptions without policy drift",
        "Policy-grounded workflow with refund approval gate",
      ],
      [
        "Warranty triage agent",
        "Manufacturers and dealers",
        "Classify warranty requests and collect evidence",
        "Intake form plus review queue",
      ],
      [
        "Field-service dispatcher",
        "Home-service businesses",
        "Match jobs, skills, locations, and availability",
        "Dispatch recommendations with operator confirmation",
      ],
      [
        "Customer health monitor",
        "B2B account teams",
        "Spot unresolved issues before renewal",
        "Signal digest linked to accounts and owners",
      ],
      [
        "Multilingual support layer",
        "Global SMBs",
        "Translate and answer routine support work",
        "Language-aware queue with source-language review",
      ],
      [
        "Complaint resolution desk",
        "Regulated service teams",
        "Track complaints to documented resolution",
        "Case ledger with escalation and SLA timers",
      ],
    ],
  ],
  [
    "Marketing and growth",
    [
      [
        "Campaign studio",
        "Marketing teams",
        "Create governed campaign variants and launch assets",
        "Brief-to-asset workflow with claims and rights review",
      ],
      [
        "Local SEO operator",
        "Local businesses",
        "Keep location pages and listings accurate",
        "Monthly content and listing maintenance pack",
      ],
      [
        "Paid ad creative lab",
        "E-commerce and agencies",
        "Generate and test creative variants",
        "Experiment backlog with spend approval boundary",
      ],
      [
        "Lifecycle messaging agent",
        "Product-led businesses",
        "Personalize activation and retention messages",
        "Event-triggered drafts with frequency caps",
      ],
      [
        "Content repurposing desk",
        "Creators and B2B marketers",
        "Turn one source into channel-ready formats",
        "Editorial queue with brand voice controls",
      ],
      [
        "Review response assistant",
        "Consumer businesses",
        "Respond to reviews without sounding generic",
        "Tone and escalation rules with owner approval",
      ],
      [
        "Influencer matching agent",
        "Consumer brands",
        "Find creators aligned to audience and budget",
        "Shortlist with disclosure and fit evidence",
      ],
      [
        "Marketing measurement analyst",
        "Growth leads",
        "Explain channel and cohort performance",
        "Attribution brief with data-quality caveats",
      ],
      [
        "Offer and pricing lab",
        "SMB owners",
        "Test offers, bundles, and positioning",
        "Experiment cards with margin and approval checks",
      ],
      [
        "PR briefing desk",
        "Founders and comms teams",
        "Prepare journalist research and briefing notes",
        "Research packet with source links and review",
      ],
    ],
  ],
  [
    "Finance and administration",
    [
      [
        "Invoice chaser",
        "Finance teams",
        "Recover overdue invoices with accountable follow-up",
        "AR queue with tone, timing, and approval policies",
      ],
      [
        "AP document desk",
        "Bookkeepers and controllers",
        "Extract and validate bills for review",
        "Confidence thresholds and exception queue",
      ],
      [
        "Reconciliation assistant",
        "Small finance teams",
        "Explain mismatches across ledgers and statements",
        "Evidence-linked reconciliation workspace",
      ],
      [
        "Cash-flow forecaster",
        "Founders and CFOs",
        "Model near-term cash scenarios",
        "Scenario briefing, never autonomous money movement",
      ],
      [
        "Expense policy reviewer",
        "Operations and finance",
        "Check expenses against policy before approval",
        "Receipt extraction with human approval",
      ],
      [
        "Close coordinator",
        "Controllers",
        "Track close tasks, blockers, and evidence",
        "Close checklist with owner reminders",
      ],
      [
        "Tax document organizer",
        "Individuals and tax practices",
        "Collect and classify tax documents",
        "Secure intake with professional review boundary",
      ],
      [
        "Bookkeeping copilot",
        "Small businesses",
        "Prepare categorized books for accountant review",
        "Month-end pack with reconciliation status",
      ],
      [
        "Procurement savings analyst",
        "Operations leaders",
        "Find duplicate spend and renegotiation opportunities",
        "Spend analysis with recommendation evidence",
      ],
      [
        "Grant finance assistant",
        "Nonprofits and research teams",
        "Map spend and reporting to grant rules",
        "Restricted-funds ledger with sign-off",
      ],
    ],
  ],
  [
    "People and recruiting",
    [
      [
        "Recruiting coordinator",
        "Growing companies",
        "Schedule interviews and keep candidates informed",
        "Candidate workflow with permissioned templates",
      ],
      [
        "Sourcing researcher",
        "Recruiters",
        "Find and summarize likely-fit candidates",
        "Human-reviewed shortlist with provenance",
      ],
      [
        "Interview debrief assistant",
        "Hiring panels",
        "Turn notes into structured debriefs",
        "Rubric-based summary with reviewer ownership",
      ],
      [
        "Onboarding guide",
        "People operations",
        "Answer new-hire questions from approved policy",
        "Cited knowledge assistant with freshness checks",
      ],
      [
        "HR case triage",
        "People teams",
        "Route employee questions to the right owner",
        "Private intake with sensitive-case escalation",
      ],
      [
        "Training curriculum builder",
        "L&D teams",
        "Turn role requirements into learning paths",
        "Skills map and manager review loop",
      ],
      [
        "Performance review drafter",
        "Managers",
        "Prepare evidence-backed review drafts",
        "Employee-data boundary with manager sign-off",
      ],
      [
        "Workforce planner",
        "Operations leaders",
        "Model staffing scenarios and constraints",
        "Scenario board without automatic employment decisions",
      ],
      [
        "Benefits explainer",
        "Employers and brokers",
        "Explain plan choices in plain language",
        "Source-grounded guide with broker handoff",
      ],
      [
        "Internal mobility matcher",
        "Enterprise people teams",
        "Suggest roles and development paths",
        "Consent-aware skills matching",
      ],
    ],
  ],
  [
    "Knowledge and documents",
    [
      [
        "Internal knowledge assistant",
        "Enterprise teams",
        "Answer questions from permissioned company sources",
        "Cited domain pilot with freshness ownership",
      ],
      [
        "Document operations agent",
        "Operations teams",
        "Extract, validate, and route recurring documents",
        "Confidence thresholds and review queues",
      ],
      [
        "Contract intake desk",
        "Legal operations",
        "Classify agreements and route review",
        "Clause-aware intake with lawyer approval",
      ],
      [
        "Policy change monitor",
        "Compliance teams",
        "Find changes that affect internal policies",
        "Source watch with impact briefing",
      ],
      [
        "RFP response workspace",
        "B2B vendors",
        "Assemble defensible answers from prior material",
        "Evidence-linked response library",
      ],
      [
        "Meeting intelligence desk",
        "Leadership teams",
        "Turn meetings into decisions and owners",
        "Consent-aware transcript and action ledger",
      ],
      [
        "Research analyst",
        "Strategy and product teams",
        "Compare markets, vendors, and evidence",
        "Source pack with confidence labels",
      ],
      [
        "SOP builder",
        "Operators and franchisees",
        "Convert know-how into repeatable procedures",
        "Interview-to-SOP workflow with owner review",
      ],
      [
        "Records classification agent",
        "Information governance teams",
        "Apply retention and classification labels",
        "Policy-bound suggestions with audit trail",
      ],
      [
        "Executive briefing writer",
        "Founders and boards",
        "Compress operating data into decisions",
        "Weekly brief with linked source receipts",
      ],
    ],
  ],
  [
    "Software and data",
    [
      [
        "Software engineering copilot",
        "Product teams",
        "Plan, implement, test, and explain code changes",
        "Repo-scoped agent with review gates",
      ],
      [
        "QA regression agent",
        "Engineering teams",
        "Turn releases into repeatable test coverage",
        "Browser and API test pack with receipts",
      ],
      [
        "Data analyst",
        "SMBs without analysts",
        "Answer business questions from approved data",
        "Semantic query layer with cited outputs",
      ],
      [
        "BI briefing agent",
        "Department leads",
        "Send metric changes and likely drivers",
        "Scheduled digest with anomaly thresholds",
      ],
      [
        "Cloud cost analyst",
        "Engineering leaders",
        "Find waste and explain infrastructure spend",
        "Read-only recommendations with change approval",
      ],
      [
        "Security questionnaire desk",
        "B2B software vendors",
        "Draft responses to buyer security reviews",
        "Evidence library with security-owner sign-off",
      ],
      [
        "API integration builder",
        "Operations and product teams",
        "Connect systems around a bounded workflow",
        "Schema-mapped build with sandbox validation",
      ],
      [
        "Data quality monitor",
        "Data teams",
        "Find missing, stale, or contradictory fields",
        "Issue queue with owner and freshness SLA",
      ],
      [
        "Incident commander",
        "SRE and platform teams",
        "Coordinate incident evidence and updates",
        "Read-only context plus human-approved communications",
      ],
      [
        "Forward-deployed engineer",
        "Complex B2B buyers",
        "Adapt an AI workflow to real operating constraints",
        "Discovery-to-pilot implementation engagement",
      ],
    ],
  ],
  [
    "Healthcare and care operations",
    [
      [
        "Clinical documentation assistant",
        "Clinics and care teams",
        "Draft visit documentation for clinician review",
        "Consent-aware ambient workflow with sign-off",
      ],
      [
        "Referral coordinator",
        "Healthcare practices",
        "Track referrals, records, and next actions",
        "Closed-loop referral queue",
      ],
      [
        "Prior authorization desk",
        "Provider operations",
        "Prepare authorization packets and status checks",
        "Evidence pack with human submission",
      ],
      [
        "Patient scheduling assistant",
        "Clinics",
        "Schedule routine visits and reminders",
        "Identity-aware scheduler with escalation",
      ],
      [
        "Care-plan explainer",
        "Care teams and families",
        "Explain approved care plans clearly",
        "Source-grounded education, not diagnosis",
      ],
      [
        "Medical billing workbench",
        "Revenue-cycle teams",
        "Find coding and billing exceptions",
        "Review-only work queue",
      ],
      [
        "Pharmacy refill coordinator",
        "Pharmacies and clinics",
        "Route refill requests and exceptions",
        "Policy-aware intake with pharmacist review",
      ],
      [
        "Home-care visit planner",
        "Home-care agencies",
        "Match visits, staff, and constraints",
        "Scheduling recommendations with supervisor approval",
      ],
      [
        "Research abstractor",
        "Life-sciences teams",
        "Extract structured facts from study documents",
        "Traceable extraction workspace",
      ],
      [
        "Practice operations manager",
        "Independent practices",
        "Run the daily admin checklist",
        "Operator cockpit with clear escalation",
      ],
    ],
  ],
  [
    "Legal and compliance",
    [
      [
        "Legal research assistant",
        "Law firms and in-house teams",
        "Find relevant authority and summarize it",
        "Cited research memo with lawyer review",
      ],
      [
        "Matter intake coordinator",
        "Law firms",
        "Collect facts and route new matters",
        "Conflict-aware intake workflow",
      ],
      [
        "Contract comparison desk",
        "Legal operations",
        "Compare versions and surface changed obligations",
        "Diff report with counsel sign-off",
      ],
      [
        "Compliance evidence collector",
        "Compliance teams",
        "Gather proof for recurring controls",
        "Evidence checklist with owner attestations",
      ],
      [
        "Privacy request coordinator",
        "Businesses with customer data",
        "Route access and deletion requests",
        "Identity and deadline-controlled case queue",
      ],
      [
        "Vendor risk reviewer",
        "Procurement and security",
        "Summarize vendor risk materials",
        "Questionnaire and evidence triage",
      ],
      [
        "Regulatory change analyst",
        "Regulated businesses",
        "Explain what new rules may change",
        "Jurisdiction-scoped monitoring brief",
      ],
      [
        "Board governance assistant",
        "Private companies and nonprofits",
        "Prepare agendas, minutes, and action logs",
        "Board packet workspace with approval",
      ],
      [
        "Insurance claims intake",
        "Brokers and carriers",
        "Collect claim facts and supporting documents",
        "Structured intake with adjuster review",
      ],
      [
        "Policy training coach",
        "Compliance leaders",
        "Make policy learning practical and measurable",
        "Role-based microlearning with attestations",
      ],
    ],
  ],
  [
    "Commerce, local, and field service",
    [
      [
        "E-commerce merchandiser",
        "Online retailers",
        "Turn product and demand signals into assortments",
        "Catalog and campaign recommendations",
      ],
      [
        "Retail associate assistant",
        "Multi-location retail",
        "Answer product and policy questions in-store",
        "Staff-facing knowledge tool",
      ],
      [
        "Restaurant operations agent",
        "Restaurants and chains",
        "Coordinate shifts, prep, and guest issues",
        "Manager cockpit with escalation",
      ],
      [
        "Real-estate leasing assistant",
        "Property managers",
        "Respond to enquiries and schedule tours",
        "Lead-to-tour workflow with fair-housing guardrails",
      ],
      [
        "Property maintenance coordinator",
        "Property operators",
        "Triage work orders and vendors",
        "Evidence-backed dispatch queue",
      ],
      [
        "Construction bid assistant",
        "Contractors",
        "Read plans and prepare bid work",
        "Document extraction with estimator review",
      ],
      [
        "Insurance broker assistant",
        "Independent brokers",
        "Prepare comparisons and renewal outreach",
        "Client-specific recommendation pack",
      ],
      [
        "Travel concierge",
        "Travel businesses and hotels",
        "Build itineraries and resolve trip friction",
        "Human-backed itinerary service",
      ],
      [
        "Automotive service advisor",
        "Repair shops and dealers",
        "Explain service needs and follow up",
        "Estimate and appointment workflow",
      ],
      [
        "Event operations coordinator",
        "Venues and event teams",
        "Run vendors, schedules, and attendee updates",
        "Event command board with approval",
      ],
    ],
  ],
  [
    "Creators, education, and personal",
    [
      [
        "AI tutor",
        "Schools, families, and learners",
        "Coach practice with adaptive explanations",
        "Curriculum-bounded tutor with progress loop",
      ],
      [
        "Personal finance assistant",
        "Individuals and coaches",
        "Explain spending and savings choices",
        "Read-only financial guidance with disclaimers",
      ],
      [
        "AI stylist",
        "Consumers and retail brands",
        "Turn preferences into useful outfit ideas",
        "Preference-led style session with shoppable handoff",
      ],
      [
        "Creator production desk",
        "Creators and studios",
        "Plan, produce, and repurpose content",
        "Editorial calendar plus asset pipeline",
      ],
      [
        "Course launch producer",
        "Experts and educators",
        "Package expertise into a sellable course",
        "Curriculum, landing page, and launch kit",
      ],
      [
        "Career coach",
        "Professionals and universities",
        "Turn goals into a practical search plan",
        "Human-reviewed action plan and practice",
      ],
      [
        "Language practice partner",
        "Learners and teams",
        "Build consistent conversation practice",
        "Roleplay sessions with feedback",
      ],
      [
        "Family logistics assistant",
        "Busy households",
        "Coordinate reminders, errands, and plans",
        "Private shared task space with consent",
      ],
      [
        "Fitness habit coach",
        "Consumers and coaches",
        "Turn goals into sustainable routines",
        "Non-clinical habit plan with check-ins",
      ],
      [
        "Travel points optimizer",
        "Frequent travelers",
        "Compare award routes and trade-offs",
        "Deterministic search with user approval",
      ],
    ],
  ],
  [
    "Agent infrastructure and studios",
    [
      [
        "Managed agent workspace",
        "SMBs and enterprise teams",
        "Deploy role-specific agents without infrastructure overhead",
        "Governed tenant workspace with one invoice",
      ],
      [
        "BYOK agent cloud",
        "Technical teams and agencies",
        "Run agents with customer-owned model keys",
        "Metered hosted control plane with key isolation",
      ],
      [
        "Agent observability desk",
        "AI platform teams",
        "See runs, costs, failures, and approvals",
        "Trace viewer with redacted receipts",
      ],
      [
        "Agent evaluation lab",
        "Product and research teams",
        "Measure agent quality against real tasks",
        "Scenario suite with regression reports",
      ],
      [
        "Skill library",
        "Agent operators",
        "Package repeatable capabilities for reuse",
        "Versioned skill registry with tests",
      ],
      [
        "Workflow automation studio",
        "Agencies and operators",
        "Turn manual processes into governed agent workflows",
        "Discovery-to-production implementation",
      ],
      [
        "White-label AI platform",
        "Software companies",
        "Embed branded assistants into an existing product",
        "Partner build with tenant isolation",
      ],
      [
        "AI adoption program",
        "Executives and teams",
        "Move from scattered tools to measured workflows",
        "Timeboxed pilot portfolio with ROI review",
      ],
      [
        "Agent marketplace builder",
        "Platforms and communities",
        "Launch a curated catalog of specialist agents",
        "Marketplace architecture and governance",
      ],
      [
        "Hermes fulfillment layer",
        "Businesses buying any AI workflow",
        "Translate a sold product into a safe implementation",
        "Brief, tune, integrate, test, launch, support",
      ],
    ],
  ],
];

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

type CategoryProfile = {
  money: number;
  scale: number;
  hermes: number;
  revenueModel: string;
};

// Scores are deliberately legible rather than pretending to be a forecast:
// money = buyer willingness to pay and measurable economic value; scale = how
// repeatable the same package is across customers; Hermes = how much of the
// workflow can be fulfilled with bounded context, tools, and approvals. Each
// dimension is scored 1–10 so close products do not disappear into ties.
const categoryProfiles: Record<string, CategoryProfile> = {
  "Revenue and sales": {
    money: 9,
    scale: 8,
    hermes: 9,
    revenueModel: "Pilot + recurring platform + outcome/usage tier",
  },
  "Customer service": {
    money: 8,
    scale: 9,
    hermes: 9,
    revenueModel: "Implementation + per-resolution or per-conversation",
  },
  "Finance and administration": {
    money: 9,
    scale: 7,
    hermes: 7,
    revenueModel: "Workflow subscription + implementation, approval-gated",
  },
  "Software and data": {
    money: 8,
    scale: 9,
    hermes: 8,
    revenueModel: "Team/enterprise subscription + usage",
  },
  "Agent infrastructure and studios": {
    money: 9,
    scale: 9,
    hermes: 7,
    revenueModel: "Platform subscription + metered runs + services",
  },
  "Knowledge and documents": {
    money: 7,
    scale: 9,
    hermes: 9,
    revenueModel: "Domain pilot + seat/workspace subscription",
  },
  "Marketing and growth": {
    money: 7,
    scale: 9,
    hermes: 9,
    revenueModel: "Retainer or subscription + campaign usage",
  },
  "Legal and compliance": {
    money: 9,
    scale: 7,
    hermes: 5,
    revenueModel: "High-value pilot + matter or seat subscription",
  },
  "Commerce, local, and field service": {
    money: 6,
    scale: 8,
    hermes: 9,
    revenueModel: "Location subscription + setup + usage",
  },
  "People and recruiting": {
    money: 6,
    scale: 7,
    hermes: 9,
    revenueModel: "Team subscription + implementation",
  },
  "Healthcare and care operations": {
    money: 9,
    scale: 7,
    hermes: 4,
    revenueModel: "Compliance-heavy pilot + per-provider subscription",
  },
  "Creators, education, and personal": {
    money: 4,
    scale: 8,
    hermes: 9,
    revenueModel: "Self-serve subscription + premium services",
  },
};

const productAdjustments: Array<{
  words: string[];
  money?: number;
  scale?: number;
  hermes?: number;
}> = [
  { words: ["invoice", "cash-flow", "reconciliation", "close"], money: 1 },
  {
    words: ["appointment", "dialer", "qualifier", "renewal", "sales"],
    money: 1,
  },
  { words: ["voice", "clinical", "patient", "pharmacy"], hermes: -2 },
  { words: ["marketplace", "white-label", "managed agent", "byok"], scale: 1 },
  { words: ["research", "briefing", "analyst", "knowledge"], hermes: 1 },
  { words: ["proposal", "quote", "revenue intelligence"], money: 1, scale: 1 },
  { words: ["support inbox", "customer health", "returns"], scale: 1 },
];

const clampScore = (score: number) => Math.max(1, Math.min(10, score));

type CategoryPlaybook = {
  features: string[];
  company: string;
  trigger: string;
  disqualifier: string;
  channels: string[];
  proofAsset: string;
  expansion: string;
};

// These playbooks keep every atlas entry specific enough to sell and scope:
// the product name changes the copy, while the category supplies the repeatable
// implementation and go-to-market pattern.
const categoryPlaybooks: Record<string, CategoryPlaybook> = {
  "Revenue and sales": {
    features: [
      "Context-aware intake from approved CRM, form, and conversation data",
      "Buyer-owned qualification, routing, and next-best-action rules",
      "Sequenced email, SMS, or voice follow-up with opt-out enforcement",
      "Calendar, CRM, and handoff updates with a full activity ledger",
      "Pipeline, conversion, and revenue attribution reporting for the owner",
    ],
    company:
      "A sales-led SMB or B2B team with repeatable lead volume and a measurable pipeline",
    trigger:
      "A missed or slow {job} is already costing booked revenue or rep capacity",
    disqualifier:
      "No consented contact data, no owner for approvals, or no CRM/system of record",
    channels: [
      "Founder-led outbound to revenue owners",
      "CRM and agency partners",
      "ROI teardown content",
      "Referral from sales operators",
    ],
    proofAsset:
      "A before/after funnel audit showing response time, qualified rate, and booked-revenue movement",
    expansion:
      "Start with one motion, then add channels, territories, reps, and revenue-workforce agents",
  },
  "Customer service": {
    features: [
      "Permissioned knowledge retrieval from help center, policy, and order sources",
      "Intent detection, answer drafting, and confidence-based human escalation",
      "Conversation memory across inbox, chat, SMS, voice, and WhatsApp",
      "Safe actions for status checks, scheduling, returns, and case creation",
      "Resolution, deflection, CSAT, and escalation analytics by intent",
    ],
    company:
      "A service-heavy business with recurring questions, queues, or after-hours demand",
    trigger:
      "Support volume is growing faster than headcount or response SLAs are slipping",
    disqualifier:
      "Unowned policies, no escalation path, or actions that cannot be approval-gated",
    channels: [
      "Helpdesk and CRM integrations",
      "Service-leader outbound",
      "Vertical playbooks",
      "Customer-experience case studies",
    ],
    proofAsset:
      "A shadow-mode resolution report with containment, reopen rate, and human-handoff quality",
    expansion:
      "Begin with one queue, then add channels, languages, locations, and authenticated actions",
  },
  "Finance and administration": {
    features: [
      "Document intake, OCR, normalization, and field-level confidence scoring",
      "Policy, vendor, ledger, and duplicate checks before a recommendation",
      "Exception queues that preserve source evidence and reviewer ownership",
      "Close, collections, and reconciliation task orchestration with deadlines",
      "Read-only reporting that separates preparation from approval and payment",
    ],
    company:
      "A finance team with recurring AP, AR, close, or reconciliation work and a clear controller",
    trigger:
      "Manual finance operations are delaying close, cash collection, or visibility",
    disqualifier:
      "Requests for autonomous money movement, weak segregation of duties, or missing source records",
    channels: [
      "Accountant and fractional-CFO partners",
      "Finance-operator outbound",
      "Cash-leak calculators",
      "Controller communities",
    ],
    proofAsset:
      "A reconciled sample pack showing exception reduction, cycle time, and reviewer touch time",
    expansion:
      "Land in one workflow, then expand from AP/AR to close, forecasting, procurement, and reporting",
  },
  "Software and data": {
    features: [
      "Repo, schema, metric, or cloud-context retrieval with scoped permissions",
      "Plan → change → test → review traces instead of opaque generation",
      "Regression, anomaly, data-quality, and cost checks with threshold alerts",
      "Human approval gates for deploys, schema changes, and production mutations",
      "Receipts that connect agent actions to code, queries, metrics, and owners",
    ],
    company:
      "A technical team with a shared codebase or data surface and a costly delivery bottleneck",
    trigger:
      "Engineering or analytics work is queueing behind specialists or repeated manual checks",
    disqualifier:
      "No test environment, no code/data ownership, or a request to bypass review controls",
    channels: [
      "Developer communities",
      "Forward-deployed pilots",
      "Technical content and benchmarks",
      "Cloud and platform partners",
    ],
    proofAsset:
      "A reproducible task benchmark with review comments, test receipts, and cycle-time deltas",
    expansion:
      "Start with one repo or data domain, then add teams, environments, and governed agent roles",
  },
  "Agent infrastructure and studios": {
    features: [
      "Tenant, identity, workspace, credential, and permission isolation",
      "Reusable role templates, skills, tools, and environment policies",
      "Run queue, spend/concurrency ceilings, trace receipts, and failure recovery",
      "Evaluation suites that block promotion when quality or safety regresses",
      "Metering, billing, support, and white-label controls around the workflow",
    ],
    company:
      "An agency, software company, or operator managing multiple AI workflows or tenants",
    trigger:
      "Ad hoc keys, VPSs, prompts, and agent runs are becoming an operational liability",
    disqualifier:
      "A buyer only wants raw compute or refuses tenant, spend, and authority boundaries",
    channels: [
      "Agency and ISV partnerships",
      "Technical founder outbound",
      "Reference architectures",
      "Platform migration audits",
    ],
    proofAsset:
      "A control-plane readiness review covering isolation, cost, traceability, and recovery",
    expansion:
      "Land one workspace or tenant, then add templates, billing, white-label, and managed operations",
  },
  "Knowledge and documents": {
    features: [
      "Permission-aware retrieval with citations, freshness, and source ownership",
      "Document classification, extraction, comparison, and structured outputs",
      "Confidence thresholds that route ambiguity to a named reviewer",
      "Reusable templates for briefs, SOPs, RFPs, policies, and decision packs",
      "Question, source, and correction analytics to improve the knowledge base",
    ],
    company:
      "A knowledge-rich team where answers and documents are spread across approved sources",
    trigger:
      "Experts are repeatedly answering the same questions or assembling the same packet",
    disqualifier:
      "No source permissions, no document owner, or a need for uncited free-form answers",
    channels: [
      "Knowledge-team communities",
      "Content and SEO around painful document jobs",
      "Systems-integrator partners",
      "Pilot workshops",
    ],
    proofAsset:
      "A citation-accuracy and time-to-answer study on the buyer's real source set",
    expansion:
      "Start with one domain, then add departments, document types, languages, and workflows",
  },
  "Marketing and growth": {
    features: [
      "Audience, offer, and brand-context intake from approved performance data",
      "Brief-to-copy, creative, landing-page, and lifecycle variant generation",
      "Claim, rights, brand, and human publication review checkpoints",
      "Experiment ledger connecting creative variants to spend and outcomes",
      "Cohort, attribution, and retention insights with explicit data caveats",
    ],
    company:
      "A growth-minded SMB, brand, or agency producing campaigns on a recurring cadence",
    trigger:
      "The team needs more experiments but cannot add proportional creative or analyst capacity",
    disqualifier:
      "No approved brand claims, no measurement baseline, or a request for unreviewed publishing/spend",
    channels: [
      "Founder and agency outbound",
      "Performance teardown content",
      "Partner bundles with CRM/ad tools",
      "Webinar-led pilots",
    ],
    proofAsset:
      "A campaign sprint showing time-to-variant, approval quality, and measured test results",
    expansion:
      "Land one campaign or channel, then expand to lifecycle, paid media, SEO, and measurement",
  },
  "Legal and compliance": {
    features: [
      "Matter, policy, or vendor intake with jurisdiction and permission context",
      "Cited research, clause comparison, evidence collection, and issue triage",
      "Reviewer queues with immutable source links and decision ownership",
      "Deadline, retention, escalation, and audit-history tracking",
      "Draft-only outputs that never substitute for licensed or accountable review",
    ],
    company:
      "A legal, compliance, or procurement team with repeated review and evidence obligations",
    trigger:
      "Specialists are spending too much time on intake, comparison, or recurring evidence work",
    disqualifier:
      "A buyer expects autonomous legal advice, filing, approval, or policy interpretation",
    channels: [
      "Legal-ops and compliance communities",
      "Practice-specific partners",
      "Evidence-quality workshops",
      "Matter-cycle ROI studies",
    ],
    proofAsset:
      "A blinded review showing citation quality, issue recall, and reviewer time saved",
    expansion:
      "Land one matter or control family, then expand to adjacent jurisdictions and workflows",
  },
  "Commerce, local, and field service": {
    features: [
      "Location, catalog, inventory, schedule, and customer-context synchronization",
      "Lead, order, maintenance, or guest-intent triage with routing rules",
      "Appointment, dispatch, quote, return, and status workflows with approvals",
      "Staff-facing answers and customer-facing messages in the right channel",
      "Location, job, margin, and service-level reporting for operators",
    ],
    company:
      "A multi-location, field-service, retail, hospitality, or property operator",
    trigger:
      "Leads, jobs, or guest requests are lost between locations, shifts, or systems",
    disqualifier:
      "No operating schedule, no local owner, or no system of record for inventory/jobs",
    channels: [
      "Vertical software partners",
      "Local-operator outbound",
      "Franchise and trade communities",
      "Location-level ROI calculators",
    ],
    proofAsset:
      "A single-location pilot showing response, booking, utilization, and exception metrics",
    expansion:
      "Land one location, then roll out to regions, franchises, languages, and adjacent workflows",
  },
  "People and recruiting": {
    features: [
      "Role, candidate, employee, and policy context with permission boundaries",
      "Scheduling, reminders, document drafting, and structured intake workflows",
      "Rubric-based summaries that preserve evidence and reviewer ownership",
      "Sensitive-case escalation, retention, and consent-aware data handling",
      "Hiring, onboarding, learning, and mobility funnel reporting",
    ],
    company:
      "A growing company with recurring recruiting, onboarding, or people-operations volume",
    trigger:
      "People teams are spending time on coordination instead of candidate or employee quality",
    disqualifier:
      "A buyer wants autonomous employment decisions or unmanaged sensitive data access",
    channels: [
      "People-ops communities",
      "Recruiting and HR partners",
      "Hiring-funnel teardown content",
      "Department pilots",
    ],
    proofAsset:
      "A coordinator-time study with candidate response, scheduling, and quality safeguards",
    expansion:
      "Land recruiting or onboarding, then add learning, internal mobility, and manager workflows",
  },
  "Healthcare and care operations": {
    features: [
      "Consent-aware intake and role-specific access to approved records",
      "Documentation, referral, scheduling, and authorization preparation",
      "Confidence and exception queues that keep clinicians or staff accountable",
      "Source-linked summaries with retention, audit, and escalation controls",
      "Operational metrics that avoid autonomous diagnosis or treatment claims",
    ],
    company:
      "A healthcare, life-sciences, or care operator with a defined administrative workflow owner",
    trigger:
      "Clinicians or care staff are losing time to documentation and coordination work",
    disqualifier:
      "No compliance owner, no approved data boundary, or a request for autonomous clinical decisions",
    channels: [
      "Practice-management partners",
      "Clinical-ops pilots",
      "Compliance-first case studies",
      "Specialty associations",
    ],
    proofAsset:
      "A supervised workflow study with documentation quality, turnaround, and safety review",
    expansion:
      "Land one administrative workflow, then add locations, specialties, and revenue-cycle operations",
  },
  "Creators, education, and personal": {
    features: [
      "Preference, goal, and context capture that improves across sessions",
      "Guided plans, practice loops, recommendations, and reusable templates",
      "Clear uncertainty, safety, and human-coach handoff language",
      "Shareable outputs that create organic referral without exposing private data",
      "Progress, retention, and conversion signals for the owner or coach",
    ],
    company:
      "A creator, educator, coach, consumer brand, or individual with a repeatable guidance job",
    trigger:
      "The buyer wants personalized help without adding one-to-one labor",
    disqualifier:
      "A high-stakes need requires licensed advice, guaranteed outcomes, or sensitive data without consent",
    channels: [
      "Creator-led content",
      "Communities and referrals",
      "Product-led free entry",
      "Partnerships with coaches or brands",
    ],
    proofAsset:
      "A cohort activation and retention loop showing useful outputs and safe handoffs",
    expansion:
      "Land one use case, then add premium plans, teams, commerce, or professional services",
  },
};

const buildBlueprint = (
  category: string,
  name: string,
  buyer: string,
  job: string,
) => {
  const playbook = categoryPlaybooks[category];
  if (!playbook)
    throw new Error(`Missing atlas commercial playbook: ${category}`);
  const replaceTokens = (value: string) =>
    value.replaceAll("{product}", name).replaceAll("{job}", job.toLowerCase());
  return {
    features: playbook.features.map(replaceTokens),
    icp: {
      company: playbook.company,
      buyer,
      trigger: replaceTokens(playbook.trigger),
      disqualifier: playbook.disqualifier,
    },
    marketing: {
      positioning: `${name} gives ${buyer.toLowerCase()} a governed way to ${job.toLowerCase()}.`,
      channels: playbook.channels,
      proofAsset: playbook.proofAsset,
      expansion: playbook.expansion,
    },
  };
};

const scoreProduct = (category: string, name: string) => {
  const profile = categoryProfiles[category];
  if (!profile) throw new Error(`Missing atlas ranking profile: ${category}`);
  const lowerName = name.toLowerCase();
  const adjustment = productAdjustments.find(({ words }) =>
    words.some((word) => lowerName.includes(word)),
  );
  const moneyScore = clampScore(profile.money + (adjustment?.money ?? 0));
  const scaleScore = clampScore(profile.scale + (adjustment?.scale ?? 0));
  const hermesScore = clampScore(profile.hermes + (adjustment?.hermes ?? 0));
  return {
    moneyScore,
    scaleScore,
    hermesScore,
    priorityScore: moneyScore * 4 + scaleScore * 3 + hermesScore * 3,
    revenueModel: profile.revenueModel,
  };
};

const scoredAtlas = categorySeeds.flatMap(([category, seeds], categoryIndex) =>
  seeds.map(([name, buyer, job, packageShape], productIndex) => ({
    slug: `${slugify(category)}-${slugify(name)}`,
    category,
    name,
    buyer,
    job,
    package: packageShape,
    categoryIndex,
    productIndex,
    ...buildBlueprint(category, name, buyer, job),
    ...scoreProduct(category, name),
  })),
);

export const productAtlas: AtlasProduct[] = scoredAtlas
  .sort(
    (left, right) =>
      right.priorityScore - left.priorityScore ||
      left.categoryIndex - right.categoryIndex ||
      left.productIndex - right.productIndex,
  )
  .map(
    (
      {
        categoryIndex: _categoryIndex,
        productIndex: _productIndex,
        ...product
      },
      index,
    ) => ({
      ...product,
      rank: index + 1,
    }),
  );

export const productAtlasCategories = [
  ...new Set(productAtlas.map((p) => p.category)),
];
