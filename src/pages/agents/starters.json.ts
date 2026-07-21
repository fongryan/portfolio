import { publicStarterCatalogue } from "../../lib/starter-catalogue";

export async function GET() {
  return new Response(
    JSON.stringify(
      {
        schema: "armalo.portfolio.starters.v1",
        generatedBy: "portfolio",
        authority: "discovery-only",
        installAuthority: "https://app.armalo.ai",
        starters: publicStarterCatalogue(),
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
