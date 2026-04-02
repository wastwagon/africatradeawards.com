import PDFDocument from "pdfkit";
import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireManager } from "@/lib/api-auth";
import { createBadgeSignature } from "@/lib/event-badge";
import {
  canBypassReprintPolicy,
  canOverrideReprintPolicy,
  MAX_REPRINTS_PER_DAY,
  MIN_OVERRIDE_REASON_LENGTH,
  normalizeOverrideReason,
  requiresPolicyOverride,
} from "@/lib/event-print-policy";

export { dynamic } from "@/lib/force-dynamic-api";

export async function GET(
  request: Request,
  { params }: { params: { eventId: string; registrationId: string } }
) {
  const auth = await requireManager();
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const registration = await prisma.eventRegistration.findFirst({
    where: { id: params.registrationId, eventId: params.eventId },
    include: { event: true },
  });
  if (!registration) return NextResponse.json({ error: "Registration not found" }, { status: 404 });

  const url = new URL(request.url);
  const wantsOverride = url.searchParams.get("overridePolicy") === "1";
  const overrideReason = normalizeOverrideReason(url.searchParams.get("overrideReason") ?? undefined);

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
  const role = auth.user.role as UserRole;
  if (!canBypassReprintPolicy(role) && needsOverride) {
    if (!wantsOverride || !canOverrideReprintPolicy(role)) {
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

  const badgeSignature = createBadgeSignature({
    eventId: params.eventId,
    registrationId: registration.id,
    attendeeEmail: registration.attendeeEmail,
  });

  await prisma.eventBadgePrintLog.create({
    data: {
      eventId: params.eventId,
      registrationId: registration.id,
      printedById: auth.user.userId,
      printerLabel: "PDF export",
      note: needsOverride && overrideReason ? `Generated signed badge PDF | [Override reason] ${overrideReason}` : "Generated signed badge PDF",
    },
  });

  const doc = new PDFDocument({ size: "A6", margin: 24 });
  const chunks: Buffer[] = [];
  doc.on("data", (chunk: Buffer) => chunks.push(chunk));

  doc.fontSize(10).fillColor("#666").text(registration.event.name.toUpperCase(), { align: "left" });
  doc.moveDown(0.6);
  doc.fontSize(22).fillColor("#111").text(registration.attendeeFullName, { align: "left" });
  doc.moveDown(0.3);
  doc.fontSize(12).fillColor("#333").text(registration.roleTitle || "Attendee");
  doc.fontSize(11).fillColor("#555").text(registration.organization || "");
  doc.moveDown(0.5);
  doc.fontSize(10).fillColor("#333").text(registration.attendeeEmail);
  doc.text(registration.event.venueName);
  doc.text(new Date(registration.event.startsAt).toLocaleString());
  doc.moveDown(0.7);
  doc.fontSize(9).fillColor("#111").text(`Pass ref: ${registration.qrTokenHint}`);
  doc.text(`Badge sig: ${badgeSignature}`);
  doc.text(`Generated: ${new Date().toISOString()}`);
  doc.end();

  await new Promise<void>((resolve) => {
    doc.on("end", () => resolve());
  });

  const pdf = Buffer.concat(chunks);
  return new NextResponse(pdf, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="badge-${registration.id}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
