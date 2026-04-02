import { NextResponse } from "next/server";
import { requireManagerOrAuditor } from "@/lib/api-auth";
import { buildVotesCsv, exportFilenameSuffix, parseExportFilters, toExportOptions } from "@/lib/exports-csv";

export { dynamic } from "@/lib/force-dynamic-api";

export async function GET(request: Request) {
  const auth = await requireManagerOrAuditor();
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const parsed = parseExportFilters(new URL(request.url).searchParams);
  if (parsed.error) return NextResponse.json({ error: parsed.error }, { status: 400 });

  const csv = await buildVotesCsv(toExportOptions(parsed));
  const suffix = exportFilenameSuffix(parsed);

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="public-votes-${suffix ? `${suffix}-` : ""}${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
