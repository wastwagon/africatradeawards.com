-- CreateTable
CREATE TABLE "PublicSiteSettings" (
    "id" TEXT NOT NULL,
    "headerDateLine" TEXT NOT NULL DEFAULT '28–29 January 2026',
    "headerVenueLine" TEXT NOT NULL DEFAULT 'Kempinski Gold Coast City · Accra',
    "mobileNavMetaLine" TEXT NOT NULL DEFAULT '28–29 Jan · Accra',
    "heroBarDateLine" TEXT NOT NULL DEFAULT '29th January 2026',
    "heroBarVenueLine" TEXT NOT NULL DEFAULT 'Kempinski Gold Coast City Hotel, Accra-Ghana',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PublicSiteSettings_pkey" PRIMARY KEY ("id")
);
