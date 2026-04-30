import { expect, test } from "@playwright/test";
import { loginAsAdmin } from "./helpers/auth";
import { uniqueEmail } from "./helpers/factories";

test("super admin can impersonate entrant and return", async ({ page }) => {
  test.setTimeout(60_000);
  await loginAsAdmin(page);

  const entrantEmail = uniqueEmail("impersonation");
  const createUserRes = await page.request.post("/api/users", {
    data: {
      email: entrantEmail,
      password: "ImpersonatePass_12345",
      fullName: "Impersonation Entrant",
      role: "ENTRANT",
    },
  });
  expect([201, 409]).toContain(createUserRes.status());

  const usersRes = await page.request.get("/api/users?role=ENTRANT");
  expect(usersRes.ok()).toBeTruthy();
  const usersBody = (await usersRes.json()) as { users?: Array<{ id: string; email: string }> };
  const entrant = usersBody.users?.find((user) => user.email.toLowerCase() === entrantEmail.toLowerCase());
  expect(entrant).toBeTruthy();
  const impersonateRes = await page.request.post("/api/auth/impersonate", {
    data: { userId: entrant!.id },
  });
  expect(impersonateRes.ok()).toBeTruthy();
  const meWhileImpersonatingRes = await page.request.get("/api/auth/me");
  expect(meWhileImpersonatingRes.ok()).toBeTruthy();
  const meWhileImpersonating = (await meWhileImpersonatingRes.json()) as {
    session?: { impersonatedBy?: { userId: string } | null };
  };
  expect(meWhileImpersonating.session?.impersonatedBy?.userId).toBeTruthy();

  const stopRes = await page.request.post("/api/auth/impersonate/stop");
  expect(stopRes.ok()).toBeTruthy();
  const stopBody = (await stopRes.json()) as { redirectTo?: string };
  await page.goto(stopBody.redirectTo ?? "/admin/");
  await expect(page).toHaveURL(/\/admin/);
});
