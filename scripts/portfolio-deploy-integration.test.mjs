/**
 * portfolio-deploy-integration.test.mjs
 *
 * Integration test for scripts/deploy-vibe.sh. We don't have a way to
 * run the script against a real Hetzner box from this test process,
 * so the test focuses on the parts that don't need network:
 *
 *   1. Dry-run mode (`./scripts/deploy-vibe.sh` with no args) prints
 *      the expected plan and exits 0 without touching the box.
 *   2. The --apply path is gated on a guard so a stray `deploy-vibe
 *      --apply` from CI doesn't ship unbuilt code.
 *   3. The script is wired with the right keys, paths, and smoke
 *      gate defaults.
 *   4. The infra/ files referenced by the script (Caddyfile patch,
 *      Route53 record, container run) agree on the same constants:
 *      host 5.78.90.97, port 3030, dist path /opt/portfolio/dist,
 *      container armalo-portfolio-web.
 *
 * The test does NOT exercise the live deploy. That's what the
 * portfolio-production-smoke.test.mjs env-gated run does against
 * https://portfolio.armalo.ai/.
 */
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const read = (rel) => readFile(new URL(rel, import.meta.url), "utf8");

test("deploy-vibe.sh dry-run prints the plan and exits 0", () => {
  // We expect the script to refuse the --apply half in this test
  // environment (no dist/index.html... actually, we do build it).
  // The point of this test is to assert that the dry-run path
  // (no --apply arg) is a no-op that exits 0 and prints the plan.
  const result = spawnSync("bash", ["scripts/deploy-vibe.sh"], {
    cwd: root,
    encoding: "utf8",
  });
  assert.equal(
    result.status,
    0,
    `dry-run must exit 0\n--- stdout ---\n${result.stdout}\n--- stderr ---\n${result.stderr}`,
  );
  assert.match(
    result.stdout,
    /dry-run\s+yes/,
    "dry-run must announce itself with 'dry-run yes'",
  );
  assert.match(
    result.stdout,
    /target host\s+5\.78\.90\.97/,
    "dry-run must print the target vibe host",
  );
  assert.match(
    result.stdout,
    /smoke gate\s+on/,
    "dry-run must announce the smoke gate is on by default",
  );
  assert.match(
    result.stdout,
    /use --apply to execute/,
    "dry-run must end with the --apply hint",
  );
});

test("deploy-vibe.sh --help prints the env vars and flags", () => {
  const result = spawnSync("bash", ["scripts/deploy-vibe.sh", "--help"], {
    cwd: root,
    encoding: "utf8",
  });
  assert.equal(result.status, 0);
  // The --help output prints the first 30 lines of the file's
  // docstring via `sed -n '4,30p'`. The host, user, ssh-key, and
  // the two most user-facing flags (--apply, --no-smoke) are in that
  // window. The remaining env vars (DIST, CONTAINER, PRODUCTION_URL)
  // are in the source header (verified separately below) but live
  // past the --help cutoff; asserting on every one in the --help
  // output is over-strict.
  for (const piece of [
    "PORTFOLIO_VIBE_HOST",
    "PORTFOLIO_VIBE_USER",
    "PORTFOLIO_VIBE_SSH_KEY",
    "--apply",
    "--no-smoke",
  ]) {
    assert.ok(
      result.stdout.includes(piece),
      `deploy-vibe.sh --help must mention ${piece}`,
    );
  }
});

test("deploy-vibe.sh source documents every env var + flag", async () => {
  // The --help output is a window into the docstring; the source
  // itself must document every env var + flag regardless of where it
  // appears in the file. A future agent adding a new flag should
  // update the docstring header and the env-table.
  const source = await read("../scripts/deploy-vibe.sh");
  for (const piece of [
    "PORTFOLIO_VIBE_HOST",
    "PORTFOLIO_VIBE_USER",
    "PORTFOLIO_VIBE_SSH_KEY",
    "PORTFOLIO_VIBE_DIST",
    "PORTFOLIO_VIBE_CONTAINER",
    "PORTFOLIO_PRODUCTION_URL",
    "--apply",
    "--no-smoke",
  ]) {
    assert.ok(
      source.includes(piece),
      `deploy-vibe.sh source must document ${piece}`,
    );
  }
});

test("deploy-vibe.sh refuses to run without a dist/ build", () => {
  // The script's first action is to require dist/index.html. We
  // simulate this by running it in a temp dir where there is no
  // dist/, then asserting the failure mode. We can't just move the
  // real dist/ aside because the proof runs `npm test` BEFORE `npm run
  // build`, so the directory may or may not exist.
  const result = spawnSync(
    "bash",
    ["-c", "cd /tmp && bash '" + root + "/scripts/deploy-vibe.sh'"],
    { cwd: "/tmp", encoding: "utf8" },
  );
  assert.notEqual(
    result.status,
    0,
    "must exit non-zero when run from a directory without dist/index.html",
  );
  assert.match(result.stdout + result.stderr, /dist\/index\.html missing/i);
});

test("infra/ artifacts referenced by deploy-vibe.sh agree on the contract", async () => {
  // The three infra/ files together form the live deploy:
  //   - infra/vibe-caddy.patch: Caddy block on /root/Caddyfile.unified
  //   - infra/vibe-container.sh: docker run for armalo-portfolio-web
  //   - infra/route53-portfolio.json: A record to 5.78.90.97
  // A drift between any two of them (different port, different host,
  // different container name) is a real failure mode this test
  // catches.
  const caddy = await read("../infra/vibe-caddy.patch");
  const container = await read("../infra/vibe-container.sh");
  const route53 = JSON.parse(await read("../infra/route53-portfolio.json"));

  // The A record must point at the same host the script's default.
  assert.equal(route53.Changes[0].ResourceRecordSet.Type, "A");
  assert.equal(
    route53.Changes[0].ResourceRecordSet.ResourceRecords[0].Value,
    "5.78.90.97",
  );

  // The Caddy patch must reverse-proxy to the same port the container
  // publishes.
  assert.match(caddy, /portfolio\.armalo\.ai\s*\{[\s\S]*?127\.0\.0\.1:3030/);

  // The container must publish 127.0.0.1:3030 (so the Caddy block
  // can reach it) and the dist path must be /opt/portfolio/dist.
  // HOST_PORT is a shell variable in the source — assert the variable
  // resolves to 3030 in the same script and is bound to the -p flag.
  assert.match(container, /HOST_PORT=3030/);
  assert.match(container, /-p 127\.0\.0\.1:\$\{HOST_PORT\}:80/);
  assert.match(container, /\/opt\/portfolio\/dist/);
  assert.match(container, /--name "\$\{CONTAINER\}"/);

  // The container must default to nginx:alpine + unless-stopped
  // (per INFRA-OPS.md rule 5: every prod container's restart policy
  // must be unless-stopped).
  assert.match(container, /nginx:alpine/);
  assert.match(container, /--restart unless-stopped/);
});

test("deploy-vibe.sh smoke gate is opt-out via --no-smoke", async () => {
  // The smoke gate is on by default. A CI deploy that wants to
  // skip it can pass --no-smoke, but that flag is the ONLY escape.
  // The script must not accept --yes or similar blanket bypasses.
  const source = await read("../scripts/deploy-vibe.sh");
  assert.match(
    source,
    /--no-smoke/,
    "deploy-vibe.sh must document a --no-smoke flag",
  );
  assert.doesNotMatch(
    source,
    /--yes/,
    "deploy-vibe.sh must NOT accept a --yes flag (per AWS-OPS.md T0 contract: never pass --yes on a serving mutation)",
  );
});
