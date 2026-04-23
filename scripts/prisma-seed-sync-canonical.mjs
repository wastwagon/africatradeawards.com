/**
 * Runs `prisma db seed` with SYNC_CANONICAL_PUBLICATION_BODIES=true so
 * publication rows listed in CMS_PUBLICATION_SEED get `body` from the repo HTML.
 */
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
process.env.SYNC_CANONICAL_PUBLICATION_BODIES = "true";
const result = spawnSync("npx", ["prisma", "db", "seed"], {
  stdio: "inherit",
  shell: true,
  cwd: root,
  env: process.env,
});
process.exit(result.status === null ? 1 : result.status);
