import { Redis } from "@upstash/redis";

let client: Redis | null | undefined;

/**
 * Returns a configured Redis client, or null if the env vars aren't set.
 * Cached after first call. Callers should treat null as "feature
 * unavailable" and degrade gracefully — never throw.
 */
export function getRedis(): Redis | null {
  if (client !== undefined) return client;

  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  client = url && token ? new Redis({ url, token }) : null;
  return client;
}
