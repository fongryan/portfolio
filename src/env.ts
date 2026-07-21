import { config } from "dotenv";
import { z } from "zod";

config();

export const schema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(3000),
});

export const env = schema.parse(import.meta.env);
export type Env = typeof env;
