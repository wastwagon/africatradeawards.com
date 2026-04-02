-- CreateTable
CREATE TABLE "CmsRevision" (
    "id" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "snapshot" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" TEXT,

    CONSTRAINT "CmsRevision_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CmsRevision_scope_createdAt_idx" ON "CmsRevision"("scope", "createdAt");

-- AddForeignKey
ALTER TABLE "CmsRevision" ADD CONSTRAINT "CmsRevision_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
