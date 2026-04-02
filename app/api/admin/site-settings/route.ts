import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requireRole } from "@/lib/api-auth";
import { getPublicSiteSettings, upsertPublicSiteSettings } from "@/lib/public-site-settings";
import { UserRole } from "@prisma/client";

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

  const o = body as Record<string, unknown>;
  const pick = (k: string): string | undefined =>
    typeof o[k] === "string" ? String(o[k]).trim() || undefined : undefined;

  const patch = {
    headerDateLine: pick("headerDateLine"),
    headerVenueLine: pick("headerVenueLine"),
    mobileNavMetaLine: pick("mobileNavMetaLine"),
    heroBarDateLine: pick("heroBarDateLine"),
    heroBarVenueLine: pick("heroBarVenueLine"),
  };

  const hasAny = Object.values(patch).some((v) => v !== undefined);
  if (!hasAny) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  const settings = await upsertPublicSiteSettings(patch);
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, settings });
}
