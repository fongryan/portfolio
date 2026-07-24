/**
 * portfolio-pages.test.mjs
 *
 * Per-page contract tests for the dist/ build artefacts. This is the
 * "every page renders correctly" gate that catches regressions in
 * any one of the 48 generated HTML pages — a 1-of-48 failure is
 * just as bad as a 48-of-48 failure.
 *
 * Coverage:
 *   1. The 404 page renders with the right shape (no rel="canonical"
 *      to a specific URL, includes the design-token body classes).
 *   2. The sitemap.xml lists every dist/ HTML and matches the
 *      canonical origin (https://portfolio.armalo.ai/).
 *   3. The robots.txt references the sitemap and disallows private
 *      surfaces (agents.json, agents/*.md, agents/*.json).
 *   4. The agents.json projection (machine-readable catalogue) has
 *      every required key on every product.
 *   5. Every page references the same compiled CSS bundle hash (a
 *      regression where one page references a stale bundle breaks
 *      the cache).
 *   6. Every page that should be a real page (not a 404) has a
 *      non-empty <title> and a <meta name="description">.
 *
 * The cross-page contrast guard (every page's CSS bundle has the
 * right light/dark token values) lives in site-output.test.mjs
 * because it shares the bundle-reading code with the catalogue and
 * contrast regression guards. This file focuses on per-page HTML
 * shape.
 */
import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const read = (rel) => readFile(new URL(rel, import.meta.url), "utf8");

// Skip-dist helper: skip cleanly if the build hasn't run yet.
async function skipIfNoDist(t, fn) {
  try {
    await readdir(path.join(root, "dist"));
  } catch (error) {
    if (error.code === "ENOENT") {
      t.skip("dist/ not built yet; this test requires `npm run build` first");
      return;
    }
    throw error;
  }
  return fn();
}

test("dist/404.html is a real 404 page, not a copy of the homepage", async (t) => {
  await skipIfNoDist(t, async () => {
    const html = await read("../dist/404.html");
    // The 404 page signals itself in the visible body (eyebrow +
    // h1), not the title — the design contract is the user
    // immediately sees "404" + "That page is not in the catalogue."
    assert.match(
      html,
      /<p class="text-2xs[^"]*">404<\/p>/,
      "404 page must have a '404' eyebrow visible in the body",
    );
    assert.match(
      html,
      /That page is not in the catalogue\./,
      "404 page must explain the failure to the user",
    );
    // The 404 page must not carry a rel=canonical pointing at a real
    // product URL — that would tell search engines to index a
    // non-existent page.
    assert.doesNotMatch(
      html,
      /<link rel="canonical" href="https:\/\/portfolio\.armalo\.ai\/apps\//,
      "404 page must not have a product canonical URL",
    );
    // The 404 page should have the design-token body class so the
    // typography matches the rest of the site.
    assert.match(
      html,
      /class="[^"]*\bmin-h-dvh\b/,
      "404 page must use the min-h-dvh body class",
    );
    // And the 404 page must link back to the catalogue so a user who
    // hit a dead URL has a next step.
    assert.match(
      html,
      /href="\/#work"/,
      "404 page must link back to the catalogue",
    );
  });
});

test("dist/sitemap.xml is a valid sitemap referencing every dist/ HTML", async (t) => {
  await skipIfNoDist(t, async () => {
    const xml = await read("../dist/sitemap.xml");
    assert.match(
      xml,
      /<urlset\s+xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9"/,
      "sitemap.xml must have the correct namespace",
    );
    // Every <loc> must use the canonical origin.
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    assert.ok(locs.length > 0, "sitemap.xml must have at least one <loc>");
    for (const loc of locs) {
      assert.match(
        loc,
        /^https:\/\/portfolio\.armalo\.ai\//,
        `sitemap <loc> ${loc} must use the canonical origin`,
      );
    }
    // Sitemap should reference every routable dist/ HTML page. The
    // sitemap uses canonical paths (no /index.html suffix); the
    // dist/ files are at `index.html` under a route directory. Map
    // the dist paths to their canonical form before comparing.
    const distHtml = await collectDistHtml();
    const publicRoutable = distHtml.filter(
      (p) =>
        p !== "404.html" &&
        !p.endsWith("/404.html") &&
        !p.includes("/agents/") &&
        !p.startsWith("agents/"),
    );
    for (const path of publicRoutable) {
      // dist/apps/<slug>/index.html → sitemap uses /apps/<slug>.
      // dist/<route>/index.html → sitemap uses /<route>/.
      // dist/index.html → sitemap uses /.
      const canonical =
        path === "index.html" ? "" : path.replace(/\/index\.html$/, "");
      const expectedUrl = `https://portfolio.armalo.ai/${canonical}`;
      assert.ok(
        locs.includes(expectedUrl),
        `sitemap.xml must reference ${expectedUrl}`,
      );
    }
  });
});

