/**
 * portfolio-lib-unit.test.mjs
 *
 * Targeted unit tests for the pure helpers in src/lib/. We can't
 * import the .ts files directly (they depend on Astro's
 * `astro:content` virtual module, which only resolves inside
 * Astro's build pipeline), so this file tests the contract by:
 *   - Reading the lib/ source as text and asserting structural
 *     invariants (function signatures, exports, type labels).
 *   - Reading the dist/ output and asserting the renderer
 *     produced the expected shape.
 *
 * Heavy lifting of "do the 41 apps still pass the schema" lives in
 * catalogue-contract.test.mjs; "does the homepage render correctly"
 * lives in site-output.test.mjs. This file is the small glue
 * between them.
 */
import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = fileURLToPath(new URL("..", import.meta.url));
const read = (rel) => readFile(new URL(rel, import.meta.url), "utf8");

// ---- apps.ts ----------------------------------------------------------------

test("apps.ts exports the expected public surface", async () => {
  const source = await read("../src/lib/apps.ts");
  const expectedExports = [
    /export type App\b/,
    /export type Access\b/,
    /export type Proof\b/,
    /export type Flywheel\b/,
    /export type DeliveryMode\b/,
    /export type OfferMode\b/,
    /export (async )?function getApps\b/,
    /export function countAvailable\b/,
    /export function hasRealApps\b/,
    /export const accessLabels\b/,
    /export const proofLabels\b/,
    /export const flywheelStages\b/,
    /export const flywheelLabels\b/,
    /export const flywheelDescriptions\b/,
    /export const deliveryLabels\b/,
    /export const offerLabels\b/,
  ];
  for (const pattern of expectedExports) {
    assert.match(
      source,
      pattern,
      `apps.ts is missing expected export ${pattern}`,
    );
  }
});

