import { expect, test } from "@playwright/test";
import { loginAsAdmin } from "./helpers/auth";
import { longSummary, uniqueEmail } from "./helpers/factories";

test("public nomination review and conversion lifecycle", async ({ page }) => {
  test.setTimeout(60_000);
  await loginAsAdmin(page);

  const entrantEmail = uniqueEmail("entrant");
  const entrantPassword = "EntrantPass_12345";
  const createUserRes = await page.request.post("/api/users", {
    data: {
      email: entrantEmail,
      password: entrantPassword,
      fullName: "E2E Entrant",
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
  const firstProgram = metadata.programs?.find(
    (program) => program.seasons.length > 0 && program.categories.length > 0,
  );
  expect(firstProgram).toBeTruthy();

  const stopImpersonationRes = await page.request.post("/api/auth/impersonate/stop");
  expect(stopImpersonationRes.ok()).toBeTruthy();

  const nomineeName = `E2E Nominee ${Date.now()}`;
  const publicSubmitRes = await page.request.post("/api/nominations/public/", {
    data: {
      nominatorName: "Public E2E Nominator",
      nominatorEmail: uniqueEmail("public-nominator"),
      nomineeFullName: nomineeName,
      nomineeEmail: uniqueEmail("nominee"),
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
  const publicSubmitBody = (await publicSubmitRes.json()) as {
    nomination?: { id: string };
  };
  const nominationId = publicSubmitBody.nomination?.id;
  expect(nominationId).toBeTruthy();

  const underReviewRes = await page.request.patch(`/api/nominations/${nominationId}`, {
    data: {
      action: "under_review",
      reviewNote: "E2E move to review",
    },
  });
  expect(underReviewRes.ok()).toBeTruthy();

  const convertRes = await page.request.post(`/api/nominations/${nominationId}/convert`);
  expect(convertRes.ok()).toBeTruthy();
  const convertBody = (await convertRes.json()) as { entry?: { id?: string; title?: string } };
  expect(convertBody.entry?.id).toBeTruthy();
  expect(convertBody.entry?.title).toContain("E2E Nominee");

  const nominationRes = await page.request.get(`/api/nominations/${nominationId}`);
  expect(nominationRes.ok()).toBeTruthy();
  const nominationBody = (await nominationRes.json()) as {
    nomination?: { status?: string; convertedEntry?: { id?: string } | null };
  };
  expect(nominationBody.nomination?.status).toBe("CONVERTED");
  expect(nominationBody.nomination?.convertedEntry?.id).toBeTruthy();
});
