import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = new URL("../", import.meta.url);
const dist = new URL("../dist/", import.meta.url);
const distPath = fileURLToPath(dist);
const defaultCanonicalOrigin = "https://portfolio-peach-sigma-85.vercel.app";
const resolveCanonicalOrigin = (siteUrl) =>
  new URL(siteUrl ?? defaultCanonicalOrigin).origin;
const canonicalOrigin = resolveCanonicalOrigin(process.env.PORTFOLIO_SITE_URL);
const publicManifestKeys = ["generatedBy", "products", "schema"];
const publicProductKeys = [
  "access",
  "audiences",
  "buyerHypothesis",
  "category",
  "commercialPriority",
  "ctaLabel",
  "deliveryModes",
  "description",
  "flywheel",
  "highlights",
  "lastVerified",
  "name",
  "offerModes",
  "owner",
  "platform",
  "proof",
  "researchRefs",
  "salesPosition",
  "slug",
  "status",
  "tags",
  "url",
  "year",
];

const commercialShortlist = [
  ["hermes-revenue-agents", "Hermes Revenue Agents", 1],
  ["ai-customer-service-desk", "AI Customer Service Desk", 2],
  ["ai-dialer", "AI Dialer", 3],
  ["hermes-ai-crm", "Hermes AI CRM", 4],
  ["internal-knowledge-assistant", "Internal Knowledge Assistant", 5],
  ["ai-forward-deployed-engineer", "AI Forward Deployed Engineer", 6],
  ["ai-attribution-remarketing", "AI Attribution & Remarketing", 7],
  ["ai-digital-product-studio", "AI Digital Product Studio", 8],
  ["expert-knowledge-assistant", "Expert Knowledge Assistant", 9],
  ["ai-stylist", "AI Stylist", 10],
];
const forbiddenMachinePatterns = [
  /\boperator(?:-only|\s+(?:profile|identity|notes?|instructions?|control\s+plane))\b/i,
  /\bproviders?\b/i,
  /\bprivate\s+control\s+plane\b/i,
  /\bprivateControlPlane\b/i,
  /\bdisallowedWithoutApproval\b/i,
  /\bMeta\s+Ads\b/i,
  /\bStripe\s+activation\b/i,
  /\bcredential\s+changes\b/i,
  /\bmutation\s+policy\b/i,
];

async function readOutput(relativePath) {
  return readFile(new URL(relativePath, dist), "utf8");
}

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const absolute = path.join(directory, entry.name);
      return entry.isDirectory() ? listFiles(absolute) : [absolute];
    }),
  );
  return files.flat();
}

function routeFromHtmlOutput(relativePath) {
  const portable = relativePath.split(path.sep).join("/");
  if (portable === "index.html") return "/";
  if (portable.endsWith("/index.html")) {
    return `/${portable.slice(0, -"/index.html".length)}`;
  }
  return `/${portable.slice(0, -".html".length)}`;
}

function metadataUrl(html, selector) {
  const match = html.match(selector);
  assert.ok(match, `expected metadata matching ${selector}`);
  return match[1];
}

function assertNoForbiddenMachinePolicy(source) {
  for (const pattern of forbiddenMachinePatterns) {
    assert.doesNotMatch(source, pattern);
  }
}

test("every generated HTML page has canonical and restrained social metadata", async () => {
  const htmlFiles = (await listFiles(distPath)).filter((file) =>
    file.endsWith(".html"),
  );
  assert.ok(htmlFiles.length > 0, "expected at least one generated HTML page");

  for (const file of htmlFiles) {
    const html = await readFile(file, "utf8");
    const relative = path.relative(distPath, file);
    const expectedUrl = new URL(routeFromHtmlOutput(relative), canonicalOrigin)
      .href;

    assert.equal(
      metadataUrl(html, /<link rel="canonical" href="([^"]+)">/),
      expectedUrl,
      `${relative} exact canonical`,
    );
    assert.match(
      html,
      /<meta property="og:type" content="website">/,
      `${relative} OG type`,
    );
    assert.match(
      html,
      /<meta property="og:title" content="[^"]+">/,
      `${relative} OG title`,
    );
    assert.match(
      html,
      /<meta property="og:description" content="[^"]+">/,
      `${relative} OG description`,
    );
    assert.equal(
      metadataUrl(html, /<meta property="og:url" content="([^"]+)">/),
      expectedUrl,
      `${relative} exact OG URL`,
    );
    assert.match(
      html,
      /<meta name="twitter:card" content="summary">/,
      `${relative} Twitter card`,
    );
    assert.match(
      html,
      /<meta name="twitter:title" content="[^"]+">/,
      `${relative} Twitter title`,
    );
    assert.match(
      html,
      /<meta name="twitter:description" content="[^"]+">/,
      `${relative} Twitter description`,
    );
  }
});

