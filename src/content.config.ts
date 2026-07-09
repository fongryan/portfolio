import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

/*
 * Mini-app collection.
 *
 * Each entry is one Armalo mini-app on its own subdomain. The homepage grid is
 * driven entirely by this collection, so adding a mini-app is a content edit,
 * never a code change. Status drives the badge; category drives grouping.
 *
 * Keep copy tight and specific. No hype words. See AGENTS.md + LOOPS.md.
 */
const apps = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/apps" }),
  schema: z.object({
    name: z.string(),
    // Full subdomain URL. Optional because "planned" apps may not have one yet.
    url: z.url().optional(),
    // live = reachable subdomain; wip = building; planned = on the roadmap.
    status: z.enum(["live", "wip", "planned"]),
    category: z.string(),
    // One tight sentence. Lead with what it does, not how impressive it is.
    description: z.string().max(160),
    year: z.number().int().min(2000).max(2100),
    // Optional manual sort within the grid; lower renders first.
    order: z.number().int().default(100),
    // Optional short tag list for future filtering. Keep to nouns, max 3.
    tags: z.array(z.string()).max(3).default([]),
  }),
});

export const collections = { apps };
