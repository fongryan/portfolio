import { getApps } from "../../lib/apps";

export async function GET() {
  const apps = await getApps();
  const body = {
    schema: "armalo.portfolio.catalogue.v3",
    generatedBy: "portfolio",
    products: apps.map(({ id, data }) => ({
      slug: id,
      name: data.name,
      url: data.url ?? null,
      status: data.status,
      access: data.access,
      proof: data.proof,
      flywheel: data.flywheel,
      lastVerified: data.lastVerified,
      category: data.category,
      description: data.description,
      year: data.year,
      tags: data.tags,
      owner: data.owner ?? null,
      platform: data.platform ?? null,
      ctaLabel: data.ctaLabel,
      highlights: data.highlights,
    })),
  };

  return new Response(JSON.stringify(body, null, 2), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, max-age=60",
    },
  });
}
