/**
 * Remove `.next` so `next build` never reads a half-written manifest from a
 * prior run (e.g. after toggling output mode or a crashed build). Cross-platform.
 */
import { existsSync, rmSync } from "node:fs";
import { join } from "node:path";

const dir = join(process.cwd(), ".next");
if (existsSync(dir)) {
	rmSync(dir, { recursive: true, force: true });
}
