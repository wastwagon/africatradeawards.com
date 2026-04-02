-- AlterTable
ALTER TABLE "Nomination"
ADD COLUMN "publicTrackingTokenHash" TEXT;

-- CreateIndex
CREATE INDEX "Nomination_publicTrackingTokenHash_idx" ON "Nomination"("publicTrackingTokenHash");
