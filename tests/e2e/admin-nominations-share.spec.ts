import { expect, test } from "@playwright/test";
import { loginAsAdmin } from "./helpers/auth";
import { longSummary, uniqueEmail } from "./helpers/factories";

test("admin nominations share shortcuts work on focused audit panel", async ({ page }) => {
  test.setTimeout(240_000);
  await loginAsAdmin(page);

  // `requireRole(ENTRANT)` allows super admin / manager without impersonation (see `lib/rbac` rank).
  const metadataRes = await page.request.get("/api/portal/metadata/");
  expect(metadataRes.ok()).toBeTruthy();
  const metadata = (await metadataRes.json()) as {
    programs?: Array<{
      id: string;
      seasons: Array<{ id: string }>;
      categories: Array<{ id: string }>;
    }>;
  };
  const firstProgram = metadata.programs?.find((program) => program.seasons.length > 0 && program.categories.length > 0);
  expect(firstProgram).toBeTruthy();

  const nomineeName = `E2E Share ${Date.now()}`;
  const publicSubmitRes = await page.request.post("/api/nominations/public/", {
    data: {
      nominatorName: "E2E Share Nominator",
      nominatorEmail: uniqueEmail("share-nominator"),
      nomineeFullName: nomineeName,
      nomineeEmail: uniqueEmail("share-nominee"),
      nomineeOrganization: "E2E Trade Org",
      nomineeRoleTitle: "Director",
      summary: longSummary(),
      evidenceLinks: "https://example.com/evidence",
      programId: firstProgram!.id,
      seasonId: firstProgram!.seasons[0]!.id,
      categoryId: firstProgram!.categories[0]!.id,
      website: "",
    },
  });
  expect(publicSubmitRes.ok()).toBeTruthy();
  const publicBody = (await publicSubmitRes.json()) as { nomination?: { id: string } };
  const nominationId = publicBody.nomination?.id;
  expect(nominationId).toBeTruthy();

  // Deep-link so `selectedId` hydrates from `nid` while `rows` loads; avoids selectOption before options exist.
  await page.goto(`/admin/nominations/?nid=${encodeURIComponent(nominationId!)}`);
  await expect(page.locator(`select option[value="${nominationId}"]`)).toHaveCount(1, { timeout: 120_000 });
  await page.getByLabel("Select nomination").first().selectOption(nominationId!);
  await expect(page.getByText("Audit timeline")).toBeVisible();
  // Audit fetch + first paint can exceed default expect timeout on cold Docker dev.
  await expect(page.getByRole("button", { name: "Apply filters" })).toBeVisible({ timeout: 90_000 });

  const origin = new URL(page.url()).origin;
  await page.context().grantPermissions(["clipboard-read", "clipboard-write"], { origin });

  const auditPanel = page.getByRole("region", { name: "Audit timeline panel." });
  await auditPanel.focus();

  await page.keyboard.press("c");
  const copiedText = await page.evaluate(async () => navigator.clipboard.readText());
  expect(copiedText).toContain("/admin/nominations");
  expect(copiedText).toContain("nid=");

  const popupPromise = page.waitForEvent("popup");
  await page.keyboard.press("o");
  const popup = await popupPromise;
  await popup.waitForLoadState("domcontentloaded");
  await expect(popup).toHaveURL(/\/admin\/nominations/);

  await auditPanel.focus();
  await page.keyboard.press("r");
  await expect(page.getByText("Share parameters reset to default.")).toBeVisible();
  await expect(page.getByLabel("Select nomination").first()).toHaveValue("");
});
