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
