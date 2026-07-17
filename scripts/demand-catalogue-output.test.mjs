import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const dist = new URL("../dist/", import.meta.url);
const readOutput = (path) => readFile(new URL(path, dist), "utf8");

const rankedSlugs = [
  "email-customer-service",
  "document-operations-agent",
  "voice-customer-service",
  "ai-qualifier",
  "internal-knowledge-assistant",
  "finance-operations-assistant",
  "marketing-campaign-studio",
  "software-engineering-copilot",
  "legal-advice-assistant",
  "clinical-documentation-assistant",
];

const consumerSlugs = [
  "ai-stylist",
  "personal-tutor",
  "personal-finance-assistant",
  "girl-math",
];

const demandedProducts = [
  ["document-operations-agent", "Document Operations Agent"],
  ["finance-operations-assistant", "Finance Operations Assistant"],
  ["marketing-campaign-studio", "Marketing Campaign Studio"],
  ["software-engineering-copilot", "Software Engineering Copilot"],
  ["clinical-documentation-assistant", "Clinical Documentation Assistant"],
  ["business-constraint-finder", "Business Constraint Finder"],
  ["ai-digital-product-studio", "AI Digital Product Studio"],
  ["revenue-intelligence-platform", "Revenue Intelligence Platform"],
  ["lead-recovery-operator", "Lead Recovery Operator"],
];

const approvedPrimaryEvidenceUrls = [
  "https://www.salesforce.com/agentforce/pricing/",
  "https://support.zendesk.com/hc/en-us/articles/5352026794010-About-automated-resolutions-for-AI-agents",
  "https://knowledge-base.rossum.ai/help/docs/understanding-rossums-data-extraction-billing",
  "https://www.uipath.com/ai/ai25-awards/winners",
  "https://www.twilio.com/en-us/products/conversational-ai/pricing",
  "https://investors.twilio.com/static-files/9a8a8a89-565a-4a5b-b11d-21ef45eede70",
  "https://www.salesforce.com/news/stories/how-salesforce-uses-agentforce-sales/",
  "https://www.microsoft.com/en-us/investor/events/fy-2026/earnings-fy-2026-q2",
  "https://www.glean.com/jp/press/glean-achieves-100m-arr-in-three-years-delivering-true-ai-roi-to-the-enterprise",
  "https://www.bill.com/product/pricing",
  "https://www.bill.com/product/ai",
  "https://www.thomsonreuters.com/en/press-releases/2025/april/from-incubation-to-integration-generative-ai-adoption-nearly-doubles-as-professional-services-reach-crossroads",
  "https://www.canva.com/newsroom/news/introducing-canva-business/",
  "https://news.adobe.com/news/2025/09/global-enterprises-embrace-adobe-ai-innovations-power-growth",
  "https://docs.github.com/en/copilot/concepts/billing/organizations-and-enterprises",
  "https://legal.thomsonreuters.com/en/c/compare-cocounsel-plans-for-your-legal-team",
  "https://learn.microsoft.com/en-us/industry/healthcare/dragon-admin-center/concepts/dragon-copilot-licenses",
  "https://www.ama-assn.org/practice-management/digital-health/2-3-physicians-are-using-health-ai-78-2023",
];

const operatorPrimaryUrls = [
  "https://ai.acquisition.com/",
  "https://vantage.acquisition.com/",
  "https://www.acquisition.com/workshop-ai-accelerator",
  "https://www.aiacquisition.com/platform",
  "https://www.aiacquisition.com/blog/ai-agency",
  "https://www.aiacquisition.com/terms-of-service",
  "https://trycook.ai/",
  "https://webby.trycook.ai/",
  "https://trycook.ai/terms",
  "https://www.monetise.com/waitlist",
  "https://www.flozy.com/",
  "https://educate.io/archives/terms-and-conditions",
  "https://hyros.com/",
  "https://hyros.com/air",
  "https://hyros.com/agency",
];

