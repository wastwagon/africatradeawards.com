-- AlterTable
ALTER TABLE "PublicSiteSettings" ADD COLUMN "eventLiveStreamEnabled" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "PublicSiteSettings" ADD COLUMN "eventLiveStreamTitle" TEXT;
ALTER TABLE "PublicSiteSettings" ADD COLUMN "eventLiveStreamEmbedUrl" TEXT;
