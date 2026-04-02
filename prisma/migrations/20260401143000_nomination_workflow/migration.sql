-- CreateEnum
CREATE TYPE "NominationStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'SHORTLISTED', 'APPROVED', 'REJECTED', 'CONVERTED', 'WITHDRAWN');

-- CreateTable
CREATE TABLE "Nomination" (
    "id" TEXT NOT NULL,
    "status" "NominationStatus" NOT NULL DEFAULT 'DRAFT',
    "nomineeFullName" TEXT NOT NULL,
    "nomineeEmail" TEXT,
    "nomineeOrganization" TEXT,
    "nomineeRoleTitle" TEXT,
    "summary" TEXT NOT NULL,
    "evidenceLinks" TEXT,
    "reviewNote" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "convertedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "nominatorId" TEXT NOT NULL,
    "reviewedById" TEXT,
    "programId" TEXT NOT NULL,
    "seasonId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "convertedEntryId" TEXT,

    CONSTRAINT "Nomination_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Nomination_nominatorId_createdAt_idx" ON "Nomination"("nominatorId", "createdAt");

-- CreateIndex
CREATE INDEX "Nomination_status_createdAt_idx" ON "Nomination"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Nomination_programId_seasonId_categoryId_idx" ON "Nomination"("programId", "seasonId", "categoryId");

-- AddForeignKey
ALTER TABLE "Nomination" ADD CONSTRAINT "Nomination_nominatorId_fkey" FOREIGN KEY ("nominatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nomination" ADD CONSTRAINT "Nomination_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nomination" ADD CONSTRAINT "Nomination_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nomination" ADD CONSTRAINT "Nomination_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nomination" ADD CONSTRAINT "Nomination_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nomination" ADD CONSTRAINT "Nomination_convertedEntryId_fkey" FOREIGN KEY ("convertedEntryId") REFERENCES "Entry"("id") ON DELETE SET NULL ON UPDATE CASCADE;