const occurrences = (source, value) => source.split(value).length - 1;
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function regionById(source, id) {
  const opening = source.match(
    new RegExp(
      `<(?<tag>section|div|aside|nav)\\b(?=[^>]*\\bid="${escapeRegex(id)}")[^>]*>`,
      "i",
    ),
  );
  assert.ok(opening, `expected stable #${id} region`);

  const start = opening.index;
  const tag = opening.groups.tag;
  const tagPattern = new RegExp(`<\\/?${tag}\\b[^>]*>`, "gi");
  tagPattern.lastIndex = start;
  let depth = 0;
  for (const match of source.matchAll(tagPattern)) {
    const token = match[0];
    if (token.startsWith("</")) {
      depth -= 1;
      if (depth === 0) return source.slice(start, match.index + token.length);
    } else if (!token.endsWith("/>")) {
      depth += 1;
    }
  }
  assert.fail(`#${id} ${tag} region must close`);
}

function wrapperContainingLink(source, slug) {
  const link = source.search(
    new RegExp(`<a\\b[^>]*href="/apps/${escapeRegex(slug)}"`, "i"),
  );
  assert.notEqual(link, -1, `${slug} link`);
  const candidates = ["li", "article"].map((tag) => ({
    tag,
    start: source.lastIndexOf(`<${tag}`, link),
  }));
  const wrapper = candidates.sort((left, right) => right.start - left.start)[0];
  assert.ok(wrapper.start >= 0, `${slug} must be inside a list item or card`);
  const end = source.indexOf(`</${wrapper.tag}>`, link);
  assert.notEqual(end, -1, `${slug} wrapper must close`);
  return source.slice(wrapper.start, end + wrapper.tag.length + 3);
}

test("homepage renders the ranked business shelf consumer lab and every product", async () => {
  const [homepage, jsonSource] = await Promise.all([
    readOutput("index.html"),
    readOutput("agents/portfolio.json"),
  ]);
  const manifest = JSON.parse(jsonSource);

  assert.equal(
    manifest.products.some(
      (product) => product.slug === "digital-product-studio",
    ),
    false,
    "duplicate digital-product-studio record must not ship",
  );

  const demand = regionById(homepage, "demand");

  let previousIndex = -1;
  for (const [index, slug] of rankedSlugs.entries()) {
    const rank = String(index + 1).padStart(2, "0");
    const wrapper = wrapperContainingLink(demand, slug);
    assert.match(wrapper, new RegExp(`>\\s*${rank}\\s*<`));
    const linkIndex = demand.search(
      new RegExp(`<a\\b[^>]*href="/apps/${escapeRegex(slug)}"`, "i"),
    );
    assert.ok(linkIndex > previousIndex, `${slug} must render in rank order`);
    previousIndex = linkIndex;
  }
  const consumerLab = regionById(demand, "consumer-lab");
  const consumerOpening = consumerLab.match(
    /^<(?<tag>section|div|aside|nav)\b[^>]*>/i,
  );
  assert.match(
    consumerOpening[0],
    /aria-label="Consumer lab"|aria-labelledby="[^"]+"/i,
  );
  const labelledBy = consumerOpening[0].match(
    /aria-labelledby="([^"]+)"/i,
  )?.[1];
  if (labelledBy) {
    assert.match(consumerLab, new RegExp(`id="${escapeRegex(labelledBy)}"`));
  }
  for (const slug of consumerSlugs) {
    assert.match(
      consumerLab,
      new RegExp(`<a\\b[^>]*href="/apps/${escapeRegex(slug)}"`, "i"),
    );
  }

  const fullShelf = regionById(homepage, "work");
  for (const product of manifest.products) {
    assert.equal(
      occurrences(fullShelf, `href="/apps/${product.slug}"`),
      1,
      `${product.slug} must appear exactly once in the full shelf`,
    );
  }
});

