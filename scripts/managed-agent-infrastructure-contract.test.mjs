import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import yaml from "js-yaml";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

async function readProduct(slug) {
  const source = await read(`src/content/apps/${slug}.md`);
  const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  assert.ok(frontmatter, `${slug} must contain YAML frontmatter`);

  const { appSchema } = await import("../src/content/app-schema.ts");
  return { source, product: appSchema.parse(yaml.load(frontmatter[1])) };
}

const expectedProducts = [
  {
    slug: "managed-agent-workspaces",
    name: "Managed Agent Workspaces",
    patterns: [
      /team/i,
      /SSO/i,
      /centralized guardrails/i,
      /one (clean )?invoice/i,
    ],
  },
  {
    slug: "agent-skill-library",
    name: "Agent Skill Library",
    patterns: [/skill/i, /domain expertise/i, /versioned/i, /evaluation/i],
  },
  {
    slug: "byok-agent-cloud",
    name: "BYOK Agent Cloud",
    patterns: [/bring your own key/i, /model spend/i, /backup/i, /gateway/i],
  },
];

test("managed agent infrastructure is three distinct, claim-honest products", async () => {
  const records = await Promise.all(
    expectedProducts.map(({ slug }) => readProduct(slug)),
  );

  for (const [index, { source, product }] of records.entries()) {
    const expected = expectedProducts[index];
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
        name: expected.name,
        category: "Managed agent infrastructure",
        status: "planned",
        access: "unavailable",
        proof: "not-yet-proven",
        flywheel: "build",
      },
    );
    assert.match(source, /docs\/managed-agent-infrastructure\.md/);
    assert.match(source, /not (?:yet )?(?:live|generally available)/i);
    for (const pattern of expected.patterns) assert.match(source, pattern);
  }
});

test("managed agent infrastructure has a public positioning and proof thesis", async () => {
  const [groups, thesis, apps] = await Promise.all([
    read("src/lib/catalogue-groups.ts"),
    read("docs/managed-agent-infrastructure.md"),
    read("src/lib/apps.ts"),
  ]);

  assert.match(groups, /["']Managed agent infrastructure["']/);
  for (const heading of [
    "What Armalo is selling",
    "The three-product system",
    "Who buys each product",
    "Authority and cost boundaries",
    "Proof ladder",
    "What this is not",
  ]) {
    assert.match(thesis, new RegExp(`^## ${heading}$`, "m"));
  }
  assert.match(thesis, /commodity compute/i);
  assert.match(thesis, /customer-controlled model spend/i);
  assert.match(thesis, /not-yet-proven/i);
  assert.doesNotMatch(
    apps,
    /build:\s*["']In production/i,
    "the shared Build-stage description must not contradict planned products",
  );
});
