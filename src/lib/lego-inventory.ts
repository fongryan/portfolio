export const legoInventorySchema = "armalo.lego.inventory.v1" as const;
export const legoInventoryVersion = "1.0.0" as const;

export type LegoMaturity =
  "planned" | "source-tested" | "runtime-verified" | "public-live";
export type LegoProof =
  | "not-yet-proven"
  | "source-tested"
  | "runtime-verified"
  | "public-live"
  | "business-verified";
export type CatalogueStatus = "live" | "beta" | "wip" | "planned";
export type CatalogueAccess =
  "public" | "sign-in" | "private-beta" | "waitlist" | "unavailable";

export type LegoInventoryRecord = {
  id: string;
  version: typeof legoInventoryVersion;
  productSlug: string;
  name: string;
  status: CatalogueStatus;
  access: CatalogueAccess;
  maturity: LegoMaturity;
  proof: LegoProof;
  capabilityFamilies: string[];
  blockFamilies: string[];
  dependencies: string[];
  integrations: string[];
  policyRefs: string[];
  evalRefs: string[];
  starterManifest: {
    path: string;
    id: string;
    version: typeof legoInventoryVersion;
  };
  source: {
    path: string;
    loader: "astro-content-glob";
    lastVerified: string;
  };
};

type CatalogueSeed = readonly [
  slug: string,
  name: string,
  status: CatalogueStatus,
  access: CatalogueAccess,
  maturity: LegoMaturity,
  proof: LegoProof,
];

