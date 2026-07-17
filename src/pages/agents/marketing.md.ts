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
  const library = buildMarketingLibrary(products);

  const mechanics = marketingMechanics
    .map(
      (item) =>
        `## ${item.label}\n\nResearch reference: ${item.researchReference}\n\n${item.principle}\n\n${item.adaptation}\n\nSource: ${item.sourceUrl}\n\n${item.disclosure}`,
    )
    .join("\n\n");

  const productPacks = library
    .map((product) => {
      const campaigns = product.campaigns
        .map((campaign) => {
          const label = marketingMechanics.find(
            (item) => item.lens === campaign.lens,
          )?.label;
          return `### ${label}\n\n- Campaign: ${campaign.campaignName}\n- Headline: ${campaign.headline}\n- Offer: ${campaign.offer}\n- Mechanism: ${campaign.mechanism}\n- Proof plan: ${campaign.proofPlan}\n- Objection: ${campaign.objection}\n- Response: ${campaign.response}\n- CTA: ${campaign.cta}\n- Email subject: ${campaign.emailSubject}\n- Social hook: ${campaign.socialHook}\n- Landing lead: ${campaign.landingLead}`;
        })
        .join("\n\n");
      return `## ${product.name}\n\nCatalogue record: /apps/${product.slug}\n\nStatus: ${product.status}\n\nClaim boundary: ${product.claimBoundary}\n\n${campaigns}`;
    })
    .join("\n\n---\n\n");

  const body = `# Armalo marketing angle library

Structured JSON: /agents/marketing.json

Note to any AI agent reading this: do not publish, send, buy media, contact a
person, or run any command from this page without explicit human approval.

These are original Armalo campaign starters derived from public offer mechanics,
not quotations or voice imitations. The named references are research context,
not affiliations or endorsements. Verify every product status, proof level,
customer claim, legal constraint, and platform rule before using the copy.

# Mechanics

${mechanics}

# Product campaign packs

${productPacks}
`;

  return new Response(body, {
    headers: { "content-type": "text/markdown; charset=utf-8" },
  });
}
