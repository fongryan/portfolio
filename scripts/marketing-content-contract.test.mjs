import test from "node:test";
import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import yaml from "js-yaml";

const marketingModule = await import("../src/lib/marketing-content.ts").catch(
  () => null,
);

async function catalogueProducts() {
  const directory = new URL("../src/content/apps/", import.meta.url);
  const files = (await readdir(directory)).filter((file) =>
    file.endsWith(".md"),
  );
  return Promise.all(
    files.map(async (file) => {
      const source = await readFile(new URL(file, directory), "utf8");
      const match = source.match(/^---\n([\s\S]*?)\n---/);
      assert.ok(match, `${file} must have frontmatter`);
      return { slug: file.replace(/\.md$/, ""), ...yaml.load(match[1]) };
    }),
  );
}

test("marketing library covers every catalogue product with five distinct mechanics", async () => {
  assert.ok(marketingModule, "the typed marketing content module must exist");
  const products = await catalogueProducts();
  const library = marketingModule.buildMarketingLibrary(products);

  assert.equal(products.length, 41);
  assert.equal(library.length, products.length);
  assert.deepEqual(
    new Set(library.map((product) => product.slug)),
    new Set(products.map((product) => product.slug)),
  );

  for (const product of library) {
    assert.equal(
      product.campaigns.length,
      5,
      `${product.slug} needs five campaigns`,
    );
    assert.equal(new Set(product.campaigns.map((item) => item.lens)).size, 5);
  }
});

test("every campaign is channel-ready, product-specific, and claim-honest", async () => {
  assert.ok(marketingModule, "the typed marketing content module must exist");
  const products = await catalogueProducts();
  const library = marketingModule.buildMarketingLibrary(products);
  const required = [
    "campaignName",
    "headline",
    "offer",
    "mechanism",
    "proofPlan",
    "objection",
    "response",
    "cta",
    "emailSubject",
    "socialHook",
    "landingLead",
  ];
  const copyBlocks = [];

  for (const product of library) {
    assert.match(product.claimBoundary, /proof|proven|verified/i);
    if (product.status === "planned") {
      assert.match(product.claimBoundary, /planned|not yet/i);
    }

    for (const campaign of product.campaigns) {
      for (const field of required) {
        assert.equal(
          typeof campaign[field],
          "string",
          `${product.slug}.${field}`,
        );
        assert.ok(
          campaign[field].trim().length >= 12,
          `${product.slug}.${field} is thin`,
        );
      }
      const copy = required.map((field) => campaign[field]).join(" ");
      assert.match(
        copy,
        new RegExp(product.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"),
      );
      assert.match(
        campaign.proofPlan,
        /baseline|measure|verify|evidence|receipt/i,
      );
      assert.doesNotMatch(
        copy,
        /guaranteed (results|revenue|returns)|risk[- ]free|overnight success|prints? money/i,
      );
      assert.doesNotMatch(
        copy,
        /in the voice of|write like|sounds? exactly like|impersonat/i,
      );
      copyBlocks.push(copy);
    }
  }

  assert.equal(new Set(copyBlocks).size, products.length * 5);
});

test("mechanic references are attributed as research, not endorsements or voices", () => {
  assert.ok(marketingModule, "the typed marketing content module must exist");
  assert.equal(marketingModule.marketingMechanics.length, 5);
  assert.deepEqual(
    marketingModule.marketingMechanics.map((item) => item.lens),
    [
      "outcome-installation",
      "constraint-offer",
      "expertise-product",
      "encoded-playbook",
      "evidence-loop",
    ],
  );
  for (const mechanic of marketingModule.marketingMechanics) {
    assert.match(mechanic.sourceUrl, /^https:\/\//);
    assert.match(mechanic.disclosure, /not affiliated|not an endorsement/i);
    assert.match(mechanic.adaptation, /original|adapt/i);
  }
});
