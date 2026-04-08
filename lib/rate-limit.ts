import { redis } from "@/lib/redis";

export async function checkRateLimit(key: string, max: number, windowSeconds: number) {
  const count = await redis.incr(key);
  if (count === 1) {
    await redis.expire(key, windowSeconds);
  }
  return {
    allowed: count <= max,
    count,
    remaining: Math.max(0, max - count),
  };
}

/**
 * Same as checkRateLimit but does not throw if Redis is down.
 * Use for non-critical public endpoints where availability beats strict throttling.
 */
export async function tryCheckRateLimit(key: string, max: number, windowSeconds: number) {
  try {
    return await checkRateLimit(key, max, windowSeconds);
  } catch {
    return { allowed: true, count: 0, remaining: max, skipped: true as const };
  }
}
