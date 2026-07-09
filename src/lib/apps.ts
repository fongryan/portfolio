/*
 * Data access for the apps collection.
 *
 * Lives in a .ts module (not .astro frontmatter) so the collection's generic
 * types infer cleanly under strict mode. Pages import these helpers instead of
 * calling getCollection inline, which keeps rendering and data access separate.
 */
import { getCollection, type CollectionEntry } from "astro:content";

export type App = CollectionEntry<"apps">;

/** All mini-apps, sorted by frontmatter `order` (ascending). */
export async function getApps(): Promise<App[]> {
  const apps = await getCollection("apps");
  return apps.sort((a: App, b: App) => a.data.order - b.data.order);
}

/** Count of apps whose subdomain is live. */
export function countLive(apps: App[]): number {
  return apps.filter((a: App) => a.data.status === "live").length;
}

/** Whether any non-placeholder (real) app exists yet. */
export function hasRealApps(apps: App[]): boolean {
  return apps.some((a: App) => !a.data.tags.includes("template"));
}
