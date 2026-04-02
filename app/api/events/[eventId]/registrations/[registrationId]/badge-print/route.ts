import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireManager } from "@/lib/api-auth";
import {
  canBypassReprintPolicy,
  canOverrideReprintPolicy,
  MAX_REPRINTS_PER_DAY,
  MIN_OVERRIDE_REASON_LENGTH,
  normalizeOverrideReason,
  requiresPolicyOverride,
} from "@/lib/event-print-policy";

export { dynamic } from "@/lib/force-dynamic-api";

const bodySchema = z.object({
  printerLabel: z.string().max(120).optional(),
  note: z.string().max(300).optional(),
  overridePolicy: z.boolean().optional(),
  overrideReason: z.string().max(300).optional(),
});

export async function POST(
  request: Request,
  { params }: { params: { eventId: string; registrationId: string } }
) {
  const auth = await requireManager();
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const body = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(body ?? {});
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const registration = await prisma.eventRegistration.findFirst({
    where: { id: params.registrationId, eventId: params.eventId },
    select: { id: true, attendeeFullName: true },
  });
  if (!registration) return NextResponse.json({ error: "Registration not found" }, { status: 404 });

  const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const [recentCount, latest] = await Promise.all([
    prisma.eventBadgePrintLog.count({
      where: {
        eventId: params.eventId,
        registrationId: params.registrationId,
        createdAt: { gte: dayAgo },
      },
    }),
    prisma.eventBadgePrintLog.findFirst({
      where: { eventId: params.eventId, registrationId: params.registrationId },
      orderBy: { createdAt: "desc" },
      select: { createdAt: true },
    }),
  ]);
  const needsOverride = requiresPolicyOverride(recentCount, latest?.createdAt ?? null);
  const overrideReason = normalizeOverrideReason(parsed.data.overrideReason);
  const wantsOverride = parsed.data.overridePolicy === true;
  const overrideAllowed = canOverrideReprintPolicy(auth.user.role);
  const bypassAllowed = canBypassReprintPolicy(auth.user.role);

  if (!bypassAllowed && needsOverride) {
    if (!wantsOverride || !overrideAllowed) {
      return NextResponse.json(
        {
          error: `Reprint policy triggered (${MAX_REPRINTS_PER_DAY}/24h or rapid reprint). Override required.`,
          code: "REPRINT_OVERRIDE_REQUIRED",
        },
        { status: 429 }
      );
    }
    if (!overrideReason || overrideReason.length < MIN_OVERRIDE_REASON_LENGTH) {
      return NextResponse.json(
        {
          error: `Override reason must be at least ${MIN_OVERRIDE_REASON_LENGTH} characters.`,
          code: "REPRINT_OVERRIDE_REASON_REQUIRED",
        },
        { status: 400 }
      );
    }
  }

  const log = await prisma.eventBadgePrintLog.create({
    data: {
      eventId: params.eventId,
      registrationId: params.registrationId,
      printedById: auth.user.userId,
      printerLabel: parsed.data.printerLabel?.trim() || undefined,
      note:
        [
          parsed.data.note?.trim() || "",
          needsOverride && overrideReason ? `[Override reason] ${overrideReason}` : "",
        ]
          .filter(Boolean)
          .join(" | ") || undefined,
    },
  });

  return NextResponse.json({
    ok: true,
    log,
    attendee: registration.attendeeFullName,
  });
}
