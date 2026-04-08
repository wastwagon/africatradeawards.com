import { cache } from "react";
import { normalizeLiveStreamEmbedUrl } from "@/lib/live-stream-embed";
import { prisma } from "@/lib/prisma";

export type PublicSiteSettingsDTO = {
  headerDateLine: string;
  headerVenueLine: string;
  mobileNavMetaLine: string;
  heroBarDateLine: string;
  heroBarVenueLine: string;
  announcementEnabled: boolean;
  announcementText: string;
  announcementLinkUrl: string;
  announcementLinkLabel: string;
  supportEmail: string;
  seoDescription: string;
  eventLiveStreamEnabled: boolean;
  eventLiveStreamTitle: string;
  eventLiveStreamEmbedUrl: string;
};

export const FALLBACK_PUBLIC_SITE_SETTINGS: PublicSiteSettingsDTO = {
  headerDateLine: "28–29 January 2026",
  headerVenueLine: "Kempinski Gold Coast City · Accra",
  mobileNavMetaLine: "28–29 Jan · Accra",
  heroBarDateLine: "29th January 2026",
  heroBarVenueLine: "Kempinski Gold Coast City Hotel, Accra-Ghana",
  announcementEnabled: false,
  announcementText: "",
  announcementLinkUrl: "",
  announcementLinkLabel: "",
  supportEmail: "secretariat@africatradeawards.com",
  seoDescription: "",
  eventLiveStreamEnabled: false,
  eventLiveStreamTitle: "Live stream",
  eventLiveStreamEmbedUrl: "",
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

type PublicSiteRow = {
  headerDateLine: string;
  headerVenueLine: string;
  mobileNavMetaLine: string;
  heroBarDateLine: string;
  heroBarVenueLine: string;
  announcementEnabled: boolean;
  announcementText: string | null;
  announcementLinkUrl: string | null;
  announcementLinkLabel: string | null;
  supportEmail: string;
  seoDescription: string | null;
  eventLiveStreamEnabled: boolean;
  eventLiveStreamTitle: string | null;
  eventLiveStreamEmbedUrl: string | null;
};

function rowToDto(row: PublicSiteRow): PublicSiteSettingsDTO {
  return {
    headerDateLine: row.headerDateLine,
    headerVenueLine: row.headerVenueLine,
    mobileNavMetaLine: row.mobileNavMetaLine,
    heroBarDateLine: row.heroBarDateLine,
    heroBarVenueLine: row.heroBarVenueLine,
    announcementEnabled: row.announcementEnabled,
    announcementText: row.announcementText ?? "",
    announcementLinkUrl: row.announcementLinkUrl ?? "",
    announcementLinkLabel: row.announcementLinkLabel ?? "",
    supportEmail: row.supportEmail,
    seoDescription: row.seoDescription ?? "",
    eventLiveStreamEnabled: row.eventLiveStreamEnabled,
    eventLiveStreamTitle: row.eventLiveStreamTitle ?? FALLBACK_PUBLIC_SITE_SETTINGS.eventLiveStreamTitle,
    eventLiveStreamEmbedUrl: row.eventLiveStreamEmbedUrl ?? "",
  };
}

function dtoToWrite(dto: PublicSiteSettingsDTO) {
  return {
    headerDateLine: dto.headerDateLine.trim(),
    headerVenueLine: dto.headerVenueLine.trim(),
    mobileNavMetaLine: dto.mobileNavMetaLine.trim(),
    heroBarDateLine: dto.heroBarDateLine.trim(),
    heroBarVenueLine: dto.heroBarVenueLine.trim(),
    announcementEnabled: dto.announcementEnabled,
    announcementText: dto.announcementText.trim() || null,
    announcementLinkUrl: dto.announcementLinkUrl.trim() || null,
    announcementLinkLabel: dto.announcementLinkLabel.trim() || null,
    supportEmail: dto.supportEmail.trim() || FALLBACK_PUBLIC_SITE_SETTINGS.supportEmail,
    seoDescription: dto.seoDescription.trim() || null,
    eventLiveStreamEnabled: dto.eventLiveStreamEnabled,
    eventLiveStreamTitle: dto.eventLiveStreamTitle.trim() || null,
    eventLiveStreamEmbedUrl: dto.eventLiveStreamEmbedUrl.trim()
      ? normalizeLiveStreamEmbedUrl(dto.eventLiveStreamEmbedUrl)
      : null,
  };
}

async function loadPublicSiteSettings(): Promise<PublicSiteSettingsDTO> {
  try {
    const row = await prisma.publicSiteSettings.findUnique({
      where: { id: "default" },
    });
    if (!row) {
      return FALLBACK_PUBLIC_SITE_SETTINGS;
    }
    return rowToDto(row as PublicSiteRow);
  } catch (error) {
    if (shouldFallbackToDefaults(error)) {
      return FALLBACK_PUBLIC_SITE_SETTINGS;
    }
    throw error;
  }
}

/** Per-request dedupe when used from layout + generateMetadata in the same render. */
export const getPublicSiteSettings = cache(loadPublicSiteSettings);

const EMAIL_LIKE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Full replace from admin UI (validated). */
export async function savePublicSiteSettings(dto: PublicSiteSettingsDTO): Promise<PublicSiteSettingsDTO> {
  const merged: PublicSiteSettingsDTO = {
    headerDateLine: dto.headerDateLine.trim(),
    headerVenueLine: dto.headerVenueLine.trim(),
    mobileNavMetaLine: dto.mobileNavMetaLine.trim(),
    heroBarDateLine: dto.heroBarDateLine.trim(),
    heroBarVenueLine: dto.heroBarVenueLine.trim(),
    announcementEnabled: dto.announcementEnabled,
    announcementText: dto.announcementText.trim(),
    announcementLinkUrl: dto.announcementLinkUrl.trim(),
    announcementLinkLabel: dto.announcementLinkLabel.trim(),
    supportEmail: dto.supportEmail.trim() || FALLBACK_PUBLIC_SITE_SETTINGS.supportEmail,
    seoDescription: dto.seoDescription.trim(),
    eventLiveStreamEnabled: dto.eventLiveStreamEnabled,
    eventLiveStreamTitle: dto.eventLiveStreamTitle.trim(),
    eventLiveStreamEmbedUrl: dto.eventLiveStreamEmbedUrl.trim(),
  };

  if (
    !merged.headerDateLine ||
    !merged.headerVenueLine ||
    !merged.mobileNavMetaLine ||
    !merged.heroBarDateLine ||
    !merged.heroBarVenueLine
  ) {
    throw new Error("Date and venue lines cannot be empty.");
  }
  if (!EMAIL_LIKE.test(merged.supportEmail)) {
    throw new Error("Support email must be a valid address.");
  }
  if (merged.announcementLinkUrl && !/^https?:\/\//i.test(merged.announcementLinkUrl)) {
    throw new Error("Announcement link must start with http:// or https://.");
  }
  if (merged.eventLiveStreamTitle.length > 120) {
    throw new Error("Live stream title must be at most 120 characters.");
  }
  if (merged.eventLiveStreamEnabled && !merged.eventLiveStreamEmbedUrl) {
    throw new Error("When live stream is enabled, paste a YouTube or Facebook embed URL.");
  }

  const payload = dtoToWrite(merged);

  try {
    const saved = await prisma.publicSiteSettings.upsert({
      where: { id: "default" },
      create: { id: "default", ...payload },
      update: payload,
    });
    return rowToDto(saved as PublicSiteRow);
  } catch (error) {
    if (shouldFallbackToDefaults(error)) {
      throw new Error(
        "Site settings cannot be updated until database connection and migrations are available.",
      );
    }
    throw error;
  }
}
