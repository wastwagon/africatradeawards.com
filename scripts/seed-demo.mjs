/**
 * Cross-platform demo seed: sets DEMO_SEED=true (Unix env prefix does not work in Windows cmd).
 * Loads repo-root `.env` so `DATABASE_URL` is available when npm does not inject it (same as `prisma` CLI).
 */
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, "..");

/**
 * Minimal `.env` parser (no dotenv dependency). Does not expand variable references.
 * @param {string} content
 * @returns {Record<string, string>}
 */
function parseDotenv(content) {
  const out = {};
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    if (!key) continue;
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"') && value.length >= 2) ||
      (value.startsWith("'") && value.endsWith("'") && value.length >= 2)
    ) {
      value = value.slice(1, -1);
    }
    out[key] = value;
  }
  return out;
}

/** @type {NodeJS.ProcessEnv} */
let env = { ...process.env };
const envPath = path.join(projectRoot, ".env");
if (existsSync(envPath)) {
  const parsed = parseDotenv(readFileSync(envPath, "utf8"));
  for (const [k, v] of Object.entries(parsed)) {
    if (env[k] === undefined) env[k] = v;
  }
}

env = { ...env, DEMO_SEED: "true" };

const dbUrl = env.DATABASE_URL && String(env.DATABASE_URL).trim();
if (!dbUrl) {
  console.error(
    [
      "prisma:seed:demo: DATABASE_URL is not set.",
      "  1. Copy .env.example to .env in the repo root.",
      "  2. Set DATABASE_URL (and start Postgres — see CONTRIBUTING.md).",
      "  3. Run: npx prisma migrate deploy   (or migrate dev)",
      "  4. Then: npm run prisma:seed:demo",
      "More: docs/MANUAL_QA_GUIDE.md",
    ].join("\n"),
  );
  process.exit(1);
}

const result = spawnSync("npx", ["prisma", "db", "seed"], {
  stdio: "inherit",
  env,
  shell: true,
  cwd: projectRoot,
});

process.exit(result.status === null ? 1 : result.status);
