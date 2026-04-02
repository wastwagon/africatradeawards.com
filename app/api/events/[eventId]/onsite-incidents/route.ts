import { OnsiteIncidentSeverity } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireManager, requireManagerOrAuditor } from "@/lib/api-auth";
import { writeAuditLog } from "@/lib/audit-log";
import { computeIncidentSlaState } from "@/lib/incident-sla";
import { safeSendOnsiteIncidentAlertEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";

export { dynamic } from "@/lib/force-dynamic-api";

const createSchema = z.object({
  title: z.string().min(3).max(140),
  category: z.string().min(2).max(80),
  severity: z.nativeEnum(OnsiteIncidentSeverity).optional(),
  detail: z.string().max(1200).optional(),
  location: z.string().max(120).optional(),
  deviceLabel: z.string().max(120).optional(),
  occurredAt: z.string().datetime().optional(),
});

export async function GET(
  _request: Request,
  { params }: { params: { eventId: string } }
) {
  const auth = await requireManagerOrAuditor();
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const incidents = await prisma.eventOnsiteIncident.findMany({
    where: { eventId: params.eventId },
    include: {
      createdBy: { select: { fullName: true, email: true } },
      resolvedBy: { select: { fullName: true, email: true } },
    },
    orderBy: [{ createdAt: "desc" }],
    take: 120,
  });

  await writeAuditLog({
    action: "onsite_incidents.list",
    userId: auth.user.userId,
    metadata: {
      eventId: params.eventId,
      count: incidents.length,
    },
  });

  return NextResponse.json({
    ok: true,
    incidents: incidents.map((incident) => ({
      ...incident,
      slaState: computeIncidentSlaState({
        createdAt: incident.createdAt,
        status: incident.status,
        resolvedAt: incident.resolvedAt,
      }),
    })),
    userRole: auth.user.role,
  });
}

export async function POST(
  request: Request,
  { params }: { params: { eventId: string } }
) {
  const auth = await requireManager();
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const body = await request.json().catch(() => null);
  const parsed = createSchema.safeParse(body ?? {});
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const incident = await prisma.eventOnsiteIncident.create({
    data: {
      eventId: params.eventId,
      title: parsed.data.title.trim(),
      category: parsed.data.category.trim(),
      severity: parsed.data.severity ?? OnsiteIncidentSeverity.MEDIUM,
      detail: parsed.data.detail?.trim() || undefined,
      location: parsed.data.location?.trim() || undefined,
      deviceLabel: parsed.data.deviceLabel?.trim() || undefined,
      occurredAt: parsed.data.occurredAt ? new Date(parsed.data.occurredAt) : undefined,
      createdById: auth.user.userId,
    },
  });

  await writeAuditLog({
    action: "onsite_incidents.create",
    userId: auth.user.userId,
    metadata: {
      eventId: params.eventId,
      incidentId: incident.id,
      severity: incident.severity,
      status: incident.status,
      category: incident.category,
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

  return NextResponse.json({ ok: true, incident }, { status: 201 });
}
