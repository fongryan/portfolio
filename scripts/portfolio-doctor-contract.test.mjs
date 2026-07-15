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
  await mkdir(path.join(root, ".github/workflows"), { recursive: true });
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
    writeFile(path.join(root, ".github/workflows/ci.yml"), "name: Fixture\n"),
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
