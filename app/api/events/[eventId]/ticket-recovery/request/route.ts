import { RegistrationStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sendEventTicketRecoveryEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";
import { generateEventRecoveryCode, hashEventRecoveryCode } from "@/lib/event-recovery";
import { getClientIp, hashIp } from "@/lib/vote-security";

export { dynamic } from "@/lib/force-dynamic-api";

const schema = z.object({
  attendeeEmail: z.string().email(),
  attendeeFullName: z.string().min(2).max(150),
});

export async function POST(
  request: NextRequest,
  { params }: { params: { eventId: string } }
) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const email = parsed.data.attendeeEmail.trim().toLowerCase();
  const fullName = parsed.data.attendeeFullName.trim();
  const ipHash = hashIp(getClientIp(request.headers));

  const ipLimit = await checkRateLimit(`evt:recover:request:ip:${ipHash}`, 12, 3600);
  if (!ipLimit.allowed) return NextResponse.json({ error: "Too many requests from this IP" }, { status: 429 });
  const emailLimit = await checkRateLimit(`evt:recover:request:email:${email}`, 8, 3600);
  if (!emailLimit.allowed) return NextResponse.json({ error: "Too many requests for this email" }, { status: 429 });

  const registration = await prisma.eventRegistration.findFirst({
    where: {
      eventId: params.eventId,
      attendeeEmail: email,
      attendeeFullName: fullName,
      status: { not: RegistrationStatus.CANCELLED },
    },
    include: { event: { select: { name: true } } },
  });

  // Avoid exposing whether an attendee exists; return generic success.
  if (!registration) {
    return NextResponse.json({ ok: true, message: "If details match, a code has been sent." });
  }

  const code = generateEventRecoveryCode();
  const codeHash = hashEventRecoveryCode(code);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  const ticketRecovery = await prisma.eventTicketRecoveryCode.create({
    data: {
      eventId: params.eventId,
      registrationId: registration.id,
      attendeeEmail: email,
      codeHash,
      ipHash,
      expiresAt,
    },
    select: { id: true, expiresAt: true },
  });

  let devCode: string | undefined;
  try {
    await sendEventTicketRecoveryEmail({
      to: email,
      code,
      eventName: registration.event.name,
    });
  } catch (err) {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Could not send recovery code" }, { status: 503 });
    }
    devCode = code;
    console.warn("Ticket recovery email send failed, returning devCode", err);
  }

  return NextResponse.json({
    ok: true,
    verificationId: ticketRecovery.id,
    expiresAt: ticketRecovery.expiresAt,
    message: "If details match, a code has been sent.",
    ...(devCode ? { devCode } : {}),
  });
}
