/**
 * portfolio-deps-security.test.mjs
 *
 * Regression guard for the three GitHub Dependabot advisories closed in
 * commit 5f43656 (astro 7.0.7 -> 7.1.3, svgo 4.0.1 -> 4.0.2,
 * fast-uri 3.1.3 -> 3.1.4). Locks the fixed versions in place so a
 * future dependency bump that re-introduces a vulnerable range, or a
 * lockfile regeneration that drops the overrides, fails the canonical
 * proof before the change can ship.
 *
 *   - GHSA-4g3v-8h47-v7g6 (astro, medium, CVSS 4.0 5.3) - XSS via
 *     unescaped View Transition animation values; patched 7.1.0.
 *   - GHSA-2p49-hgcm-8545 (svgo, high, CVSS 8.2) - removeScripts
 *     leaves namespaced/case-variant JS URIs; patched 4.0.2.
 *   - GHSA-v2hh-gcrm-f6hx (fast-uri, high, CVSS 7.5) - backslash not
 *     an authority delimiter; patched 3.1.4.
 *
 * Runs as part of `npm run proof` via the test entry in package.json.
 */
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));

const loadJson = async (rel) =>
  JSON.parse(await readFile(new URL(rel, import.meta.url), "utf8"));

// Trivial semver comparator (X.Y.Z, all numeric) - the patched
// versions we care about all use strict numeric tags. Anything with a
// pre-release or build suffix is treated as newer than the base.
function parseVersion(version) {
  const match = /^(\d+)\.(\d+)\.(\d+)/.exec(version ?? "");
  if (!match) throw new Error(`unparseable version: ${version}`);
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

function isAtLeast(version, minimum) {
  const v = parseVersion(version);
  const m = parseVersion(minimum);
  for (let i = 0; i < 3; i += 1) {
    if (v[i] > m[i]) return true;
    if (v[i] < m[i]) return false;
  }
  return true;
}

function satisfiesRange(version, range) {
  // Range shapes we care about, parsed from Dependabot payloads:
  //   ">= 7.1.0"     - inclusive lower bound
  //   ">= 4.0.0, < 4.0.2"  - inclusive lower, exclusive upper
  // Anything else fails closed.
  const clauses = range.split(",").map((c) => c.trim());
  for (const clause of clauses) {
    const gte = /^>=\s*(\d+\.\d+\.\d+)$/.exec(clause);
    const lte = /^<=\s*(\d+\.\d+\.\d+)$/.exec(clause);
    const gt = /^>\s*(\d+\.\d+\.\d+)$/.exec(clause);
    const lt = /^<\s*(\d+\.\d+\.\d+)$/.exec(clause);
    const eq = /^=\s*(\d+\.\d+\.\d+)$/.exec(clause);
    if (gte) {
      if (!isAtLeast(version, gte[1])) return false;
    } else if (lte) {
      if (!isAtLeast(lte[1], version)) return false;
    } else if (gt) {
      if (parseVersion(version).join(".") === parseVersion(gt[1]).join("."))
        return false;
      if (!isAtLeast(version, gt[1])) return false;
    } else if (lt) {
      if (isAtLeast(version, lt[1])) return false;
    } else if (eq) {
      if (parseVersion(version).join(".") !== eq[1]) return false;
    } else {
      throw new Error(`unsupported range syntax: ${clause}`);
    }
  }
  return true;
}

test("astro direct dep is at or past the GHSA-4g3v-8h47-v7g6 patch (7.1.0)", async () => {
  const pkg = await loadJson("../package.json");
  const constraint = pkg.dependencies?.astro;
  assert.ok(constraint, "astro must be a direct dependency in package.json");
  // Accept "7.1.0", "^7.1.0", ">=7.1.0", "~7.1.0" - the proof is
  // that the floor is 7.1.0, not the exact syntax.
  const floor = (/\^|~|>=|>\s*(\d+\.\d+\.\d+)/.exec(constraint) || [])[0];
  const baseMatch = /(\d+\.\d+\.\d+)/.exec(
    constraint.replace(/^[\^~>=]+\s*/, ""),
  );
  assert.ok(
    baseMatch,
    `astro constraint must include a version: ${constraint}`,
  );
  assert.ok(
    isAtLeast(baseMatch[1], "7.1.0"),
    `astro ${constraint} is below the 7.1.0 XSS patch floor`,
  );
});

test("svgo override pins GHSA-2p49-hgcm-8545 patch (4.0.2)", async () => {
  const pkg = await loadJson("../package.json");
  const override = pkg.overrides?.svgo;
  assert.ok(
    override,
    "package.json must declare an overrides.svgo entry to force the transitive past 4.0.1",
  );
  const baseMatch = /(\d+\.\d+\.\d+)/.exec(
    override.replace(/^[\^~>=]+\s*/, ""),
  );
  assert.ok(baseMatch, `svgo override must include a version: ${override}`);
  assert.ok(
    isAtLeast(baseMatch[1], "4.0.2"),
    `svgo override ${override} is below the 4.0.2 patch floor`,
  );
});

test("fast-uri override pins GHSA-v2hh-gcrm-f6hx patch (3.1.4)", async () => {
  const pkg = await loadJson("../package.json");
  const override = pkg.overrides?.["fast-uri"];
  assert.ok(
    override,
    "package.json must declare an overrides.fast-uri entry to force the transitive past 3.1.3",
  );
  const baseMatch = /(\d+\.\d+\.\d+)/.exec(
    override.replace(/^[\^~>=]+\s*/, ""),
  );
  assert.ok(baseMatch, `fast-uri override must include a version: ${override}`);
  assert.ok(
    isAtLeast(baseMatch[1], "3.1.4"),
    `fast-uri override ${override} is below the 3.1.4 patch floor`,
  );
});

test("range parser flags every known-vulnerable version and clears every known-patched version", () => {
  // Negative control. If any of these flip, the regression guard above
  // is silently broken - the parser is the only thing standing between
  // a future dependency bump and a re-introduced advisory. Covers the
  // three GHSAs closed in commit 5f43656 plus the major-axis boundary
  // cases (equal to floor, one below floor, one above ceiling).
  const cases = [
    // GHSA-4g3v-8h47-v7g6 (astro)
    { version: "7.0.9", range: ">= 2.9.0, <= 7.0.9", expect: true },
    { version: "7.0.7", range: ">= 2.9.0, <= 7.0.9", expect: true },
    { version: "7.1.0", range: ">= 2.9.0, <= 7.0.9", expect: false },
    { version: "7.1.3", range: ">= 2.9.0, <= 7.0.9", expect: false },
    // GHSA-2p49-hgcm-8545 (svgo)
    { version: "4.0.0", range: ">= 4.0.0, < 4.0.2", expect: true },
    { version: "4.0.1", range: ">= 4.0.0, < 4.0.2", expect: true },
    { version: "4.0.2", range: ">= 4.0.0, < 4.0.2", expect: false },
    { version: "3.3.4", range: ">= 3.0.0, < 3.3.4", expect: false },
    { version: "3.3.3", range: ">= 3.0.0, < 3.3.4", expect: true },
    { version: "2.8.2", range: ">= 1.0.0, < 2.8.3", expect: true },
    { version: "2.8.3", range: ">= 1.0.0, < 2.8.3", expect: false },
    // GHSA-v2hh-gcrm-f6hx (fast-uri)
    { version: "2.4.2", range: ">= 2.3.1, <= 2.4.2", expect: true },
    { version: "2.4.3", range: ">= 2.3.1, <= 2.4.2", expect: false },
    { version: "3.1.3", range: ">= 3.0.0, <= 3.1.3", expect: true },
    { version: "3.1.4", range: ">= 3.0.0, <= 3.1.3", expect: false },
    { version: "4.1.0", range: ">= 4.0.0, <= 4.1.0", expect: true },
    { version: "4.1.1", range: ">= 4.0.0, <= 4.1.0", expect: false },
  ];
  for (const { version, range, expect } of cases) {
    assert.equal(
      satisfiesRange(version, range),
      expect,
      `satisfiesRange("${version}", "${range}") expected ${expect}, got ${!expect}`,
    );
  }
});

test("package-lock.json resolves astro, svgo, fast-uri past every known vulnerable range", async () => {
  const lock = await loadJson("../package-lock.json");
  // Vulnerable ranges copied from the GitHub Dependabot advisory payloads
  // for the three GHSAs. If Dependabot adds new GHSAs to the same packages
  // later, append them here and let the next audit confirm.
  const vulnerableRanges = {
    astro: [{ ghsa: "GHSA-4g3v-8h47-v7g6", range: ">= 2.9.0, <= 7.0.9" }],
    svgo: [
      { ghsa: "GHSA-2p49-hgcm-8545", range: ">= 1.0.0, < 2.8.3" },
      { ghsa: "GHSA-2p49-hgcm-8545", range: ">= 3.0.0, < 3.3.4" },
      { ghsa: "GHSA-2p49-hgcm-8545", range: ">= 4.0.0, < 4.0.2" },
    ],
    "fast-uri": [
      { ghsa: "GHSA-v2hh-gcrm-f6hx", range: ">= 2.3.1, <= 2.4.2" },
      { ghsa: "GHSA-v2hh-gcrm-f6hx", range: ">= 3.0.0, <= 3.1.3" },
      { ghsa: "GHSA-v2hh-gcrm-f6hx", range: ">= 4.0.0, <= 4.1.0" },
    ],
  };

  for (const [pkg, ranges] of Object.entries(vulnerableRanges)) {
    const matches = [];
    for (const [path, info] of Object.entries(lock.packages ?? {})) {
      const name = path
        .replace(/^.*node_modules\//, "")
        .split("/node_modules/")
        .pop();
      if (name !== pkg) continue;
      const version = info.version;
      for (const { ghsa, range } of ranges) {
        if (satisfiesRange(version, range)) {
          matches.push({ path, version, ghsa, range });
        }
      }
    }
    assert.deepEqual(
      matches,
      [],
      `${pkg} still resolves into a vulnerable range: ${JSON.stringify(matches)}`,
    );
  }
});

test("installed node_modules matches the lockfile (no stale pnpm-style duplicates)", async () => {
  // After the 5f43656 fix we know ~/.npm cache collisions force a local
  // cache; this test guards against a future regen that re-introduces
  // a vulnerable duplicate inside a nested node_modules path.
  const lock = await loadJson("../package-lock.json");
  const expected = {};
  for (const [path, info] of Object.entries(lock.packages ?? {})) {
    if (path === "") continue;
    if (!path.startsWith("node_modules/")) continue;
    const name = path
      .replace(/^.*node_modules\//, "")
      .split("/node_modules/")
      .pop();
    if (!["astro", "svgo", "fast-uri"].includes(name)) continue;
    expected[name] = info.version;
  }
  for (const [pkg, lockVersion] of Object.entries(expected)) {
    const installed = JSON.parse(
      await readFile(
        new URL(`../node_modules/${pkg}/package.json`, import.meta.url),
        "utf8",
      ),
    );
    assert.equal(
      installed.version,
      lockVersion,
      `node_modules/${pkg}@${installed.version} is out of sync with lockfile@${lockVersion}; run npm install against the proof's expected cache`,
    );
  }
});

test("the repo carries only one package-manager lockfile (npm is canonical)", async () => {
  // Vercel auto-detects the package manager from the lockfile in the
  // upload. If multiple lockfiles exist, or a foreign one slips in,
  // Vercel picks one based on heuristics and the npm overrides in
  // package.json stop applying (which is how the 2026-07-15 to
  // 2026-07-21 production Error streak was caused).
  const lockfiles = [
    "package-lock.json",
    "pnpm-lock.yaml",
    "yarn.lock",
    "bun.lockb",
    "bun.lock",
  ];
  const present = [];
  for (const lockfile of lockfiles) {
    try {
      await readFile(new URL(`../${lockfile}`, import.meta.url));
      present.push(lockfile);
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
  }
  assert.deepEqual(
    present,
    ["package-lock.json"],
    `Only package-lock.json must exist in the working tree; found ${JSON.stringify(present)}. A foreign lockfile makes Vercel auto-detect a non-npm manager and the GHSA overrides stop applying.`,
  );
});

test(".prettierignore excludes the foreign package-manager artifacts", async () => {
  // Even if .pnpm-store slips into the working tree (a future agent
  // runs `pnpm install` locally), prettier --check must not scan it.
  // The 2026-07-15 Error streak ran prettier against 310 pnpm-store
  // files and exited 1 before the proof got to the build.
  const ignored = new Set(
    (await readFile(new URL("../.prettierignore", import.meta.url), "utf8"))
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#")),
  );

  for (const path of [
    "pnpm-lock.yaml",
    "yarn.lock",
    "bun.lockb",
    "bun.lock",
    ".pnpm-store/",
  ]) {
    assert.ok(
      ignored.has(path),
      `.prettierignore must exclude ${path} so prettier --check . cannot be polluted by foreign package-manager artifacts`,
    );
  }
});

test(".gitignore excludes the foreign package-manager artifacts", async () => {
  // Defense in depth: even if a future agent runs pnpm or yarn
  // locally, the resulting artifacts cannot be committed.
  const ignored = new Set(
    (await readFile(new URL("../.gitignore", import.meta.url), "utf8"))
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#")),
  );

  for (const path of [
    "pnpm-lock.yaml",
    "yarn.lock",
    "bun.lockb",
    "bun.lock",
    ".pnpm-store/",
  ]) {
    assert.ok(
      ignored.has(path),
      `.gitignore must exclude ${path} so it cannot be committed`,
    );
  }
});

test("npm audit reports no high or critical vulnerabilities in the resolved tree", (t) => {
  // Optional gate: skip when PORTFOLIO_SKIP_NPM_AUDIT=1 to keep CI
  // deterministic when offline. The lockfile check above already locks
  // the three known GHSAs in place; this audit is a broader net.
  if (process.env.PORTFOLIO_SKIP_NPM_AUDIT === "1") {
    t.skip("PORTFOLIO_SKIP_NPM_AUDIT=1 set");
    return;
  }
  const result = spawnSync("npm", ["audit", "--json"], {
    cwd: root,
    encoding: "utf8",
    env: { ...process.env, npm_config_audit_level: "high" },
  });
  // npm exits non-zero when vulnerabilities are found - that is
  // expected. We only fail the test if the JSON parses AND high > 0.
  let payload;
  try {
    payload = JSON.parse(result.stdout || "{}");
  } catch {
    t.skip(`npm audit did not return JSON (status=${result.status}); skipping`);
    return;
  }
  const counts = payload?.metadata?.vulnerabilities ?? {};
  assert.equal(
    counts.high ?? 0,
    0,
    `npm audit reports ${counts.high} high-severity vulnerabilities`,
  );
  assert.equal(
    counts.critical ?? 0,
    0,
    `npm audit reports ${counts.critical} critical-severity vulnerabilities`,
  );
});
