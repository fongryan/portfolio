// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

// Portfolio hub — content-first, static output, zero client JS for static
// content. See AGENTS.md for the non-vibe-coded design contract.
export default defineConfig({
  // Set to the real deploy origin before going live so canonical URLs and OG
  // tags resolve. Left empty so local + preview stay portable.
  site: process.env.PORTFOLIO_SITE_URL ?? undefined,
  output: "static",
  trailingSlash: "never",
  prefetch: false,
  vite: {
    plugins: [tailwindcss()],
  },
});
