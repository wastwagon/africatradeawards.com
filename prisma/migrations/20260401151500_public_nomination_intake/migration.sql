-- CreateEnum
CREATE TYPE "NominationSource" AS ENUM ('PORTAL', 'PUBLIC_FORM', 'ADMIN');

-- AlterTable
ALTER TABLE "Nomination"
ADD COLUMN "source" "NominationSource" NOT NULL DEFAULT 'PORTAL',
ADD COLUMN "publicNominatorName" TEXT,
ADD COLUMN "publicNominatorEmail" TEXT,
ALTER COLUMN "nominatorId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Nomination_publicNominatorEmail_createdAt_idx" ON "Nomination"("publicNominatorEmail", "createdAt");

-- DropForeignKey
ALTER TABLE "Nomination" DROP CONSTRAINT "Nomination_nominatorId_fkey";

-- AddForeignKey
ALTER TABLE "Nomination" ADD CONSTRAINT "Nomination_nominatorId_fkey" FOREIGN KEY ("nominatorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
