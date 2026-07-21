import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import { createHash } from "node:crypto";
import { test } from "node:test";
import armaloApp from "../starters/armalo-app/manifest.json" with { type: "json" };
import hermesRevenue from "../starters/hermes-revenue-agents/manifest.json" with { type: "json" };
import {
  composeStarters,
  validateStarterManifest,
} from "../src/lib/starter-system.ts";
import { publicStarterCatalogue } from "../src/lib/starter-catalogue.ts";

const digest = async (relativePath) => {
  const bytes = await readFile(new URL(`../${relativePath}`, import.meta.url));
  return `sha256:${createHash("sha256").update(bytes).digest("hex")}`;
};

test("starter manifests validate and point at real immutable reference artifacts", async () => {
  for (const manifest of [armaloApp, hermesRevenue]) {
    assert.equal(
      validateStarterManifest(manifest).schema,
      "armalo.starter.manifest.v1",
    );
    for (const module of manifest.modules) {
      await access(
        new URL(
          `../starters/${manifest.productSlug}/${module.artifact.path}`,
          import.meta.url,
        ),
      );
      assert.equal(
        await digest(
          `starters/${manifest.productSlug}/${module.artifact.path}`,
        ),
        module.artifact.digest,
      );
    }
  }
});

test("composition resolves dependency order across starter Lego pieces", () => {
  const composition = composeStarters([armaloApp, hermesRevenue]);
  assert.deepEqual(composition.manifests, [
    "armalo.app",
    "hermes.revenue-agents",
  ]);
  assert.deepEqual(
    composition.modules.map(({ id }) => id),
    [
      "workspace.foundation",
      "hermes.operator",
      "revenue.pipeline",
      "operator.approval-gates",
      "workspace.multiplayer",
    ],
  );
  assert.ok(composition.capabilities.includes("revenue.pipeline"));
});

test("composition fails closed on missing dependencies and conflicts", () => {
  assert.throws(() => composeStarters([hermesRevenue]), /missing dependency/);
  const conflicting = {
    ...armaloApp,
    id: "conflicting.app",
    modules: [{ ...armaloApp.modules[0], conflictsWith: ["revenue.pipeline"] }],
  };
  assert.throws(
    () => composeStarters([armaloApp, hermesRevenue, conflicting]),
    /duplicate module|module conflict/,
  );
});

test("public projection excludes private source, Hermes instructions, and artifact digests", () => {
  const projection = publicStarterCatalogue();
  assert.equal(projection.length, 2);
  assert.equal("source" in projection[0], false);
  assert.equal("hermes" in projection[0], false);
  assert.equal("digest" in projection[0].modules[0], false);
});