test("demand research route ships cited zero-script claim-honest output", async () => {
  const html = await readOutput(
    "research/demand-backed-ai-catalogue/index.html",
  );

  for (const operator of [
    "Alex Hormozi",
    "Jordan Lee",
    "Serge Gatari",
    "Iman Gadzhi",
    "Alex Becker",
  ]) {
    assert.match(html, new RegExp(operator));
  }
  for (let rank = 1; rank <= 10; rank += 1) {
    assert.match(
      html,
      new RegExp(`>\\s*${String(rank).padStart(2, "0")}\\s*<`),
    );
  }
  for (const url of approvedPrimaryEvidenceUrls) {
    assert.match(html, new RegExp(`href="${escapeRegex(url)}"`));
  }
  for (const url of operatorPrimaryUrls) {
    assert.match(html, new RegExp(`href="${escapeRegex(url)}"`));
  }
  assert.match(html, /no affiliation|not affiliated/i);
  assert.match(html, /B2B|business AI/i);
  assert.match(html, /consumer lab/i);
  assert.match(html, /ethical adaptation/i);
  assert.match(html, /observed attribution/i);
  assert.match(html, /modeled attribution/i);
  assert.match(html, /attribution/i);
  assert.match(html, /experimentally verified incrementality/i);
  assert.match(
    html,
    /does not establish\s+(?:Armalo\s+)?customers?,\s*revenue,\s*retention,\s*(?:or\s*)?product-market fit/i,
  );
  assert.doesNotMatch(html, /<script\b/i);
});

test("new demand products ship in detail JSON and Markdown surfaces", async () => {
  const [jsonSource, markdown] = await Promise.all([
    readOutput("agents/portfolio.json"),
    readOutput("agents/portfolio.md"),
  ]);
  const manifest = JSON.parse(jsonSource);

  for (const [slug, name] of demandedProducts) {
    const matching = manifest.products.filter(
      (product) => product.slug === slug,
    );
    assert.equal(matching.length, 1, `${slug} must occur exactly once in JSON`);
    assert.deepEqual(
      {
        name: matching[0].name,
        status: matching[0].status,
        access: matching[0].access,
        proof: matching[0].proof,
      },
      {
        name,
        status: "planned",
        access: "unavailable",
        proof: "not-yet-proven",
      },
    );
    assert.equal(
      occurrences(markdown, `## ${name}`),
      1,
      `${name} Markdown heading`,
    );
    const sectionStart = markdown.indexOf(`## ${name}`);
    const nextSection = markdown.indexOf("\n## ", sectionStart + 3);
    const section = markdown.slice(
      sectionStart,
      nextSection === -1 ? undefined : nextSection,
    );
    assert.match(section, new RegExp(`^- Slug: ${escapeRegex(slug)}$`, "m"));
    assert.match(section, /^- Status: planned$/m);
    assert.match(section, /^- Access: unavailable$/m);
    assert.match(section, /^- Proof: not-yet-proven$/m);

    const detail = await readOutput(`apps/${slug}/index.html`);
    assert.match(detail, new RegExp(`<h1[^>]*>${escapeRegex(name)}</h1>`));
    assert.match(detail, /Status: Planned/);
    assert.match(detail, />Unavailable</);
    assert.match(detail, />Not yet proven</);
  }

  const agency = manifest.products.filter(
    (product) => product.slug === "agency-ai-workbench",
  );
  assert.equal(agency.length, 1);
  assert.equal(agency[0].name, "AI Agency Operating System");
  assert.deepEqual(
    {
      status: agency[0].status,
      access: agency[0].access,
      proof: agency[0].proof,
    },
    { status: "planned", access: "unavailable", proof: "not-yet-proven" },
  );
  assert.equal(occurrences(markdown, "## AI Agency Operating System"), 1);
  const agencySectionStart = markdown.indexOf("## AI Agency Operating System");
  const agencySectionEnd = markdown.indexOf("\n## ", agencySectionStart + 3);
  const agencyMarkdown = markdown.slice(
    agencySectionStart,
    agencySectionEnd === -1 ? undefined : agencySectionEnd,
  );
  const agencyDetail = await readOutput("apps/agency-ai-workbench/index.html");
  assert.match(agencyMarkdown, /^- Status: planned$/m);
  assert.match(agencyMarkdown, /^- Access: unavailable$/m);
  assert.match(agencyMarkdown, /^- Proof: not-yet-proven$/m);
  assert.match(agencyDetail, /AI Agency Operating System/);
  assert.match(agencyDetail, /tenant isolation/i);
  assert.match(agencyDetail, /acceptance test/i);
  assert.match(agencyDetail, /client approval/i);
});
