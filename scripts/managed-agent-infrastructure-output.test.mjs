import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const dist = new URL("../dist/", import.meta.url);
const readOutput = (path) => readFile(new URL(path, dist), "utf8");

const expectedProducts = [
  ["managed-agent-workspaces", "Managed Agent Workspaces"],
  ["agent-skill-library", "Agent Skill Library"],
  ["byok-agent-cloud", "BYOK Agent Cloud"],
];

test("managed agent infrastructure ships across human and machine surfaces", async () => {
  const [homepage, jsonSource, markdown] = await Promise.all([
    readOutput("index.html"),
    readOutput("agents/portfolio.json"),
    readOutput("agents/portfolio.md"),
  ]);
  const manifest = JSON.parse(jsonSource);

  assert.match(homepage, /Managed agent infrastructure/);
  for (const [slug, name] of expectedProducts) {
    const product = manifest.products.find((entry) => entry.slug === slug);
    assert.ok(product, `expected ${name} in JSON catalogue`);
    assert.deepEqual(
      {
        name: product.name,
        category: product.category,
        status: product.status,
        access: product.access,
        proof: product.proof,
      },
      {
        name,
        category: "Managed agent infrastructure",
        status: "planned",
        access: "unavailable",
        proof: "not-yet-proven",
      },
    );
    assert.match(markdown, new RegExp(`^## ${name}$`, "m"));
    assert.equal(
      homepage.split(`href="/apps/${slug}"`).length - 1,
      1,
      `${slug} must appear once in the homepage shelf`,
    );

    const detail = await readOutput(`apps/${slug}/index.html`);
    assert.match(detail, new RegExp(`<h1[^>]*>${name}</h1>`));
    assert.match(detail, />Planned</);
    assert.match(detail, />Not yet proven</);
    assert.match(detail, />Unavailable</);
  }
});
