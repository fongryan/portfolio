// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

// Portfolio hub — content-first, static output, zero client JS for static
// content. See AGENTS.md for the non-vibe-coded design contract.
//
// The canonical live URL is portfolio.armalo.ai (Hetzner vibe cluster).
// The historical portfolio-peach-sigma-85.vercel.app URL still resolves
// from a final Vercel build while the project is being decommissioned;
// PORTFOLIO_SITE_URL remains the override seam for future migrations.
export default defineConfig({
  site: process.env.PORTFOLIO_SITE_URL ?? "https://portfolio.armalo.ai/",
  output: "static",
  trailingSlash: "never",
  prefetch: false,
  vite: {
    plugins: [tailwindcss()],
  },
});
