import { productAtlas } from "../../lib/product-atlas";

const inline = (value: string | number) =>
  String(value).replace(/[\\`*_{}\[\]()<>#+!|~]/g, "\\$&");

export async function GET() {
  const products = productAtlas
    .map(
      (product) => `## ${inline(product.rank)}. ${inline(product.name)}

- Category: ${inline(product.category)}
- Job: ${inline(product.job)}
- Package: ${inline(product.package)}
- Priority: ${inline(product.priorityScore)}/100
- Scores: money ${inline(product.moneyScore)}/10; scale ${inline(product.scaleScore)}/10; Hermes ${inline(product.hermesScore)}/10
- Revenue model: ${inline(product.revenueModel)}
- Features: ${product.features.map(inline).join("; ")}
- ICP company: ${inline(product.icp.company)}
- ICP buyer: ${inline(product.icp.buyer)}
- Buying trigger: ${inline(product.icp.trigger)}
- Disqualifier: ${inline(product.icp.disqualifier)}
- Positioning: ${inline(product.marketing.positioning)}
- Marketing channels: ${product.marketing.channels.map(inline).join("; ")}
- Proof asset: ${inline(product.marketing.proofAsset)}
- Expansion: ${inline(product.marketing.expansion)}
- Availability: planned; unavailable; not yet proven`,
    )
    .join("\n\n");

  const body = `# Armalo AI product atlas

Machine-readable JSON: /agents/atlas.json

Hermes Agent is the fulfillment brain behind these product hypotheses. This is
public positioning and implementation context, not proof of a live product,
customer, revenue, or business outcome.

${products}
`;

  return new Response(body, {
    headers: { "content-type": "text/markdown; charset=utf-8" },
  });
}
