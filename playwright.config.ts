import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.E2E_BASE_URL ?? "http://127.0.0.1:3003";
const useWebServer = process.env.PLAYWRIGHT_USE_WEB_SERVER === "true";

export default defineConfig({
  testDir: "./tests/e2e",
  /** Admin API login + bcrypt can approach 30s on cold Docker dev; keep headroom for follow-up requests. */
  timeout: 120 * 1000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  webServer: useWebServer
    ? {
        command: "npm run dev",
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120 * 1000,
      }
    : undefined,
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
