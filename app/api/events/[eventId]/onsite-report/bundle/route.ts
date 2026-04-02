import archiver from "archiver";
import { NextResponse } from "next/server";
import { PassThrough, Readable } from "stream";
import { requireManagerOrAuditor } from "@/lib/api-auth";
import { writeAuditLog } from "@/lib/audit-log";
import { buildShiftSummaryPdf, onsiteReportToCsv } from "@/lib/event-onsite-export";
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
    action: "onsite_report.bundle_export",
    userId: auth.user.userId,
    metadata: {
      eventId: params.eventId,
      role: auth.user.role,
      totals: report.totals,
    },
  });

  const csv = onsiteReportToCsv(report);
  const pdf = await buildShiftSummaryPdf(
    { name: event.name, venueName: event.venueName, startsAt: event.startsAt },
    report
  );

  const passThrough = new PassThrough();
  const archive = archiver("zip", { zlib: { level: 9 } });
  archive.on("error", () => {
    passThrough.destroy(new Error("Could not generate bundle"));
  });
  archive.pipe(passThrough);
  archive.append(csv, { name: "onsite-report.csv" });
  archive.append(pdf, { name: "onsite-shift-summary.pdf" });
  archive.append(
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        event: {
          id: params.eventId,
          name: event.name,
          venueName: event.venueName,
          startsAt: event.startsAt,
        },
        totals: report.totals,
      },
      null,
      2
    ),
    { name: "manifest.json" }
  );
  void archive.finalize();

  const webStream = Readable.toWeb(passThrough) as unknown as ReadableStream;
  return new NextResponse(webStream, {
    status: 200,
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="onsite-export-bundle-${params.eventId}.zip"`,
      "Cache-Control": "no-store",
    },
  });
}
