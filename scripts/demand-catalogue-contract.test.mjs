import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";
import yaml from "js-yaml";

import {
  businessDemandProducts,
  consumerLabSlugs,
  operatorPatterns,
} from "../src/lib/demand-catalogue.ts";
import {
  buildCatalogueGroups,
  preferredCatalogueCategories,
} from "../src/lib/catalogue-groups.ts";
import { appSchema } from "../src/content/app-schema.ts";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

const rankedSlugs = [
  "email-customer-service",
  "document-operations-agent",
  "voice-customer-service",
  "ai-qualifier",
  "internal-knowledge-assistant",
  "finance-operations-assistant",
  "marketing-campaign-studio",
  "software-engineering-copilot",
  "legal-advice-assistant",
  "clinical-documentation-assistant",
];

const consumerSlugs = [
  "ai-stylist",
  "personal-tutor",
  "personal-finance-assistant",
  "girl-math",
];

const scoreDimensions = [
  "urgency",
  "repeatability",
  "timeToValue",
  "feasibility",
  "complianceSafety",
  "proofability",
];

const scoreMatrix = [
  [5, 5, 5, 4, 4, 5, 28],
  [5, 5, 4, 4, 4, 5, 27],
  [5, 5, 5, 4, 3, 4, 26],
  [5, 5, 5, 4, 2, 4, 25],
  [4, 5, 4, 4, 4, 4, 25],
  [5, 5, 4, 4, 2, 4, 24],
  [4, 5, 5, 5, 2, 3, 24],
  [4, 5, 4, 3, 4, 3, 23],
  [4, 4, 3, 3, 2, 4, 20],
  [5, 5, 4, 2, 1, 1, 18],
];

const operatorPrimaryUrls = [
  "https://ai.acquisition.com/",
  "https://vantage.acquisition.com/",
  "https://www.acquisition.com/workshop-ai-accelerator",
  "https://www.aiacquisition.com/platform",
  "https://www.aiacquisition.com/blog/ai-agency",
  "https://www.aiacquisition.com/terms-of-service",
  "https://trycook.ai/",
  "https://webby.trycook.ai/",
  "https://trycook.ai/terms",
  "https://www.monetise.com/waitlist",
  "https://www.flozy.com/",
  "https://educate.io/archives/terms-and-conditions",
  "https://hyros.com/",
  "https://hyros.com/air",
  "https://hyros.com/agency",
];

const demandedProducts = [
  ["document-operations-agent", "Document Operations Agent"],
  ["finance-operations-assistant", "Finance Operations Assistant"],
  ["marketing-campaign-studio", "Marketing Campaign Studio"],
  ["software-engineering-copilot", "Software Engineering Copilot"],
  ["clinical-documentation-assistant", "Clinical Documentation Assistant"],
  ["business-constraint-finder", "Business Constraint Finder"],
  ["ai-digital-product-studio", "AI Digital Product Studio"],
  ["revenue-intelligence-platform", "Revenue Intelligence Platform"],
  ["lead-recovery-operator", "Lead Recovery Operator"],
];

async function readCatalogueEntry(slug) {
  const source = await read(`src/content/apps/${slug}.md`);
  const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  assert.ok(frontmatter, `${slug} must contain YAML frontmatter`);
  const result = appSchema.safeParse(yaml.load(frontmatter[1]));
  assert.equal(
    result.success,
    true,
    `${slug} must satisfy appSchema: ${JSON.stringify(result.error?.issues)}`,
  );
  return { source, product: result.data };
}

function assertContainsAll(source, patterns, label) {
  for (const pattern of patterns) {
    assert.match(source, pattern, `${label} must include ${pattern}`);
  }
}

