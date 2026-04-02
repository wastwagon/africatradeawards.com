import { OnsiteIncidentStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireManager } from "@/lib/api-auth";
import { writeAuditLog } from "@/lib/audit-log";
import { safeSendOnsiteIncidentAlertEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";

export { dynamic } from "@/lib/force-dynamic-api";

const patchSchema = z.object({
  status: z.nativeEnum(OnsiteIncidentStatus),
  resolutionNote: z.string().max(500).optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: { eventId: string; incidentId: string } }
) {
  const auth = await requireManager();
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const body = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(body ?? {});
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const existing = await prisma.eventOnsiteIncident.findFirst({
    where: { id: params.incidentId, eventId: params.eventId },
    select: { id: true },
  });
  if (!existing) return NextResponse.json({ error: "Incident not found" }, { status: 404 });

  const toResolved = parsed.data.status === OnsiteIncidentStatus.RESOLVED;
  const updated = await prisma.eventOnsiteIncident.update({
    where: { id: params.incidentId },
    data: {
      status: parsed.data.status,
      resolvedAt: toResolved ? new Date() : null,
      resolvedById: toResolved ? auth.user.userId : null,
      resolutionNote: parsed.data.resolutionNote?.trim() || (toResolved ? "Resolved by operations" : null),
    },
  });

  await writeAuditLog({
    action: "onsite_incidents.update_status",
    userId: auth.user.userId,
    metadata: {
      eventId: params.eventId,
      incidentId: params.incidentId,
      status: updated.status,
      severity: updated.severity,
    },
  });

  if (updated.status === "RESOLVED") {
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
      detail: updated.resolutionNote,
    });
  }

  return NextResponse.json({ ok: true, incident: updated });
}
