export type MarketingLens =
  | "outcome-installation"
  | "constraint-offer"
  | "expertise-product"
  | "encoded-playbook"
  | "evidence-loop";

export type MarketingProduct = {
  slug: string;
  name: string;
  status: "live" | "beta" | "wip" | "planned";
  proof: string;
  category: string;
  description: string;
  audiences: string[];
  deliveryModes: string[];
  offerModes: string[];
  salesPosition: string;
  ctaLabel: string;
  highlights: string[];
};

export type MarketingMechanic = {
  lens: MarketingLens;
  label: string;
  researchReference: string;
  principle: string;
  adaptation: string;
  sourceUrl: `https://${string}`;
  disclosure: string;
};

export type MarketingCampaign = {
  lens: MarketingLens;
  campaignName: string;
  headline: string;
  offer: string;
  mechanism: string;
  proofPlan: string;
  objection: string;
  response: string;
  cta: string;
  emailSubject: string;
  socialHook: string;
  landingLead: string;
};

export type ProductMarketingPack = {
  slug: string;
  name: string;
  category: string;
  status: MarketingProduct["status"];
  proof: string;
  audience: string;
  claimBoundary: string;
  campaigns: MarketingCampaign[];
};

export const marketingMechanics: MarketingMechanic[] = [
  {
    lens: "outcome-installation",
    label: "Outcome installation",
    researchReference: "Jordan Lee / AI Acquisition",
    principle:
      "Package one repeatable business outcome as a scoped installation, then earn recurring work through transparent operation and optimization.",
    adaptation:
      "Original Armalo adaptation: narrow the workflow, specify what is installed, define acceptance tests, and keep customer authority explicit.",
    sourceUrl:
      "https://www.aiacquisition.com/blog/top-5-most-profitable-ai-services-our-clients-are-selling",
    disclosure:
      "Research reference only. Armalo is not affiliated with AI Acquisition, and this is not an endorsement.",
  },
  {
    lens: "constraint-offer",
    label: "Constraint offer",
    researchReference: "Alex Hormozi / Acquisition.com",
    principle:
      "Lead with the costly constraint, make the path to value legible, and surround the tool with diagnosis, implementation, and proof.",
    adaptation:
      "Original Armalo adaptation: name one measurable bottleneck and offer the smallest credible intervention that can change it.",
    sourceUrl: "https://ai.acquisition.com/",
    disclosure:
      "Research reference only. Armalo is not affiliated with Acquisition.com, and this is not an endorsement.",
  },
  {
    lens: "expertise-product",
    label: "Expertise product",
    researchReference: "Iman Gadzhi / Monetise",
    principle:
      "Turn owned expertise into a coherent offer ladder that connects education, product, delivery, and continued support.",
    adaptation:
      "Original Armalo adaptation: use owned or licensed knowledge, preserve the expert's authorship, and validate demand before scaling distribution.",
    sourceUrl: "https://www.monetise.com/policy/terms",
    disclosure:
      "Research reference only. Armalo is not affiliated with Monetise or Iman Gadzhi, and this is not an endorsement.",
  },
  {
    lens: "encoded-playbook",
    label: "Encoded playbook",
    researchReference: "Serge Gatari / Cook.ai",
    principle:
      "Encode the best operator's judgment into reusable infrastructure so delivery compounds instead of restarting from prompts and memory.",
    adaptation:
      "Original Armalo adaptation: make the playbook inspectable, tenant-isolated, versioned, and accountable to real acceptance tests.",
    sourceUrl: "https://webby.trycook.ai/",
    disclosure:
      "Research reference only. Armalo is not affiliated with Cook.ai or Serge Gatari, and this is not an endorsement.",
  },
  {
    lens: "evidence-loop",
    label: "Evidence loop",
    researchReference: "Alex Becker / HYROS",
    principle:
      "Instrument the journey from action to revenue so the system can learn which work deserves more investment and which does not.",
    adaptation:
      "Original Armalo adaptation: distinguish observed signals, modeled attribution, verified outcomes, and genuine incrementality.",
    sourceUrl: "https://hyros.ai/",
    disclosure:
      "Research reference only. Armalo is not affiliated with HYROS or Alex Becker, and this is not an endorsement.",
  },
];

