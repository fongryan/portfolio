export type DemandEvidence = {
  label: string;
  url: `https://${string}`;
  kind: "offer" | "commercial-traction" | "adoption";
  accessed: "2026-07-15";
};

export type DemandProduct = {
  rank: number;
  slug: string;
  buyer: string;
  job: string;
  packaging: string;
  score: {
    urgency: number;
    repeatability: number;
    timeToValue: number;
    feasibility: number;
    complianceSafety: number;
    proofability: number;
  };
  total: number;
  risk: string;
  evidence: DemandEvidence[];
};

export type OperatorPattern = {
  operator: string;
  companies: string[];
  mechanic: string;
  armaloProducts: string[];
  ethicalAdaptation: string;
  sources: Array<{
    label: string;
    url: `https://${string}`;
    accessed: "2026-07-15";
  }>;
};

const accessed = "2026-07-15" as const;

export const businessDemandProducts: DemandProduct[] = [
  {
    rank: 1,
    slug: "email-customer-service",
    buyer: "Customer-service and operations leaders",
    job: "Resolve and route high-volume email support work",
    packaging: "Governed support-inbox pilot with a human approval queue",
    score: {
      urgency: 5,
      repeatability: 5,
      timeToValue: 5,
      feasibility: 4,
      complianceSafety: 4,
      proofability: 5,
    },
    total: 28,
    risk: "Sending authority and account-impacting actions must stay approval-gated.",
    evidence: [
      {
        label: "Salesforce Agentforce pricing",
        url: "https://www.salesforce.com/agentforce/pricing/",
        kind: "offer",
        accessed,
      },
      {
        label: "Zendesk automated-resolution adoption model",
        url: "https://support.zendesk.com/hc/en-us/articles/5352026794010-About-automated-resolutions-for-AI-agents",
        kind: "adoption",
        accessed,
      },
    ],
  },
  {
    rank: 2,
    slug: "document-operations-agent",
    buyer: "Operations teams processing recurring business documents",
    job: "Extract, validate, and route document data with traceable exceptions",
    packaging:
      "Bounded document workflow with confidence thresholds and review queues",
    score: {
      urgency: 5,
      repeatability: 5,
      timeToValue: 4,
      feasibility: 4,
      complianceSafety: 4,
      proofability: 5,
    },
    total: 27,
    risk: "Low-confidence fields and permission-sensitive documents require human review.",
    evidence: [
      {
        label: "Rossum data-extraction billing",
        url: "https://knowledge-base.rossum.ai/help/docs/understanding-rossums-data-extraction-billing",
        kind: "offer",
        accessed,
      },
      {
        label: "UiPath AI25 customer adoption examples",
        url: "https://www.uipath.com/ai/ai25-awards/winners",
        kind: "adoption",
        accessed,
      },
    ],
  },
  {
    rank: 3,
    slug: "voice-customer-service",
    buyer: "Service businesses and customer-service teams",
    job: "Handle routine calls, scheduling, and reception with escalation",
    packaging:
      "Consent-aware voice pilot with recording disclosure and handoff rules",
    score: {
      urgency: 5,
      repeatability: 5,
      timeToValue: 5,
      feasibility: 4,
      complianceSafety: 3,
      proofability: 4,
    },
    total: 26,
    risk: "Consent, emergency handling, and outbound-call authority vary by context.",
    evidence: [
      {
        label: "Twilio conversational AI pricing",
        url: "https://www.twilio.com/en-us/products/conversational-ai/pricing",
        kind: "offer",
        accessed,
      },
      {
        label: "Twilio investor adoption disclosure",
        url: "https://investors.twilio.com/static-files/9a8a8a89-565a-4a5b-b11d-21ef45eede70",
        kind: "adoption",
        accessed,
      },
    ],
  },
  {
    rank: 4,
    slug: "ai-qualifier",
    buyer: "Sales and revenue-operations teams",
    job: "Qualify authorized leads and route the next best action",
    packaging: "Buyer-owned qualification rubric with disposition evidence",
    score: {
      urgency: 5,
      repeatability: 5,
      timeToValue: 5,
      feasibility: 4,
      complianceSafety: 2,
      proofability: 4,
    },
    total: 25,
    risk: "Contact authorization, opt-outs, and nondiscriminatory qualification require controls.",
    evidence: [
      {
        label: "Salesforce internal sales-agent deployment",
        url: "https://www.salesforce.com/news/stories/how-salesforce-uses-agentforce-sales/",
        kind: "adoption",
        accessed,
      },
      {
        label: "Salesforce Agentforce commercial pricing",
        url: "https://www.salesforce.com/agentforce/pricing/",
        kind: "offer",
        accessed,
      },
    ],
  },
  {
    rank: 5,
    slug: "internal-knowledge-assistant",
    buyer: "Enterprise operations and knowledge teams",
    job: "Retrieve permission-aware answers from approved internal sources",
    packaging:
      "Narrow knowledge domain with citations, ownership, and freshness controls",
    score: {
      urgency: 4,
      repeatability: 5,
      timeToValue: 4,
      feasibility: 4,
      complianceSafety: 4,
      proofability: 4,
    },
    total: 25,
    risk: "Retrieval must preserve source permissions, citations, and retention policy.",
    evidence: [
      {
        label: "Glean enterprise revenue and ROI signal",
        url: "https://www.glean.com/jp/press/glean-achieves-100m-arr-in-three-years-delivering-true-ai-roi-to-the-enterprise",
        kind: "commercial-traction",
        accessed,
      },
      {
        label: "Microsoft FY2026 Q2 AI adoption disclosures",
        url: "https://www.microsoft.com/en-us/investor/events/fy-2026/earnings-fy-2026-q2",
        kind: "adoption",
        accessed,
      },
    ],
  },
  {
    rank: 6,
    slug: "finance-operations-assistant",
    buyer: "Finance and accounting operations teams",
    job: "Prepare AP, AR, reconciliation, and close work for review",
    packaging: "Segregated finance workflow without autonomous money movement",
    score: {
      urgency: 5,
      repeatability: 5,
      timeToValue: 4,
      feasibility: 4,
      complianceSafety: 2,
      proofability: 4,
    },
    total: 24,
    risk: "Payments and ledger-impacting actions require explicit authorization and separation of duties.",
    evidence: [
      {
        label: "BILL product pricing",
        url: "https://www.bill.com/product/pricing",
        kind: "offer",
        accessed,
      },
      {
        label: "BILL AI product capabilities",
        url: "https://www.bill.com/product/ai",
        kind: "offer",
        accessed,
      },
      {
        label: "Professional-services generative AI adoption survey",
        url: "https://www.thomsonreuters.com/en/press-releases/2025/april/from-incubation-to-integration-generative-ai-adoption-nearly-doubles-as-professional-services-reach-crossroads",
        kind: "adoption",
        accessed,
      },
    ],
  },
  {
    rank: 7,
    slug: "marketing-campaign-studio",
    buyer: "Marketing and creative operations teams",
    job: "Produce governed campaign variants and launch assets",
    packaging: "Campaign production system with claim and rights review",
    score: {
      urgency: 4,
      repeatability: 5,
      timeToValue: 5,
      feasibility: 5,
      complianceSafety: 2,
      proofability: 3,
    },
    total: 24,
    risk: "Claims, rights, publication, and spend changes require accountable approval.",
    evidence: [
      {
        label: "Canva Business commercial offering",
        url: "https://www.canva.com/newsroom/news/introducing-canva-business/",
        kind: "offer",
        accessed,
      },
      {
        label: "Adobe enterprise AI adoption examples",
        url: "https://news.adobe.com/news/2025/09/global-enterprises-embrace-adobe-ai-innovations-power-growth",
        kind: "adoption",
        accessed,
      },
    ],
  },
  {
    rank: 8,
    slug: "software-engineering-copilot",
    buyer: "Software engineering organizations",
    job: "Accelerate bounded coding tasks with reviewable evidence",
    packaging: "Repository-scoped copilot with tests and human promotion gates",
    score: {
      urgency: 4,
      repeatability: 5,
      timeToValue: 4,
      feasibility: 3,
      complianceSafety: 4,
      proofability: 3,
    },
    total: 23,
    risk: "Generated changes can introduce defects or security issues without review and tests.",
    evidence: [
      {
        label: "GitHub Copilot organization and enterprise billing",
        url: "https://docs.github.com/en/copilot/concepts/billing/organizations-and-enterprises",
        kind: "offer",
        accessed,
      },
      {
        label: "Microsoft FY2026 Q2 AI adoption disclosures",
        url: "https://www.microsoft.com/en-us/investor/events/fy-2026/earnings-fy-2026-q2",
        kind: "adoption",
        accessed,
      },
    ],
  },
  {
    rank: 9,
    slug: "legal-advice-assistant",
    buyer: "Legal teams and legal-service organizations",
    job: "Prepare research, issue spotting, and document review",
    packaging:
      "Source-grounded legal workflow with qualified professional review",
    score: {
      urgency: 4,
      repeatability: 4,
      timeToValue: 3,
      feasibility: 3,
      complianceSafety: 2,
      proofability: 4,
    },
    total: 20,
    risk: "Outputs must preserve provenance and cannot substitute for qualified legal advice.",
    evidence: [
      {
        label: "CoCounsel legal-team plans",
        url: "https://legal.thomsonreuters.com/en/c/compare-cocounsel-plans-for-your-legal-team",
        kind: "offer",
        accessed,
      },
      {
        label: "Professional-services generative AI adoption survey",
        url: "https://www.thomsonreuters.com/en/press-releases/2025/april/from-incubation-to-integration-generative-ai-adoption-nearly-doubles-as-professional-services-reach-crossroads",
        kind: "adoption",
        accessed,
      },
    ],
  },
  {
    rank: 10,
    slug: "clinical-documentation-assistant",
    buyer: "Clinical operations and healthcare documentation teams",
    job: "Draft clinical documentation for clinician review",
    packaging:
      "Privacy-bounded documentation workflow with clinician finalization",
    score: {
      urgency: 5,
      repeatability: 5,
      timeToValue: 4,
      feasibility: 2,
      complianceSafety: 1,
      proofability: 1,
    },
    total: 18,
    risk: "Patient privacy and clinical accountability preclude autonomous diagnosis or chart finalization.",
    evidence: [
      {
        label: "Microsoft Dragon Copilot licensing",
        url: "https://learn.microsoft.com/en-us/industry/healthcare/dragon-admin-center/concepts/dragon-copilot-licenses",
        kind: "offer",
        accessed,
      },
      {
        label: "American Medical Association physician AI adoption survey",
        url: "https://www.ama-assn.org/practice-management/digital-health/2-3-physicians-are-using-health-ai-78-2023",
        kind: "adoption",
        accessed,
      },
    ],
  },
];

