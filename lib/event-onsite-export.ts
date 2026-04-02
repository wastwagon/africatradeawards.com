import PDFDocument from "pdfkit";
import type { OnsiteReportPayload } from "@/lib/event-onsite-report";

type ShiftSummaryEvent = {
  name: string;
  venueName: string;
  startsAt: Date;
};

export function onsiteReportToCsv(payload: OnsiteReportPayload): string {
  const rows: Array<[string, string, string]> = [];
  rows.push(["section", "key", "value"]);
  rows.push(["totals", "registrations", String(payload.totals.registrations)]);
  rows.push(["totals", "checked_in", String(payload.totals.checkedIn)]);
  rows.push(["totals", "pending", String(payload.totals.pending)]);
  rows.push(["totals", "attendance_rate", String(payload.totals.attendanceRate)]);
  rows.push(["totals", "badge_prints", String(payload.totals.badgePrints)]);
  rows.push(["totals", "attempts_24h", String(payload.totals.attempts24h)]);
  rows.push(["totals", "failed_attempts_24h", String(payload.totals.failedAttempts24h)]);
  rows.push(["totals", "successful_attempts_24h", String(payload.totals.successfulAttempts24h)]);
  rows.push(["totals", "incidents_open", String(payload.totals.incidentsOpen)]);
  rows.push(["totals", "incidents_resolved_24h", String(payload.totals.incidentsResolved24h)]);
  rows.push(["totals", "incidents_breached_ack", String(payload.totals.incidentsBreachedAck)]);
  rows.push(["totals", "incidents_breached_resolve", String(payload.totals.incidentsBreachedResolve)]);
  rows.push(["totals", "avg_resolve_minutes", String(payload.totals.avgResolveMinutes)]);
  for (const item of payload.byLocation) rows.push(["by_location", item.name, String(item.count)]);
  for (const item of payload.byDevice) rows.push(["by_device", item.name, String(item.count)]);
  for (const item of payload.hourlyThroughput) rows.push(["hourly_throughput", item.hourIso, String(item.count)]);
  for (const item of payload.topFailureReasons) rows.push(["failure_reason", item.reason, String(item.count)]);
  for (const item of payload.bySource) rows.push(["attempt_source", item.source, String(item.count)]);
  for (const item of payload.heavyReprints) rows.push(["heavy_reprint", item.registrationId, String(item.count)]);
  for (const item of payload.incidents) rows.push(["incident", item.id, `${item.severity}:${item.status}:${item.slaState}:${item.title}`]);

  return rows
    .map((row) =>
      row
        .map((value) => `"${value.replace(/"/g, '""')}"`)
        .join(",")
    )
    .join("\n");
}

export async function buildShiftSummaryPdf(event: ShiftSummaryEvent, report: OnsiteReportPayload): Promise<Buffer> {
  const doc = new PDFDocument({ size: "A4", margin: 36 });
  const chunks: Buffer[] = [];
  doc.on("data", (chunk: Buffer) => chunks.push(chunk));

  doc.fontSize(20).fillColor("#111").text("Onsite Shift Summary");
  doc.moveDown(0.2);
  doc.fontSize(12).fillColor("#333").text(event.name);
  doc.text(`${event.venueName} | ${new Date(event.startsAt).toLocaleString()}`);
  doc.text(`Generated: ${new Date().toLocaleString()}`);
  doc.moveDown(0.8);

  doc.fontSize(13).fillColor("#111").text("KPI Snapshot");
  doc.fontSize(11).fillColor("#222");
  doc.text(`Registrations: ${report.totals.registrations}`);
  doc.text(`Checked in: ${report.totals.checkedIn}`);
  doc.text(`Pending: ${report.totals.pending}`);
  doc.text(`Attendance: ${report.totals.attendanceRate}%`);
  doc.text(`Attempts (24h): ${report.totals.attempts24h}`);
  doc.text(`Failed attempts (24h): ${report.totals.failedAttempts24h}`);
  doc.text(`Open incidents: ${report.totals.incidentsOpen}`);
  doc.text(`Ack SLA breaches: ${report.totals.incidentsBreachedAck}`);
  doc.text(`Resolve SLA breaches: ${report.totals.incidentsBreachedResolve}`);
  doc.text(`Average resolve time: ${report.totals.avgResolveMinutes} minutes`);
  doc.moveDown(0.6);

  doc.fontSize(13).fillColor("#111").text("Top Failure Reasons");
  doc.fontSize(10).fillColor("#222");
  if (report.topFailureReasons.length === 0) {
    doc.text("None in last 24h.");
  } else {
    for (const row of report.topFailureReasons.slice(0, 10)) {
      doc.text(`- ${row.reason}: ${row.count}`);
    }
  }
  doc.moveDown(0.6);

  doc.fontSize(13).fillColor("#111").text("Open Incidents");
  doc.fontSize(10).fillColor("#222");
  const openIncidents = report.incidents.filter((item) => item.status !== "RESOLVED").slice(0, 12);
  if (openIncidents.length === 0) {
    doc.text("No open incidents.");
  } else {
    for (const incident of openIncidents) {
      doc.text(
        `- [${incident.severity}] [${incident.slaState}] ${incident.title} (${incident.category}) @ ${incident.location ?? "Unspecified"}`
      );
    }
  }

  doc.end();
  await new Promise<void>((resolve) => doc.on("end", () => resolve()));
  return Buffer.concat(chunks);
}