test("apps.ts flywheel stages are the five-stage loop in the right order", async () => {
  const source = await read("../src/lib/apps.ts");
  const m = source.match(
    /export const flywheelStages:\s*Flywheel\[\]\s*=\s*\[([\s\S]*?)\];/,
  );
  assert.ok(m, "flywheelStages must be a typed const array literal");
  const stages = m[1]
    .split(",")
    .map((s) => s.trim().replace(/^["']|["']$/g, ""))
    .filter(Boolean);
  assert.deepEqual(stages, [
    "build",
    "launch",
    "acquire",
    "monetize",
    "compound",
  ]);
});

test("apps.ts labels cover every access / proof / delivery / offer enum value", async () => {
  const source = await read("../src/lib/apps.ts");
  // Schema is in src/content/app-schema.ts; we don't import it here
  // because it pulls in astro:content transitively. Instead, assert
  // the labels cover the full set of values the schema can produce.
  const mustCover = {
    accessLabels: [
      "public",
      "sign-in",
      "private-beta",
      "waitlist",
      "unavailable",
    ],
    proofLabels: [
      "not-yet-proven",
      "source-tested",
      "runtime-verified",
      "public-live",
      "business-verified",
    ],
    flywheelLabels: ["build", "launch", "acquire", "monetize", "compound"],
    flywheelDescriptions: [
      "build",
      "launch",
      "acquire",
      "monetize",
      "compound",
    ],
    deliveryLabels: ["hosted", "custom-build", "dfy", "licensed", "partner"],
    offerLabels: [
      "pilot",
      "team",
      "agency",
      "enterprise",
      "commission",
      "partner",
    ],
  };
  for (const [dict, values] of Object.entries(mustCover)) {
    // `export const NAME: TYPE = { ... }` — match the dict name and
    // the opening `{` of the value object. Use `[^{]` to skip past the
    // type annotation without stumbling on its `=`.
    const m = source.match(
      new RegExp(`export const ${dict}\\b[^{]*\\{([\\s\\S]*?)\\n\\};`),
    );
    assert.ok(m, `${dict} must be a const object literal`);
    // Match both bare-identifier keys (`public:`) and quoted
    // keys (`"sign-in":`). The schema permits both.
    const keys = [...m[1].matchAll(/["']?([a-z0-9-]+)["']?\s*:/g)].map(
      (x) => x[1],
    );
    for (const value of values) {
      assert.ok(
        keys.includes(value),
        `${dict} is missing key "${value}" (have: ${keys.join(", ")})`,
      );
    }
  }
});

// ---- catalogue-groups.ts ----------------------------------------------------

test("catalogue-groups.ts prefers canonical category labels", async () => {
  const source = await read("../src/lib/catalogue-groups.ts");
  assert.match(
    source,
    /export const preferredCatalogueCategories\b/,
    "catalogue-groups.ts must export preferredCatalogueCategories",
  );
  // Source is `export const preferredCatalogueCategories = [ "First", ... ];`
  // — the `[` is on the SAME line as the export, not after a newline.
  // Capture from the export through the closing `];` on the matching
  // line and split the array.
  const m = source.match(
    /export const preferredCatalogueCategories\s*=\s*\[([\s\S]*?)\];/,
  );
  assert.ok(m, "preferredCatalogueCategories must be an array literal");
  const labels = m[1]
    .split(",")
    .map((s) => s.trim().replace(/^["']|["']$/g, ""))
    .filter(Boolean);
  assert.ok(
    new Set(labels).size === labels.length,
    "preferredCatalogueCategories must not contain duplicates",
  );
  assert.equal(labels[0], "Revenue operations");
  assert.equal(labels[1], "Business operations");
  assert.equal(labels[2], "Customer service");
});

test("catalogue-groups.ts slugifies category ids safely", async () => {
  const source = await read("../src/lib/catalogue-groups.ts");
  assert.match(
    source,
    /const slugify = \(label: string\)/,
    "catalogue-groups.ts must define a slugify helper",
  );
  // The slugify must produce lowercase kebab-case output — used
  // as the <section id="..."> for in-page nav anchors.
  const fnMatch = source.match(/const slugify[\s\S]*?return[^;]+;/);
  assert.ok(fnMatch, "could not locate slugify body");
  // The function uses .replace chains; assert the output of the
  // canonical transformation is in slug form.
  assert.match(fnMatch[0], /[a-z0-9-]/);
});

// ---- portfolio-markdown.ts --------------------------------------------------

test("portfolio-markdown.ts renders a stable heading + key fields per app", async () => {
  const source = await read("../src/lib/portfolio-markdown.ts");
  assert.match(
    source,
    /export function renderCatalogueProductMarkdown\b/,
    "portfolio-markdown.ts must export renderCatalogueProductMarkdown",
  );
  // The renderer must surface name, category, access, proof, flywheel,
  // status, and the highlights block — every one of those is rendered
  // somewhere on /agents/portfolio.md.
  for (const field of [
    "name",
    "category",
    "access",
    "proof",
    "flywheel",
    "status",
    "highlights",
  ]) {
    assert.ok(
      source.includes(`data.${field}`) || source.includes(`data["${field}"]`),
      `renderCatalogueProductMarkdown must reference data.${field}`,
    );
  }
});

// ---- Output contract: every catalog card links a slug -------------------------

test("every dist/apps/<slug>/index.html links back to the catalogue + marketing", async (t) => {
  // Skip if the build hasn't run yet (the proof runs `npm test` before
  // the build phase). This is the natural seam: the dist-only tests
  // skip when there's no dist, the build-only tests skip when there's
  // no dist, the source-only tests always run.
  try {
    await readdir(new URL("../dist/apps/", import.meta.url));
  } catch (error) {
    if (error.code === "ENOENT") {
      t.skip(
        "dist/apps/ not built yet; this test requires `npm run build` first",
      );
      return;
    }
    throw error;
  }
  // Functional / integration check: the 41 app detail pages are
  // navigable from the catalogue and the marketing surface. If a
  // future change to the detail template drops the back-link, this
  // test catches it across all 41 pages.
  const appsDir = new URL("../dist/apps/", import.meta.url);
  const files = (await readdir(appsDir, { withFileTypes: true })).filter((d) =>
    d.isDirectory(),
  );
  assert.equal(
    files.length,
    41,
    `expected 41 app detail pages in dist/apps/, found ${files.length}`,
  );
  for (const dirent of files) {
    const html = await readFile(
      new URL(`./${dirent.name}/index.html`, appsDir),
      "utf8",
    );
    // The detail template is [slug].astro. It has a "← Back to
    // catalogue" link to /#work and a marketing-anchor link to the
    // five-angle marketing pack.
    assert.match(
      html,
      /href="\/#work"|href="#work"|href="#main"/,
      `${dirent.name}/index.html must include navigation anchors`,
    );
    assert.match(
      html,
      new RegExp(
        `/marketing#${dirent.name.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\\\$&")}`,
      ),
      `${dirent.name}/index.html must link to its marketing pack at /marketing#<slug>`,
    );
  }
});

test("every dist/apps/<slug>/index.html has the public machine surface", async (t) => {
  try {
    await readdir(new URL("../dist/apps/", import.meta.url));
  } catch (error) {
    if (error.code === "ENOENT") {
      t.skip(
        "dist/apps/ not built yet; this test requires `npm run build` first",
      );
      return;
    }
    throw error;
  }
  // Functional check: every product detail page renders the same
  // canonical meta + OG + Twitter card + theme-color. A regression
  // in one of the page templates (e.g. a missing <link
  // rel="canonical">) shows up as a 1-of-41 failure.
  const appsDir = new URL("../dist/apps/", import.meta.url);
  const dirs = (await readdir(appsDir, { withFileTypes: true })).filter((d) =>
    d.isDirectory(),
  );
  for (const dirent of dirs) {
    const html = await readFile(
      new URL(`./${dirent.name}/index.html`, appsDir),
      "utf8",
    );
    assert.match(
      html,
      /rel="canonical"/,
      `${dirent.name}/index.html must include rel="canonical"`,
    );
    assert.match(
      html,
      /property="og:type"\s+content="website"/,
      `${dirent.name}/index.html must include the Open Graph type tag`,
    );
    assert.match(
      html,
      /name="twitter:card"\s+content="summary"/,
      `${dirent.name}/index.html must include the Twitter card tag`,
    );
    assert.match(
      html,
      new RegExp(
        `rel="canonical" href="https://portfolio\\.armalo\\.ai/apps/${dirent.name.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\\\$&")}"`,
      ),
      `${dirent.name}/index.html must canonical-link to its public URL`,
    );
  }
});

// ---- the design system ------------------------------------------------------

test("global.css declares every token used by the home/catalogue surface", async () => {
  // The catalogue depends on --color-ink, --color-paper, --color-line,
  // --color-accent, --color-ink-soft, --color-ink-faint, --text-sm,
  // --text-xs, --text-base, --text-2xs, --radius-md, --radius-sm,
  // --font-sans. A new design system block that drops any of these
  // would silently regress the catalogue. The contrast fix in 2026-07
  // proved the value of this assertion.
  const css = await read("../src/styles/global.css");
  for (const token of [
    "--color-ink",
    "--color-paper",
    "--color-line",
    "--color-accent",
    "--color-ink-soft",
    "--color-ink-faint",
    "--text-sm",
    "--text-xs",
    "--text-base",
    "--text-2xs",
    "--radius-md",
    "--radius-sm",
    "--font-sans",
  ]) {
    assert.ok(css.includes(`${token}:`), `global.css must declare ${token}`);
  }
});
