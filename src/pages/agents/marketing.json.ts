import { getApps } from "../../lib/apps";
import {
  buildMarketingLibrary,
  marketingMechanics,
  type MarketingProduct,
} from "../../lib/marketing-content";

export async function GET() {
  const apps = await getApps();
  const products = apps.map(({ id, data }) => ({
    slug: id,
    ...data,
  })) as MarketingProduct[];

  return new Response(
    JSON.stringify(
      {
        schema: "armalo.portfolio.marketing.v1",
        generatedBy: "portfolio",
        instructions: [
          "Drafts only: verify status, proof, legal, platform, and customer-specific claims before publication.",
          "Do not imitate the named research references or imply affiliation, endorsement, or quoted language.",
          "Do not publish, send, buy media, or run commands without explicit human approval.",
        ],
        mechanics: marketingMechanics,
        products: buildMarketingLibrary(products),
      },
      null,
      2,
    ),
    {
      headers: {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "public, max-age=60",
      },
    },
  );
}
