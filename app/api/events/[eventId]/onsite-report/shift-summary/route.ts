import { NextResponse } from "next/server";
import { requireManagerOrAuditor } from "@/lib/api-auth";
import { writeAuditLog } from "@/lib/audit-log";
import { buildShiftSummaryPdf } from "@/lib/event-onsite-export";
import { buildOnsiteReport } from "@/lib/event-onsite-report";
import { prisma } from "@/lib/prisma";

export { dynamic } from "@/lib/force-dynamic-api";
export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: { eventId: string } }
) {
  const auth = await requireManagerOrAuditor();
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const [report, event] = await Promise.all([
    buildOnsiteReport(params.eventId),
    prisma.event.findUnique({
      where: { id: params.eventId },
      select: { name: true, venueName: true, startsAt: true },
    }),
  ]);

  if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });

  await writeAuditLog({
    action: "onsite_report.shift_summary_export",
    userId: auth.user.userId,
    metadata: {
      eventId: params.eventId,
      role: auth.user.role,
      incidentsOpen: report.totals.incidentsOpen,
      incidentsBreachedAck: report.totals.incidentsBreachedAck,
      incidentsBreachedResolve: report.totals.incidentsBreachedResolve,
    },
  });

  const pdf = await buildShiftSummaryPdf(
    { name: event.name, venueName: event.venueName, startsAt: event.startsAt },
    report
  );
  return new NextResponse(new Uint8Array(pdf), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="onsite-shift-summary-${params.eventId}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
