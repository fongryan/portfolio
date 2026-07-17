# AI Stylist Catalogue Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add AI Stylist as an honestly planned, publicly visible Armalo product family.

**Architecture:** Reuse the existing Astro content collection and generated product-detail route. Add one Markdown content record and one homepage category, guarded by a catalogue contract test that verifies schema fields, concrete copy, visible grouping, and public projection compatibility.

**Tech Stack:** Astro content collections, TypeScript/Zod schema, Markdown/YAML frontmatter, Node test runner.

---

## Chunk 1: Catalogue contract and implementation

### Task 1: Specify the AI Stylist public contract

**Files:**

- Modify: `scripts/catalogue-contract.test.mjs`
- Modify: `scripts/site-output.test.mjs`
- Create: `src/content/apps/ai-stylist.md`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Write the failing catalogue test**

Add these complete tests:

```js
test("AI Stylist is a bounded planned personal-style product", async () => {
  const [{ source: entry, product }, homepage, jsonRoute, markdownRoute] =
    await Promise.all([
      readCatalogueEntry("src/content/apps/ai-stylist.md"),
      read("src/pages/index.astro"),
      read("src/pages/agents/portfolio.json.ts"),
      read("src/pages/agents/portfolio.md.ts"),
    ]);

  assert.deepEqual(
    {
      name: product.name,
      status: product.status,
      access: product.access,
      proof: product.proof,
      flywheel: product.flywheel,
      category: product.category,
      audiences: product.audiences,
    },
    {
      name: "AI Stylist",
      status: "planned",
      access: "unavailable",
      proof: "not-yet-proven",
      flywheel: "build",
      category: "Personal style",
      audiences: [
        "Consumers",
        "Personal stylists",
        "Retailers",
        "Fashion brands",
      ],
    },
  );
  assert.match(entry, /wardrobe/i);
  assert.match(entry, /outfit/i);
  assert.match(entry, /shopping/i);
  assert.match(entry, /white-label|partner/i);
  assert.match(entry, /purchas|checkout/i);
  assert.match(entry, /inventory/i);
  assert.match(entry, /returns/i);
  assert.match(entry, /brand integrations/i);
  assert.match(entry, /explicit implementation/i);
  assert.match(entry, /human approval/i);
  assert.match(homepage, /["']Personal style["']/);
  assert.match(jsonRoute, /getApps\(\)/);
  assert.match(markdownRoute, /getApps\(\)/);
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
  assert.match(homepage, />Personal style</);
  assert.match(detail, /AI Stylist/);
  assert.match(detail, /Not yet proven/);
  assert.ok(product, "expected AI Stylist in JSON catalogue");
  assert.equal(product.status, "planned");
  assert.equal(product.access, "unavailable");
  assert.equal(product.proof, "not-yet-proven");
  assert.match(markdown, /^- Slug: ai-stylist$/m);
  assert.match(markdown, /Name: AI Stylist/);
});
```

- [ ] **Step 2: Run the focused test to verify RED**

Run: `node --test --test-name-pattern="AI Stylist" scripts/catalogue-contract.test.mjs`

Expected: FAIL with `ENOENT` for `src/content/apps/ai-stylist.md`.

- [ ] **Step 3: Add the minimal content record and homepage group**

Create this exact record:

```markdown
---
name: "AI Stylist"
status: planned
access: unavailable
proof: not-yet-proven
flywheel: build
lastVerified: "2026-07-15"
category: "Personal style"
description: "A personal style concierge that learns wardrobe context and preferences, assembles outfits, and narrows shopping choices without taking over the final decision."
year: 2026
order: 55
tags: ["style", "wardrobe", "shopping"]
audiences: ["Consumers", "Personal stylists", "Retailers", "Fashion brands"]
deliveryModes: ["hosted", "custom-build", "dfy", "licensed"]
offerModes: ["pilot", "team", "agency", "enterprise"]
salesPosition: "Sell a clearer path from what someone owns and likes to what they can wear or buy next, with a white-label path for commerce partners."
ctaLabel: "Request a conversation"
highlights:
  - "Builds outfit ideas from wardrobe, occasion, and preference context."
  - "Turns broad shopping intent into a focused, explainable shortlist."
  - "Can be packaged for stylists, retailers, and fashion brands."
---

AI Stylist is a planned personal style concierge for wardrobe discovery,
outfit planning, and more deliberate shopping. The same product family can be
adapted as a white-label or partner experience for personal stylists, retailers,
and fashion brands.

Recommendations remain guidance. Purchases, checkout, inventory access, returns
workflows, and brand integrations require an explicit implementation with the
relevant partner systems and controls. Purchases and checkout also require
human approval.
```

Add `"Personal style",` to the homepage `groups` list immediately after
`"Learning",` without disturbing the existing uncommitted category changes.
Update the existing homepage count output assertion from a fixed product count
to `/>\d+ products · 1 available</`, preserving the separate
no-collapsed-space assertion so catalogue growth cannot make the proof stale.

- [ ] **Step 4: Run the focused test to verify GREEN**

Run: `node --test --test-name-pattern="AI Stylist" scripts/catalogue-contract.test.mjs`

Expected: PASS with zero failures.

### Task 2: Verify the complete catalogue

**Files:**

- Verify: `src/content/apps/ai-stylist.md`
- Verify: `src/pages/index.astro`
- Verify: `dist/index.html`
- Verify: `dist/apps/ai-stylist/index.html`
- Verify: `dist/agents/portfolio.json`
- Verify: `dist/agents/portfolio.md`

- [ ] **Step 1: Run repository proof gates**

Run: `npm run proof`

Expected: exit 0 after formatting check, catalogue tests, Astro check, build,
generated-output tests, performance budget, and repository doctor.

Run the workspace captain-stack audit described by `AGENTS.md`.

Expected: exit 0 with portfolio `AGENTS.md` and `CLAUDE.md` inheritance marked
`ok`.

- [ ] **Step 2: Inspect generated product projections**

Run:

```bash
node --test --test-name-pattern="AI Stylist" scripts/site-output.test.mjs
rg -n "AI Stylist|ai-stylist" \
  dist/index.html \
  dist/apps/ai-stylist/index.html \
  dist/agents/portfolio.json \
  dist/agents/portfolio.md
```

Expected: the product appears in all four surfaces and the generated detail
route exists.

- [ ] **Step 3: Review the scoped diff**

Inspect only the design doc, plan, test addition, AI Stylist entry, and homepage
group addition. Confirm no private profile content, credentials, unrelated
catalogue edits, or exaggerated maturity claims are present.
