import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireManager } from "@/lib/api-auth";
import { buildEventQrScanValue, eventQrSvgDataUrl } from "@/lib/event-qr";

export { dynamic } from "@/lib/force-dynamic-api";

export async function POST(
  request: Request,
  { params }: { params: { eventId: string; registrationId: string } }
) {
  const auth = await requireManager();
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const body = await request.json().catch(() => null) as { qrToken?: string } | null;
  const qrToken = body?.qrToken?.trim();
  if (!qrToken) return NextResponse.json({ error: "qrToken is required" }, { status: 400 });

  const registration = await prisma.eventRegistration.findFirst({
    where: { id: params.registrationId, eventId: params.eventId },
    select: { id: true },
  });
  if (!registration) return NextResponse.json({ error: "Registration not found" }, { status: 404 });

  const qrPayload = buildEventQrScanValue(params.eventId, params.registrationId, qrToken);
  const qrDataUrl = await eventQrSvgDataUrl(qrPayload);
  return NextResponse.json({ ok: true, qrPayload, qrDataUrl });
}
