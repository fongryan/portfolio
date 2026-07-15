import { getCollection, type CollectionEntry } from "astro:content";

export type App = CollectionEntry<"apps">;
export type Access = App["data"]["access"];
export type Proof = App["data"]["proof"];

export async function getApps(): Promise<App[]> {
  const apps = await getCollection("apps");
  return apps.sort((a: App, b: App) => a.data.order - b.data.order);
}

export function countAvailable(apps: App[]): number {
  return apps.filter((app) => ["live", "beta"].includes(app.data.status))
    .length;
}

export function hasRealApps(apps: App[]): boolean {
  return apps.some((app) => !app.data.tags.includes("template"));
}

export const accessLabels: Record<Access, string> = {
  public: "Public",
  "sign-in": "Sign-in required",
  "private-beta": "Private beta",
  waitlist: "Waitlist",
  unavailable: "Unavailable",
};

export const proofLabels: Record<Proof, string> = {
  "not-yet-proven": "Not yet proven",
  "source-tested": "Source tested",
  "runtime-verified": "Runtime verified",
  "public-live": "Publicly verified",
  "business-verified": "Business verified",
};
