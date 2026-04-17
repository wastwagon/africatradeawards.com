import { prisma } from "@/lib/prisma";
import { buildOnsiteReport } from "@/lib/event-onsite-report";
import { isSmtpConfigured } from "@/lib/email";

export type OpsReadinessItem = {
  id: string;
  level: "ok" | "warn" | "blocker";
  title: string;
  detail: string;
};

export type OpsReadinessResult = {
  eventId: string;
  score: number;
  status: "ready" | "needs_attention" | "blocked";
  checks: OpsReadinessItem[];
};

export async function buildEventOpsReadiness(eventId: string): Promise<OpsReadinessResult> {
  const checks: OpsReadinessItem[] = [];
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: { id: true, name: true },
  });
  if (!event) {
    return {
      eventId,
      score: 0,
      status: "blocked",
      checks: [
        {
          id: "event_exists",
          level: "blocker",
          title: "Event not found",
          detail: "The selected event record does not exist.",
        },
      ],
    };
  }

  const smtpConfigured = isSmtpConfigured();
  checks.push({
    id: "smtp_config",
    level: smtpConfigured ? "ok" : "warn",
    title: "SMTP configuration",
    detail: smtpConfigured
      ? "SMTP is configured for incident notifications."
      : "SMTP is not configured. Incident alert emails are currently disabled.",
  });

  const [report, queueCounts, auditCount24h] = await Promise.all([
    buildOnsiteReport(eventId),
    prisma.eventCheckInQueueItem.groupBy({
      by: ["state"],
      where: { eventId },
      _count: { _all: true },
    }),
    prisma.auditLog.count({
      where: {
        createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        action: {
          in: [
            "onsite_report.view",
            "onsite_report.csv_export",
            "onsite_report.shift_summary_export",
            "onsite_report.bundle_export",
            "onsite_incidents.create",
            "onsite_incidents.update_status",
            "onsite_incidents.auto_create",
            "onsite_incidents.auto_update",
            "checkin_queue.list",
            "checkin_queue.create",
            "checkin_queue.update",
            "checkin_queue.delete",
          ],
        },
      },
    }),
  ]);

  const pendingQueue = queueCounts.find((row) => row.state === "PENDING")?._count._all ?? 0;
  const conflictQueue = queueCounts.find((row) => row.state === "CONFLICT")?._count._all ?? 0;

  checks.push({
    id: "attendance_data",
    level: report.totals.registrations > 0 ? "ok" : "blocker",
    title: "Registrations loaded",
    detail:
      report.totals.registrations > 0
        ? `${report.totals.registrations} attendees in registration pipeline.`
        : "No registrations available; event operations cannot run.",
  });

  checks.push({
    id: "queue_backlog",
    level: conflictQueue > 0 ? "warn" : "ok",
    title: "Queue backlog state",
    detail: `Pending queue items: ${pendingQueue}. Conflict queue items: ${conflictQueue}.`,
  });

  checks.push({
    id: "incident_sla",
    level: report.totals.incidentsBreachedResolve > 0 ? "blocker" : report.totals.incidentsBreachedAck > 0 ? "warn" : "ok",
    title: "Incident SLA posture",
    detail: `Ack breaches: ${report.totals.incidentsBreachedAck}. Resolve breaches: ${report.totals.incidentsBreachedResolve}.`,
  });

  checks.push({
    id: "audit_coverage",
    level: auditCount24h > 0 ? "ok" : "warn",
    title: "Audit trail activity",
    detail:
      auditCount24h > 0
        ? `${auditCount24h} operational audit entries in last 24h.`
        : "No recent operational audit entries detected in last 24h.",
  });

  const blockerCount = checks.filter((c) => c.level === "blocker").length;
  const warnCount = checks.filter((c) => c.level === "warn").length;
  const okCount = checks.filter((c) => c.level === "ok").length;
  const score = Math.max(0, Math.min(100, Math.round((okCount / checks.length) * 100 - blockerCount * 20 - warnCount * 8)));

  return {
    eventId,
    score,
    status: blockerCount > 0 ? "blocked" : warnCount > 0 ? "needs_attention" : "ready",
    checks,
  };
}
