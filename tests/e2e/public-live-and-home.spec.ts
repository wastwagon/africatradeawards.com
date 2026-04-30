import { expect, test } from "@playwright/test";

test.describe("public marketing shell", () => {
  test("home hero loads", async ({ page }) => {
    await page.goto("/");
    await expect(
      page
        .getByRole("heading", { name: /Where Trade Excellence Takes the Stage|Africa Trade Awards/i })
        .first()
    ).toBeVisible();
  });

  test("live page loads with stream section", async ({ page }) => {
    await page.goto("/live");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    const offline = page.getByText(/The live stream is not active on the website right now/i);
    const player = page.locator(".ata-live-stream-embed iframe");
    await expect(offline.or(player)).toBeVisible();
  });
});
