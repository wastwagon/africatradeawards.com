import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL ?? "redis://localhost:6379";
const redis = new Redis(redisUrl, {
  maxRetriesPerRequest: 2,
});

const patterns = [
  "rl:auth:login:*",
  "rl:nominations:*",
  "rl:voting:*",
  "rl:event:*",
];

async function deleteByPattern(pattern) {
  let cursor = "0";
  let deleted = 0;
  do {
    const [nextCursor, keys] = await redis.scan(cursor, "MATCH", pattern, "COUNT", 200);
    cursor = nextCursor;
    if (keys.length > 0) {
      deleted += await redis.del(...keys);
    }
  } while (cursor !== "0");
  return deleted;
}

async function main() {
  let totalDeleted = 0;
  for (const pattern of patterns) {
    totalDeleted += await deleteByPattern(pattern);
  }
  console.log(`Reset E2E rate-limit keys: ${totalDeleted}`);
}

main()
  .catch((error) => {
    console.error("Failed to reset E2E rate-limit keys:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await redis.quit();
  });
