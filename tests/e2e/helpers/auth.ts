import { expect, type Page } from "@playwright/test";

export const E2E_ADMIN_EMAIL = process.env.E2E_ADMIN_EMAIL ?? "admin@local.test";
export const E2E_ADMIN_PASSWORD = process.env.E2E_ADMIN_PASSWORD ?? "ChangeMe_Local_12345";

export async function loginAsAdmin(page: Page) {
  const loginRes = await page.request.post("/api/auth/login/", {
    data: { email: E2E_ADMIN_EMAIL, password: E2E_ADMIN_PASSWORD },
  });
  expect(loginRes.ok(), `Admin login failed with status ${loginRes.status()}`).toBeTruthy();
  const setCookieHeader = loginRes.headers()["set-cookie"] ?? "";
  const tokenMatch = setCookieHeader.match(/ata_session=([^;]+)/);
  expect(tokenMatch, "ata_session cookie missing from login response").toBeTruthy();
  const baseUrl = process.env.E2E_BASE_URL ?? "http://127.0.0.1:3003";
  const url = new URL(baseUrl);
  await page.context().addCookies([
    {
      name: "ata_session",
      value: tokenMatch![1],
      domain: url.hostname,
      path: "/",
      httpOnly: true,
      sameSite: "Lax",
      secure: url.protocol === "https:",
    },
  ]);
  const me = await page.request.get("/api/auth/me");
  expect(me.ok()).toBeTruthy();
  const body = (await me.json()) as {
    user?: { email?: string; role?: string };
  };
  expect(body.user?.email?.toLowerCase()).toBe(E2E_ADMIN_EMAIL.toLowerCase());
}
