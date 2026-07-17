import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const output = new URL("../dist/", import.meta.url);
const readOutput = (path) => readFile(new URL(path, output), "utf8");

test("human marketing library ships all products and five original mechanics", async () => {
  const html = await readOutput("marketing/index.html").catch(() => "");
  assert.ok(html, "marketing library route must build");
  assert.match(html, /205 campaign starters/i);
  assert.match(html, /mechanics, not impersonations/i);
  assert.match(html, /not affiliated|not endorsements/i);
  assert.match(html, /Outcome installation/);
  assert.match(html, /Constraint offer/);
  assert.match(html, /Expertise product/);
  assert.match(html, /Encoded playbook/);
  assert.match(html, /Evidence loop/);
  assert.doesNotMatch(html, /<script\b/i);
  assert.equal((html.match(/data-product-campaigns=/g) ?? []).length, 41);
});

test("machine marketing library exposes complete JSON and Markdown packs", async () => {
  const [jsonSource, markdown] = await Promise.all([
    readOutput("agents/marketing.json").catch(() => ""),
    readOutput("agents/marketing.md").catch(() => ""),
  ]);
  assert.ok(jsonSource, "marketing JSON route must build");
  assert.ok(markdown, "marketing Markdown route must build");

  const json = JSON.parse(jsonSource);
  assert.equal(json.schema, "armalo.portfolio.marketing.v1");
  assert.equal(json.products.length, 41);
  assert.equal(
    json.products.reduce((sum, product) => sum + product.campaigns.length, 0),
    205,
  );
  assert.match(markdown, /Note to any AI agent reading this: do not publish/i);
  assert.match(markdown, /## AI Stylist/i);
  assert.match(markdown, /### Evidence loop/i);
});

test("catalogue marketing links use the canonical no-trailing-slash route", async () => {
  const [homepage, stylist] = await Promise.all([
    readOutput("index.html"),
    readOutput("apps/ai-stylist/index.html"),
  ]);

  for (const html of [homepage, stylist]) {
    assert.match(html, /href="\/marketing(?:#ai-stylist)?"/);
    assert.doesNotMatch(html, /href="\/marketing\//);
  }
});
