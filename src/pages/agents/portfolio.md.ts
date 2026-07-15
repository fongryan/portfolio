import { getApps } from "../../lib/apps";
import { renderCatalogueProductMarkdown } from "../../lib/portfolio-markdown";

export async function GET() {
  const apps = await getApps();
  const products = apps
    .map(({ id, data }) => renderCatalogueProductMarkdown(id, data))
    .join("\n\n");

  const body = `# Armalo public product catalogue

Machine-readable JSON: /agents/portfolio.json

This surface contains public catalogue metadata only. Access describes how a
visitor can use a product; proof names the strongest verified public claim.

${products}
`;

  return new Response(body, {
    headers: { "content-type": "text/markdown; charset=utf-8" },
  });
}
