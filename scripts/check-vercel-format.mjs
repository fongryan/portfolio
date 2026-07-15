import { execFileSync } from "node:child_process";
import * as prettier from "prettier";

const root = process.env.PORTFOLIO_FORMAT_ROOT ?? process.cwd();

try {
  const source = execFileSync("git", ["show", "HEAD:vercel.json"], {
    cwd: root,
    encoding: "utf8",
  });
  const formatted = await prettier.format(source, { filepath: "vercel.json" });

  if (source !== formatted) {
    console.log("error: committed vercel.json is not formatted");
    process.exitCode = 1;
  } else {
    console.log("ok: committed vercel.json format passed");
  }
} catch (error) {
  console.error(
    `error: could not check committed vercel.json: ${error.message}`,
  );
  process.exitCode = 1;
}
