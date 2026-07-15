import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import path from "node:path";
import * as prettier from "prettier";

const root = process.env.PORTFOLIO_FORMAT_ROOT ?? process.cwd();

try {
  let source;
  let sourceDescription = "committed";
  try {
    source = execFileSync("git", ["show", "HEAD:vercel.json"], {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
  } catch {
    source = await readFile(path.join(root, "vercel.json"), "utf8");
    sourceDescription = "uploaded";
  }

  const formatted = await prettier.format(source, { filepath: "vercel.json" });

  if (source !== formatted) {
    console.log(`error: ${sourceDescription} vercel.json is not formatted`);
    process.exitCode = 1;
  } else {
    console.log(`ok: ${sourceDescription} vercel.json format passed`);
  }
} catch (error) {
  console.error(
    `error: could not check vercel.json formatting: ${error.message}`,
  );
  process.exitCode = 1;
}
