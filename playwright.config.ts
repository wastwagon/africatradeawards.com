import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.E2E_BASE_URL ?? "http://127.0.0.1:3003";
const isCi = !!process.env.CI;
/** Local opt-in: PLAYWRIGHT_USE_WEB_SERVER=true. CI always starts a server so tests are not connection-refused. */
const useWebServer = process.env.PLAYWRIGHT_USE_WEB_SERVER === "true" || isCi;

export default defineConfig({
  testDir: "./tests/e2e",
  /** Admin API login + bcrypt can approach 30s on cold Docker dev; keep headroom for follow-up requests. */
  timeout: 120 * 1000,
  fullyParallel: true,
  forbidOnly: isCi,
  retries: isCi ? 2 : 0,
  workers: isCi ? 2 : undefined,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  webServer: useWebServer
    ? {
        // GitHub Actions runs `npm run build` first; use production server. Local opt-in uses dev.
        command: isCi ? "npm run start" : "npm run dev",
        url: baseURL,
        reuseExistingServer: !isCi,
        timeout: isCi ? 180 * 1000 : 120 * 1000,
      }
    : undefined,
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
