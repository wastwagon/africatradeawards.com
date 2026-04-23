import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig, env } from "prisma/config";

/**
 * When `prisma.config.ts` is present, Prisma skips its default `.env` loading.
 * Populate `process.env` from the project root `.env` so `env("DATABASE_URL")`
 * and `schema.prisma` `env("DATABASE_URL")` resolve the same way as before.
 */
function loadDotEnvFromProjectRoot() {
  const envPath = resolve(process.cwd(), ".env");
  if (!existsSync(envPath)) return;

  const content = readFileSync(envPath, "utf8");
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const exportPrefix = line.startsWith("export ") ? 7 : 0;
    const segment = exportPrefix ? line.slice(exportPrefix).trim() : line;

    const eq = segment.indexOf("=");
    if (eq <= 0) continue;

    const key = segment.slice(0, eq).trim();
    if (!key || process.env[key] !== undefined) continue;

    let value = segment.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  }
}

loadDotEnvFromProjectRoot();

export default defineConfig({
  engine: "classic",
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DATABASE_URL"),
  },
  migrations: {
    seed: "node prisma/seed.mjs",
  },
});
