import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
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

test("Vercel publishes only output that passed the canonical proof", async () => {
  const config = JSON.parse(
    await readFile(new URL("../vercel.json", import.meta.url), "utf8"),
  );

  assert.equal(config.framework, "astro");
  assert.equal(config.buildCommand, "npm run proof");
  assert.equal(config.outputDirectory, "dist");
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

test("Vercel applies the approved static-site security policy", async () => {
  const config = JSON.parse(
    await readFile(new URL("../vercel.json", import.meta.url), "utf8"),
  );
  const expected = {
    "Content-Security-Policy":
      "default-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; object-src 'none'; script-src 'none'",
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy":
      "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  };

  assert.deepEqual(config.headers, [
    {
      source: "/(.*)",
      headers: Object.entries(expected).map(([key, value]) => ({ key, value })),
    },
  ]);
});
