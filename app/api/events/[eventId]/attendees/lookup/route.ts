import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { buildEventQrPayload, createEventQrToken, eventQrHint, eventQrSvgDataUrl, hashEventQrToken } from "@/lib/event-qr";
import { requireManager } from "@/lib/api-auth";

export { dynamic } from "@/lib/force-dynamic-api";

const bodySchema = z.object({
  attendeeEmail: z.string().email(),
  attendeeFullName: z.string().min(2).max(150),
});

export async function POST(
  request: Request,
  { params }: { params: { eventId: string } }
) {
  const auth = await requireManager();
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const body = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const registration = await prisma.eventRegistration.findFirst({
    where: {
      eventId: params.eventId,
      attendeeEmail: parsed.data.attendeeEmail.trim().toLowerCase(),
      attendeeFullName: parsed.data.attendeeFullName.trim(),
    },
    select: {
      id: true,
      attendeeFullName: true,
      attendeeEmail: true,
      checkedInAt: true,
    },
  });
  if (!registration) return NextResponse.json({ error: "Registration not found" }, { status: 404 });

  const qrToken = createEventQrToken();
  await prisma.eventRegistration.update({
    where: { id: registration.id },
    data: {
      qrTokenHash: hashEventQrToken(qrToken),
      qrTokenHint: eventQrHint(qrToken),
    },
  });

  const qrPayload = buildEventQrPayload(params.eventId, registration.id, qrToken);
  const qrDataUrl = await eventQrSvgDataUrl(qrPayload);
  return NextResponse.json({
    ok: true,
    attendee: {
      fullName: registration.attendeeFullName,
      email: registration.attendeeEmail,
      checkedInAt: registration.checkedInAt,
    },
    qrToken,
    qrPayload,
    qrDataUrl,
  });
}
