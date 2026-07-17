<<<<<<< HEAD
import { getApps } from "../../lib/apps";

export async function GET() {
  const apps = await getApps();
  const body = {
    schema: "armalo.portfolio.catalogue.v4",
    generatedBy: "portfolio",
    operator: {
      name: "Hermes",
      mode: "hosted-admin-only",
      runtime: "Armalo hosted relay",
      authority: "plan-and-propose",
      liveMutations: "approval-required",
    },
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
      audiences: data.audiences,
      deliveryModes: data.deliveryModes,
      offerModes: data.offerModes,
      salesPosition: data.salesPosition,
      commercialPriority: data.commercialPriority ?? null,
      buyerHypothesis: data.buyerHypothesis ?? null,
      researchRefs: data.researchRefs ?? [],
      owner: data.owner ?? null,
      platform: data.platform ?? null,
      ctaLabel: data.ctaLabel,
      highlights: data.highlights,
    })),
    capabilities: {
      marketing: ["catalogue recall", "campaign planning", "copy variants", "creative brief", "Meta Ads proposal"],
      commerce: ["Stripe product proposal", "pricing proposal", "catalogue mapping", "reconciliation plan"],
      disallowedWithoutApproval: ["ad spend", "campaign activation", "Stripe activation", "payout", "refund", "credential changes"],
    },
    privateControlPlane: "https://app.armalo.ai",
=======
import { getCollection, type CollectionEntry } from "astro:content";

/**
 * Public, machine-readable catalogue surface.
 *
 * This is intentionally metadata-only. Private campaign strategy, customer
 * data, credentials, spend, and provider state belong behind app.armalo.ai.
 */
export async function GET() {
  const apps: CollectionEntry<"apps">[] = await getCollection("apps");
  const body = {
    schema: "armalo.portfolio.catalogue.v1",
    generatedBy: "portfolio",
    operator: {
      name: "Hermes",
      mode: "hosted-admin-only",
      runtime: "Armalo hosted relay",
      authority: "plan-and-propose",
      liveMutations: "approval-required",
    },
    products: apps
      .sort((a, b) => a.data.order - b.data.order)
      .map(({ id, data }) => ({
        slug: id,
        name: data.name,
        url: data.url ?? null,
        status: data.status,
        category: data.category,
        description: data.description,
        year: data.year,
        tags: data.tags,
        owner: data.owner ?? null,
        platform: data.platform ?? null,
      })),
    capabilities: {
      marketing: ["catalogue recall", "campaign planning", "copy variants", "creative brief", "Meta Ads proposal"],
      commerce: ["Stripe product proposal", "pricing proposal", "catalogue mapping", "reconciliation plan"],
      disallowedWithoutApproval: ["ad spend", "campaign activation", "Stripe activation", "payout", "refund", "credential changes"],
    },
    privateControlPlane: "https://app.armalo.ai",
>>>>>>> codex/portfolio-hermes-catalogue
  };

  return new Response(JSON.stringify(body, null, 2), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, max-age=60",
    },
  });
}