test("exact metadata URL checks reject same-origin suffixes", () => {
  const expected = `${canonicalOrigin}/apps/girl-math`;
  const malformed = `<link rel="canonical" href="${expected}/unexpected"><meta property="og:url" content="${expected}/unexpected">`;

  assert.notEqual(
    metadataUrl(malformed, /<link rel="canonical" href="([^"]+)">/),
    expected,
  );
  assert.notEqual(
    metadataUrl(malformed, /<meta property="og:url" content="([^"]+)">/),
    expected,
  );
});

test("generated HTML remains zero-script and free of inline style attributes", async () => {
  const htmlFiles = (await listFiles(distPath)).filter((file) =>
    file.endsWith(".html"),
  );

  for (const file of htmlFiles) {
    const html = await readFile(file, "utf8");
    const relative = path.relative(distPath, file);
    assert.doesNotMatch(html, /<script\b/i, `${relative} script element`);
    assert.doesNotMatch(html, /\sstyle\s*=/i, `${relative} inline style`);
  }
});

test("robots and sitemap expose deterministic public discovery routes", async () => {
  const [robots, sitemap] = await Promise.all([
    readOutput("robots.txt"),
    readOutput("sitemap.xml"),
  ]);

  assert.equal(
    robots,
    `User-agent: *\nAllow: /\nSitemap: ${canonicalOrigin}/sitemap.xml\n`,
  );
  assert.match(sitemap, /^<\?xml version="1\.0" encoding="UTF-8"\?>/);
  assert.match(
    sitemap,
    new RegExp(`<loc>${canonicalOrigin.replaceAll(".", "\\.")}/</loc>`),
  );
  assert.match(
    sitemap,
    new RegExp(
      `<loc>${canonicalOrigin.replaceAll(".", "\\.")}/apps/girl-math</loc>`,
    ),
  );
  assert.match(
    sitemap,
    new RegExp(`<loc>${canonicalOrigin.replaceAll(".", "\\.")}/flywheel</loc>`),
  );
  assert.doesNotMatch(sitemap, /<loc>http:/);
});

test("the flywheel strategy board ships every stage and stays claim-honest", async () => {
  const html = await readOutput("flywheel/index.html");

  for (const stage of ["Build", "Launch", "Acquire", "Monetize", "Compound"]) {
    assert.match(html, new RegExp(`>${stage}<`), `stage ${stage}`);
  }
  // The board names the mechanism, never private operational numbers.
  assert.match(html, /stage and proof only/i);
  assert.doesNotMatch(html, /\$\s*\d|ROAS|CPM\b|CPC\b/i);
  // Girl Math is placed on the board at its honest stage.
  assert.match(html, /href="\/apps\/girl-math"/);
});

test("homepage and product surfaces route to the flywheel board", async () => {
  const [homepage, detail] = await Promise.all([
    readOutput("index.html"),
    readOutput("apps/girl-math/index.html"),
  ]);

  assert.match(homepage, /href="\/flywheel"/);
  assert.match(detail, /href="\/flywheel"/);
});

test("the build contains the branded custom 404", async () => {
  const html = await readOutput("404.html");
  assert.match(html, /That page is not in the catalogue\./);
  assert.match(html, /href="\/#work"/);
});

test("homepage catalogue count preserves readable word spacing", async () => {
  const [html, jsonSource] = await Promise.all([
    readOutput("index.html"),
    readOutput("agents/portfolio.json"),
  ]);
  const manifest = JSON.parse(jsonSource);
  const count = manifest.products.length;
  const availableCount = manifest.products.filter((product) =>
    ["live", "beta"].includes(product.status),
  ).length;

  assert.match(
    html,
    new RegExp(`>${count} products · ${availableCount} available<`),
  );
  assert.doesNotMatch(html, new RegExp(`>${count}products`));
});

