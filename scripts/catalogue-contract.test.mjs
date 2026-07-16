import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

const forbiddenProjectionPatterns = [
  /(?:["']\s*)?\boperator\b\s*(?:["'])?\s*:/i,
  /(?:["']\s*)?\bcapabilities\b\s*(?:["'])?\s*:/i,
  /(?:["']\s*)?\bprivateControlPlane\b\s*(?:["'])?\s*:/i,
  /\bdisallowedWithoutApproval\b/i,
  /\bMeta\s+Ads\b/i,
  /\bStripe\s+activation\b/i,
  /\bcredential\s+changes\b/i,
];

function assertPublicProjection(source) {
  for (const pattern of forbiddenProjectionPatterns) {
    assert.doesNotMatch(source, pattern);
  }
}

test("product actions follow access truth instead of maturity alone", async () => {
  const detail = await read("src/pages/apps/[slug].astro");

  assert.match(detail, /url\s*&&\s*access\s*!==\s*["']unavailable["']/);
  assert.doesNotMatch(detail, /status\s*===\s*["']live["']/);
  assert.match(detail, /ctaLabel/);
});

test("Girl Math points directly to its verified public product surface", async () => {
  const source = await read("src/content/apps/girl-math.md");

  assert.match(source, /url:\s*["']https:\/\/girl-math\.armalo\.ai["']/);
  assert.match(source, /status:\s*beta/);
  assert.match(source, /access:\s*public/);
  assert.match(source, /proof:\s*public-live/);
  assert.match(source, /flywheel:\s*launch/);
  assert.match(source, /lastVerified:\s*["']2026-07-15["']/);
  assert.match(source, /not live (seat )?availability/i);
});

test("public catalogue machine surfaces contain catalogue truth only", async () => {
  const [json, markdown] = await Promise.all([
    read("src/pages/agents/portfolio.json.ts"),
    read("src/pages/agents/portfolio.md.ts"),
  ]);
  const combined = `${json}\n${markdown}`;

  for (const required of [
    "access",
    "proof",
    "flywheel",
    "lastVerified",
    "ctaLabel",
    "highlights",
  ]) {
    assert.match(combined, new RegExp(required));
  }

  assertPublicProjection(combined);
});

test("public projection guard catches quoted and spaced forbidden keys", () => {
  for (const fixture of [
    '{ "operator": {} }',
    "{ 'capabilities' : {} }",
    '{ "privateControlPlane"\n: "https://example.com" }',
  ]) {
    assert.throws(() => assertPublicProjection(fixture));
  }
});

test("Markdown catalogue projects product tags", async () => {
  const [route, renderer] = await Promise.all([
    read("src/pages/agents/portfolio.md.ts"),
    read("src/lib/portfolio-markdown.ts"),
  ]);

  assert.match(route, /renderCatalogueProductMarkdown/);
  assert.match(renderer, /- Tags:/);
  assert.match(renderer, /data\.tags\.map/);
});

test("global navigation resolves homepage sections from every page", async () => {
  const source = await read("src/components/SiteHeader.astro");
  assert.match(source, /href=["']\/#work["']/);
  assert.match(source, /href=["']\/#about["']/);
  assert.match(source, /href=["']\/flywheel["']/);
});

test("the portfolio no longer owns a private Girl Math invocation route", async () => {
  const retiredFiles = [
    "src/pages/agents/girl-math.md.ts",
    "scripts/invoke-girl-math.mjs",
    "scripts/invoke-girl-math.test.mjs",
    "docs/agents/girl-math-runtime.md",
    "docs/agents/portfolio-hermes-runtime.md",
  ];
  await Promise.all(
    retiredFiles.map((path) =>
      assert.rejects(access(new URL(`../${path}`, import.meta.url)), {
        code: "ENOENT",
      }),
    ),
  );

  const packageSource = await read("package.json");
  assert.doesNotMatch(packageSource, /invoke:girl-math|test:hermes/);
});

test("catalogue schema rejects impossible maturity and proof pairs", async () => {
  const { appSchema } = await import("../src/content/app-schema.ts");
  const base = {
    name: "Contract fixture",
    url: "https://example.com/product",
    category: "Example",
    description: "A deterministic catalogue contract fixture.",
    year: 2026,
    tags: [],
    access: "public",
    lastVerified: "2026-07-15",
    flywheel: "launch",
    audiences: ["Fixture buyers"],
    deliveryModes: ["hosted"],
    offerModes: ["pilot"],
    salesPosition: "A concise public-safe sales position.",
    ctaLabel: "Open fixture",
    highlights: ["A concise, public-safe product highlight."],
  };

  const expected = {
    planned: ["not-yet-proven"],
    wip: ["not-yet-proven", "source-tested"],
    beta: ["source-tested", "runtime-verified", "public-live"],
    live: ["public-live", "business-verified"],
  };
  const proofs = [
    "not-yet-proven",
    "source-tested",
    "runtime-verified",
    "public-live",
    "business-verified",
  ];
  const flywheelForStatus = {
    planned: "build",
    wip: "build",
    beta: "launch",
    live: "launch",
  };

  for (const [status, allowed] of Object.entries(expected)) {
    for (const proof of proofs) {
      assert.equal(
        appSchema.safeParse({
          ...base,
          status,
          proof,
          flywheel: flywheelForStatus[status],
        }).success,
        allowed.includes(proof),
        `${status} + ${proof}`,
      );
    }
  }

  assert.equal(
    appSchema.safeParse({
      ...base,
      url: "http://example.com/product",
      status: "beta",
      proof: "public-live",
    }).success,
    false,
  );
  assert.equal(
    appSchema.safeParse({
      ...base,
      url: undefined,
      status: "beta",
      proof: "public-live",
    }).success,
    false,
  );
  assert.equal(
    appSchema.safeParse({
      ...base,
      lastVerified: "2999-01-01",
      status: "beta",
      proof: "public-live",
    }).success,
    false,
  );
});

test("catalogue schema keeps flywheel stages honest against maturity and proof", async () => {
  const { appSchema } = await import("../src/content/app-schema.ts");
  const base = {
    name: "Contract fixture",
    url: "https://example.com/product",
    category: "Example",
    description: "A deterministic catalogue contract fixture.",
    year: 2026,
    tags: [],
    access: "public",
    lastVerified: "2026-07-15",
    audiences: ["Fixture buyers"],
    deliveryModes: ["hosted"],
    offerModes: ["pilot"],
    salesPosition: "A concise public-safe sales position.",
    ctaLabel: "Open fixture",
    highlights: ["A concise, public-safe product highlight."],
  };

  const expected = {
    planned: ["build"],
    wip: ["build"],
    beta: ["launch", "acquire", "monetize"],
    live: ["launch", "acquire", "monetize", "compound"],
  };
  const proofForStatus = {
    planned: "not-yet-proven",
    wip: "not-yet-proven",
    beta: "public-live",
    live: "business-verified",
  };
  const stages = ["build", "launch", "acquire", "monetize", "compound"];

  for (const [status, allowed] of Object.entries(expected)) {
    for (const flywheel of stages) {
      assert.equal(
        appSchema.safeParse({
          ...base,
          status,
          proof: proofForStatus[status],
          flywheel,
        }).success,
        allowed.includes(flywheel),
        `${status} + ${flywheel}`,
      );
    }
  }

  // The compounding claim is a revenue claim: it demands business-verified
  // proof even when the maturity pairing alone would allow it.
  assert.equal(
    appSchema.safeParse({
      ...base,
      status: "live",
      proof: "public-live",
      flywheel: "compound",
    }).success,
    false,
  );
  // A stage is required: a product cannot sit off the board.
  assert.equal(
    appSchema.safeParse({
      ...base,
      status: "beta",
      proof: "public-live",
    }).success,
    false,
  );
});

test("catalogue schema rejects control characters in inline fields", async () => {
  const { appSchema } = await import("../src/content/app-schema.ts");
  const base = {
    name: "Contract fixture",
    url: "https://example.com/product",
    status: "beta",
    access: "public",
    proof: "public-live",
    flywheel: "launch",
    lastVerified: "2026-07-15",
    category: "Example",
    description: "A deterministic catalogue contract fixture.",
    year: 2026,
    tags: ["fixture"],
    audiences: ["Fixture buyers"],
    deliveryModes: ["hosted"],
    offerModes: ["pilot"],
    salesPosition: "A concise public-safe sales position.",
    owner: "Example owner",
    platform: "Example platform",
    ctaLabel: "Open fixture",
    highlights: ["A concise, public-safe product highlight."],
  };

  for (const [field, hostile] of [
    ["name", "Product\n## Forged heading"],
    ["category", "Travel\r- Forged list"],
    ["description", "Description\u2028## Forged heading"],
    ["owner", "Owner\u0000hidden"],
    ["platform", "Platform\u2029- Forged list"],
    ["ctaLabel", "Open\n[forged](https://example.com)"],
    ["salesPosition", "Position\n- forged list"],
  ]) {
    assert.equal(
      appSchema.safeParse({ ...base, [field]: hostile }).success,
      false,
      field,
    );
  }
  assert.equal(
    appSchema.safeParse({ ...base, tags: ["safe\n- forged"] }).success,
    false,
  );
  assert.equal(
    appSchema.safeParse({ ...base, highlights: ["safe\n## forged"] }).success,
    false,
  );
});

test("Markdown projection escapes hostile inline syntax", async () => {
  const { renderCatalogueProductMarkdown } =
    await import("../src/lib/portfolio-markdown.ts");
  const rendered = renderCatalogueProductMarkdown("hostile-slug", {
    name: "Product **forged** [link](https://example.com)",
    url: "https://example.com/product",
    status: "beta",
    access: "public",
    proof: "public-live",
    flywheel: "launch",
    lastVerified: "2026-07-15",
    category: "Travel # forged",
    description: "Try `code` or <unsafe> markup.",
    year: 2026,
    tags: ["points*", "[award]"],
    audiences: ["Example buyers"],
    deliveryModes: ["hosted"],
    offerModes: ["pilot"],
    salesPosition: "A concise, public-safe sales position.",
    owner: "Owner_underscore",
    platform: "Public | private",
    ctaLabel: "Open [now]",
    highlights: ["No **forged emphasis** or [link](https://example.com)."],
  });

  assert.doesNotMatch(rendered, /\*\*forged\*\*/);
  assert.doesNotMatch(rendered, /\[link\]\(https:\/\/example\.com\)/);
  assert.doesNotMatch(rendered, /`code`|<unsafe>/);
  assert.match(rendered, /Product \\\*\\\*forged\\\*\\\*/);
  assert.match(rendered, /\\\[link\\\]\\\(https:\/\/example\.com\\\)/);
  assert.match(rendered, /Public \\\| private/);
});

test("Markdown projection cannot terminate slug formatting with a backtick", async () => {
  const { renderCatalogueProductMarkdown } =
    await import("../src/lib/portfolio-markdown.ts");
  const rendered = renderCatalogueProductMarkdown("hostile`slug", {
    name: "Product",
    url: "https://example.com/product",
    status: "beta",
    access: "public",
    proof: "public-live",
    flywheel: "launch",
    lastVerified: "2026-07-15",
    category: "Travel",
    description: "A safe product description.",
    year: 2026,
    tags: ["points"],
    audiences: ["Example buyers"],
    deliveryModes: ["hosted"],
    offerModes: ["pilot"],
    salesPosition: "A concise, public-safe sales position.",
    owner: "Owner",
    platform: "Platform",
    ctaLabel: "Open product",
    highlights: ["A safe product highlight."],
  });

  assert.match(rendered, /- Slug: hostile\\`slug/);
  assert.doesNotMatch(rendered, /- Slug: `[^\n]*`/);
});
