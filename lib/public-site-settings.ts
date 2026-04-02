import { prisma } from "@/lib/prisma";

export type PublicSiteSettingsDTO = {
  headerDateLine: string;
  headerVenueLine: string;
  mobileNavMetaLine: string;
  heroBarDateLine: string;
  heroBarVenueLine: string;
};

export const FALLBACK_PUBLIC_SITE_SETTINGS: PublicSiteSettingsDTO = {
  headerDateLine: "28–29 January 2026",
  headerVenueLine: "Kempinski Gold Coast City · Accra",
  mobileNavMetaLine: "28–29 Jan · Accra",
  heroBarDateLine: "29th January 2026",
  heroBarVenueLine: "Kempinski Gold Coast City Hotel, Accra-Ghana",
};

function shouldFallbackToDefaults(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const message = error.message || "";
  return (
    message.includes("Environment variable not found: DATABASE_URL") ||
    message.includes("P2021") || // table does not exist (migrations not applied yet)
    message.includes("Can't reach database server")
  );
}

function rowToDto(row: {
  headerDateLine: string;
  headerVenueLine: string;
  mobileNavMetaLine: string;
  heroBarDateLine: string;
  heroBarVenueLine: string;
}): PublicSiteSettingsDTO {
  return {
    headerDateLine: row.headerDateLine,
    headerVenueLine: row.headerVenueLine,
    mobileNavMetaLine: row.mobileNavMetaLine,
    heroBarDateLine: row.heroBarDateLine,
    heroBarVenueLine: row.heroBarVenueLine,
  };
}

export async function getPublicSiteSettings(): Promise<PublicSiteSettingsDTO> {
  try {
    const row = await prisma.publicSiteSettings.findUnique({
      where: { id: "default" },
    });
    if (!row) {
      return FALLBACK_PUBLIC_SITE_SETTINGS;
    }
    return rowToDto(row);
  } catch (error) {
    if (shouldFallbackToDefaults(error)) {
      return FALLBACK_PUBLIC_SITE_SETTINGS;
    }
    throw error;
  }
}

export async function upsertPublicSiteSettings(
  patch: Partial<PublicSiteSettingsDTO>,
): Promise<PublicSiteSettingsDTO> {
  let current: Awaited<ReturnType<typeof prisma.publicSiteSettings.findUnique>> = null;
  try {
    current = await prisma.publicSiteSettings.findUnique({
      where: { id: "default" },
    });
  } catch (error) {
    if (shouldFallbackToDefaults(error)) {
      throw new Error(
        "Site settings cannot be updated until database connection and migrations are available.",
      );
    }
    throw error;
  }

  const base = current ? rowToDto(current) : FALLBACK_PUBLIC_SITE_SETTINGS;
  const merged: PublicSiteSettingsDTO = {
    headerDateLine: patch.headerDateLine ?? base.headerDateLine,
    headerVenueLine: patch.headerVenueLine ?? base.headerVenueLine,
    mobileNavMetaLine: patch.mobileNavMetaLine ?? base.mobileNavMetaLine,
    heroBarDateLine: patch.heroBarDateLine ?? base.heroBarDateLine,
    heroBarVenueLine: patch.heroBarVenueLine ?? base.heroBarVenueLine,
  };

  const saved = await prisma.publicSiteSettings.upsert({
    where: { id: "default" },
    create: { id: "default", ...merged },
    update: merged,
  });
  return rowToDto(saved);
}
