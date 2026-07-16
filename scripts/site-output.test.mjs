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
  "category",
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
  "salesPosition",
  "slug",
  "status",
  "tags",
  "url",
  "year",
];
const forbiddenMachinePatterns = [
  /\boperator\b/i,
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
  const html = await readOutput("index.html");
  assert.match(html, />13 products · 1 available</);
  assert.doesNotMatch(html, />13products/);
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

test("machine-policy guard rejects forbidden fields and values", () => {
  for (const fixture of [
    '{"operator":"internal"}',
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
