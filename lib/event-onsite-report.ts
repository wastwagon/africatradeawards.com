import { CheckInAttemptOutcome } from "@prisma/client";
import {
  computeIncidentSlaState,
} from "@/lib/incident-sla";
import { prisma } from "@/lib/prisma";

export type OnsiteReportPayload = {
  ok: true;
  totals: {
    registrations: number;
    checkedIn: number;
    pending: number;
    attendanceRate: number;
    badgePrints: number;
    attempts24h: number;
    failedAttempts24h: number;
    successfulAttempts24h: number;
    incidentsOpen: number;
    incidentsResolved24h: number;
    incidentsBreachedAck: number;
    incidentsBreachedResolve: number;
    avgResolveMinutes: number;
  };
  byLocation: Array<{ name: string; count: number }>;
  byDevice: Array<{ name: string; count: number }>;
  hourlyThroughput: Array<{ hourIso: string; count: number }>;
  topFailureReasons: Array<{ reason: string; count: number }>;
  bySource: Array<{ source: string; count: number }>;
  heavyReprints: Array<{ registrationId: string; count: number }>;
  incidents: Array<{
    id: string;
    title: string;
    category: string;
    severity: string;
    status: string;
    location: string | null;
    createdAt: string;
    resolvedAt: string | null;
    slaState: "ON_TRACK" | "ACK_BREACHED" | "RESOLVE_BREACHED" | "RESOLVED_LATE";
  }>;
};

export async function buildOnsiteReport(eventId: string): Promise<OnsiteReportPayload> {
  const now = Date.now();
  const from24h = new Date(now - 24 * 60 * 60 * 1000);

  const [totals, checkIns, badgePrints, attempts24h, incidents, incidentsForSla, checkedIn] = await Promise.all([
    prisma.eventRegistration.count({ where: { eventId } }),
    prisma.eventCheckIn.findMany({
      where: { eventId },
      select: { createdAt: true, location: true, deviceLabel: true },
      orderBy: [{ createdAt: "asc" }],
    }),
    prisma.eventBadgePrintLog.findMany({
      where: { eventId },
      select: { registrationId: true, createdAt: true },
      orderBy: [{ createdAt: "asc" }],
    }),
    prisma.eventCheckInAttempt.findMany({
      where: { eventId, createdAt: { gte: from24h } },
      select: { outcome: true, reasonCode: true, source: true, createdAt: true },
    }),
    prisma.eventOnsiteIncident.findMany({
      where: { eventId },
      select: {
        id: true,
        title: true,
        category: true,
        severity: true,
        status: true,
        location: true,
        createdAt: true,
        resolvedAt: true,
      },
      orderBy: [{ createdAt: "desc" }],
      take: 50,
    }),
    prisma.eventOnsiteIncident.findMany({
      where: { eventId },
      select: { createdAt: true, resolvedAt: true, status: true },
      orderBy: [{ createdAt: "desc" }],
      take: 1000,
    }),
    prisma.eventRegistration.count({
      where: { eventId, NOT: { checkedInAt: null } },
    }),
  ]);

  const byLocationMap = new Map<string, number>();
  const byDeviceMap = new Map<string, number>();
  const hourlyMap = new Map<string, number>();
  for (const item of checkIns) {
    const location = item.location || "Unspecified";
    const device = item.deviceLabel || "Unspecified";
    byLocationMap.set(location, (byLocationMap.get(location) ?? 0) + 1);
    byDeviceMap.set(device, (byDeviceMap.get(device) ?? 0) + 1);
    const hour = new Date(item.createdAt);
    hour.setMinutes(0, 0, 0);
    const hourKey = hour.toISOString();
    hourlyMap.set(hourKey, (hourlyMap.get(hourKey) ?? 0) + 1);
  }

  const reprintsByRegistration = new Map<string, number>();
  for (const item of badgePrints) {
    reprintsByRegistration.set(item.registrationId, (reprintsByRegistration.get(item.registrationId) ?? 0) + 1);
  }
  const heavyReprints = [...reprintsByRegistration.entries()]
    .filter(([, count]) => count >= 3)
    .map(([registrationId, count]) => ({ registrationId, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);

  const failedAttempts = attempts24h.filter((item) => item.outcome === CheckInAttemptOutcome.FAILED);
  const successfulAttempts = attempts24h.filter((item) => item.outcome === CheckInAttemptOutcome.SUCCESS);
  const reasonMap = new Map<string, number>();
  const sourceMap = new Map<string, number>();
  for (const item of attempts24h) {
    sourceMap.set(item.source, (sourceMap.get(item.source) ?? 0) + 1);
    if (item.reasonCode) {
      reasonMap.set(item.reasonCode, (reasonMap.get(item.reasonCode) ?? 0) + 1);
    }
  }

  const incidentsOpen = incidents.filter((item) => item.status !== "RESOLVED").length;
  const incidentsResolved24h = incidents.filter(
    (item) => item.resolvedAt && new Date(item.resolvedAt).getTime() >= from24h.getTime()
  ).length;
  const incidentsBreachedAck = incidentsForSla.filter(
    (item) => computeIncidentSlaState(item) === "ACK_BREACHED"
  ).length;
  const incidentsBreachedResolve = incidentsForSla.filter(
    (item) =>
      computeIncidentSlaState(item) === "RESOLVE_BREACHED" ||
      computeIncidentSlaState(item) === "RESOLVED_LATE"
  ).length;
  const resolvedDurations = incidentsForSla
    .filter((item) => item.resolvedAt)
    .map((item) => item.resolvedAt!.getTime() - item.createdAt.getTime());
  const avgResolveMinutes =
    resolvedDurations.length > 0
      ? Number((resolvedDurations.reduce((sum, ms) => sum + ms, 0) / resolvedDurations.length / 60000).toFixed(1))
      : 0;

  return {
    ok: true,
    totals: {
      registrations: totals,
      checkedIn,
      pending: Math.max(totals - checkedIn, 0),
      attendanceRate: totals > 0 ? Number(((checkedIn / totals) * 100).toFixed(2)) : 0,
      badgePrints: badgePrints.length,
      attempts24h: attempts24h.length,
      failedAttempts24h: failedAttempts.length,
      successfulAttempts24h: successfulAttempts.length,
      incidentsOpen,
      incidentsResolved24h,
      incidentsBreachedAck,
      incidentsBreachedResolve,
      avgResolveMinutes,
    },
    byLocation: [...byLocationMap.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count),
    byDevice: [...byDeviceMap.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count),
    hourlyThroughput: [...hourlyMap.entries()]
      .map(([hourIso, count]) => ({ hourIso, count }))
      .sort((a, b) => a.hourIso.localeCompare(b.hourIso)),
    topFailureReasons: [...reasonMap.entries()]
      .map(([reason, count]) => ({ reason, count }))
      .sort((a, b) => b.count - a.count),
    bySource: [...sourceMap.entries()]
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count),
    heavyReprints,
    incidents: incidents.map((item) => ({
      id: item.id,
      title: item.title,
      category: item.category,
      severity: item.severity,
      status: item.status,
      location: item.location ?? null,
      createdAt: item.createdAt.toISOString(),
      resolvedAt: item.resolvedAt?.toISOString() ?? null,
      slaState: computeIncidentSlaState(item),
    })),
  };
}