test("homepage shelf renders every catalogue product exactly once", async () => {
  const [html, jsonSource] = await Promise.all([
    readOutput("index.html"),
    readOutput("agents/portfolio.json"),
  ]);
  const manifest = JSON.parse(jsonSource);
  const shelfStart = html.indexOf('<section id="work"');
  const shelfEnd = html.indexOf('<section id="about"', shelfStart);
  assert.notEqual(shelfStart, -1, "expected the catalogue shelf");
  assert.notEqual(shelfEnd, -1, "expected the shelf boundary");
  const shelf = html.slice(shelfStart, shelfEnd);

  for (const product of manifest.products) {
    const href = `href="/apps/${product.slug}"`;
    assert.equal(
      shelf.split(href).length - 1,
      1,
      `${product.slug} must appear exactly once in the shelf`,
    );
  }
});

test("AI product atlas exposes money-maker ranking and Hermes fit", async () => {
  const html = await readOutput("research/ai-product-atlas/index.html");
  assert.match(html, /Money-maker order/);
  assert.match(html, /Priority <strong>\d+\/100<\/strong>/);
  assert.match(html, /Hermes fulfillment fit/);
  assert.match(html, /Planned · unavailable · not yet proven/);
});

test("generated machine surfaces expose only the public catalogue contract", async () => {
  const [jsonSource, markdown] = await Promise.all([
    readOutput("agents/portfolio.json"),
    readOutput("agents/portfolio.md"),
  ]);
  const manifest = JSON.parse(jsonSource);

  assert.deepEqual(Object.keys(manifest).sort(), publicManifestKeys);
  assert.ok(
    manifest.products.length > 0,
    "expected at least one public product",
  );
  for (const product of manifest.products) {
    assert.deepEqual(Object.keys(product).sort(), publicProductKeys);
  }

  assertNoForbiddenMachinePolicy(jsonSource);
  assertNoForbiddenMachinePolicy(markdown);
});

test("commercial shortlist ships in rank order across human and machine surfaces", async () => {
  const [homepage, jsonSource, markdown] = await Promise.all([
    readOutput("index.html"),
    readOutput("agents/portfolio.json"),
    readOutput("agents/portfolio.md"),
  ]);
  const manifest = JSON.parse(jsonSource);
  assert.equal(manifest.schema, "armalo.portfolio.catalogue.v4");
  assert.match(homepage, /Internal validation candidates/);
  assert.match(homepage, /Studio hypotheses/);
  assert.match(homepage, /not the market-evidence ranking/i);

  const ranked = manifest.products
    .filter((product) => product.commercialPriority !== null)
    .sort((a, b) => a.commercialPriority - b.commercialPriority);
  assert.equal(ranked.length, 10);

  for (const [index, [slug, name, priority]] of commercialShortlist.entries()) {
    const product = ranked[index];
    assert.equal(product.slug, slug);
    assert.equal(product.name, name);
    assert.equal(product.commercialPriority, priority);
    assert.match(product.buyerHypothesis, /^Armalo hypothesis:/);
    assert.ok(product.researchRefs.length > 0);
    assert.match(homepage, new RegExp(`href="/apps/${slug}"`));
    assert.match(markdown, new RegExp(`^## ${name.replace("&", "\\&")}$`, "m"));
    assert.match(markdown, new RegExp(`Commercial priority: ${priority}`));

    const detail = await readOutput(`apps/${slug}/index.html`);
    assert.match(detail, /Commercial priority/);
    assert.match(detail, /Our buyer hypothesis/);
  }
});

test("Invoice Chaser and Proposal Generator ship in generated machine surfaces", async () => {
  const [jsonSource, markdown] = await Promise.all([
    readOutput("agents/portfolio.json"),
    readOutput("agents/portfolio.md"),
  ]);
  const manifest = JSON.parse(jsonSource);

  for (const [slug, name] of [
    ["invoice-chaser", "Invoice Chaser"],
    ["proposal-generator", "Proposal Generator"],
  ]) {
    const product = manifest.products.find((entry) => entry.slug === slug);
    assert.ok(product, `expected ${name} in JSON catalogue`);
    assert.equal(product.status, "planned");
    assert.equal(product.access, "unavailable");
    assert.equal(product.proof, "not-yet-proven");
    assert.match(markdown, new RegExp(`^## ${name}$`, "m"));
  }
});

