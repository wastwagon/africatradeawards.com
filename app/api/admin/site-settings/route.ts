import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requireRole } from "@/lib/api-auth";
import {
  getPublicSiteSettings,
  savePublicSiteSettings,
  type PublicSiteSettingsDTO,
} from "@/lib/public-site-settings";
import { UserRole } from "@prisma/client";

function readString(v: unknown): string {
  return typeof v === "string" ? v : "";
}

function readBool(v: unknown, fallback: boolean): boolean {
  if (typeof v === "boolean") return v;
  if (v === "true") return true;
  if (v === "false") return false;
  return fallback;
}

function bodyToDto(o: Record<string, unknown>, fallback: PublicSiteSettingsDTO): PublicSiteSettingsDTO {
  return {
    headerDateLine: readString(o.headerDateLine),
    headerVenueLine: readString(o.headerVenueLine),
    mobileNavMetaLine: readString(o.mobileNavMetaLine),
    heroBarDateLine: readString(o.heroBarDateLine),
    heroBarVenueLine: readString(o.heroBarVenueLine),
    announcementEnabled: readBool(o.announcementEnabled, fallback.announcementEnabled),
    announcementText: readString(o.announcementText),
    announcementLinkUrl: readString(o.announcementLinkUrl),
    announcementLinkLabel: readString(o.announcementLinkLabel),
    supportEmail: readString(o.supportEmail) || fallback.supportEmail,
    seoDescription: readString(o.seoDescription),
    eventLiveStreamEnabled: readBool(o.eventLiveStreamEnabled, fallback.eventLiveStreamEnabled),
    eventLiveStreamTitle: readString(o.eventLiveStreamTitle) || fallback.eventLiveStreamTitle,
    eventLiveStreamEmbedUrl: readString(o.eventLiveStreamEmbedUrl),
  };
}

export async function GET() {
  const auth = await requireRole(UserRole.PROGRAM_MANAGER);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }
  const settings = await getPublicSiteSettings();
  return NextResponse.json({ ok: true, settings });
}

export async function PATCH(request: Request) {
  const auth = await requireRole(UserRole.PROGRAM_MANAGER);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Expected object body" }, { status: 400 });
  }

  const fallback = await getPublicSiteSettings();
  const dto = bodyToDto(body as Record<string, unknown>, fallback);

  try {
    const settings = await savePublicSiteSettings(dto);
    revalidatePath("/", "layout");
    for (const path of [
      "/",
      "/contact",
      "/faq",
      "/vote",
      "/login",
      "/nominate",
      "/about",
      "/awards-structure",
      "/live",
    ]) {
      revalidatePath(path);
    }
    return NextResponse.json({ ok: true, settings });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Save failed";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
