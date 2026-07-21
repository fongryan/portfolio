import armaloApp from "../../starters/armalo-app/manifest.json" with { type: "json" };
import hermesRevenue from "../../starters/hermes-revenue-agents/manifest.json" with { type: "json" };
import {
  validateStarterManifest,
  type StarterManifest,
} from "./starter-system.ts";

export const starterManifests: readonly StarterManifest[] = [
  validateStarterManifest(armaloApp),
  validateStarterManifest(hermesRevenue),
];

export function publicStarterCatalogue() {
  return starterManifests.map(
    ({ id, version, productSlug, name, maturity, capabilities, modules }) => ({
      id,
      version,
      productSlug,
      name,
      maturity,
      capabilities,
      modules: modules.map(
        ({ id: moduleId, kind, description, dependsOn, provides }) => ({
          id: moduleId,
          kind,
          description,
          dependsOn,
          provides,
        }),
      ),
    }),
  );
}
