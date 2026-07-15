import assert from "node:assert/strict";
import {
  chmod,
  copyFile,
  mkdtemp,
  mkdir,
  rm,
  symlink,
  unlink,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";

const sourceDoctor = fileURLToPath(
  new URL("./portfolio-doctor.sh", import.meta.url),
);

function run(command, args, options = {}) {
  const result = spawnSync(command, args, { encoding: "utf8", ...options });
  assert.equal(
    result.status,
    0,
    `${command} ${args.join(" ")}\n${result.stdout}\n${result.stderr}`,
  );
  return result;
}

async function makeRepo(t) {
  const root = await mkdtemp(path.join(tmpdir(), "portfolio-doctor-test-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  await mkdir(path.join(root, "scripts"));
  await copyFile(sourceDoctor, path.join(root, "scripts/portfolio-doctor.sh"));
  await Promise.all([
    writeFile(
      path.join(root, "AGENTS.md"),
      "<!-- BEGIN RYAN CRACKED DEV WORKFLOW -->\n<!-- END RYAN CRACKED DEV WORKFLOW -->\n",
    ),
    writeFile(
      path.join(root, "CLAUDE.md"),
      "<!-- BEGIN RYAN CRACKED DEV WORKFLOW -->\n<!-- END RYAN CRACKED DEV WORKFLOW -->\n",
    ),
    writeFile(path.join(root, "README.md"), "# Fixture\n"),
    writeFile(path.join(root, "package.json"), '{"private":true}\n'),
    writeFile(path.join(root, "astro.config.mjs"), "export default {};\n"),
    writeFile(path.join(root, ".gitignore"), "node_modules/\ndist/\n"),
    writeFile(path.join(root, "scripts/portfolio-proof.sh"), "#!/bin/sh\n"),
  ]);
  run("git", ["init", "-q"], { cwd: root });
  run("git", ["add", "."], { cwd: root });
  return root;
}

async function makeArchive(t) {
  const root = await makeRepo(t);
  await rm(path.join(root, ".git"), { recursive: true, force: true });
  await rm(path.join(root, ".gitignore"), { force: true });
  return root;
}

function runDoctor(root, env = process.env) {
  return spawnSync("/bin/bash", ["scripts/portfolio-doctor.sh"], {
    cwd: root,
    encoding: "utf8",
    env,
  });
}

test("doctor rejects runnable GitHub Actions workflows while Actions is intentionally dormant", async (t) => {
  const root = await makeRepo(t);
  await mkdir(path.join(root, ".github/workflows"), { recursive: true });
  await writeFile(
    path.join(root, ".github/workflows/ci.yml"),
    "name: Unexpected workflow\n",
  );

  const result = runDoctor(root, {
    ...process.env,
    PORTFOLIO_DOCTOR_SKIP_BUILD: "1",
  });

  assert.notEqual(result.status, 0, result.stdout);
  assert.match(result.stdout, /workflow present without direct owner approval/);
});

async function environmentWithoutOptionalUnixTools(root) {
  const bin = path.join(root, "test-bin");
  await mkdir(bin, { recursive: true });
  for (const tool of ["cmp", "rg"]) {
    const fakeTool = path.join(bin, tool);
    await writeFile(fakeTool, "#!/bin/sh\nexit 127\n");
    await chmod(fakeTool, 0o755);
  }
  return { ...process.env, PATH: `${bin}:${process.env.PATH}` };
}

test("doctor validates a safe upload archive without Git metadata", async (t) => {
  const root = await makeArchive(t);

  const result = runDoctor(root, {
    ...(await environmentWithoutOptionalUnixTools(root)),
    PORTFOLIO_DOCTOR_SKIP_BUILD: "1",
  });

  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(
    result.stdout,
    /archive mode: scanning uploaded filesystem files/,
  );
});

test("doctor rejects secrets in an upload archive", async (t) => {
  const root = await makeArchive(t);
  await writeFile(
    path.join(root, "archive-secret.txt"),
    `${"OPENAI_"}API_KEY=fixture-not-a-real-key\n`,
  );

  const result = runDoctor(root, {
    ...(await environmentWithoutOptionalUnixTools(root)),
    PORTFOLIO_DOCTOR_SKIP_BUILD: "1",
  });

  assert.notEqual(result.status, 0, result.stdout);
  assert.match(result.stdout, /possible secret leaked/);
  assert.match(result.stdout, /archive-secret\.txt/);
});

const secretCases = [
  ["OpenAI token", `sk-${"a".repeat(20)}`],
  ["Anthropic token", `sk-${"ant"}-${"b".repeat(20)}`],
  ["OpenAI key", ["OPENAI", "API", "KEY"].join("_") + "=fixture"],
  ["OpenAI shorthand", ["OPENAI", "KEY"].join("_") + "=fixture"],
  ["Anthropic key", ["ANTHROPIC", "API", "KEY"].join("_") + "=fixture"],
  ["Anthropic shorthand", ["ANTHROPIC", "KEY"].join("_") + "=fixture"],
  ["AWS secret", ["AWS", "SECRET", "ACCESS", "KEY"].join("_") + "=fixture"],
  ["AWS secret shorthand", ["AWS", "SECRET", "ACCESS"].join("_") + "=fixture"],
  ["GitHub token", ["GITHUB", "TOKEN"].join("_") + "=fixture"],
  ["GitHub key", ["GITHUB", "KEY"].join("_") + "=fixture"],
  ["Slack bot token", ["SLACK", "BOT", "TOKEN"].join("_") + "=fixture"],
  ["Slack bot key", ["SLACK", "BOT", "KEY"].join("_") + "=fixture"],
  ["Stripe secret", ["STRIPE", "SECRET", "KEY"].join("_") + "=fixture"],
  ["Stripe shorthand", ["STRIPE", "SECRET"].join("_") + "=fixture"],
  ["private key", ["BEGIN RSA", "PRIVATE KEY"].join(" ")],
  ["Slack token", `xox${"b"}-${"a".repeat(20)}`],
  ["AWS access key", `AKIA${"A".repeat(16)}`],
  ["GitHub personal token", `ghp_${"a".repeat(36)}`],
  ["GitHub OAuth token", `gho_${"b".repeat(36)}`],
];

test("doctor rejects every configured secret pattern", async (t) => {
  const root = await makeArchive(t);
  for (const [index, [, value]] of secretCases.entries()) {
    await writeFile(path.join(root, `secret-${index}.txt`), `${value}\n`);
  }
  const result = runDoctor(root, {
    ...(await environmentWithoutOptionalUnixTools(root)),
    PORTFOLIO_DOCTOR_SKIP_BUILD: "1",
  });

  assert.notEqual(result.status, 0, result.stdout);
  assert.match(result.stdout, /possible secret leaked/);
  for (const [index, [name]] of secretCases.entries()) {
    assert.match(result.stdout, new RegExp(`secret-${index}\\.txt`), name);
  }
});

const envBoundaryCases = [
  ["bare env", [".", "env"].join(""), true],
  ["suffixed env", ["config ", ".", "env.local"].join(""), true],
  ["path env", ["config/", ".", "env"].join(""), true],
  ["environment word", [".", "environment"].join(""), false],
  ["envfile suffix", ["my.", "envfile"].join(""), false],
  ["property access", ["object.", "env"].join(""), false],
];

test("doctor enforces exact .env reference boundaries", async (t) => {
  const positiveRoot = await makeArchive(t);
  const negativeRoot = await makeArchive(t);
  for (const [index, [, value, rejected]] of envBoundaryCases.entries()) {
    const root = rejected ? positiveRoot : negativeRoot;
    await writeFile(path.join(root, `env-${index}.txt`), `${value}\n`);
  }

  const positive = runDoctor(positiveRoot, {
    ...(await environmentWithoutOptionalUnixTools(positiveRoot)),
    PORTFOLIO_DOCTOR_SKIP_BUILD: "1",
  });
  assert.notEqual(positive.status, 0, positive.stdout);
  assert.match(positive.stdout, /\.env reference outside allowed files/);
  for (const [index, [name, , rejected]] of envBoundaryCases.entries()) {
    if (rejected) {
      assert.match(positive.stdout, new RegExp(`env-${index}\\.txt`), name);
    }
  }

  const negative = runDoctor(negativeRoot, {
    ...(await environmentWithoutOptionalUnixTools(negativeRoot)),
    PORTFOLIO_DOCTOR_SKIP_BUILD: "1",
  });
  assert.equal(negative.status, 0, `${negative.stdout}\n${negative.stderr}`);
});

test("doctor does not depend on an external ripgrep binary", async (t) => {
  const root = await makeRepo(t);
  const result = runDoctor(
    root,
    await environmentWithoutOptionalUnixTools(root),
  );

  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /ok: public-safety scanner completed/);
});

test("doctor rejects a force-tracked file that matches ignore rules", async (t) => {
  const root = await makeRepo(t);
  await writeFile(
    path.join(root, ".gitignore"),
    "node_modules/\ndist/\nignored-secret.txt\n",
  );
  await writeFile(
    path.join(root, "ignored-secret.txt"),
    `${"OPENAI_"}API_KEY=fixture-not-a-real-key\n`,
  );
  run("git", ["add", ".gitignore"], { cwd: root });
  run("git", ["add", "-f", "ignored-secret.txt"], { cwd: root });

  const result = runDoctor(
    root,
    await environmentWithoutOptionalUnixTools(root),
  );

  assert.notEqual(result.status, 0, result.stdout);
  assert.match(result.stdout, /tracked files match ignore rules/);
  assert.match(result.stdout, /ignored-secret\.txt/);
});

test("doctor rejects CLAUDE.md symlinks that do not target AGENTS.md", async (t) => {
  const root = await makeRepo(t);
  await unlink(path.join(root, "CLAUDE.md"));
  await symlink("README.md", path.join(root, "CLAUDE.md"));
  run("git", ["add", "CLAUDE.md"], { cwd: root });

  const result = runDoctor(
    root,
    await environmentWithoutOptionalUnixTools(root),
  );

  assert.notEqual(result.status, 0, result.stdout);
  assert.match(
    result.stdout,
    /CLAUDE\.md symlink target must be exactly AGENTS\.md/,
  );
});

test("doctor rejects other public-tree symlinks without following them", async (t) => {
  const root = await makeRepo(t);
  const link = path.join(root, "private-link");
  await symlink(`${"/Users"}/example/private-vault`, link);
  run("git", ["add", "private-link"], { cwd: root });

  const result = runDoctor(
    root,
    await environmentWithoutOptionalUnixTools(root),
  );

  assert.notEqual(result.status, 0, result.stdout);
  assert.match(result.stdout, /symlink is not public-safe: private-link/);
  assert.match(result.stdout, /private-vault/);
});