test("Invoice Chaser and Proposal Generator detail routes preserve claim status", async () => {
  for (const [slug, name] of [
    ["invoice-chaser", "Invoice Chaser"],
    ["proposal-generator", "Proposal Generator"],
  ]) {
    const html = await readOutput(`apps/${slug}/index.html`);
    assert.match(html, new RegExp(`<h1[^>]*>${name}</h1>`));
    assert.match(
      html,
      /<span[^>]*aria-label="Status: Planned"[^>]*>Planned<\/span>/,
    );
    assert.match(html, /<p[^>]*>Access<\/p><p[^>]*>Unavailable<\/p>/);
    assert.match(html, /<p[^>]*>Proof<\/p><p[^>]*>Not yet proven<\/p>/);
  }
});

test("quote-to-cash research route ships canonical zero-script output", async () => {
  const route = "/research/ai-products-buyers-and-hermes-quote-to-cash";
  const html = await readOutput(`${route.slice(1)}/index.html`);

  assert.match(
    html,
    /Two narrow agents for the work between a promising conversation and cash\./,
  );
  assert.equal(
    metadataUrl(html, /<link rel="canonical" href="([^"]+)">/),
    new URL(route, canonicalOrigin).href,
  );
  assert.doesNotMatch(html, /<script\b/i);
});

test("AI Forward Deployed Engineer ships across human and machine catalogue surfaces", async () => {
  const [homepage, detail, jsonSource, markdown] = await Promise.all([
    readOutput("index.html"),
    readOutput("apps/ai-forward-deployed-engineer/index.html"),
    readOutput("agents/portfolio.json"),
    readOutput("agents/portfolio.md"),
  ]);
  const manifest = JSON.parse(jsonSource);
  const product = manifest.products.find(
    (entry) => entry.slug === "ai-forward-deployed-engineer",
  );

  assert.match(homepage, /href="\/apps\/ai-forward-deployed-engineer"/);
  assert.match(homepage, /AI engineering services/);
  assert.match(detail, /AI Forward Deployed Engineer/);
  assert.match(detail, /Not yet proven/);
  assert.ok(product, "expected AI FDE in JSON catalogue");
  assert.equal(product.status, "planned");
  assert.equal(product.access, "unavailable");
  assert.equal(product.proof, "not-yet-proven");
  assert.deepEqual(product.audiences, [
    "AI startups",
    "Software companies",
    "Small businesses",
    "Brick-and-mortar operators",
  ]);
  assert.match(markdown, /^- Slug: ai-forward-deployed-engineer$/m);
  assert.match(markdown, /Status: planned/);
  assert.match(markdown, /Proof: not-yet-proven/);
});

test("AI Stylist ships across human and machine catalogue surfaces", async () => {
  const [homepage, detail, jsonSource, markdown] = await Promise.all([
    readOutput("index.html"),
    readOutput("apps/ai-stylist/index.html"),
    readOutput("agents/portfolio.json"),
    readOutput("agents/portfolio.md"),
  ]);
  const manifest = JSON.parse(jsonSource);
  const product = manifest.products.find(
    (entry) => entry.slug === "ai-stylist",
  );

  assert.match(homepage, /href="\/apps\/ai-stylist"/);
  assert.match(homepage, /Personal style/);
  assert.match(detail, /AI Stylist/);
  assert.match(detail, /Not yet proven/);
  assert.ok(product, "expected AI Stylist in JSON catalogue");
  assert.equal(product.status, "planned");
  assert.equal(product.access, "unavailable");
  assert.equal(product.proof, "not-yet-proven");
  assert.match(markdown, /^## AI Stylist$/m);
  assert.match(markdown, /^- Slug: ai-stylist$/m);
});

test("machine-policy guard rejects forbidden fields and values", () => {
  for (const fixture of [
    '{"description":"operator instructions"}',
    '{"description":"provider mutation policy"}',
    "Private control plane: authenticated only",
    "disallowedWithoutApproval: Meta Ads",
    "Stripe activation and credential changes",
  ]) {
    assert.throws(() => assertNoForbiddenMachinePolicy(fixture));
  }

  assert.doesNotThrow(() =>
    assertNoForbiddenMachinePolicy('{"access":"private-beta"}'),
  );
});

test("Astro config keeps a production-safe canonical default and env override", async () => {
  const source = await readFile(new URL("astro.config.mjs", root), "utf8");
  assert.match(source, /process\.env\.PORTFOLIO_SITE_URL\s*\?\?/);
  assert.match(source, /https:\/\/portfolio-peach-sigma-85\.vercel\.app/);
  assert.equal(resolveCanonicalOrigin(), defaultCanonicalOrigin);
  assert.equal(
    resolveCanonicalOrigin("https://portfolio.example/"),
    "https://portfolio.example",
  );
});
