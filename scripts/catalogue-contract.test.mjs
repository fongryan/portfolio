import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("product detail actions only invite users to open verified live products", async () => {
  const source = await readFile(new URL("../src/pages/apps/[slug].astro", import.meta.url), "utf8");

  assert.match(
    source,
    /url\s*&&\s*status\s*===\s*["']live["']/,
    "detail pages must gate external product links on live proof status",
  );
});

test("public catalogue contracts keep consequential capabilities approval-gated", async () => {
  const source = await readFile(new URL("../src/pages/agents/portfolio.json.ts", import.meta.url), "utf8");

  assert.match(source, /disallowedWithoutApproval/);
  assert.match(source, /ad spend/);
  assert.match(source, /Stripe activation/);
  assert.match(source, /credential changes/);
});
