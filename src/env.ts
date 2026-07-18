import { z } from 'zod'
import { loadEnv } from '@fongryan/dotenv-schema'

export const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
})

export const env = loadEnv(schema)
export type Env = typeof env