// This is the only product list owned by the LEGO layer. The product Markdown
// remains the public catalogue copy; this table adds reusable composition
// metadata without importing private runtime, tenant, or provider state.
const catalogueSeeds: readonly CatalogueSeed[] = [
  [
    "agency-ai-workbench",
    "AI Agency Operating System",
    "planned",
    "unavailable",
    "planned",
    "not-yet-proven",
  ],
  [
    "agent-skill-library",
    "Agent Skill Library",
    "planned",
    "unavailable",
    "planned",
    "not-yet-proven",
  ],
  [
    "ai-attribution-remarketing",
    "AI Attribution & Remarketing",
    "planned",
    "unavailable",
    "planned",
    "not-yet-proven",
  ],
  [
    "ai-customer-service-desk",
    "AI Customer Service Desk",
    "planned",
    "unavailable",
    "planned",
    "not-yet-proven",
  ],
  [
    "ai-dialer",
    "AI Dialer",
    "planned",
    "unavailable",
    "planned",
    "not-yet-proven",
  ],
  [
    "ai-digital-product-studio",
    "AI Digital Product Studio",
    "planned",
    "unavailable",
    "planned",
    "not-yet-proven",
  ],
  [
    "ai-forward-deployed-engineer",
    "AI Forward Deployed Engineer",
    "planned",
    "unavailable",
    "planned",
    "not-yet-proven",
  ],
  [
    "ai-lead-generation",
    "AI Lead Generation",
    "planned",
    "unavailable",
    "planned",
    "not-yet-proven",
  ],
  [
    "ai-qualifier",
    "AI Qualifier",
    "planned",
    "unavailable",
    "planned",
    "not-yet-proven",
  ],
  [
    "ai-salesman",
    "AI Salesman",
    "planned",
    "unavailable",
    "planned",
    "not-yet-proven",
  ],
  [
    "ai-setter",
    "AI Setter",
    "planned",
    "unavailable",
    "planned",
    "not-yet-proven",
  ],
  [
    "ai-stylist",
    "AI Stylist",
    "planned",
    "unavailable",
    "planned",
    "not-yet-proven",
  ],
  ["armalo-app", "Armalo App", "live", "public", "public-live", "public-live"],
  [
    "autonomous-business",
    "Autonomous Business",
    "planned",
    "unavailable",
    "planned",
    "not-yet-proven",
  ],
  [
    "business-constraint-finder",
    "Business Constraint Finder",
    "planned",
    "unavailable",
    "planned",
    "not-yet-proven",
  ],
  [
    "byok-agent-cloud",
    "BYOK Agent Cloud",
    "planned",
    "unavailable",
    "planned",
    "not-yet-proven",
  ],
  [
    "clinical-documentation-assistant",
    "Clinical Documentation Assistant",
    "planned",
    "unavailable",
    "planned",
    "not-yet-proven",
  ],
  [
    "document-operations-agent",
    "Document Operations Agent",
    "planned",
    "unavailable",
    "planned",
    "not-yet-proven",
  ],
  [
    "email-customer-service",
    "Email Customer Service Assistant",
    "planned",
    "unavailable",
    "planned",
    "not-yet-proven",
  ],
  [
    "expert-knowledge-assistant",
    "Expert Knowledge Assistant",
    "planned",
    "unavailable",
    "planned",
    "not-yet-proven",
  ],
  [
    "finance-operations-assistant",
    "Finance Operations Assistant",
    "planned",
    "unavailable",
    "planned",
    "not-yet-proven",
  ],
  ["girl-math", "Girl Math", "beta", "public", "public-live", "public-live"],
  [
    "hermes-ai-crm",
    "Hermes AI CRM",
    "planned",
    "unavailable",
    "planned",
    "not-yet-proven",
  ],
  [
    "hermes-financial-adviser",
    "Hermes Financial Adviser",
    "planned",
    "unavailable",
    "planned",
    "not-yet-proven",
  ],
  [
    "hermes-revenue-agents",
    "Hermes Revenue Agents",
    "planned",
    "unavailable",
    "planned",
    "not-yet-proven",
  ],
  [
    "internal-knowledge-assistant",
    "Internal Knowledge Assistant",
    "planned",
    "unavailable",
    "planned",
    "not-yet-proven",
  ],
  [
    "invoice-chaser",
    "Invoice Chaser",
    "planned",
    "unavailable",
    "planned",
    "not-yet-proven",
  ],
  [
    "lead-recovery-operator",
    "Lead Recovery Operator",
    "planned",
    "unavailable",
    "planned",
    "not-yet-proven",
  ],
  [
    "legal-advice-assistant",
    "Legal Advice Assistant",
    "planned",
    "unavailable",
    "planned",
    "not-yet-proven",
  ],
  [
    "managed-agent-workspaces",
    "Managed Agent Workspaces",
    "planned",
    "unavailable",
    "planned",
    "not-yet-proven",
  ],
  [
    "marketing-campaign-studio",
    "Marketing Campaign Studio",
    "planned",
    "unavailable",
    "planned",
    "not-yet-proven",
  ],
  [
    "personal-finance-assistant",
    "Personal Finance AI Assistant",
    "planned",
    "unavailable",
    "planned",
    "not-yet-proven",
  ],
  [
    "personal-tutor",
    "Personal Tutor Assistant",
    "planned",
    "unavailable",
    "planned",
    "not-yet-proven",
  ],
  [
    "proposal-generator",
    "Proposal Generator",
    "planned",
    "unavailable",
    "planned",
    "not-yet-proven",
  ],
  [
    "revenue-intelligence-platform",
    "Revenue Intelligence Platform",
    "planned",
    "unavailable",
    "planned",
    "not-yet-proven",
  ],
  [
    "sms-customer-service",
    "SMS Customer Service Assistant",
    "planned",
    "unavailable",
    "planned",
    "not-yet-proven",
  ],
  [
    "software-engineering-copilot",
    "Software Engineering Copilot",
    "planned",
    "unavailable",
    "planned",
    "not-yet-proven",
  ],
  [
    "sports-betting-agent",
    "Sports Betting Intelligence Agent",
    "planned",
    "unavailable",
    "planned",
    "not-yet-proven",
  ],
  [
    "trading-agent",
    "Automated Trading Agent",
    "planned",
    "unavailable",
    "planned",
    "not-yet-proven",
  ],
  [
    "voice-customer-service",
    "Voice Customer Service Assistant",
    "planned",
    "unavailable",
    "planned",
    "not-yet-proven",
  ],
  [
    "whatsapp-customer-service",
    "WhatsApp Customer Service Assistant",
    "planned",
    "unavailable",
    "planned",
    "not-yet-proven",
  ],
];

const commonBlocks = [
  "workspace.foundation",
  "hermes.operator",
  "policy.approval-gates",
  "evaluation.harness",
  "provenance.receipts",
] as const;
const commonDependencies = ["workspace.foundation", "hermes.operator"] as const;

