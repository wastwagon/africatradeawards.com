import { expect, test } from "@playwright/test";
import { loginAsAdmin } from "./helpers/auth";
import { longSummary, uniqueEmail } from "./helpers/factories";

test("admin nominations share shortcuts work on focused audit panel", async ({ page }) => {
  await loginAsAdmin(page);

  const entrantEmail = uniqueEmail("audit-shortcuts");
  const createUserRes = await page.request.post("/api/users", {
    data: {
      email: entrantEmail,
      password: "AuditShortcuts_12345",
      fullName: "Audit Shortcut Entrant",
      role: "ENTRANT",
    },
  });
  expect([201, 409]).toContain(createUserRes.status());

  const usersRes = await page.request.get("/api/users?role=ENTRANT");
  expect(usersRes.ok()).toBeTruthy();
  const usersBody = (await usersRes.json()) as {
    users?: Array<{ id: string; email: string }>;
  };
  const entrant = usersBody.users?.find((user) => user.email.toLowerCase() === entrantEmail.toLowerCase());
  expect(entrant).toBeTruthy();

  const impersonateRes = await page.request.post("/api/auth/impersonate", {
    data: { userId: entrant!.id },
  });
  expect(impersonateRes.ok()).toBeTruthy();
  const metadataRes = await page.request.get("/api/portal/metadata");
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
  const stopImpersonationRes = await page.request.post("/api/auth/impersonate/stop");
  expect(stopImpersonationRes.ok()).toBeTruthy();

  const nomineeName = `E2E Share ${Date.now()}`;
  const publicSubmitRes = await page.request.post("/api/nominations/public", {
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

  await page.goto("/admin/nominations");
  await page.getByLabel("Select nomination").first().selectOption(nominationId!);
  await expect(page.getByText("Audit timeline")).toBeVisible();
  await expect(page.getByRole("button", { name: "Apply filters" })).toBeVisible();

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
