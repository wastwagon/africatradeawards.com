import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashEventRecoveryCode } from "@/lib/event-recovery";
import { buildEventQrScanValue, createEventQrToken, eventQrHint, eventQrSvgDataUrl, hashEventQrToken } from "@/lib/event-qr";
import { checkRateLimit } from "@/lib/rate-limit";
import { getClientIp, hashIp } from "@/lib/vote-security";

export { dynamic } from "@/lib/force-dynamic-api";

const schema = z.object({
  verificationId: z.string().min(8),
  code: z.string().regex(/^\d{6}$/),
});

export async function POST(
  request: NextRequest,
  { params }: { params: { eventId: string } }
) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const ipHash = hashIp(getClientIp(request.headers));
  const limit = await checkRateLimit(`evt:recover:verify:ip:${ipHash}`, 20, 3600);
  if (!limit.allowed) return NextResponse.json({ error: "Too many verification attempts" }, { status: 429 });

  const verification = await prisma.eventTicketRecoveryCode.findUnique({
    where: { id: parsed.data.verificationId },
    include: { registration: true },
  });
  if (!verification || verification.eventId !== params.eventId) {
    return NextResponse.json({ error: "Verification not found" }, { status: 404 });
  }
  if (verification.usedAt) return NextResponse.json({ error: "Code already used" }, { status: 400 });
  if (verification.expiresAt < new Date()) return NextResponse.json({ error: "Code expired" }, { status: 400 });
  if (verification.ipHash !== ipHash) return NextResponse.json({ error: "Verification/IP mismatch" }, { status: 403 });
  if (verification.codeHash !== hashEventRecoveryCode(parsed.data.code)) {
    return NextResponse.json({ error: "Invalid code" }, { status: 400 });
  }

  const token = createEventQrToken();
  const tokenHash = hashEventQrToken(token);
  await prisma.$transaction([
    prisma.eventRegistration.update({
      where: { id: verification.registrationId },
      data: {
        qrTokenHash: tokenHash,
        qrTokenHint: eventQrHint(token),
      },
    }),
    prisma.eventTicketRecoveryCode.update({
      where: { id: verification.id },
      data: { usedAt: new Date() },
    }),
    prisma.eventTicketRecoveryCode.updateMany({
      where: {
        registrationId: verification.registrationId,
        usedAt: null,
        NOT: { id: verification.id },
      },
      data: { usedAt: new Date() },
    }),
  ]);

  const qrPayload = buildEventQrScanValue(params.eventId, verification.registrationId, token);
  const qrDataUrl = await eventQrSvgDataUrl(qrPayload);
  return NextResponse.json({
    ok: true,
    attendee: {
      fullName: verification.registration.attendeeFullName,
      email: verification.registration.attendeeEmail,
      checkedInAt: verification.registration.checkedInAt,
    },
    qrPayload,
    qrDataUrl,
  });
}
