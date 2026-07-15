import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { appSchema } from "./content/app-schema";

const apps = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/apps" }),
  schema: appSchema,
});

export { appSchema };
export const collections = { apps };
