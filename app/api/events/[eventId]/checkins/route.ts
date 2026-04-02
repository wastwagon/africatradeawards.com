import { CheckInAttemptOutcome, CheckInAttemptSource, CheckInMethod } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireManager } from "@/lib/api-auth";
import { hashEventQrToken, verifyEventQrSignature } from "@/lib/event-qr";

export { dynamic } from "@/lib/force-dynamic-api";

const postSchema = z.object({
  registrationId: z.string().min(8).optional(),
  qrPayload: z.string().optional(),
  qrToken: z.string().optional(),
  source: z.nativeEnum(CheckInAttemptSource).optional(),
  location: z.string().max(120).optional(),
  deviceLabel: z.string().max(120).optional(),
  note: z.string().max(500).optional(),
});

type ParsedQrPayload = {
  type?: string;
  eventId?: string;
  registrationId?: string;
  token?: string;
  iat?: number;
  sig?: string;
};

function parseQrPayload(raw: string | undefined): ParsedQrPayload | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ParsedQrPayload;
  } catch {
    return null;
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { eventId: string } }
) {
  const auth = await requireManager();
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const checkIns = await prisma.eventCheckIn.findMany({
    where: { eventId: params.eventId },
    include: {
      registration: { select: { attendeeFullName: true, attendeeEmail: true, qrTokenHint: true } },
      checkedInBy: { select: { id: true, fullName: true, email: true } },
    },
    orderBy: [{ createdAt: "desc" }],
  });
  return NextResponse.json({ ok: true, checkIns });
}

export async function POST(
  request: NextRequest,
  { params }: { params: { eventId: string } }
) {
  const auth = await requireManager();
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });
  const actorId = auth.user.userId;

  const body = await request.json().catch(() => null);
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const source = parsed.data.source ?? CheckInAttemptSource.MANUAL;
  const location = parsed.data.location?.trim() || undefined;
  const deviceLabel = parsed.data.deviceLabel?.trim() || undefined;
  const note = parsed.data.note?.trim() || undefined;

  async function logAttempt(input: {
    outcome: CheckInAttemptOutcome;
    reasonCode?: string;
    registrationId?: string;
    note?: string;
  }) {
    await prisma.eventCheckInAttempt.create({
      data: {
        eventId: params.eventId,
        registrationId: input.registrationId,
        actorId,
        source,
        outcome: input.outcome,
        reasonCode: input.reasonCode,
        note: input.note,
        location,
        deviceLabel,
      },
    });
  }

  const parsedQr = parseQrPayload(parsed.data.qrPayload);
  const registrationId = parsed.data.registrationId ?? parsedQr?.registrationId;
  const qrToken = parsed.data.qrToken ?? parsedQr?.token;

  if (!registrationId || !qrToken) {
    await logAttempt({
      outcome: CheckInAttemptOutcome.FAILED,
      reasonCode: "MISSING_TOKEN_OR_REGISTRATION",
      registrationId,
    });
    return NextResponse.json({ error: "registrationId and qrToken are required" }, { status: 400 });
  }

  if (parsedQr?.eventId && parsedQr.eventId !== params.eventId) {
    await logAttempt({
      outcome: CheckInAttemptOutcome.FAILED,
      reasonCode: "EVENT_MISMATCH",
      registrationId,
    });
    return NextResponse.json({ error: "QR does not belong to this event" }, { status: 400 });
  }

  if (parsedQr?.sig) {
    const validSignature = verifyEventQrSignature({
      eventId: parsedQr.eventId ?? params.eventId,
      registrationId: parsedQr.registrationId ?? registrationId,
      token: parsedQr.token ?? qrToken,
      iat: parsedQr.iat,
      sig: parsedQr.sig,
    });
    if (!validSignature) {
      await logAttempt({
        outcome: CheckInAttemptOutcome.FAILED,
        reasonCode: "INVALID_SIGNATURE",
        registrationId,
      });
      return NextResponse.json({ error: "Invalid QR signature" }, { status: 401 });
    }
  }

  const registration = await prisma.eventRegistration.findFirst({
    where: { id: registrationId, eventId: params.eventId },
    select: {
      id: true,
      checkedInAt: true,
      qrTokenHash: true,
      attendeeFullName: true,
      attendeeEmail: true,
    },
  });
  if (!registration) {
    await logAttempt({
      outcome: CheckInAttemptOutcome.FAILED,
      reasonCode: "REGISTRATION_NOT_FOUND",
      registrationId,
    });
    return NextResponse.json({ error: "Registration not found" }, { status: 404 });
  }

  const isValidToken = hashEventQrToken(qrToken) === registration.qrTokenHash;
  if (!isValidToken) {
    await logAttempt({
      outcome: CheckInAttemptOutcome.FAILED,
      reasonCode: "INVALID_TOKEN",
      registrationId: registration.id,
    });
    return NextResponse.json({ error: "Invalid QR token" }, { status: 401 });
  }

  if (registration.checkedInAt) {
    await logAttempt({
      outcome: CheckInAttemptOutcome.FAILED,
      reasonCode: "ALREADY_CHECKED_IN",
      registrationId: registration.id,
    });
    return NextResponse.json({
      ok: false,
      error: "Attendee already checked in",
      alreadyCheckedInAt: registration.checkedInAt,
      attendee: {
        fullName: registration.attendeeFullName,
        email: registration.attendeeEmail,
      },
    }, { status: 409 });
  }

  const now = new Date();
  const checkIn = await prisma.$transaction(async (tx) => {
    await tx.eventRegistration.update({
      where: { id: registration.id },
      data: { checkedInAt: now },
    });
    return tx.eventCheckIn.create({
      data: {
        eventId: params.eventId,
        registrationId: registration.id,
        checkedInById: actorId,
        method: CheckInMethod.QR_SCAN,
        location,
        deviceLabel,
        note,
      },
    });
  });

  await logAttempt({
    outcome: CheckInAttemptOutcome.SUCCESS,
    reasonCode: "CHECKED_IN",
    registrationId: registration.id,
    note,
  });

  return NextResponse.json({
    ok: true,
    checkIn,
    attendee: {
      fullName: registration.attendeeFullName,
      email: registration.attendeeEmail,
    },
  });
}
