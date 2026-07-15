import assert from "node:assert/strict";
import { access, mkdir, mkdtemp, readFile, rm, utimes } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawn, spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const proofScript = path.join(root, "scripts/portfolio-proof.sh");

function lockEnvironment(lockDir, timeoutSeconds, extra = {}) {
  return {
    ...process.env,
    PORTFOLIO_PROOF_LOCK_DIR: lockDir,
    PORTFOLIO_PROOF_LOCK_ONLY: "1",
    PORTFOLIO_PROOF_LOCK_TIMEOUT_SECONDS: String(timeoutSeconds),
    ...extra,
  };
}

function runLockOnly(lockDir, timeoutSeconds = 2, extra = {}) {
  return spawnSync("bash", [proofScript], {
    cwd: root,
    encoding: "utf8",
    env: lockEnvironment(lockDir, timeoutSeconds, extra),
  });
}

function startLockOnly(lockDir, timeoutSeconds = 5, extra = {}) {
  return new Promise((resolve) => {
    const child = spawn("bash", [proofScript], {
      cwd: root,
      env: lockEnvironment(lockDir, timeoutSeconds, extra),
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => {
      stdout += chunk;
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk;
    });
    child.on("close", (status) => resolve({ status, stdout, stderr }));
  });
}

async function makeLockOld(lockDir) {
  const old = new Date(Date.now() - 10_000);
  await utimes(lockDir, old, old);
}

test("proof lock defaults to a bounded 120-second wait", async () => {
  const source = await readFile(proofScript, "utf8");
  assert.match(
    source,
    /PORTFOLIO_PROOF_LOCK_TIMEOUT_SECONDS:-120/,
    "expected a 120-second default lock timeout",
  );
  assert.match(
    source,
    /PORTFOLIO_PROOF_LOCK_STALE_GRACE_SECONDS:-2/,
    "expected a documented two-second metadata grace window",
  );
  assert.doesNotMatch(source, /\bflock\b/, "proof lock must remain portable");
});

test("simultaneous stale waiters claim one stale directory and never overlap", async (t) => {
  const temporary = await mkdtemp(path.join(tmpdir(), "portfolio-proof-race-"));
  const lockDir = path.join(temporary, "proof.lock");
  t.after(() => rm(temporary, { recursive: true, force: true }));

  await mkdir(lockDir);
  await mkdir(path.join(lockDir, "owner.999999999"));

  const started = performance.now();
  const [first, second] = await Promise.all([
    startLockOnly(lockDir, 5, { PORTFOLIO_PROOF_LOCK_HOLD_SECONDS: "1" }),
    startLockOnly(lockDir, 5, { PORTFOLIO_PROOF_LOCK_HOLD_SECONDS: "1" }),
  ]);
  const elapsed = performance.now() - started;

  assert.equal(first.status, 0, `${first.stdout}\n${first.stderr}`);
  assert.equal(second.status, 0, `${second.stdout}\n${second.stderr}`);
  assert.ok(
    elapsed >= 1_800,
    `critical sections overlapped: both one-second holders finished in ${elapsed.toFixed(0)}ms`,
  );
  assert.equal(
    [first.stdout, second.stdout].filter((output) =>
      /recovered stale proof lock/.test(output),
    ).length,
    1,
    "exactly one waiter must claim the original stale directory",
  );
});

test("proof recovers an ownerless lock after the metadata grace window", async (t) => {
  const temporary = await mkdtemp(
    path.join(tmpdir(), "portfolio-proof-ownerless-"),
  );
  const lockDir = path.join(temporary, "proof.lock");
  t.after(() => rm(temporary, { recursive: true, force: true }));

  await mkdir(lockDir);
  await makeLockOld(lockDir);

  const result = runLockOnly(lockDir, 3);
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /recovered stale proof lock with missing PID/);
});

test("proof recovers a malformed PID lock after the metadata grace window", async (t) => {
  const temporary = await mkdtemp(
    path.join(tmpdir(), "portfolio-proof-malformed-"),
  );
  const lockDir = path.join(temporary, "proof.lock");
  t.after(() => rm(temporary, { recursive: true, force: true }));

  await mkdir(lockDir);
  await mkdir(path.join(lockDir, "owner.not-a-pid"));
  await makeLockOld(lockDir);

  const result = runLockOnly(lockDir, 3);
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /recovered stale proof lock with malformed PID/);
});

test("proof recovers a stale PID lock and releases its owned lock", async (t) => {
  const temporary = await mkdtemp(
    path.join(tmpdir(), "portfolio-proof-stale-"),
  );
  const lockDir = path.join(temporary, "proof.lock");
  t.after(() => rm(temporary, { recursive: true, force: true }));

  await mkdir(lockDir);
  await mkdir(path.join(lockDir, "owner.999999999"));

  const result = runLockOnly(lockDir);
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /recovered stale proof lock/);
  await assert.rejects(access(lockDir), { code: "ENOENT" });
});

test("proof reports an exact error when a live lock times out", async (t) => {
  const temporary = await mkdtemp(path.join(tmpdir(), "portfolio-proof-live-"));
  const lockDir = path.join(temporary, "proof.lock");
  t.after(() => rm(temporary, { recursive: true, force: true }));

  await mkdir(lockDir);
  await mkdir(path.join(lockDir, `owner.${process.pid}`));

  const result = runLockOnly(lockDir, 1);
  assert.notEqual(result.status, 0);
  assert.match(
    result.stderr,
    /error: timed out after 1s waiting for portfolio proof lock \(held by PID \d+\)/,
  );
});
