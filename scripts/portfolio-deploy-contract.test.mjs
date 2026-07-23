import assert from "node:assert/strict";
import { mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const formatChecker = fileURLToPath(
  new URL("./check-vercel-format.mjs", import.meta.url),
);

function git(cwd, args) {
  const result = spawnSync("git", args, { cwd, encoding: "utf8" });
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
}

test("vibe container serves the approved static-site security policy", async () => {
  // Replaces the old "Vercel publishes only output that passed the
  // canonical proof" test now that the portfolio is hosted on the
  // Armalo vibe Hetzner box (infra/handoff.md). The active deployment
  // config is infra/vibe-container.sh, which bakes a nginx.conf with
  // the same approved static-site security policy that used to live
  // in vercel.json.
  const source = await readFile(
    new URL("../infra/vibe-container.sh", import.meta.url),
    "utf8",
  );
  const expected = {
    "Content-Security-Policy":
      "default-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; object-src 'none'; script-src 'self' 'unsafe-inline'",
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy":
      "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
    "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  };
  for (const [name, value] of Object.entries(expected)) {
    assert.ok(
      source.includes(value),
      `infra/vibe-container.sh is missing the approved ${name}: ${value}`,
    );
  }
});

test("vibe Caddy patch routes portfolio.armalo.ai to the static container", async () => {
  const patch = await readFile(
    new URL("../infra/vibe-caddy.patch", import.meta.url),
    "utf8",
  );
  assert.match(
    patch,
    /portfolio\.armalo\.ai\s*\{[^}]*reverse_proxy\s+127\.0\.0\.1:3030/s,
    "Caddy patch must route portfolio.armalo.ai to the static container on :3030",
  );
  assert.match(
    patch,
    /encode zstd gzip/,
    "Caddy patch must request zstd+gzip encoding",
  );
});

test("Route53 record is the A record for portfolio.armalo.ai -> vibe", async () => {
  const changeBatch = JSON.parse(
    await readFile(
      new URL("../infra/route53-portfolio.json", import.meta.url),
      "utf8",
    ),
  );
  assert.equal(changeBatch.Changes.length, 1);
  const change = changeBatch.Changes[0];
  assert.equal(change.Action, "UPSERT");
  assert.equal(change.ResourceRecordSet.Name, "portfolio.armalo.ai.");
  assert.equal(change.ResourceRecordSet.Type, "A");
  assert.deepEqual(change.ResourceRecordSet.ResourceRecords, [
    { Value: "5.78.90.97" },
  ]);
});

test("vercel.json is an inert sentinel (off-Vercel move)", async () => {
  // The portfolio is no longer deployed via Vercel. vercel.json is kept
  // as a documented sentinel so any stray Vercel scanner / framework
  // detector falls back to defaults rather than running an outdated
  // build. The active deployment config lives in infra/.
  const config = JSON.parse(
    await readFile(new URL("../vercel.json", import.meta.url), "utf8"),
  );
  // The sentinel must not try to run a real build, and must not claim
  // a framework that's actually live (so Vercel doesn't pretend to
  // own the deploy).
  assert.equal(
    config.framework,
    "other",
    "vercel.json framework must be 'other' so Vercel stops owning the deploy",
  );
  assert.match(
    config.buildCommand,
    /no longer deployed via Vercel/,
    "vercel.json buildCommand must announce the off-Vercel move",
  );
});

test("GitHub Actions stays intentionally dormant while the owner billing gate is closed", async () => {
  const workflowsDirectory = new URL("../.github/workflows/", import.meta.url);
  const workflowFiles = await readdir(workflowsDirectory).catch((error) => {
    if (error.code === "ENOENT") return [];
    throw error;
  });

  assert.deepEqual(
    workflowFiles.filter((file) => /\.ya?ml$/i.test(file)),
    [],
    "Do not add runnable GitHub Actions workflows without direct owner approval",
  );

  const readme = await readFile(
    new URL("../README.md", import.meta.url),
    "utf8",
  );
  const goals = await readFile(new URL("../GOALS.md", import.meta.url), "utf8");
  assert.match(readme, /GitHub Actions is intentionally disabled/);
  assert.match(goals, /GitHub Actions remains disabled/);
});

test("Vercel-generated surfaces stay outside the authored-source format gate", async () => {
  const ignored = new Set(
    (await readFile(new URL("../.prettierignore", import.meta.url), "utf8"))
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#")),
  );

  for (const path of [
    ".astro/",
    ".lavish/",
    ".gstack/",
    ".vercel/",
    "dist/",
    "vercel.json",
  ]) {
    assert.ok(ignored.has(path), `${path} must be excluded from format:check`);
  }
});

test("Vercel uploads exclude local agent state", async () => {
  const ignored = new Set(
    (await readFile(new URL("../.vercelignore", import.meta.url), "utf8"))
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#")),
  );

  for (const path of [
    ".gstack/",
    ".portfolio-proof.lock/",
    ".lavish/",
    ".firstmate/",
    ".no-mistakes/",
    ".treehouse/",
  ]) {
    assert.ok(ignored.has(path), `${path} must not upload to Vercel`);
  }
});

test("Vercel uploads exclude foreign package-manager artifacts", async () => {
  // The 2026-07-15 -> 2026-07-21 production Error streak was caused
  // by Vercel auto-detecting pnpm from a stray pnpm-lock.yaml in the
  // upload, which switched the install to pnpm and ignored the npm
  // overrides in package.json (the GHSA patches). Locking the upload
  // contract so a future agent cannot accidentally re-trigger this.
  const ignored = new Set(
    (await readFile(new URL("../.vercelignore", import.meta.url), "utf8"))
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
      `${path} must not upload to Vercel (Vercel would auto-detect the matching package manager)`,
    );
  }
});

test("the format gate checks committed authored Vercel config", async (t) => {
  const fixture = await mkdtemp(
    path.join(tmpdir(), "portfolio-vercel-format-"),
  );
  t.after(() => rm(fixture, { recursive: true, force: true }));
  git(fixture, ["init", "-q"]);
  git(fixture, ["config", "user.email", "fixture@example.com"]);
  git(fixture, ["config", "user.name", "Fixture"]);

  await writeFile(path.join(fixture, "vercel.json"), '{"framework":"astro"}\n');
  git(fixture, ["add", "vercel.json"]);
  git(fixture, ["commit", "-qm", "malformed config"]);

  const malformed = spawnSync(process.execPath, [formatChecker], {
    encoding: "utf8",
    env: { ...process.env, PORTFOLIO_FORMAT_ROOT: fixture },
  });
  assert.notEqual(malformed.status, 0, malformed.stdout);
  assert.match(malformed.stdout, /committed vercel\.json is not formatted/);

  await writeFile(
    path.join(fixture, "vercel.json"),
    '{\n  "framework": "astro"\n}\n',
  );
  git(fixture, ["add", "vercel.json"]);
  git(fixture, ["commit", "-qm", "formatted config"]);

  const formatted = spawnSync(process.execPath, [formatChecker], {
    encoding: "utf8",
    env: { ...process.env, PORTFOLIO_FORMAT_ROOT: fixture },
  });
  assert.equal(formatted.status, 0, `${formatted.stdout}\n${formatted.stderr}`);
  assert.match(formatted.stdout, /committed vercel\.json format passed/);

  const packageJson = JSON.parse(
    await readFile(new URL("../package.json", import.meta.url), "utf8"),
  );
  const proof = await readFile(
    new URL("./portfolio-proof.sh", import.meta.url),
    "utf8",
  );
  assert.equal(
    packageJson.scripts["format:vercel"],
    "node scripts/check-vercel-format.mjs",
  );
  assert.match(proof, /npm run format:vercel/);
});

test("the Vercel format gate validates upload archives without Git metadata", async (t) => {
  const fixture = await mkdtemp(
    path.join(tmpdir(), "portfolio-vercel-upload-"),
  );
  t.after(() => rm(fixture, { recursive: true, force: true }));

  await writeFile(
    path.join(fixture, "vercel.json"),
    '{"framework":"astro","buildCommand":"npm run build","outputDirectory":"dist"}\n',
  );
  const malformed = spawnSync(process.execPath, [formatChecker], {
    encoding: "utf8",
    env: { ...process.env, PORTFOLIO_FORMAT_ROOT: fixture },
  });
  assert.notEqual(malformed.status, 0, malformed.stdout);
  assert.match(
    malformed.stdout,
    /uploaded vercel\.json deploy contract is invalid/,
  );

  await writeFile(
    path.join(fixture, "vercel.json"),
    '{"framework":"astro","buildCommand":"npm run proof","outputDirectory":"dist"}\n',
  );
  const formatted = spawnSync(process.execPath, [formatChecker], {
    encoding: "utf8",
    env: { ...process.env, PORTFOLIO_FORMAT_ROOT: fixture },
  });
  assert.equal(formatted.status, 0, `${formatted.stdout}\n${formatted.stderr}`);
  assert.match(
    formatted.stdout,
    /uploaded vercel\.json deploy contract passed/,
  );
});

test("vercel.json is an inert sentinel (no live security policy)", async () => {
  // The portfolio is no longer deployed via Vercel; vercel.json is kept
  // as a sentinel that announces the off-Vercel move. It must NOT
  // claim a live security policy in its headers array, because the
  // active policy lives in infra/vibe-container.sh (asserted by the
  // "vibe container serves the approved static-site security policy"
  // test above). Drift here means vercel.json is trying to be live.
  const config = JSON.parse(
    await readFile(new URL("../vercel.json", import.meta.url), "utf8"),
  );
  assert.deepEqual(
    config.headers,
    [],
    "vercel.json must not carry a live security policy; the active policy lives in infra/vibe-container.sh",
  );
});
