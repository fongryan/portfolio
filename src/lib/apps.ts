import { getCollection, type CollectionEntry } from "astro:content";

export type App = CollectionEntry<"apps">;
export type Access = App["data"]["access"];
export type Proof = App["data"]["proof"];
export type Flywheel = App["data"]["flywheel"];

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

/**
 * The revenue flywheel every product moves through, in loop order. Stage
 * definitions stay public-safe: they describe the mechanism, never spend,
 * revenue, or account details — those live in the private operating system.
 */
export const flywheelStages: Flywheel[] = [
  "build",
  "launch",
  "acquire",
  "monetize",
  "compound",
];

export const flywheelLabels: Record<Flywheel, string> = {
  build: "Build",
  launch: "Launch",
  acquire: "Acquire",
  monetize: "Monetize",
  compound: "Compound",
};

export const flywheelDescriptions: Record<Flywheel, string> = {
  build: "In production on app.armalo.ai; no public surface yet.",
  launch: "Public surface live on its own subdomain, earning first users.",
  acquire: "Paid social campaigns are driving measured traffic.",
  monetize: "Paid checkout is live and the funnel collects revenue.",
  compound: "Profitable; profit is reinvested into ads and the next build.",
};

export function appsByFlywheelStage(apps: App[]): Map<Flywheel, App[]> {
  const board = new Map<Flywheel, App[]>(
    flywheelStages.map((stage) => [stage, []]),
  );
  for (const app of apps) {
    board.get(app.data.flywheel)?.push(app);
  }
  return board;
}
