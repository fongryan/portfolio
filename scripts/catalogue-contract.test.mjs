import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";
import yaml from "js-yaml";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

async function readCatalogueEntry(path) {
  const source = await read(path);
  const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  assert.ok(frontmatter, `${path} must contain YAML frontmatter`);

  const parsed = yaml.load(frontmatter[1]);
  const { appSchema } = await import("../src/content/app-schema.ts");
  const result = appSchema.safeParse(parsed);
  assert.equal(
    result.success,
    true,
    `${path} must satisfy appSchema: ${JSON.stringify(result.error?.issues)}`,
  );

  return { source, product: result.data };
}

const forbiddenProjectionPatterns = [
  /(?:["']\s*)?\boperator\b\s*(?:["'])?\s*:/i,
  /(?:["']\s*)?\bcapabilities\b\s*(?:["'])?\s*:/i,
  /(?:["']\s*)?\bprivateControlPlane\b\s*(?:["'])?\s*:/i,
  /\bdisallowedWithoutApproval\b/i,
  /\bMeta\s+Ads\b/i,
  /\bStripe\s+activation\b/i,
  /\bcredential\s+changes\b/i,
];

function assertPublicProjection(source) {
  for (const pattern of forbiddenProjectionPatterns) {
    assert.doesNotMatch(source, pattern);
  }
}

test("product actions follow access truth instead of maturity alone", async () => {
  const detail = await read("src/pages/apps/[slug].astro");

  assert.match(detail, /url\s*&&\s*access\s*!==\s*["']unavailable["']/);
  assert.doesNotMatch(detail, /status\s*===\s*["']live["']/);
  assert.match(detail, /ctaLabel/);
});

test("Girl Math points directly to its verified public product surface", async () => {
  const source = await read("src/content/apps/girl-math.md");

  assert.match(source, /url:\s*["']https:\/\/girl-math\.armalo\.ai["']/);
  assert.match(source, /status:\s*beta/);
  assert.match(source, /access:\s*public/);
  assert.match(source, /proof:\s*public-live/);
  assert.match(source, /flywheel:\s*launch/);
  assert.match(source, /lastVerified:\s*["']2026-07-15["']/);
  assert.match(source, /not live (seat )?availability/i);
});

test("AI Stylist is a bounded planned personal-style product", async () => {
  const [
    { source: entry, product },
    catalogueGroups,
    jsonProjection,
    markdownProjection,
  ] = await Promise.all([
    readCatalogueEntry("src/content/apps/ai-stylist.md"),
    read("src/lib/catalogue-groups.ts"),
    read("src/pages/agents/portfolio.json.ts"),
    read("src/pages/agents/portfolio.md.ts"),
  ]);

  assert.deepEqual(
    {
      name: product.name,
      status: product.status,
      access: product.access,
      proof: product.proof,
      flywheel: product.flywheel,
      category: product.category,
      audiences: product.audiences,
    },
    {
      name: "AI Stylist",
      status: "planned",
      access: "unavailable",
      proof: "not-yet-proven",
      flywheel: "build",
      category: "Personal style",
      audiences: [
        "Consumers",
        "Personal stylists",
        "Retailers",
        "Fashion brands",
      ],
    },
  );

  for (const pattern of [
    /wardrobe/i,
    /outfit/i,
    /shopping/i,
    /white-label|partner/i,
    /purchase|checkout/i,
    /inventory/i,
    /returns/i,
    /brand integrations/i,
    /explicit implementation/i,
    /human approval/i,
  ]) {
    assert.match(entry, pattern);
  }

  assert.match(catalogueGroups, /["']Personal style["']/);
  assert.match(jsonProjection, /getApps\(\)/);
  assert.match(markdownProjection, /getApps\(\)/);
});

test("commercial shortlist defines ten traceable, honestly planned priorities", async () => {
  const expected = [
    [
      "hermes-revenue-agents",
      "Hermes Revenue Agents",
      1,
      "Revenue operations",
      [
        "ai-acquisition-services-2025",
        "client-acquisition-build-release",
        "mckinsey-state-ai-2025",
      ],
    ],
    [
      "ai-customer-service-desk",
      "AI Customer Service Desk",
      2,
      "Customer service",
      ["mckinsey-state-ai-2025", "menlo-enterprise-ai-2025"],
    ],
    [
      "ai-dialer",
      "AI Dialer",
      3,
      "Revenue operations",
      ["client-acquisition-build-release", "mckinsey-state-ai-2025"],
    ],
    [
      "hermes-ai-crm",
      "Hermes AI CRM",
      4,
      "Revenue operations",
      ["ai-acquisition-services-2025", "mckinsey-state-ai-2025"],
    ],
    [
      "internal-knowledge-assistant",
      "Internal Knowledge Assistant",
      5,
      "Business operations",
      ["menlo-enterprise-ai-2025", "mckinsey-state-ai-2025"],
    ],
    [
      "ai-forward-deployed-engineer",
      "AI Forward Deployed Engineer",
      6,
      "AI engineering services",
      ["menlo-enterprise-ai-2025", "mckinsey-state-ai-2025"],
    ],
    [
      "ai-attribution-remarketing",
      "AI Attribution & Remarketing",
      7,
      "Marketing intelligence",
      ["hyros-attribution-remarketing", "mckinsey-state-ai-2025"],
    ],
    [
      "ai-digital-product-studio",
      "AI Digital Product Studio",
      8,
      "Creator commerce",
      ["monetise-product-terms", "mckinsey-state-ai-2025"],
    ],
    [
      "expert-knowledge-assistant",
      "Expert Knowledge Assistant",
      9,
      "Knowledge products",
      ["acquisition-acq-ai", "monetise-product-terms"],
    ],
    [
      "ai-stylist",
      "AI Stylist",
      10,
      "Personal style",
      ["a16z-ai-shopping-2025", "menlo-consumer-ai-2025"],
    ],
  ];

  const products = await Promise.all(
    expected.map(async ([slug]) =>
      readCatalogueEntry(`src/content/apps/${slug}.md`),
    ),
  );

  for (const [index, { product }] of products.entries()) {
    const [, name, commercialPriority, category, researchRefs] =
      expected[index];
    assert.deepEqual(
      {
        name: product.name,
        commercialPriority: product.commercialPriority,
        category: product.category,
        status: product.status,
        access: product.access,
        proof: product.proof,
        flywheel: product.flywheel,
        researchRefs: product.researchRefs,
      },
      {
        name,
        commercialPriority,
        category,
        status: "planned",
        access: "unavailable",
        proof: "not-yet-proven",
        flywheel: "build",
        researchRefs,
      },
    );
    assert.match(product.buyerHypothesis, /^Armalo hypothesis:/);
  }

  assert.deepEqual(
    products
      .map(({ product }) => product.commercialPriority)
      .sort((a, b) => a - b),
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  );

  const [jsonProjection, markdownProjection] = await Promise.all([
    read("src/pages/agents/portfolio.json.ts"),
    read("src/lib/portfolio-markdown.ts"),
  ]);
  for (const field of [
    "commercialPriority",
    "buyerHypothesis",
    "researchRefs",
  ]) {
    assert.match(jsonProjection, new RegExp(field));
    assert.match(markdownProjection, new RegExp(field));
  }
  assert.match(jsonProjection, /armalo\.portfolio\.catalogue\.v4/);
});

test("market-led research resolves shortlist evidence and keeps claims bounded", async () => {
  const [research, card, homepage, detail, catalogueGroups] = await Promise.all(
    [
      read("docs/market-led-ai-product-catalogue.md"),
      read("src/components/AppCard.astro"),
      read("src/pages/index.astro"),
      read("src/pages/apps/[slug].astro"),
      read("src/lib/catalogue-groups.ts"),
    ],
  );

  const sources = [
    [
      "ai-acquisition-services-2025",
      "https://www.aiacquisition.com/blog/top-5-most-profitable-ai-services-our-clients-are-selling",
    ],
    ["acquisition-acq-ai", "https://ai.acquisition.com/"],
    ["monetise-product-terms", "https://www.monetise.com/policy/terms"],
    [
      "client-acquisition-build-release",
      "https://book.clientacquisition.io/new",
    ],
    ["cook-ai-native-agency", "https://webby.trycook.ai/"],
    ["hyros-attribution-remarketing", "https://hyros.ai/"],
    [
      "menlo-enterprise-ai-2025",
      "https://menlovc.com/wp-content/uploads/2025/12/menlo_ventures_enterprise_ai_report-2025-121925.pdf",
    ],
    [
      "mckinsey-state-ai-2025",
      "https://www.mckinsey.com/~/media/mckinsey/business%20functions/quantumblack/our%20insights/the%20state%20of%20ai/2025/the-state-of-ai-how-organizations-are-rewiring-to-capture-value_final.pdf",
    ],
    ["a16z-ai-shopping-2025", "https://a16z.com/ai-shopping-online/"],
    [
      "menlo-consumer-ai-2025",
      "https://menlovc.com/perspective/2025-the-state-of-consumer-ai/",
    ],
  ];

  for (const [id, url] of sources) {
    assert.match(research, new RegExp(`^### ${id}$`, "m"));
    assert.ok(research.includes(url), `expected research URL ${url}`);
  }
  assert.match(research, /Accessed:\s*2026-07-15/g);
  assert.match(research, /HYROS, not Hyrox/);
  assert.match(research, /not affiliated|no affiliation/i);
  assert.match(research, /promotional\s+earnings claims/i);
  assert.match(
    research,
    /Willingness to pay for these Armalo products remains unproven\./,
  );

  assert.match(homepage, /Internal validation candidates/);
  assert.match(homepage, /Studio hypotheses/);
  assert.match(homepage, /not\s+the market-evidence\s+ranking/i);
  for (const category of [
    "Marketing intelligence",
    "Creator commerce",
    "Knowledge products",
  ]) {
    assert.match(catalogueGroups, new RegExp(`["']${category}["']`));
  }
  for (const source of [card, detail]) {
    assert.match(source, /commercialPriority/);
    assert.match(source, /buyerHypothesis/);
    assert.match(source, /Our buyer hypothesis|Commercial priority/);
  }
});

test("AI Forward Deployed Engineer is a deeply documented hybrid planned offer", async () => {
  const [entry, operatingModel, catalogueGroups] = await Promise.all([
    read("src/content/apps/ai-forward-deployed-engineer.md"),
    read("docs/ai-forward-deployed-engineer.md"),
    read("src/lib/catalogue-groups.ts"),
  ]);

  const frontmatter = entry.match(/^---\n([\s\S]*?)\n---/);
  assert.ok(frontmatter, "expected YAML frontmatter");
  const parsed = yaml.load(frontmatter[1]);
  const { appSchema } = await import("../src/content/app-schema.ts");
  const product = appSchema.parse(parsed);

  assert.equal(product.name, "AI Forward Deployed Engineer");
  assert.equal(product.status, "planned");
  assert.equal(product.access, "unavailable");
  assert.equal(product.proof, "not-yet-proven");
  assert.deepEqual(product.audiences, [
    "AI startups",
    "Software companies",
    "Small businesses",
    "Brick-and-mortar operators",
  ]);
  assert.match(`${product.description} ${product.salesPosition}`, /human/i);
  assert.match(`${product.description} ${product.salesPosition}`, /AI agents/i);
  assert.match(entry, /human FDE remains responsible/i);
  assert.match(entry, /AI agents accelerate/i);
  assert.match(entry, /docs\/ai-forward-deployed-engineer\.md/);
  assert.match(catalogueGroups, /["']AI engineering services["']/);

  for (const section of [
    "What an AI FDE is",
    "Who it is for",
    "Engagement lifecycle",
    "Evaluation and proof",
    "Security and authority",
    "Commercial shapes",
    "Research sources",
  ]) {
    assert.match(operatingModel, new RegExp(`## ${section}`));
  }
  assert.ok(operatingModel.length > 20_000, "expected a deep operating model");
});

test("Invoice Chaser is a bounded planned quote-to-cash product", async () => {
  const { source: entry, product } = await readCatalogueEntry(
    "src/content/apps/invoice-chaser.md",
  );
  assert.deepEqual(
    {
      name: product.name,
      status: product.status,
      access: product.access,
      proof: product.proof,
      flywheel: product.flywheel,
      audiences: product.audiences,
      deliveryModes: product.deliveryModes,
      offerModes: product.offerModes,
    },
    {
      name: "Invoice Chaser",
      status: "planned",
      access: "unavailable",
      proof: "not-yet-proven",
      flywheel: "build",
      audiences: [
        "Freelancers",
        "Agencies",
        "Professional services firms",
        "Finance teams",
      ],
      deliveryModes: ["hosted", "custom-build", "dfy", "licensed"],
      offerModes: ["pilot", "team", "agency", "enterprise"],
    },
  );
  assert.match(entry, /overdue|paid faster|cash flow/i);
  assert.match(entry, /approval|escalat|dispute/i);
  assert.match(
    entry,
    /\]\(\/research\/ai-products-buyers-and-hermes-quote-to-cash\)/,
  );
  assert.doesNotMatch(entry, /quote-to-cash\/\)/);
  assert.doesNotMatch(
    entry,
    /(?:is|now|currently) (?:live|deployed|generally available)/i,
  );
});

test("Proposal Generator is a bounded planned quote-to-cash product", async () => {
  const { source: entry, product } = await readCatalogueEntry(
    "src/content/apps/proposal-generator.md",
  );
  assert.deepEqual(
    {
      name: product.name,
      status: product.status,
      access: product.access,
      proof: product.proof,
      flywheel: product.flywheel,
      audiences: product.audiences,
      deliveryModes: product.deliveryModes,
      offerModes: product.offerModes,
    },
    {
      name: "Proposal Generator",
      status: "planned",
      access: "unavailable",
      proof: "not-yet-proven",
      flywheel: "build",
      audiences: ["Agencies", "Consultancies", "Freelancers", "Sales teams"],
      deliveryModes: ["hosted", "custom-build", "dfy", "licensed"],
      offerModes: ["pilot", "team", "agency", "enterprise"],
    },
  );
  assert.match(entry, /proposal|scope|pricing|close/i);
  assert.match(entry, /approval|review|authoritative/i);
  assert.match(
    entry,
    /\]\(\/research\/ai-products-buyers-and-hermes-quote-to-cash\)/,
  );
  assert.doesNotMatch(entry, /quote-to-cash\/\)/);
  assert.doesNotMatch(
    entry,
    /(?:is|now|currently) (?:live|deployed|generally available)/i,
  );
});

test("Autonomous Business and its revenue workforce are distinct honest catalogue offers", async () => {
  const expected = [
    ["autonomous-business", "Autonomous Business", "Business operations"],
    ["ai-lead-generation", "AI Lead Generation", "Revenue operations"],
    ["ai-qualifier", "AI Qualifier", "Revenue operations"],
    ["ai-setter", "AI Setter", "Revenue operations"],
    ["ai-dialer", "AI Dialer", "Revenue operations"],
    ["ai-salesman", "AI Salesman", "Revenue operations"],
  ];

  const products = await Promise.all(
    expected.map(async ([slug]) =>
      readCatalogueEntry(`src/content/apps/${slug}.md`),
    ),
  );

  for (const [index, { source, product }] of products.entries()) {
    const [, name, category] = expected[index];
    assert.deepEqual(
      {
        name: product.name,
        category: product.category,
        status: product.status,
        access: product.access,
        proof: product.proof,
        flywheel: product.flywheel,
      },
      {
        name,
        category,
        status: "planned",
        access: "unavailable",
        proof: "not-yet-proven",
        flywheel: "build",
      },
    );
    assert.match(source, /planned|not (?:yet )?live|does not claim/i);
    assert.match(source, /Autonomous\s+Business suite/i);
  }

  await assert.rejects(
    access(
      new URL(
        "../src/content/apps/lead-qualification-assistant.md",
        import.meta.url,
      ),
    ),
    { code: "ENOENT" },
    "AI Qualifier must replace the duplicate legacy qualification card",
  );
});

test("autonomous business strategy defines a governed learning company, not a vague autopilot claim", async () => {
  const [strategy, catalogueGroups] = await Promise.all([
    read("docs/autonomous-business-suite.md"),
    read("src/lib/catalogue-groups.ts"),
  ]);

  for (const section of [
    "Product thesis",
    "Why this beats a generic AI co-founder",
    "The product architecture",
    "Revenue workforce",
    "Autonomous operating loop",
    "Authority and safety model",
    "Evidence and operator visibility",
    "Learning system",
    "Commercial packaging",
    "Unit economics",
    "Launch sequence",
    "Outcome contracts",
    "Public claim boundaries",
    "Research basis",
  ]) {
    assert.match(strategy, new RegExp(`## ${section}`));
  }

  assert.match(strategy, /Polsia/i);
  assert.match(strategy, /lead generation/i);
  assert.match(strategy, /qualifier/i);
  assert.match(strategy, /setter/i);
  assert.match(strategy, /dialer/i);
  assert.match(strategy, /salesman/i);
  assert.match(strategy, /human approval|approval gate/i);
  assert.match(strategy, /receipt|evidence/i);
  assert.match(strategy, /feedback|learn/i);
  assert.match(catalogueGroups, /["']Business operations["']/);
  assert.match(catalogueGroups, /["']Revenue operations["']/);
});

test("quote-to-cash research route documents buyers, products, and bounded Hermes execution", async () => {
  const research = await read(
    "src/pages/research/ai-products-buyers-and-hermes-quote-to-cash.astro",
  );
  const [invoiceChaser, proposalGenerator] = await Promise.all([
    read("src/content/apps/invoice-chaser.md"),
    read("src/content/apps/proposal-generator.md"),
  ]);

  for (const section of [
    "Market conclusion",
    "What buyers are buying",
    "Who buys",
    "Ranked opportunities",
    "Invoice Chaser product",
    "Proposal Generator product",
    "Quote-to-cash connection",
    "Buyer, package, and metrics",
    "Hermes autonomy contract",
    "Goal contract: Invoice Chaser",
    "Goal contract: Proposal Generator",
    "Task graphs",
    "Approvals and stop conditions",
    "Deterministic proof and evidence receipts",
    "Retry, lease, fencing, and idempotency rules",
    "Capability and verification boundaries",
    "Rollout sequence",
    "Sources",
  ]) {
    const escapedSection = section.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    assert.match(research, new RegExp(`>\\s*${escapedSection}\\s*<`));
  }

  assert.ok(research.length > 20_000, "expected a deep public research route");
  assert.match(research, /planned/i);
  assert.match(research, /unavailable/i);
  assert.match(research, /not yet proven/i);
  assert.match(research, /our (?:inference|hypothesis)/i);
  assert.match(research, /not\s+direct\s+purchase\s+proof/i);
  assert.match(
    research,
    /willingness\s+to\s+pay\s+for\s+(?:these|the)\s+Armalo\s+(?:offers|products)\s+(?:is|remains)\s+unproven/i,
  );

  for (const source of [
    "https://www.mckinsey.com/~/media/mckinsey/business%20functions/quantumblack/our%20insights/the%20state%20of%20ai/2025/the-state-of-ai-how-organizations-are-rewiring-to-capture-value_final.pdf",
    "https://www.pwc.com/us/en/tech-effect/ai-analytics/ai-agent-survey.html",
    "https://www.upwork.com/research/in-demand-skills-2025",
    "https://www.uschamber.com/technology/artificial-intelligence/u-s-chambers-latest-empowering-small-business-report-shows-majority-of-businesses-in-all-50-states-are-embracing-ai",
    "https://quickbooks.intuit.com/r/small-business-data/small-business-late-payments-report-2025/",
    "https://qwilr.com/",
    "https://www.kolleno.com/",
    "https://www.pandadoc.com/blog/proposal-software/",
    "https://www.upwork.com/research/ai-impact-work-categories",
  ]) {
    assert.match(
      research,
      new RegExp(source.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
    );
  }

  assert.doesNotMatch(research, /client:/);
  assert.doesNotMatch(research, /<script\b/i);
  assert.equal(
    [...research.matchAll(/<caption\b/g)].length,
    3,
    "each research table must have a caption",
  );
  assert.equal(
    [
      ...research.matchAll(
        /<div\s+[^>]*class="table-wrap"[^>]*role="region"[^>]*aria-label=/g,
      ),
    ].length,
    3,
    "each horizontal table region must have an accessible label",
  );
  for (const product of [invoiceChaser, proposalGenerator]) {
    assert.match(
      product,
      /\]\(\/research\/ai-products-buyers-and-hermes-quote-to-cash\)/,
    );
  }
});

test("public catalogue machine surfaces contain catalogue truth only", async () => {
  const [json, markdown] = await Promise.all([
    read("src/pages/agents/portfolio.json.ts"),
    read("src/pages/agents/portfolio.md.ts"),
  ]);
  const combined = `${json}\n${markdown}`;

  for (const required of [
    "access",
    "proof",
    "flywheel",
    "lastVerified",
    "ctaLabel",
    "highlights",
  ]) {
    assert.match(combined, new RegExp(required));
  }

  assertPublicProjection(combined);
});

test("public projection guard catches quoted and spaced forbidden keys", () => {
  for (const fixture of [
    '{ "operator": {} }',
    "{ 'capabilities' : {} }",
    '{ "privateControlPlane"\n: "https://example.com" }',
  ]) {
    assert.throws(() => assertPublicProjection(fixture));
  }
});

test("Markdown catalogue projects product tags", async () => {
  const [route, renderer] = await Promise.all([
    read("src/pages/agents/portfolio.md.ts"),
    read("src/lib/portfolio-markdown.ts"),
  ]);

  assert.match(route, /renderCatalogueProductMarkdown/);
  assert.match(renderer, /- Tags:/);
  assert.match(renderer, /data\.tags\.map/);
});

test("global navigation resolves homepage sections from every page", async () => {
  const source = await read("src/components/SiteHeader.astro");
  assert.match(source, /href=["']\/#work["']/);
  assert.match(source, /href=["']\/#about["']/);
  assert.match(source, /href=["']\/flywheel["']/);
});

test("the portfolio no longer owns a private Girl Math invocation route", async () => {
  const retiredFiles = [
    "src/pages/agents/girl-math.md.ts",
    "scripts/invoke-girl-math.mjs",
    "scripts/invoke-girl-math.test.mjs",
    "docs/agents/girl-math-runtime.md",
    "docs/agents/portfolio-hermes-runtime.md",
  ];
  await Promise.all(
    retiredFiles.map((path) =>
      assert.rejects(access(new URL(`../${path}`, import.meta.url)), {
        code: "ENOENT",
      }),
    ),
  );

  const packageSource = await read("package.json");
  assert.doesNotMatch(packageSource, /invoke:girl-math|test:hermes/);
});

test("catalogue schema rejects impossible maturity and proof pairs", async () => {
  const { appSchema } = await import("../src/content/app-schema.ts");
  const base = {
    name: "Contract fixture",
    url: "https://example.com/product",
    category: "Example",
    description: "A deterministic catalogue contract fixture.",
    year: 2026,
    tags: [],
    access: "public",
    lastVerified: "2026-07-15",
    flywheel: "launch",
    audiences: ["Fixture buyers"],
    deliveryModes: ["hosted"],
    offerModes: ["pilot"],
    salesPosition: "A concise public-safe sales position.",
    ctaLabel: "Open fixture",
    highlights: ["A concise, public-safe product highlight."],
  };

  const expected = {
    planned: ["not-yet-proven"],
    wip: ["not-yet-proven", "source-tested"],
    beta: ["source-tested", "runtime-verified", "public-live"],
    live: ["public-live", "business-verified"],
  };
  const proofs = [
    "not-yet-proven",
    "source-tested",
    "runtime-verified",
    "public-live",
    "business-verified",
  ];
  const flywheelForStatus = {
    planned: "build",
    wip: "build",
    beta: "launch",
    live: "launch",
  };

  for (const [status, allowed] of Object.entries(expected)) {
    for (const proof of proofs) {
      assert.equal(
        appSchema.safeParse({
          ...base,
          status,
          proof,
          flywheel: flywheelForStatus[status],
        }).success,
        allowed.includes(proof),
        `${status} + ${proof}`,
      );
    }
  }

  assert.equal(
    appSchema.safeParse({
      ...base,
      url: "http://example.com/product",
      status: "beta",
      proof: "public-live",
    }).success,
    false,
  );
  assert.equal(
    appSchema.safeParse({
      ...base,
      url: undefined,
      status: "beta",
      proof: "public-live",
    }).success,
    false,
  );
  assert.equal(
    appSchema.safeParse({
      ...base,
      lastVerified: "2999-01-01",
      status: "beta",
      proof: "public-live",
    }).success,
    false,
  );
});

test("catalogue schema keeps flywheel stages honest against maturity and proof", async () => {
  const { appSchema } = await import("../src/content/app-schema.ts");
  const base = {
    name: "Contract fixture",
    url: "https://example.com/product",
    category: "Example",
    description: "A deterministic catalogue contract fixture.",
    year: 2026,
    tags: [],
    access: "public",
    lastVerified: "2026-07-15",
    audiences: ["Fixture buyers"],
    deliveryModes: ["hosted"],
    offerModes: ["pilot"],
    salesPosition: "A concise public-safe sales position.",
    ctaLabel: "Open fixture",
    highlights: ["A concise, public-safe product highlight."],
  };

  const expected = {
    planned: ["build"],
    wip: ["build"],
    beta: ["launch", "acquire", "monetize"],
    live: ["launch", "acquire", "monetize", "compound"],
  };
  const proofForStatus = {
    planned: "not-yet-proven",
    wip: "not-yet-proven",
    beta: "public-live",
    live: "business-verified",
  };
  const stages = ["build", "launch", "acquire", "monetize", "compound"];

  for (const [status, allowed] of Object.entries(expected)) {
    for (const flywheel of stages) {
      assert.equal(
        appSchema.safeParse({
          ...base,
          status,
          proof: proofForStatus[status],
          flywheel,
        }).success,
        allowed.includes(flywheel),
        `${status} + ${flywheel}`,
      );
    }
  }

  // The compounding claim is a revenue claim: it demands business-verified
  // proof even when the maturity pairing alone would allow it.
  assert.equal(
    appSchema.safeParse({
      ...base,
      status: "live",
      proof: "public-live",
      flywheel: "compound",
    }).success,
    false,
  );
  // A stage is required: a product cannot sit off the board.
  assert.equal(
    appSchema.safeParse({
      ...base,
      status: "beta",
      proof: "public-live",
    }).success,
    false,
  );
});

test("catalogue schema rejects control characters in inline fields", async () => {
  const { appSchema } = await import("../src/content/app-schema.ts");
  const base = {
    name: "Contract fixture",
    url: "https://example.com/product",
    status: "beta",
    access: "public",
    proof: "public-live",
    flywheel: "launch",
    lastVerified: "2026-07-15",
    category: "Example",
    description: "A deterministic catalogue contract fixture.",
    year: 2026,
    tags: ["fixture"],
    audiences: ["Fixture buyers"],
    deliveryModes: ["hosted"],
    offerModes: ["pilot"],
    salesPosition: "A concise public-safe sales position.",
    owner: "Example owner",
    platform: "Example platform",
    ctaLabel: "Open fixture",
    highlights: ["A concise, public-safe product highlight."],
  };

  for (const [field, hostile] of [
    ["name", "Product\n## Forged heading"],
    ["category", "Travel\r- Forged list"],
    ["description", "Description\u2028## Forged heading"],
    ["owner", "Owner\u0000hidden"],
    ["platform", "Platform\u2029- Forged list"],
    ["ctaLabel", "Open\n[forged](https://example.com)"],
    ["salesPosition", "Position\n- forged list"],
  ]) {
    assert.equal(
      appSchema.safeParse({ ...base, [field]: hostile }).success,
      false,
      field,
    );
  }
  assert.equal(
    appSchema.safeParse({ ...base, tags: ["safe\n- forged"] }).success,
    false,
  );
  assert.equal(
    appSchema.safeParse({ ...base, highlights: ["safe\n## forged"] }).success,
    false,
  );
});

test("Markdown projection escapes hostile inline syntax", async () => {
  const { renderCatalogueProductMarkdown } =
    await import("../src/lib/portfolio-markdown.ts");
  const rendered = renderCatalogueProductMarkdown("hostile-slug", {
    name: "Product **forged** [link](https://example.com)",
    url: "https://example.com/product",
    status: "beta",
    access: "public",
    proof: "public-live",
    flywheel: "launch",
    lastVerified: "2026-07-15",
    category: "Travel # forged",
    description: "Try `code` or <unsafe> markup.",
    year: 2026,
    tags: ["points*", "[award]"],
    audiences: ["Example buyers"],
    deliveryModes: ["hosted"],
    offerModes: ["pilot"],
    salesPosition: "A concise, public-safe sales position.",
    owner: "Owner_underscore",
    platform: "Public | private",
    ctaLabel: "Open [now]",
    highlights: ["No **forged emphasis** or [link](https://example.com)."],
  });

  assert.doesNotMatch(rendered, /\*\*forged\*\*/);
  assert.doesNotMatch(rendered, /\[link\]\(https:\/\/example\.com\)/);
  assert.doesNotMatch(rendered, /`code`|<unsafe>/);
  assert.match(rendered, /Product \\\*\\\*forged\\\*\\\*/);
  assert.match(rendered, /\\\[link\\\]\\\(https:\/\/example\.com\\\)/);
  assert.match(rendered, /Public \\\| private/);
});

test("Markdown projection cannot terminate slug formatting with a backtick", async () => {
  const { renderCatalogueProductMarkdown } =
    await import("../src/lib/portfolio-markdown.ts");
  const rendered = renderCatalogueProductMarkdown("hostile`slug", {
    name: "Product",
    url: "https://example.com/product",
    status: "beta",
    access: "public",
    proof: "public-live",
    flywheel: "launch",
    lastVerified: "2026-07-15",
    category: "Travel",
    description: "A safe product description.",
    year: 2026,
    tags: ["points"],
    audiences: ["Example buyers"],
    deliveryModes: ["hosted"],
    offerModes: ["pilot"],
    salesPosition: "A concise, public-safe sales position.",
    owner: "Owner",
    platform: "Platform",
    ctaLabel: "Open product",
    highlights: ["A safe product highlight."],
  });

  assert.match(rendered, /- Slug: hostile\\`slug/);
  assert.doesNotMatch(rendered, /- Slug: `[^\n]*`/);
});
