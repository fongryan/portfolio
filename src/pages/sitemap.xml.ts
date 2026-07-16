import type { APIRoute } from "astro";
import { getCollection, type CollectionEntry } from "astro:content";

export const prerender = true;

const escapeXml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

export const GET: APIRoute = async ({ site }) => {
  if (!site) {
    throw new Error("Astro.site is required to generate sitemap.xml");
  }

  const apps = await getCollection("apps");
  const paths = [
    "/",
    "/flywheel",
    ...apps.map((app: CollectionEntry<"apps">) => `/apps/${app.id}`),
  ].sort();
  const urls = paths
    .map(
      (pathname) =>
        `  <url><loc>${escapeXml(new URL(pathname, site).href)}</loc></url>`,
    )
    .join("\n");
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
