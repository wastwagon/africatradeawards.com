-- PublicSiteSettings: announcements, support email, SEO
ALTER TABLE "PublicSiteSettings" ADD COLUMN "announcementEnabled" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "PublicSiteSettings" ADD COLUMN "announcementText" TEXT;
ALTER TABLE "PublicSiteSettings" ADD COLUMN "announcementLinkUrl" TEXT;
ALTER TABLE "PublicSiteSettings" ADD COLUMN "announcementLinkLabel" TEXT;
ALTER TABLE "PublicSiteSettings" ADD COLUMN "supportEmail" TEXT NOT NULL DEFAULT 'secretariat@africatradeawards.com';
ALTER TABLE "PublicSiteSettings" ADD COLUMN "seoDescription" TEXT;

-- List performance (admin / dashboards)
CREATE INDEX "User_role_idx" ON "User"("role");
CREATE INDEX "Entry_status_updatedAt_idx" ON "Entry"("status", "updatedAt");


-- Contact inquiries captured from public form
CREATE TABLE "ContactInquiry" (
  "id" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "inquiryType" TEXT NOT NULL,
  "subject" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "ipHash" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'NEW',
  "emailedAt" TIMESTAMP(3),
  "emailError" TEXT,
  CONSTRAINT "ContactInquiry_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ContactInquiry_createdAt_idx" ON "ContactInquiry"("createdAt");
CREATE INDEX "ContactInquiry_status_createdAt_idx" ON "ContactInquiry"("status", "createdAt");
CREATE INDEX "ContactInquiry_email_createdAt_idx" ON "ContactInquiry"("email", "createdAt");