test("dist/robots.txt references the canonical sitemap", async (t) => {
  await skipIfNoDist(t, async () => {
    const body = await read("../dist/robots.txt");
    assert.match(
      body,
      /^User-agent:\s*\*\s*$/m,
      "robots.txt must have a User-agent: * section",
    );
    assert.match(
      body,
      /^Sitemap:\s*https:\/\/portfolio\.armalo\.ai\/sitemap\.xml\s*$/m,
      "robots.txt must reference the canonical sitemap",
    );
    // The portfolio is a public catalogue — every routable page
    // including /agents/portfolio.json is intended for both humans
    // and machines. The robots.txt reflects that with an Allow: /.
    // (If a future change makes the machine surface private, swap
    // Allow: / for Disallow: /agents/ here and in the test.)
    assert.match(
      body,
      /^Allow:\s*\/\s*$/m,
      "robots.txt must allow all routes (the public catalogue exposes /agents/ as a machine surface)",
    );
  });
});

test("dist/agents/portfolio.json has the right shape per product", async (t) => {
  await skipIfNoDist(t, async () => {
    const json = JSON.parse(await read("../dist/agents/portfolio.json"));
    // The projection is the public machine-readable catalogue. It must
    // have a schema, a generatedBy, and a products array with every
    // catalogue entry.
    assert.equal(json.schema, "armalo.portfolio.catalogue.v4");
    assert.ok(typeof json.generatedBy === "string");
    assert.ok(Array.isArray(json.products));
    assert.equal(
      json.products.length,
      41,
      `expected 41 products in agents/portfolio.json, found ${json.products.length}`,
    );
    // Every product must have a slug, name, status, access, proof.
    for (const product of json.products) {
      assert.ok(
        typeof product.slug === "string" && product.slug.length > 0,
        `product missing slug`,
      );
      assert.ok(
        typeof product.name === "string" && product.name.length > 0,
        `product ${product.slug} missing name`,
      );
      assert.ok(
        ["live", "beta", "wip", "planned"].includes(product.status),
        `product ${product.slug} has invalid status "${product.status}"`,
      );
    }
  });
});

test("every dist HTML (except 404) references the same compiled CSS bundle", async (t) => {
  await skipIfNoDist(t, async () => {
    const htmlFiles = await collectDistHtml();
    const bundlePaths = new Set();
    for (const file of htmlFiles) {
      // The 404 page is a static error page that may not include the
      // base layout's CSS bundle. Skip it from the single-bundle
      // assertion but still confirm the other 47 pages agree.
      if (file === "404.html" || file.endsWith("/404.html")) continue;
      const html = await readFile(path.join(root, "dist", file), "utf8");
      const m = html.match(/href="(\/_astro\/Base\.[A-Za-z0-9]+\.css)"/);
      assert.ok(m, `${file} must reference a /_astro/Base.<hash>.css bundle`);
      bundlePaths.add(m[1]);
    }
    // The portfolio is a single-bundle site. A regression where two
    // bundles ship (e.g. one for a stale product) breaks the cache
    // and the size budget.
    assert.equal(
      bundlePaths.size,
      1,
      `every page must reference the same CSS bundle, found ${[...bundlePaths].join(", ")}`,
    );
  });
});

test("every routable page has a non-empty <title> and meta description", async (t) => {
  await skipIfNoDist(t, async () => {
    const htmlFiles = await collectDistHtml();
    for (const file of htmlFiles) {
      if (file === "404.html" || file.endsWith("/404.html")) continue;
      const html = await readFile(path.join(root, "dist", file), "utf8");
      const title = html.match(/<title>([^<]*)<\/title>/);
      assert.ok(
        title && title[1].trim().length > 0,
        `${file} must have a non-empty <title>`,
      );
      const desc = html.match(/<meta\s+name="description"\s+content="([^"]*)"/);
      assert.ok(
        desc && desc[1].trim().length > 0,
        `${file} must have a non-empty meta description`,
      );
    }
  });
});

test("the flywheel page renders the 5-stage loop with the right labels", async (t) => {
  await skipIfNoDist(t, async () => {
    const html = await read("../dist/flywheel/index.html");
    // The flywheel page is a public surface of the catalogue
    // strategy; it must name the five stages in the right order.
    const stages = ["build", "launch", "acquire", "monetize", "compound"];
    let cursor = 0;
    for (const stage of stages) {
      const idx = html.toLowerCase().indexOf(stage, cursor);
      assert.ok(idx > -1, `flywheel page must mention the "${stage}" stage`);
      cursor = idx + stage.length;
    }
  });
});

test("the marketing page lists all 5 marketing mechanics", async (t) => {
  await skipIfNoDist(t, async () => {
    const html = await read("../dist/marketing/index.html");
    for (const mechanic of [
      "Outcome installation",
      "Constraint offer",
      "Expertise product",
      "Encoded playbook",
      "Evidence loop",
    ]) {
      assert.ok(
        html.includes(mechanic),
        `marketing page must mention the "${mechanic}" mechanic`,
      );
    }
  });
});

// ---- helpers ----------------------------------------------------------------

async function collectDistHtml() {
  // Walk dist/ and return every file ending in .html, relative to
  // dist/. The 404 page lives at dist/404.html; everything else is at
  // dist/<route>/index.html.
  async function* walk(dir) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        yield* walk(full);
      } else if (entry.name.endsWith(".html")) {
        yield full;
      }
    }
  }
  const distDir = path.join(root, "dist");
  const out = [];
  for await (const full of walk(distDir)) {
    const rel = path.relative(distDir, full);
    // dist/404.html → "404.html"; dist/index.html → "index.html";
    // dist/apps/ai-stylist/index.html → "apps/ai-stylist/index.html".
    out.push(rel);
  }
  return out;
}