export const consumerLabSlugs = [
  "ai-stylist",
  "personal-tutor",
  "personal-finance-assistant",
  "girl-math",
];

export const consumerLabScopeLabel =
  "Unranked consumer lab · comparable commercial evidence is still weaker";

export const operatorPatterns: OperatorPattern[] = [
  {
    operator: "Alex Hormozi",
    companies: ["Acquisition.com"],
    mechanic:
      "Package education, diagnostic tools, and implementation support around a measurable business constraint.",
    armaloProducts: ["business-constraint-finder", "agency-ai-workbench"],
    ethicalAdaptation:
      "Keep diagnoses evidence-linked, disclose uncertainty, and require approval before operational changes.",
    sources: [
      {
        label: "Acquisition.com AI",
        url: "https://ai.acquisition.com/",
        accessed,
      },
      {
        label: "Acquisition.com Vantage",
        url: "https://vantage.acquisition.com/",
        accessed,
      },
      {
        label: "AI Accelerator workshop",
        url: "https://www.acquisition.com/workshop-ai-accelerator",
        accessed,
      },
    ],
  },
  {
    operator: "Jordan Lee",
    companies: ["AI Acquisition"],
    mechanic:
      "Turn a repeatable AI service into a productized agency installation and managed offer.",
    armaloProducts: ["agency-ai-workbench", "lead-recovery-operator"],
    ethicalAdaptation:
      "Use original positioning, client-owned permissions, explicit acceptance tests, and approval-gated actions.",
    sources: [
      {
        label: "AI Acquisition platform",
        url: "https://www.aiacquisition.com/platform",
        accessed,
      },
      {
        label: "AI agency article",
        url: "https://www.aiacquisition.com/blog/ai-agency",
        accessed,
      },
      {
        label: "AI Acquisition terms",
        url: "https://www.aiacquisition.com/terms-of-service",
        accessed,
      },
    ],
  },
  {
    operator: "Serge Gatari",
    companies: ["Cook.ai"],
    mechanic:
      "Productize agency expertise into a reusable operating system sold as a fixed installation, then extend it with a managed-operation retainer.",
    armaloProducts: ["agency-ai-workbench", "lead-recovery-operator"],
    ethicalAdaptation:
      "Keep the reusable core explicit, isolate each client's data and authority, define acceptance tests, and make ongoing operational duties transparent.",
    sources: [
      { label: "Cook.ai", url: "https://trycook.ai/", accessed },
      { label: "Cook.ai Webby", url: "https://webby.trycook.ai/", accessed },
      { label: "Cook.ai terms", url: "https://trycook.ai/terms", accessed },
    ],
  },
  {
    operator: "Iman Gadzhi",
    companies: ["Monetise", "Flozy", "Educate"],
    mechanic:
      "Connect expertise, product creation, audience education, and delivery operations into one offer ladder.",
    armaloProducts: ["ai-digital-product-studio", "marketing-campaign-studio"],
    ethicalAdaptation:
      "Use licensed source material, avoid identity impersonation, and test demand before asserting outcomes.",
    sources: [
      {
        label: "Monetise waitlist",
        url: "https://www.monetise.com/waitlist",
        accessed,
      },
      { label: "Flozy", url: "https://www.flozy.com/", accessed },
      {
        label: "Educate terms",
        url: "https://educate.io/archives/terms-and-conditions",
        accessed,
      },
    ],
  },
  {
    operator: "Alex Becker",
    companies: ["HYROS"],
    mechanic:
      "Make event instrumentation and attribution legible enough to guide revenue decisions.",
    armaloProducts: ["revenue-intelligence-platform"],
    ethicalAdaptation:
      "Collect first-party or consented events and distinguish observed or modeled attribution from verified incrementality.",
    sources: [
      { label: "HYROS", url: "https://hyros.com/", accessed },
      { label: "HYROS AIR", url: "https://hyros.com/air", accessed },
      { label: "HYROS agency", url: "https://hyros.com/agency", accessed },
    ],
  },
];

export const demandBackedSlugs = businessDemandProducts.map(
  (product) => product.slug,
);