const capabilityFamily = (slug: string): string => {
  if (/(customer-service|email|sms|voice|whatsapp)/.test(slug))
    return "customer-service";
  if (
    /(dialer|lead|qualifier|salesman|setter|crm|invoice|proposal|revenue|recovery)/.test(
      slug,
    )
  )
    return "revenue-operations";
  if (/(finance|trading)/.test(slug)) return "financial-workflows";
  if (/(legal|clinical)/.test(slug)) return "regulated-review";
  if (/(knowledge|skill|tutor|stylist|digital-product)/.test(slug))
    return "knowledge-personalization";
  if (/(marketing|attribution)/.test(slug)) return "marketing-operations";
  if (/(agent|workspace|autonomous|byok|engineering|armalo)/.test(slug))
    return "agent-infrastructure";
  if (/sports/.test(slug)) return "research-intelligence";
  return "business-operations";
};

const integrationsFor = (slug: string): string[] => {
  const integrations = new Set<string>(["integration.customer-system"]);
  if (/(email|invoice|proposal)/.test(slug))
    integrations.add("integration.email");
  if (/(voice|dialer)/.test(slug)) integrations.add("integration.telephony");
  if (/(sms|whatsapp)/.test(slug)) integrations.add("integration.messaging");
  if (/(knowledge|document|legal|clinical|tutor|stylist)/.test(slug))
    integrations.add("integration.knowledge-source");
  if (/(revenue|attribution|trading|sports|finance)/.test(slug))
    integrations.add("integration.analytics");
  if (/(workspace|agent|autonomous|byok|engineering|armalo)/.test(slug))
    integrations.add("integration.workspace");
  return [...integrations].sort();
};

const policyRefsFor = (slug: string): string[] => {
  const refs = new Set(["policy.public-claims", "policy.human-approval"]);
  if (/(finance|trading|sports)/.test(slug))
    refs.add("policy.no-autonomous-execution");
  if (/(legal|clinical)/.test(slug)) refs.add("policy.qualified-review");
  if (/(voice|dialer|sms|whatsapp|email)/.test(slug))
    refs.add("policy.consent-and-messaging");
  return [...refs].sort();
};

const evalRefsFor = (slug: string): string[] => {
  const refs = new Set([
    "eval.catalogue-contract",
    "eval.proof-boundary",
    "eval.approval-path",
  ]);
  if (/(finance|trading|sports|legal|clinical)/.test(slug))
    refs.add("eval.domain-safety");
  if (/(email|sms|voice|whatsapp|dialer)/.test(slug))
    refs.add("eval.integration-boundary");
  return [...refs].sort();
};

const makeRecord = ([
  slug,
  name,
  status,
  access,
  maturity,
  proof,
]: CatalogueSeed): LegoInventoryRecord => ({
  id: `lego.product.${slug}`,
  version: legoInventoryVersion,
  productSlug: slug,
  name,
  status,
  access,
  maturity,
  proof,
  capabilityFamilies: [
    "catalogue.product",
    `capability.${capabilityFamily(slug)}`,
  ].sort(),
  blockFamilies: [...commonBlocks],
  dependencies: [...commonDependencies],
  integrations: integrationsFor(slug),
  policyRefs: policyRefsFor(slug),
  evalRefs: evalRefsFor(slug),
  starterManifest: {
    path: `starters/${slug}/manifest.json`,
    id: `starter.${slug}`,
    version: legoInventoryVersion,
  },
  source: {
    path: `src/content/apps/${slug}.md`,
    loader: "astro-content-glob",
    lastVerified: "2026-07-15",
  },
});

export const canonicalLegoInventory: readonly LegoInventoryRecord[] =
  catalogueSeeds.map(makeRecord);

export function validateLegoInventory(
  records: readonly LegoInventoryRecord[],
): LegoInventoryRecord[] {
  const ids = new Set<string>();
  const slugs = new Set<string>();
  for (const record of records) {
    if (ids.has(record.id))
      throw new Error(`duplicate LEGO inventory id: ${record.id}`);
    if (slugs.has(record.productSlug))
      throw new Error(`duplicate LEGO product slug: ${record.productSlug}`);
    if (!record.id.startsWith("lego.product."))
      throw new Error(`unstable LEGO inventory id: ${record.id}`);
    if (record.maturity === "planned" && record.proof !== "not-yet-proven") {
      throw new Error(
        `planned product cannot claim proof: ${record.productSlug}`,
      );
    }
    ids.add(record.id);
    slugs.add(record.productSlug);
  }
  return [...records];
}

export const validatedCanonicalLegoInventory = validateLegoInventory(
  canonicalLegoInventory,
);
export const canonicalLegoProductCount = validatedCanonicalLegoInventory.length;
