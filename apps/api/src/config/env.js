import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

// Strict environment schema validation blocking missing secrets
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('production'),
  PORT: z.coerce.number().default(8080),
  CORS_ORIGIN: z.string().min(1, 'CORS_ORIGIN must be explicitly defined (no wildcards)'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters for cryptographic safety'),
  REDIS_HOST: z.string().default('127.0.0.1'),
  REDIS_PORT: z.coerce.number().default(6379),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(60000),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().default(100)
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ FATAL: Invalid Environment Configuration:');
  console.error(parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