function statusBoundary(product: MarketingProduct): string {
  if (product.status === "planned") {
    return `${product.name} is planned catalogue inventory and not yet proven live. The copy below is a campaign starter, not a claim of availability, customer results, or verified demand.`;
  }
  if (product.status === "wip") {
    return `${product.name} is work in progress. Any public claim must remain inside its current ${product.proof} proof level until runtime evidence supports more.`;
  }
  if (product.status === "beta") {
    return `${product.name} is a beta product. Market the verified workflow and its ${product.proof} proof only; do not imply broad availability or business outcomes.`;
  }
  return `${product.name} is live, but campaign claims must still match its ${product.proof} proof and the evidence available for the buyer's exact workflow.`;
}

function audience(product: MarketingProduct): string {
  return product.audiences[0] ?? "operating teams";
}

function job(product: MarketingProduct): string {
  return (
    product.highlights[0]?.replace(/[.]$/, "") ??
    product.description.replace(/[.]$/, "")
  );
}

function channel(product: MarketingProduct): string {
  const mode = product.deliveryModes[0]?.replaceAll("-", " ") ?? "scoped";
  return `${mode} ${product.offerModes[0] ?? "pilot"}`;
}

function buildCampaigns(product: MarketingProduct): MarketingCampaign[] {
  const buyer = audience(product);
  const coreJob = job(product);
  const offerShape = channel(product);

  return [
    {
      lens: "outcome-installation",
      campaignName: `${product.name}: the installed outcome`,
      headline: `${product.name}, installed around one working outcome—not another AI subscription.`,
      offer: `For ${buyer}: a ${offerShape} that starts with “${coreJob},” then configures the workflow, permissions, handoffs, and operating owner around it.`,
      mechanism: `Map the current ${product.category.toLowerCase()} workflow, install the minimum ${product.name} capability, test representative cases, train the owner, and separate the fixed installation from any optional managed operation.`,
      proofPlan: `Baseline cycle time, backlog, error rate, or conversion before the ${product.name} pilot; verify the same measure after a bounded acceptance test and retain the receipts.`,
      objection: `“We do not need another platform that creates more work for the team.”`,
      response: `${product.name} is positioned as an installed workflow with a named owner and acceptance test. If it cannot remove a specific burden, the scope does not expand.`,
      cta: `Scope the smallest ${product.name} installation worth proving.`,
      emailSubject: `${product.name}: one workflow, installed and measured`,
      socialHook: `Most teams do not need more AI access. They need ${product.name} installed around one job, one owner, and one acceptance test.`,
      landingLead: `${product.description} Start with a bounded installation, prove the operating result, then decide whether continued optimization deserves a retainer.`,
    },
    {
      lens: "constraint-offer",
      campaignName: `${product.name}: remove the constraint`,
      headline: `The constraint is not “we need AI.” It is the work ${product.name} can make measurable.`,
      offer: `${product.name} begins with a diagnostic for ${buyer}, isolates the most expensive repeatable constraint, and packages the intervention around a result the buyer can inspect.`,
      mechanism: `Identify where ${product.category.toLowerCase()} work queues, stalls, leaks, or depends on memory; choose one constraint, define the authority boundary, and configure ${product.name} only around that point.`,
      proofPlan: `Record the constraint's baseline cost, volume, delay, or loss; measure the pilot against a pre-agreed threshold and verify exceptions instead of hiding them in an average.`,
      objection: `“This sounds broad, expensive, and difficult to adopt.”`,
      response: `The ${product.name} offer is intentionally narrow: one constraint, one accountable owner, one measurement window, and a stop decision before broader rollout.`,
      cta: `Diagnose the first constraint ${product.name} should remove.`,
      emailSubject: `Where is ${product.name} worth deploying first?`,
      socialHook: `“Add AI” is not a strategy. Find the operating constraint, price the drag, and give ${product.name} one measurable job.`,
      landingLead: `${product.salesPosition} The offer is strongest when the buyer can point to the before state, the intervention, and the evidence required to continue.`,
    },
    {
      lens: "expertise-product",
      campaignName: `${product.name}: expertise into an offer`,
      headline: `Turn the way your best people handle this work into a ${product.name} offer the whole team can use.`,
      offer: `For ${buyer}, ${product.name} packages approved knowledge, operating guidance, reusable assets, and supported delivery into a ladder that can start small and deepen after proof.`,
      mechanism: `Collect owned source material, interview the people responsible for ${product.category.toLowerCase()}, structure their decisions into a guided ${product.name} workflow, and keep expert review visible at consequential steps.`,
      proofPlan: `Test the ${product.name} workflow with real representative users; measure task completion, correction rate, time saved, and whether users return without being pushed.`,
      objection: `“Our expertise is too nuanced to flatten into templates or generic AI copy.”`,
      response: `${product.name} should preserve source attribution, uncertainty, and expert approval. The product distributes judgment; it does not borrow an identity or erase the author.`,
      cta: `Choose the first piece of expertise ${product.name} should productize.`,
      emailSubject: `Package your best operating knowledge with ${product.name}`,
      socialHook: `Your best operator already has a product in their head. ${product.name} can turn the repeatable parts into an offer without pretending nuance disappeared.`,
      landingLead: `${product.description} Build the first version from owned knowledge, test whether it helps a real audience, and earn the right to add education, service, licensing, or support.`,
    },
    {
      lens: "encoded-playbook",
      campaignName: `${product.name}: the compounding playbook`,
      headline: `Stop rebuilding ${product.name} from prompts. Encode the playbook your operation can improve.`,
      offer: `${product.name} becomes a reusable operating layer for ${buyer}: versioned instructions, approved data, integrations, decision rules, evaluation cases, and explicit escalation paths.`,
      mechanism: `Observe how the best operator performs “${coreJob},” encode the stable decisions, isolate customer data and permissions, and improve the ${product.name} playbook from reviewed exceptions.`,
      proofPlan: `Run a fixed evaluation set before each ${product.name} release; compare accuracy, escalation quality, latency, cost, and operator corrections with versioned evidence.`,
      objection: `“A reusable system will become rigid or leak context between clients and teams.”`,
      response: `${product.name} separates the reusable playbook from tenant-specific data, credentials, policy, and authority. Reuse compounds the method—not private context.`,
      cta: `Map the playbook ${product.name} should encode first.`,
      emailSubject: `Make ${product.name} improve with every reviewed case`,
      socialHook: `Prompts are disposable. A versioned ${product.name} playbook—rules, cases, boundaries, receipts—can become operating leverage.`,
      landingLead: `${product.salesPosition} The durable asset is not a clever prompt; it is a governed playbook that survives staff changes and gets better from evidence.`,
    },
    {
      lens: "evidence-loop",
      campaignName: `${product.name}: prove what compounds`,
      headline: `If ${product.name} cannot connect its work to an observable result, it does not get credit.`,
      offer: `Give ${buyer} a ${product.name} deployment with measurement designed in: consented events, workflow receipts, outcome definitions, review queues, and a decision rule for what happens next.`,
      mechanism: `Instrument the path from ${product.name} input to action to outcome; distinguish direct observations from modeled influence, preserve failed cases, and feed verified findings into the next operating decision.`,
      proofPlan: `Define the baseline and attribution limits before launch, measure leading and lagging indicators, verify data coverage, and use a holdout or comparable check when causality matters.`,
      objection: `“Attribution will overstate the system's impact and turn noisy activity into a success story.”`,
      response: `${product.name} should label what was observed, inferred, and independently verified. Uncertain attribution is a reason to improve the test—not manufacture certainty.`,
      cta: `Design the evidence loop for the first ${product.name} pilot.`,
      emailSubject: `What evidence would make ${product.name} worth expanding?`,
      socialHook: `The useful question is not whether ${product.name} ran. It is what changed, what evidence connects the change, and what decision that evidence supports.`,
      landingLead: `${product.description} Instrument the journey before scaling so the buyer can protect what works, stop what does not, and separate activity from verified value.`,
    },
  ];
}

export function buildMarketingPack(
  product: MarketingProduct,
): ProductMarketingPack {
  return {
    slug: product.slug,
    name: product.name,
    category: product.category,
    status: product.status,
    proof: product.proof,
    audience: audience(product),
    claimBoundary: statusBoundary(product),
    campaigns: buildCampaigns(product),
  };
}

export function buildMarketingLibrary(
  products: MarketingProduct[],
): ProductMarketingPack[] {
  return products.map(buildMarketingPack);
}
