export interface CatalogueMarkdownProduct {
  name: string;
  url?: string;
  status: string;
  access: string;
  proof: string;
  flywheel: string;
  lastVerified: string;
  category: string;
  description: string;
  year: number;
  tags: string[];
  audiences: string[];
  deliveryModes: string[];
  offerModes: string[];
  salesPosition: string;
  commercialPriority?: number;
  buyerHypothesis?: string;
  researchRefs?: string[];
  owner?: string;
  platform?: string;
  ctaLabel: string;
  highlights: string[];
}

const markdownInlineSyntax = /([\\`*_{}\[\]()<>#+!|~])/g;
const controlCharacters = /[\u0000-\u001f\u007f-\u009f\u2028\u2029]+/gu;

export function escapeMarkdownInline(value: string): string {
  return value
    .replace(controlCharacters, " ")
    .replace(markdownInlineSyntax, "\\$1");
}

export function renderCatalogueProductMarkdown(
  slug: string,
  data: CatalogueMarkdownProduct,
): string {
  const inline = (value: string | number) =>
    escapeMarkdownInline(String(value));
  const tags =
    data.tags.length > 0
      ? data.tags.map((tag) => inline(tag)).join(", ")
      : "None";
  const highlights = data.highlights
    .map((highlight) => `  - ${inline(highlight)}`)
    .join("\n");

  return `## ${inline(data.name)}

- Slug: ${inline(slug)}
- Destination: ${inline(data.url ?? "Unavailable")}
- Status: ${inline(data.status)}
- Access: ${inline(data.access)}
- Proof: ${inline(data.proof)}
- Flywheel stage: ${inline(data.flywheel)}
- Last verified: ${inline(data.lastVerified)}
- Category: ${inline(data.category)}
- Year: ${inline(data.year)}
- Tags: ${tags}
- Audiences: ${data.audiences.map(inline).join(", ")}
- Delivery modes: ${data.deliveryModes.map(inline).join(", ")}
- Offer modes: ${data.offerModes.map(inline).join(", ")}
- Sales position: ${inline(data.salesPosition)}
- Commercial priority: ${inline(data.commercialPriority ?? "Not prioritized")}
- Buyer hypothesis: ${inline(data.buyerHypothesis ?? "Not prioritized")}
- Research references: ${inline(data.researchRefs?.join(", ") ?? "None")}
- Owner: ${inline(data.owner ?? "Not specified")}
- Platform: ${inline(data.platform ?? "Not specified")}
- Action: ${inline(data.ctaLabel)}
- Description: ${inline(data.description)}
- Highlights:
${highlights}`;
}
