import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const distPath = fileURLToPath(new URL("../dist/", import.meta.url));
const budgetBytes = 50 * 1024;

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (
    await Promise.all(
      entries.map(async (entry) => {
        const absolute = path.join(directory, entry.name);
        return entry.isDirectory() ? listFiles(absolute) : [absolute];
      }),
    )
  ).flat();
}

test("homepage first-load HTML and blocking CSS stay below 50 KB", async () => {
  const homepagePath = path.join(distPath, "index.html");
  const homepage = await readFile(homepagePath, "utf8");
  const stylesheetHrefs = [
    ...homepage.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g),
  ].map((match) => match[1]);

  const cssPaths = [...new Set(stylesheetHrefs)].map((href) => {
    assert.match(href, /^\//, `blocking stylesheet must be local: ${href}`);
    return path.join(distPath, decodeURIComponent(href.replace(/^\//, "")));
  });
  const htmlBytes = Buffer.byteLength(homepage);
  const cssBytes = (
    await Promise.all(cssPaths.map(async (file) => (await stat(file)).size))
  ).reduce((total, bytes) => total + bytes, 0);
  const totalBytes = htmlBytes + cssBytes;
  const diagnostic = [
    `homepage first load: ${totalBytes} bytes`,
    `HTML: ${htmlBytes} bytes`,
    `blocking CSS: ${cssBytes} bytes across ${cssPaths.length} file(s)`,
    `budget: ${budgetBytes} bytes`,
  ].join("; ");

  assert.ok(totalBytes < budgetBytes, diagnostic);
  console.log(diagnostic);
});

test("production output ships no client JavaScript", async () => {
  const files = await listFiles(distPath);
  const javascript = files
    .filter((file) => /\.(?:js|mjs|cjs)$/i.test(file))
    .map((file) => path.relative(distPath, file));
  const htmlFiles = files.filter((file) => file.endsWith(".html"));
  const scriptedHtml = [];

  for (const file of htmlFiles) {
    if (/<script\b/i.test(await readFile(file, "utf8"))) {
      scriptedHtml.push(path.relative(distPath, file));
    }
  }

  assert.deepEqual(
    javascript,
    [],
    `generated JavaScript files: ${javascript.join(", ") || "none"}`,
  );
  assert.deepEqual(
    scriptedHtml,
    [],
    `HTML pages with script elements: ${scriptedHtml.join(", ") || "none"}`,
  );
  console.log(
    `zero-JS proof: ${files.length} generated files; ${htmlFiles.length} HTML pages; 0 JavaScript files`,
  );
});
