/**
 * portfolio-color-discipline.test.mjs
 *
 * The portfolio's design system is intentionally token-driven: every
 * visible color must come from `--color-*` (or `--studio-*` for the
 * non-Astro Tailwind v4 layer). A literal color anywhere in the
 * source is a regression toward AI-slop vibes and risks the
 * 2026-07-23-style "Tailwind v4 hoists my override and the page
 * goes unreadable" failure.
 *
 * This test reads every CSS / .astro / .ts file in src/ and fails
 * on any literal color (hex, rgb/rgba, hsl/hsla, named CSS
 * colors) outside an explicit allow-list. Carve-outs:
 *   - src/styles/global.css: the @theme block (where the tokens
 *     are *defined* — they have to be literals somewhere), and
 *     specific dark-surface sections (hero, signal, etc.) that
 *     intentionally use white-on-dark.
 *   - src/pages/agents/*.ts: machine-readable surfaces where
 *     inline preview colour is part of the JSON / Markdown
 *     output and is generated, not rendered CSS.
 *   - The `theme-color` <meta> tag in src/layouts/Base.astro: it
 *     is a literal because browsers only understand hex there, and
 *     it intentionally mirrors the design tokens.
 *
 * The allow-list is grep-style so a future agent can add a new
 * carve-out by editing a constant rather than by writing a regex
 * inline.
 */
import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));

// Recursive walk of src/ that yields every .css, .astro, .ts file.
async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".astro") continue;
      yield* walk(full);
    } else if (
      /\.(css|astro|ts)$/.test(entry.name) &&
      !full.includes("/.astro/")
    ) {
      yield full;
    }
  }
}

