import { OnsiteIncidentSeverity, OnsiteIncidentStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireManager } from "@/lib/api-auth";
import { writeAuditLog } from "@/lib/audit-log";
import { safeSendOnsiteIncidentAlertEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";

export { dynamic } from "@/lib/force-dynamic-api";

const autoSchema = z.object({
  title: z.string().min(3).max(140).default("Scanner queue risk"),
  location: z.string().max(120).optional(),
  deviceLabel: z.string().max(120).optional(),
  queueSize: z.number().int().min(0),
  conflictCount: z.number().int().min(0),
  warningAgeCount: z.number().int().min(0),
  criticalAgeCount: z.number().int().min(0),
  oldestPendingAgeMinutes: z.number().int().min(0),
});

function deriveSeverity(input: z.infer<typeof autoSchema>): OnsiteIncidentSeverity {
  if (input.criticalAgeCount > 0 || input.conflictCount >= 5) return OnsiteIncidentSeverity.CRITICAL;
  if (input.conflictCount >= 2 || input.queueSize >= 50 || input.oldestPendingAgeMinutes >= 20) return OnsiteIncidentSeverity.HIGH;
  if (input.warningAgeCount > 0 || input.queueSize >= 20) return OnsiteIncidentSeverity.MEDIUM;
  return OnsiteIncidentSeverity.LOW;
}

export async function POST(
  request: Request,
  { params }: { params: { eventId: string } }
) {
  const auth = await requireManager();
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const body = await request.json().catch(() => null);
  const parsed = autoSchema.safeParse(body ?? {});
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const payload = parsed.data;
  const severity = deriveSeverity(payload);
  const detail = `Queue ${payload.queueSize}, conflicts ${payload.conflictCount}, aged ${payload.warningAgeCount}, critical-aged ${payload.criticalAgeCount}, oldest ${payload.oldestPendingAgeMinutes}m.`;
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

  const existing = await prisma.eventOnsiteIncident.findFirst({
    where: {
      eventId: params.eventId,
      title: payload.title,
      status: { not: OnsiteIncidentStatus.RESOLVED },
      location: payload.location?.trim() || null,
      deviceLabel: payload.deviceLabel?.trim() || null,
      createdAt: { gte: tenMinutesAgo },
    },
    orderBy: [{ createdAt: "desc" }],
  });

  if (existing) {
    const updated = await prisma.eventOnsiteIncident.update({
      where: { id: existing.id },
      data: {
        status: OnsiteIncidentStatus.IN_REVIEW,
        severity,
        detail,
        occurredAt: new Date(),
      },
    });
    await writeAuditLog({
      action: "onsite_incidents.auto_update",
      userId: auth.user.userId,
      metadata: {
        eventId: params.eventId,
        incidentId: updated.id,
        severity: updated.severity,
        status: updated.status,
      },
    });
    if (updated.severity === "HIGH" || updated.severity === "CRITICAL") {
      const event = await prisma.event.findUnique({
        where: { id: params.eventId },
        select: { name: true },
      });
      await safeSendOnsiteIncidentAlertEmail({
        eventName: event?.name ?? params.eventId,
        incidentTitle: updated.title,
        severity: updated.severity,
        status: updated.status,
        location: updated.location,
        detail: updated.detail,
      });
    }
    return NextResponse.json({ ok: true, incident: updated, deduped: true });
  }

  const incident = await prisma.eventOnsiteIncident.create({
    data: {
      eventId: params.eventId,
      createdById: auth.user.userId,
      title: payload.title,
      category: "Scanner queue risk",
      severity,
      status: OnsiteIncidentStatus.OPEN,
      detail,
      location: payload.location?.trim() || undefined,
      deviceLabel: payload.deviceLabel?.trim() || undefined,
      occurredAt: new Date(),
    },
  });

  await writeAuditLog({
    action: "onsite_incidents.auto_create",
    userId: auth.user.userId,
    metadata: {
      eventId: params.eventId,
      incidentId: incident.id,
      severity: incident.severity,
      status: incident.status,
      queueSize: payload.queueSize,
      conflictCount: payload.conflictCount,
    },
  });
  if (incident.severity === "HIGH" || incident.severity === "CRITICAL") {
    const event = await prisma.event.findUnique({
      where: { id: params.eventId },
      select: { name: true },
    });
    await safeSendOnsiteIncidentAlertEmail({
      eventName: event?.name ?? params.eventId,
      incidentTitle: incident.title,
      severity: incident.severity,
      status: incident.status,
      location: incident.location,
      detail: incident.detail,
    });
  }

  return NextResponse.json({ ok: true, incident, deduped: false }, { status: 201 });
}
