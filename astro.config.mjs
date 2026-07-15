// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

// Portfolio hub — content-first, static output, zero client JS for static
// content. See AGENTS.md for the non-vibe-coded design contract.
export default defineConfig({
  // Keep production metadata deterministic while allowing an intentional
  // future custom-domain migration through one environment override.
  site:
    process.env.PORTFOLIO_SITE_URL ??
    "https://portfolio-peach-sigma-85.vercel.app",
  output: "static",
  trailingSlash: "never",
  prefetch: false,
  vite: {
    plugins: [tailwindcss()],
  },
});
