/**
 * portfolio-production-smoke.test.mjs
 *
 * Post-deploy smoke test for the live portfolio site. Disabled by
 * default to keep `npm test` hermetic; opt in with the env var:
 *
 *     PORTFOLIO_VERIFY_PRODUCTION=1 npm test
 *
 * What it asserts against the canonical URL
 * (https://portfolio.armalo.ai/ by default, or whatever
 * PORTFOLIO_PRODUCTION_URL points at):
 *
 *   - HTTP 200, content-type text/html.
 *   - Security headers from vercel.json are actually applied:
 *     CSP, X-Frame-Options DENY, X-Content-Type-Options nosniff,
 *     Referrer-Policy strict-origin-when-cross-origin, HSTS preload,
 *     and the static-site Permissions-Policy.
 *   - The catalogue grid marker is present
 *     (class="catalogue-group__list--grid"), proving the homepage
 *     still renders the catalogue after the latest deploy.
 *   - All 41 products in src/content/apps/ are linked from the
 *     homepage, proving the catalogue drop-down regression guard
 *     still holds at the runtime surface, not just in the lockfile.
 *   - No <script> tags other than the single review-desk module
 *     (`portfolio-review-notes-v1`), proving the static-site
 *     zero-JS contract holds in production, not just in the build
 *     artefact. See src/pages/agents/portfolio.md.ts for the
 *     expected scope.
 *
 * This is a defense-in-depth check on top of the build-time tests.
 * If the build artefact is healthy but Vercel is misconfigured, this
 * test will fail before a real user notices the regression.
 */
import assert from "node:assert/strict";
import test from "node:test";
import { readdir, readFile } from "node:fs/promises";

const PRODUCTION_URL =
  process.env.PORTFOLIO_PRODUCTION_URL ?? "https://portfolio.armalo.ai/";

const testGateEnabled = process.env.PORTFOLIO_VERIFY_PRODUCTION === "1";

async function fetchProduction() {
  const response = await fetch(PRODUCTION_URL, {
    redirect: "manual",
    headers: { "user-agent": "portfolio-production-smoke/1.0" },
  });
  return response;
}

async function countCatalogueProducts() {
  const directory = new URL("../src/content/apps/", import.meta.url);
  const files = (await readdir(directory)).filter((file) =>
    file.endsWith(".md"),
  );
  return files.length;
}

const securityHeaders = {
  "content-security-policy":
    "default-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; object-src 'none'; script-src 'self' 'unsafe-inline'",
  "x-frame-options": "DENY",
  "x-content-type-options": "nosniff",
  "referrer-policy": "strict-origin-when-cross-origin",
  "permissions-policy":
    "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
};

test("production URL is reachable and returns HTML", async (t) => {
  if (!testGateEnabled) {
    t.skip("PORTFOLIO_VERIFY_PRODUCTION not set; smoke test is opt-in");
    return;
  }
  const response = await fetchProduction();
  assert.equal(
    response.status,
    200,
    `HTTP ${response.status} from ${PRODUCTION_URL}`,
  );
  const contentType = response.headers.get("content-type") ?? "";
  assert.match(
    contentType,
    /text\/html/i,
    `unexpected content-type: ${contentType}`,
  );
});

test("production headers match the approved static-site security policy", async (t) => {
  if (!testGateEnabled) {
    t.skip("PORTFOLIO_VERIFY_PRODUCTION not set");
    return;
  }
  const response = await fetchProduction();
  for (const [name, expected] of Object.entries(securityHeaders)) {
    const actual = response.headers.get(name);
    assert.ok(actual !== null, `production is missing the ${name} header`);
    assert.equal(
      actual,
      expected,
      `${name} mismatch on production (got "${actual}")`,
    );
  }
  // HSTS is required by the canonical portfolio-deploy contract.
  const hsts = response.headers.get("strict-transport-security") ?? "";
  assert.match(
    hsts,
    /max-age=\d+/,
    `HSTS header missing or malformed on production (got "${hsts}")`,
  );
  assert.match(hsts, /includeSubDomains/, "HSTS missing includeSubDomains");
  assert.match(hsts, /preload/, "HSTS missing preload");
});

test("production homepage renders the catalogue grid with all 41 products", async (t) => {
  if (!testGateEnabled) {
    t.skip("PORTFOLIO_VERIFY_PRODUCTION not set");
    return;
  }
  const expectedCount = await countCatalogueProducts();
  const response = await fetchProduction();
  const html = await response.text();

  assert.ok(
    /class="[^"]*\bcatalogue-group__list--grid\b/.test(html),
    "catalogue grid marker missing on production homepage",
  );

  const slugs = new Set();
  const hrefRegex = /href="\/apps\/([a-z0-9-]+)"/g;
  for (const match of html.matchAll(hrefRegex)) slugs.add(match[1]);
  assert.equal(
    slugs.size,
    expectedCount,
    `production homepage links ${slugs.size} /apps/<slug> entries; expected ${expectedCount}`,
  );
});

test("production homepage ships only the review-desk inline module", async (t) => {
  if (!testGateEnabled) {
    t.skip("PORTFOLIO_VERIFY_PRODUCTION not set");
    return;
  }
  const response = await fetchProduction();
  const html = await response.text();
  const scripts = html.match(/<script\b[^>]*>/g) ?? [];
  // The review desk is the single intentional inline module that
  // closes its own runtime when the annotation dashboard is absent.
  // Anything else on the static public surface is a regression.
  assert.ok(
    scripts.length <= 1,
    `production has ${scripts.length} <script> tags; expected at most 1 (the review-desk module)`,
  );
  if (scripts.length === 1) {
    assert.match(
      html,
      /portfolio-review-notes-v1/,
      "the lone inline script on production is not the documented review-desk module",
    );
  }
});