test("demand catalogue has ten ranked evidence-backed business products", async () => {
  assert.deepEqual(
    businessDemandProducts.map((product) => product.slug),
    rankedSlugs,
  );
  assert.deepEqual(
    businessDemandProducts.map((product) => product.rank),
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  );
  assert.equal(new Set(rankedSlugs).size, businessDemandProducts.length);

  for (const [index, product] of businessDemandProducts.entries()) {
    assert.deepEqual(
      Object.keys(product.score).sort(),
      [...scoreDimensions].sort(),
    );
    for (const dimension of scoreDimensions) {
      assert.equal(Number.isInteger(product.score[dimension]), true);
      assert.ok(product.score[dimension] >= 1 && product.score[dimension] <= 5);
    }
    assert.equal(
      product.total,
      scoreDimensions.reduce(
        (sum, dimension) => sum + product.score[dimension],
        0,
      ),
    );
    assert.deepEqual(
      [
        ...scoreDimensions.map((dimension) => product.score[dimension]),
        product.total,
      ],
      scoreMatrix[index],
      `${product.slug} score row`,
    );
    assert.ok(
      product.evidence.some((source) =>
        ["offer", "commercial-traction"].includes(source.kind),
      ),
    );
    assert.ok(product.evidence.some((source) => source.kind === "adoption"));
    for (const source of product.evidence) {
      assert.ok(
        ["offer", "commercial-traction", "adoption"].includes(source.kind),
        `${product.slug} has unsupported evidence kind ${source.kind}`,
      );
      assert.equal(source.accessed, "2026-07-15");
      assert.match(source.url, /^https:\/\//);
      assert.ok(source.label.trim().length > 0);
    }
  }

  assert.deepEqual(
    businessDemandProducts.map((product) => product.total),
    [28, 27, 26, 25, 25, 24, 24, 23, 20, 18],
    "totals must remain descending with the approved tie order",
  );

  await Promise.all(
    rankedSlugs.map((slug) =>
      assert.doesNotReject(
        access(new URL(`../src/content/apps/${slug}.md`, import.meta.url)),
        `${slug} must have a canonical catalogue record`,
      ),
    ),
  );

  assert.deepEqual(consumerLabSlugs, consumerSlugs);
});

test("new demand products stay planned bounded and canonical", async () => {
  const entries = await Promise.all(
    [
      ...demandedProducts,
      ["agency-ai-workbench", "AI Agency Operating System"],
    ].map(async ([slug, expectedName]) => [
      slug,
      expectedName,
      await readCatalogueEntry(slug),
    ]),
  );

  for (const [slug, expectedName, { product }] of entries) {
    assert.deepEqual(
      {
        name: product.name,
        status: product.status,
        access: product.access,
        proof: product.proof,
        flywheel: product.flywheel,
      },
      {
        name: expectedName,
        status: "planned",
        access: "unavailable",
        proof: "not-yet-proven",
        flywheel: "build",
      },
      slug,
    );
  }

  const bySlug = Object.fromEntries(
    entries.map(([slug, , entry]) => [slug, entry.source]),
  );
  await assert.rejects(
    access(
      new URL("../src/content/apps/digital-product-studio.md", import.meta.url),
    ),
    { code: "ENOENT" },
    "the canonical AI Digital Product Studio must not have a duplicate record",
  );
  assertContainsAll(
    bySlug["document-operations-agent"],
    [
      /permission|authorized/i,
      /source|provenance|citation/i,
      /confidence/i,
      /exception/i,
      /human review|approval/i,
    ],
    "document operations",
  );
  assertContainsAll(
    bySlug["finance-operations-assistant"],
    [
      /prepare|reconcile/i,
      /no (?:payment|money movement)|without explicit authorization/i,
      /segregation of duties/i,
    ],
    "finance operations",
  );
  assertContainsAll(
    bySlug["marketing-campaign-studio"],
    [
      /claim substantiation/i,
      /copyright|likeness/i,
      /human approval/i,
      /publication|spend changes/i,
    ],
    "marketing campaigns",
  );
  assertContainsAll(
    bySlug["software-engineering-copilot"],
    [/tests/i, /human review/i, /merge|deploy/i],
    "software engineering",
  );
  assertContainsAll(
    bySlug["clinical-documentation-assistant"],
    [
      /clinician review/i,
      /patient|privacy/i,
      /no diagnosis|not diagnose/i,
      /treatment/i,
      /chart finalization/i,
    ],
    "clinical documentation",
  );
  assertContainsAll(
    bySlug["business-constraint-finder"],
    [
      /evidence/i,
      /diagnos/i,
      /hypothesis|tested/i,
      /no autonomous changes|not autonomously change|changes.*approval/i,
    ],
    "business constraints",
  );
  assertContainsAll(
    bySlug["ai-digital-product-studio"],
    [
      /licensed source material/i,
      /no (?:identity )?impersonation|not\s+impersonat/i,
      /hypothesis until tested|hypothesis.*test/i,
    ],
    "digital products",
  );
  assertContainsAll(
    bySlug["revenue-intelligence-platform"],
    [
      /first-party|consented data/i,
      /attribution/i,
      /causal|incrementality/i,
      /no autonomous budget changes|budget changes.*approval/i,
    ],
    "revenue intelligence",
  );
  const attributionModule = await read(
    "src/content/apps/ai-attribution-remarketing.md",
  );
  assert.match(attributionModule, /campaign-activation module/i);
  assert.match(attributionModule, /\/apps\/revenue-intelligence-platform/);
  assert.match(
    bySlug["revenue-intelligence-platform"],
    /parent measurement layer/i,
  );
  assertContainsAll(
    bySlug["lead-recovery-operator"],
    [
      /consent|authorized contacts/i,
      /opt-out/i,
      /non-discriminatory/i,
      /no fabricated evidence|not fabricate/i,
      /send approval|approval.*send/i,
    ],
    "lead recovery",
  );
  assertContainsAll(
    bySlug["agency-ai-workbench"],
    [
      /software/i,
      /installation/i,
      /managed operation/i,
      /tenant isolation/i,
      /acceptance test/i,
      /client approval/i,
    ],
    "agency operating system",
  );

  const existingBoundaries = Object.fromEntries(
    await Promise.all(
      [
        "email-customer-service",
        "voice-customer-service",
        "ai-qualifier",
        "internal-knowledge-assistant",
        "legal-advice-assistant",
      ].map(async (slug) => [slug, await read(`src/content/apps/${slug}.md`)]),
    ),
  );
  assertContainsAll(
    existingBoundaries["email-customer-service"],
    [/refund/i, /account/i, /send|sending/i, /approval/i],
    "email support",
  );
  assertContainsAll(
    existingBoundaries["voice-customer-service"],
    [
      /consent/i,
      /recording disclosure|disclos/i,
      /emergency handoff/i,
      /no autonomous cold calling|not autonomously cold call/i,
    ],
    "voice support",
  );
  assertContainsAll(
    existingBoundaries["ai-qualifier"],
    [
      /authorized contacts/i,
      /opt-out/i,
      /non-discriminatory/i,
      /no fabricated evidence|not fabricate/i,
    ],
    "qualification",
  );
  assertContainsAll(
    existingBoundaries["internal-knowledge-assistant"],
    [
      /permission-aware|permissions/i,
      /citation/i,
      /retention control|retention/i,
    ],
    "knowledge assistant",
  );
  assertContainsAll(
    existingBoundaries["legal-advice-assistant"],
    [
      /qualified professional review|qualified review/i,
      /source provenance|provenance/i,
      /no legal advice|not legal advice|avoids a claim of legal advice/i,
    ],
    "legal assistant",
  );

  const armaloRecords = Object.values(bySlug).join("\n");
  for (const outsideName of [
    /Alex Hormozi/i,
    /Acquisition\.com/i,
    /Jordan Lee/i,
    /Jordan Lee\s*\/\s*AI Acquisition LLC/i,
    /inspired by AI Acquisition/i,
    /Serge Gatari/i,
    /Cook\.ai/i,
    /Iman Gadzhi/i,
    /\bFlozy(?:\.com)?\b/i,
    /Alex Becker/i,
    /\bHYROS\b/i,
  ]) {
    assert.doesNotMatch(armaloRecords, outsideName);
  }
  assert.doesNotMatch(
    armaloRecords,
    /operator (?:pattern|mechanic)|creator playbook/i,
  );
  assert.doesNotMatch(
    armaloRecords,
    /affiliated with|official (?:partner|product)|in partnership with/i,
  );
});

test("catalogue groups merge variants and retain every product exactly once", () => {
  const fixtures = [
    ["revenue-lower", "Revenue operations"],
    ["revenue-title", "Revenue Operations"],
    ["sales", "Sales Operations"],
    ["finance", "Financial Intelligence"],
    ["punctuation-slash", "Growth / Ops"],
    ["punctuation-plus", "Growth + Ops"],
  ].map(([id, category]) => ({ id, data: { category } }));

  const groups = buildCatalogueGroups([...fixtures].reverse());
  assert.ok(preferredCatalogueCategories.includes("Revenue operations"));
  assert.equal(
    groups.find((group) => group.label === "Revenue operations")?.apps.length,
    2,
  );
  assert.equal(
    groups.some((group) => group.label === "Revenue Operations"),
    false,
  );

  assert.equal(groups[0].label, "Revenue operations");
  assert.deepEqual(
    groups.slice(1).map((group) => group.label),
    [
      "Sales Operations",
      "Financial Intelligence",
      "Growth / Ops",
      "Growth + Ops",
    ].sort((left, right) => left.localeCompare(right)),
  );
  assert.equal(new Set(groups.map((group) => group.id)).size, groups.length);
  assert.deepEqual(
    groups.flatMap((group) => group.apps.map((product) => product.id)).sort(),
    fixtures.map((product) => product.id).sort(),
  );
});

test("demand research keeps market evidence separate from operator mechanics", async () => {
  const source = await read(
    "src/pages/research/demand-backed-ai-catalogue.astro",
  );

  assert.equal(operatorPatterns.length, 5);
  assert.deepEqual(
    operatorPatterns.flatMap((pattern) =>
      pattern.sources.map((entry) => entry.url),
    ),
    operatorPrimaryUrls,
  );
  for (const pattern of operatorPatterns) {
    assert.equal(pattern.sources.length, 3);
    assert.ok(pattern.mechanic.trim().length > 0);
    assert.ok(pattern.ethicalAdaptation.trim().length > 0);
    assert.ok(pattern.armaloProducts.length > 0);
    for (const entry of pattern.sources) {
      assert.equal(entry.accessed, "2026-07-15");
      assert.ok(entry.label.trim().length > 0);
    }
  }
  assertContainsAll(
    source,
    [
      /methodology/i,
      /B2B|business AI/i,
      /consumer lab/i,
      /no affiliation|not affiliated/i,
      /2026-07-15/,
      /ethical adaptation/i,
      /attribution/i,
      /experimentally verified incrementality/i,
    ],
    "research route",
  );
  assert.match(source, /operatorPatterns\s*\.\s*map\s*\(/);
});

test("homepage and research share the typed demand catalogue", async () => {
  const [homepage, research] = await Promise.all([
    read("src/pages/index.astro"),
    read("src/pages/research/demand-backed-ai-catalogue.astro"),
  ]);

  for (const source of [homepage, research]) {
    const sharedImport = source.match(
      /import\s*\{([^}]*)\}\s*from\s*["'][^"']*demand-catalogue["']/s,
    );
    assert.ok(sharedImport, "page must import from demand-catalogue");
    assert.match(sharedImport[1], /\bbusinessDemandProducts\b/);
    assert.match(sharedImport[1], /\bconsumerLabSlugs\b/);
    const withoutSharedImport = source.replace(sharedImport[0], "");
    assert.match(withoutSharedImport, /\bbusinessDemandProducts\b/);
    assert.match(withoutSharedImport, /\bconsumerLabSlugs\b/);
    const literalRankedSlugs = rankedSlugs.filter(
      (slug) => source.includes(`"${slug}"`) || source.includes(`'${slug}'`),
    );
    assert.deepEqual(
      literalRankedSlugs,
      [],
      "pages must not duplicate ranked slug literals",
    );
  }
  const researchImport = research.match(
    /import\s*\{([^}]*)\}\s*from\s*["'][^"']*demand-catalogue["']/s,
  );
  assert.match(researchImport[1], /\boperatorPatterns\b/);
  assert.match(research.replace(researchImport[0], ""), /\boperatorPatterns\b/);
  assert.equal(operatorPatterns.length, 5);
});