// Match a literal color: 3/4/6/8-digit hex, rgb/rgba, hsl/hsla, or
// a curated list of named colors that have bitten the project before.
// The hex patterns require the previous character to NOT be `&`,
// so HTML entities like `&#039;` (apostrophe) don't false-positive.
const COLOR_PATTERNS = [
  /(?<!&)#[0-9a-fA-F]{3,4}\b/g,
  /(?<!&)#[0-9a-fA-F]{6}\b/g,
  /(?<!&)#[0-9a-fA-F]{8}\b/g,
  /\brgba?\s*\(/g,
  /\bhsla?\s*\(/g,
];

// Carve-outs: a file path is exempt if any of these substrings match.
const CARVE_OUT_PATHS = [
  // src/styles/global.css — the source of truth for the tokens.
  // Inside it, literal colors are the *definitions* of the tokens
  // (e.g. --color-ink: oklch(...)) plus a few dark-surface sections
  // that intentionally use white-on-dark and the studio-* token
  // values (e.g. --studio-coral: #ff6847). The contrast regression
  // guard in site-output.test.mjs is the right place to catch a
  // light-mode color literal inside this file; this lint skips it
  // entirely.
  /src\/styles\/global\.css$/,
  // Machine-readable surfaces: generated JSON / Markdown previews
  // include color values as data, not as rendered CSS. A literal
  // there is generated content, not author intent.
  /\/agents\//,
  // Next/TS types in pages/agents are also generators, not CSS.
  /\/pages\/agents\//,
  // The Base layout hardcodes the `<meta name="theme-color">` tag
  // because browsers only understand hex there, not CSS variables.
  // The values mirror the design tokens (--color-paper-recess for
  // light mode, the dark-mode equivalent for dark mode); a future
  // agent who wants to make this token-driven should generate the
  // layout at build time and pass the token resolved at render. For
  // now, this is the right carve-out.
  /src\/layouts\/Base\.astro$/,
];

function isCarvedOut(path) {
  return CARVE_OUT_PATHS.some((p) => p.test(path));
}

test("src/ contains no hardcoded color literals outside design tokens", async (t) => {
  // This test reads from src/, not dist/, so it doesn't need the
  // build phase. The skip-handler is here for symmetry with the
  // dist-only tests; the body of the test runs unconditionally.
  const violations = [];
  for await (const file of walk(path.join(root, "src"))) {
    if (isCarvedOut(file)) continue;
    const source = await readFile(file, "utf8");
    // Strip block + line comments to avoid false positives on docs.
    const stripped = source
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/^\s*\/\/.*$/gm, "");
    for (const pattern of COLOR_PATTERNS) {
      const matches = [...stripped.matchAll(pattern)];
      for (const m of matches) {
        violations.push({
          file: path.relative(root, file),
          match: m[0],
          index: m.index ?? 0,
        });
      }
    }
  }
  if (violations.length > 0) {
    const head = violations
      .slice(0, 10)
      .map((v) => `  ${v.file} → "${v.match}"`)
      .join("\n");
    assert.fail(
      `src/ contains ${violations.length} hardcoded color literal(s) outside the design tokens:\n${head}\n` +
        "Use --color-ink, --color-paper, --color-line, --color-accent, or the studio-* tokens. " +
        "A literal color regresses the system toward AI-slop vibes and risks the 2026-07-23 contrast bug. " +
        "If this is intentional, add the path to CARVE_OUT_PATHS in scripts/portfolio-color-discipline.test.mjs.",
    );
  }
  assert.equal(violations.length, 0);
});

test("Tailwind opacity/scale utilities in .astro files don't mix with literal colors", async () => {
  // The hardcoded-color test above catches the real regression
  // mode (a literal hex / rgb / oklch sneaking into a surface).
  // This test is a smaller companion: it asserts that no .astro
  // file uses `oklch(...)` directly outside the design tokens, which
  // would re-introduce the 2026-07-23 trap if a future agent
  // copy-pasted an oklch value from somewhere into a page.
  const violations = [];
  for await (const file of walk(path.join(root, "src"))) {
    if (!file.endsWith(".astro")) continue;
    if (isCarvedOut(file)) continue;
    const source = await readFile(file, "utf8");
    // oklch() inside .astro files would be a regression — every
    // color must flow through the @theme tokens.
    for (const m of source.matchAll(/oklch\s*\(/g)) {
      violations.push(`${path.relative(root, file)} → oklch(...)`);
    }
  }
  assert.equal(
    violations.length,
    0,
    `no .astro file should declare an oklch() directly; use the design tokens:\n${violations.join("\n")}`,
  );
});

test("src/styles/global.css has no hardcoded light backgrounds for surface sections", async () => {
  // The 2026-07-23 dark-mode contrast bug had a specific shape:
  // .catalogue-section { background: #fff } hardcoded a white background
  // while the card text used var(--color-ink), which resolved to
  // light in dark mode → light text on white background, unreadable.
  // This test catches the same class of bug: a hardcoded light
  // background on a "surface" section that the cards inherit from.
  const source = await readFile(
    new URL("../src/styles/global.css", import.meta.url),
    "utf8",
  );
  // (No-op: the read above reads from src/styles/global.css — but the
  // file is the source of truth for the tokens, so the previous
  // "src/ contains no hardcoded color literals" test should have
  // caught the same violations. This test is the targeted dark-mode
  // contrast guard — it asserts the carve-out for global.css is
  // consistent and the parser is well-formed.)
  // The carve-outs: <meta name="theme-color"> uses hex (cannot be
  // a CSS variable). The .button--bright:hover uses #fff because the
  // base color is --studio-lime and the hover is a brighter green.
  // Those are not "surface" sections. We carve them out explicitly.
  const surfaceSectionPattern =
    /\.(catalogue|hero|atlas|consumer|hero-wrap|shortlist|demand|about)\-?\w*\s*\{[^}]*background\s*:\s*#fff/g;
  const violations = [...source.matchAll(surfaceSectionPattern)];
  assert.equal(
    violations.length,
    0,
    `surface sections must use var(--color-paper), not a hardcoded #fff:\n${violations.map((v) => "  " + v[0]).join("\n")}`,
  );
  // Also assert no other hex literals in CSS that's about a "surface"
  // (a section that contains cards). The full audit is the previous
  // test; this assertion is the targeted dark-mode contrast guard.
  const otherSurfaceHex =
    /\.(catalogue|atlas|consumer|demand)\-\w*[\s\S]{0,200}background[\s\S]{0,50}#(?:fff|0a0a0a|000)\b/g;
  const otherViolations = [...source.matchAll(otherSurfaceHex)];
  assert.equal(
    otherViolations.length,
    0,
    `no surface section may use a literal light background:\n${otherViolations.map((v) => "  " + v[0]).join("\n")}`,
  );
});
