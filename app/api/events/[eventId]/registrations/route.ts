import { NextRequest, NextResponse } from "next/server";
import { RegistrationStatus } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireManager } from "@/lib/api-auth";
import { buildEventQrPayload, createEventQrToken, eventQrHint, eventQrSvgDataUrl, hashEventQrToken } from "@/lib/event-qr";

export { dynamic } from "@/lib/force-dynamic-api";

const createRegistrationSchema = z.object({
  attendeeFullName: z.string().min(2).max(150),
  attendeeEmail: z.string().email().max(150),
  attendeePhone: z.string().max(50).optional(),
  organization: z.string().max(150).optional(),
  roleTitle: z.string().max(150).optional(),
  notes: z.string().max(2000).optional(),
});

export async function GET(
  _request: NextRequest,
  { params }: { params: { eventId: string } }
) {
  const auth = await requireManager();
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const registrations = await prisma.eventRegistration.findMany({
    where: { eventId: params.eventId },
    orderBy: [{ createdAt: "desc" }],
    include: { _count: { select: { checkIns: true } } },
  });
  return NextResponse.json({ ok: true, registrations });
}

export async function POST(
  request: NextRequest,
  { params }: { params: { eventId: string } }
) {
  const event = await prisma.event.findUnique({ where: { id: params.eventId } });
  if (!event || !event.isPublished) return NextResponse.json({ error: "Event not found" }, { status: 404 });

  const body = await request.json().catch(() => null);
  const parsed = createRegistrationSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const email = parsed.data.attendeeEmail.trim().toLowerCase();
  const existing = await prisma.eventRegistration.findFirst({
    where: { eventId: params.eventId, attendeeEmail: email, status: { not: RegistrationStatus.CANCELLED } },
  });
  if (existing) {
    return NextResponse.json({ error: "Registration already exists for this attendee email" }, { status: 409 });
  }
  if (event.capacity && event.capacity > 0) {
    const confirmedCount = await prisma.eventRegistration.count({
      where: { eventId: params.eventId, status: { not: RegistrationStatus.CANCELLED } },
    });
    if (confirmedCount >= event.capacity) {
      return NextResponse.json({ error: "Event is fully booked" }, { status: 409 });
    }
  }

  const token = createEventQrToken();
  const tokenHash = hashEventQrToken(token);
  const registration = await prisma.eventRegistration.create({
    data: {
      eventId: params.eventId,
      status: RegistrationStatus.CONFIRMED,
      attendeeFullName: parsed.data.attendeeFullName.trim(),
      attendeeEmail: email,
      attendeePhone: parsed.data.attendeePhone?.trim() || undefined,
      organization: parsed.data.organization?.trim() || undefined,
      roleTitle: parsed.data.roleTitle?.trim() || undefined,
      notes: parsed.data.notes?.trim() || undefined,
      qrTokenHash: tokenHash,
      qrTokenHint: eventQrHint(token),
    },
  });

  const qrPayload = buildEventQrPayload(params.eventId, registration.id, token);
  const qrDataUrl = await eventQrSvgDataUrl(qrPayload);
  return NextResponse.json({
    ok: true,
    registration,
    qrToken: token,
    qrPayload,
    qrDataUrl,
  }, { status: 201 });
}
