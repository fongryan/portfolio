import { z } from "zod";

const id = z.string().regex(/^[a-z0-9]+(?:[.-][a-z0-9]+)*$/);
const semver = z.string().regex(/^\d+\.\d+\.\d+$/);
const sha256 = z.string().regex(/^sha256:[a-f0-9]{64}$/);

export const starterModuleSchema = z.object({
  id,
  kind: z.enum([
    "foundation",
    "ui",
    "data",
    "auth",
    "integration",
    "billing",
    "deployment",
    "hermes",
  ]),
  description: z.string().min(1).max(240),
  dependsOn: z.array(id).default([]),
  conflictsWith: z.array(id).default([]),
  provides: z.array(id).min(1),
  requires: z.array(id).default([]),
  artifact: z.object({ path: z.string().min(1), digest: sha256 }),
});

export const starterManifestSchema = z.object({
  schema: z.literal("armalo.starter.manifest.v1"),
  id,
  version: semver,
  productSlug: id,
  name: z.string().min(1).max(120),
  visibility: z.enum(["public-safe", "private", "community"]),
  maturity: z.enum([
    "planned",
    "source-tested",
    "runtime-verified",
    "public-live",
  ]),
  source: z.object({
    repository: z.string().url(),
    commit: z.string().regex(/^[0-9a-f]{7,64}$/),
    digest: sha256,
  }),
  capabilities: z.array(id).min(1),
  modules: z.array(starterModuleSchema).min(1),
  hermes: z.object({
    soul: z.string().min(1),
    goals: z.string().min(1),
    skills: z.array(z.string().min(1)),
    loops: z.array(z.string().min(1)),
  }),
  acceptance: z
    .array(
      z.object({ id, command: z.string().min(1), purpose: z.string().min(1) }),
    )
    .min(1),
});

export type StarterManifest = z.infer<typeof starterManifestSchema>;
export type StarterModule = z.infer<typeof starterModuleSchema>;

export type CompositionResult = {
  manifests: string[];
  modules: StarterModule[];
  capabilities: string[];
  hermes: {
    souls: string[];
    goals: string[];
    skills: string[];
    loops: string[];
  };
};

export function validateStarterManifest(input: unknown): StarterManifest {
  return starterManifestSchema.parse(input);
}

/** Resolve a deterministic Lego graph. This is planning only: it has no install,
 * billing, tenant, or runtime authority. Armalo owns those decisions. */
export function composeStarters(inputs: readonly unknown[]): CompositionResult {
  const manifests = inputs.map(validateStarterManifest);
  const modules = new Map<string, StarterModule>();
  const owners = new Map<string, string>();
  for (const manifest of manifests) {
    for (const module of manifest.modules) {
      const previous = owners.get(module.id);
      if (previous && previous !== manifest.id)
        throw new Error(
          `duplicate module ${module.id} from ${previous} and ${manifest.id}`,
        );
      owners.set(module.id, manifest.id);
      modules.set(module.id, module);
    }
  }
  for (const module of modules.values()) {
    for (const dependency of module.dependsOn) {
      if (!modules.has(dependency))
        throw new Error(`missing dependency ${module.id} -> ${dependency}`);
    }
    for (const conflict of module.conflictsWith) {
      if (modules.has(conflict))
        throw new Error(`module conflict ${module.id} x ${conflict}`);
    }
  }
  const ordered: StarterModule[] = [];
  const visiting = new Set<string>();
  const visited = new Set<string>();
  const visit = (module: StarterModule) => {
    if (visited.has(module.id)) return;
    if (visiting.has(module.id))
      throw new Error(`dependency cycle at ${module.id}`);
    visiting.add(module.id);
    [...module.dependsOn]
      .sort()
      .forEach((dependency) => visit(modules.get(dependency)!));
    visiting.delete(module.id);
    visited.add(module.id);
    ordered.push(module);
  };
  [...modules.values()].sort((a, b) => a.id.localeCompare(b.id)).forEach(visit);
  return {
    manifests: manifests.map((manifest) => manifest.id),
    modules: ordered,
    capabilities: [
      ...new Set(manifests.flatMap((manifest) => manifest.capabilities)),
    ].sort(),
    hermes: {
      souls: manifests.map((manifest) => manifest.hermes.soul),
      goals: manifests.map((manifest) => manifest.hermes.goals),
      skills: [
        ...new Set(manifests.flatMap((manifest) => manifest.hermes.skills)),
      ].sort(),
      loops: [
        ...new Set(manifests.flatMap((manifest) => manifest.hermes.loops)),
      ].sort(),
    },
  };
}
