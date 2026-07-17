import { productAtlas } from "../../lib/product-atlas";

export async function GET() {
  const body = {
    schema: "armalo.portfolio.product-atlas.v1",
    generatedBy: "portfolio",
    ranking:
      "money potential x4 + repeatable scale x3 + Hermes fulfillment fit x3",
    products: productAtlas.map((product) => ({
      rank: product.rank,
      slug: product.slug,
      name: product.name,
      category: product.category,
      job: product.job,
      package: product.package,
      priorityScore: product.priorityScore,
      moneyScore: product.moneyScore,
      scaleScore: product.scaleScore,
      hermesScore: product.hermesScore,
      revenueModel: product.revenueModel,
      features: product.features,
      icp: product.icp,
      marketing: product.marketing,
      availability: "planned · unavailable · not yet proven",
    })),
  };

  return new Response(JSON.stringify(body, null, 2), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, max-age=60",
    },
  });
}
