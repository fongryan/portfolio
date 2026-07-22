import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { test } from "node:test";
import {
  canonicalLegoInventory,
  canonicalLegoProductCount,
  legoInventorySchema,
  legoInventoryVersion,
  validateLegoInventory,
  validatedCanonicalLegoInventory,
} from "../src/lib/lego-inventory.ts";

test("canonical LEGO inventory covers exactly forty-one portfolio products", () => {
  assert.equal(canonicalLegoInventory.length, 41);
  assert.equal(canonicalLegoProductCount, 41);
  assert.equal(validatedCanonicalLegoInventory.length, 41);

  const ids = new Set(canonicalLegoInventory.map((record) => record.id));
  const slugs = new Set(
    canonicalLegoInventory.map((record) => record.productSlug),
  );
  assert.equal(ids.size, 41);
  assert.equal(slugs.size, 41);
});

test("canonical LEGO inventory assigns stable IDs and version", () => {
  for (const record of canonicalLegoInventory) {
    assert.match(record.id, /^lego\.product\.[a-z0-9-]+$/);
    assert.equal(record.version, legoInventoryVersion);
    assert.match(record.starterManifest.id, /^starter\.[a-z0-9-]+$/);
    assert.match(record.source.path, /^src\/content\/apps\/[a-z0-9-]+\.md$/);
    assert.match(
      record.source.lastVerified,
      /^\d{4}-\d{2}-\d{2}$/,
    );
  }
});

test("canonical LEGO inventory matches the existing Astro content glob", async () => {
  const directory = new URL("../src/content/apps/", import.meta.url);
  const catalogueSlugs = (await readdir(directory))
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.replace(/\.md$/, ""))
    .sort();
  const inventorySlugs = canonicalLegoInventory
    .map((record) => record.productSlug)
    .sort();
  assert.deepEqual(inventorySlugs, catalogueSlugs);
  for (const record of canonicalLegoInventory) {
    const source = await readFile(
      new URL(`../${record.source.path}`, import.meta.url),
      "utf8",
    );
    assert.match(source, new RegExp(`^name:\\s*"?${record.name.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\\\$&")}`, "m"));
    assert.match(source, new RegExp(`^status:\\s*${record.status}$`, "m"));
    assert.match(source, new RegExp(`^proof:\\s*${record.proof}$`, "m"));
    assert.match(source, new RegExp(`^access:\\s*${record.access}$`, "m"));
  }
});

test("canonical LEGO inventory treats only Armalo App and Girl Math as public-live", () => {
  const publicLive = canonicalLegoInventory.filter(
    (record) => record.maturity === "public-live",
  );
  assert.deepEqual(
    publicLive.map((record) => record.productSlug).sort(),
    ["armalo-app", "girl-math"],
  );
  for (const record of publicLive) {
    assert.equal(record.proof, "public-live");
    assert.equal(record.access, "public");
  }

  const planned = canonicalLegoInventory.filter(
    (record) => record.maturity === "planned",
  );
  assert.equal(planned.length, 39);
  for (const record of planned) {
    assert.equal(record.proof, "not-yet-proven");
    assert.equal(record.access, "unavailable");
  }
});

test("canonical LEGO inventory carries capability families, dependencies, integrations, and policy/eval refs", () => {
  for (const record of canonicalLegoInventory) {
    assert.ok(record.capabilityFamilies.length > 0);
    assert.ok(record.dependencies.length > 0);
    assert.ok(record.integrations.length > 0);
    assert.ok(record.policyRefs.length > 0);
    assert.ok(record.evalRefs.length > 0);
    assert.ok(record.blockFamilies.length > 0);
  }

  const hero = canonicalLegoInventory.find(
    (record) => record.productSlug === "armalo-app",
  );
  assert.ok(hero, "armalo-app record must exist");
  assert.ok(hero.capabilityFamilies.includes("capability.agent-infrastructure"));

  const revenue = canonicalLegoInventory.find(
    (record) => record.productSlug === "hermes-revenue-agents",
  );
  assert.ok(revenue, "hermes-revenue-agents record must exist");
  assert.ok(revenue.capabilityFamilies.includes("capability.revenue-operations"));
  assert.ok(revenue.policyRefs.includes("policy.human-approval"));
});

test("validation rejects duplicate IDs and planned-records claiming proof", () => {
  const duplicateId = [
    ...canonicalLegoInventory,
    {
      ...canonicalLegoInventory[0],
      id: canonicalLegoInventory[0].id,
      productSlug: "alt-product",
    },
  ];
  assert.throws(() => validateLegoInventory(duplicateId), /duplicate LEGO inventory id/);

  const overClaiming = [
    ...canonicalLegoInventory,
    {
      ...canonicalLegoInventory[0],
      id: "lego.product.over-claim",
      productSlug: "over-claim",
      maturity: "planned",
      proof: "public-live",
    },
  ];
  assert.throws(() => validateLegoInventory(overClaiming), /planned product cannot claim proof/);
});

test("canonical LEGO inventory schema and version are stable", () => {
  assert.equal(legoInventorySchema, "armalo.lego.inventory.v1");
  assert.equal(legoInventoryVersion, "1.0.0");
});
