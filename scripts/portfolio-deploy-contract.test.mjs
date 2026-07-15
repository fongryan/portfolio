import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("Vercel publishes only output that passed the canonical proof", async () => {
  const config = JSON.parse(
    await readFile(new URL("../vercel.json", import.meta.url), "utf8"),
  );

  assert.equal(config.framework, "astro");
  assert.equal(config.buildCommand, "npm run proof");
  assert.equal(config.outputDirectory, "dist");
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
