import { NextResponse } from "next/server";
import { requireManagerOrAuditor } from "@/lib/api-auth";
import { writeAuditLog } from "@/lib/audit-log";
import { onsiteReportToCsv } from "@/lib/event-onsite-export";
import { buildOnsiteReport } from "@/lib/event-onsite-report";

export { dynamic } from "@/lib/force-dynamic-api";

export async function GET(
  request: Request,
  { params }: { params: { eventId: string } }
) {
  const auth = await requireManagerOrAuditor();
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });
  const payload = await buildOnsiteReport(params.eventId);

  const url = new URL(request.url);
  if (url.searchParams.get("format") === "csv") {
    await writeAuditLog({
      action: "onsite_report.csv_export",
      userId: auth.user.userId,
      metadata: { eventId: params.eventId, role: auth.user.role },
    });
    const csv = onsiteReportToCsv(payload);

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="onsite-report-${params.eventId}.csv"`,
        "Cache-Control": "no-store",
      },
    });
  }

  await writeAuditLog({
    action: "onsite_report.view",
    userId: auth.user.userId,
    metadata: { eventId: params.eventId, role: auth.user.role },
  });
  return NextResponse.json(payload);
}
