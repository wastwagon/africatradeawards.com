import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireManager } from "@/lib/api-auth";
import { createBadgeSignature } from "@/lib/event-badge";
import { requiresPolicyOverride } from "@/lib/event-print-policy";

export { dynamic } from "@/lib/force-dynamic-api";

export async function GET(
  _request: Request,
  { params }: { params: { eventId: string; registrationId: string } }
) {
  const auth = await requireManager();
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const registration = await prisma.eventRegistration.findFirst({
    where: { id: params.registrationId, eventId: params.eventId },
    include: {
      event: true,
      _count: { select: { checkIns: true, badgePrintLogs: true } },
    },
  });
  if (!registration) return NextResponse.json({ error: "Registration not found" }, { status: 404 });

  const badgeSignature = createBadgeSignature({
    eventId: params.eventId,
    registrationId: registration.id,
    attendeeEmail: registration.attendeeEmail,
  });

  const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const recentPrints = await prisma.eventBadgePrintLog.count({
    where: {
      eventId: params.eventId,
      registrationId: registration.id,
      createdAt: { gte: dayAgo },
    },
  });
  const latestPrint = await prisma.eventBadgePrintLog.findFirst({
    where: { eventId: params.eventId, registrationId: registration.id },
    orderBy: { createdAt: "desc" },
    select: { createdAt: true },
  });

  return NextResponse.json({
    ok: true,
    registration,
    badgeSignature,
    userRole: auth.user.role,
    reprintPolicy: {
      printsLast24h: recentPrints,
      lastPrintedAt: latestPrint?.createdAt ?? null,
      needsOverride: requiresPolicyOverride(recentPrints, latestPrint?.createdAt ?? null),
    },
  });
}
