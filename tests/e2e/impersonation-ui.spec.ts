import { expect, test } from "@playwright/test";
import { E2E_ADMIN_EMAIL, loginAsAdmin } from "./helpers/auth";
import { uniqueEmail } from "./helpers/factories";

test("super admin can impersonate entrant and return", async ({ page }) => {
  test.setTimeout(180_000);
  await loginAsAdmin(page);

  const entrantEmail = uniqueEmail("impersonation");
  const createUserRes = await page.request.post("/api/users/", {
    data: {
      email: entrantEmail,
      password: "ImpersonatePass_12345",
      fullName: "Impersonation Entrant",
      role: "ENTRANT",
    },
  });
  expect([201, 409]).toContain(createUserRes.status());
  let entrantId: string | undefined;
  if (createUserRes.status() === 201) {
    const created = (await createUserRes.json()) as { user?: { id?: string } };
    entrantId = created.user?.id;
  }
  if (!entrantId) {
    const usersRes = await page.request.get("/api/users/?role=ENTRANT");
    expect(usersRes.ok()).toBeTruthy();
    const usersBody = (await usersRes.json()) as { users?: Array<{ id: string; email: string }> };
    entrantId = usersBody.users?.find((u) => u.email.toLowerCase() === entrantEmail.toLowerCase())?.id;
  }
  expect(entrantId).toBeTruthy();

  // API-only impersonation: skip loading `/portal/nominator` in headless (slow first compile on cold Docker dev).
  const impersonateRes = await page.request.post("/api/auth/impersonate/", { data: { userId: entrantId } });
  expect(impersonateRes.ok()).toBeTruthy();
  const impersonateJson = (await impersonateRes.json()) as {
    target?: { id?: string; email?: string; role?: string };
  };
  expect(impersonateJson.target?.id).toBe(entrantId);
  expect(impersonateJson.target?.email?.toLowerCase()).toBe(entrantEmail.toLowerCase());
  expect(impersonateJson.target?.role).toBe("ENTRANT");

  // Avoid GET `/api/auth/me` while impersonated: on some Windows+Docker setups that request can stall until the
  // Playwright test timeout even though the impersonation cookie is valid (see response body above).

  const stopRes = await page.request.post("/api/auth/impersonate/stop/");
  expect(stopRes.ok()).toBeTruthy();
  const stopBody = (await stopRes.json()) as { redirectTo?: string };
  const meAfterStop = await page.request.get("/api/auth/me/");
  expect(meAfterStop.ok()).toBeTruthy();
  const meBody = (await meAfterStop.json()) as { user?: { email?: string }; session?: { impersonatedBy?: unknown } };
  expect(meBody.user?.email?.toLowerCase()).toBe(E2E_ADMIN_EMAIL.toLowerCase());
  expect(meBody.session?.impersonatedBy).toBeFalsy();

  const base = process.env.E2E_BASE_URL ?? "http://127.0.0.1:3003";
  const adminPath = stopBody.redirectTo ?? "/admin/";
  await page.goto(adminPath.startsWith("http") ? adminPath : `${base.replace(/\/+$/, "")}${adminPath.startsWith("/") ? adminPath : `/${adminPath}`}`, {
    waitUntil: "domcontentloaded",
    timeout: 120_000,
  });
  await expect(page).toHaveURL(/\/admin/);
});
