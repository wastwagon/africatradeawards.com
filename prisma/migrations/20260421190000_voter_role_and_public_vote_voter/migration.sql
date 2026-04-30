-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'VOTER';

-- AlterTable
ALTER TABLE "PublicVote" ADD COLUMN "voterId" TEXT;

-- AddForeignKey
ALTER TABLE "PublicVote" ADD CONSTRAINT "PublicVote_voterId_fkey" FOREIGN KEY ("voterId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateIndex
CREATE UNIQUE INDEX "PublicVote_entryId_voterId_key" ON "PublicVote"("entryId", "voterId");
CREATE INDEX "PublicVote_voterId_createdAt_idx" ON "PublicVote"("voterId", "createdAt");
