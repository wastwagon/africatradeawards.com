-- AlterTable
ALTER TABLE "CmsFaq"
ADD COLUMN "publishAt" TIMESTAMP(3),
ADD COLUMN "unpublishAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "CmsPublication"
ADD COLUMN "publishAt" TIMESTAMP(3),
ADD COLUMN "unpublishAt" TIMESTAMP(3);
