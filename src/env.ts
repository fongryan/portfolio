import { z } from 'zod'
import { loadEnv } from '/Users/ryanfong/dotfiles/configs/env-schema/index.mjs'

export const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
})

export const env = loadEnv(schema)
export type Env = typeof env
