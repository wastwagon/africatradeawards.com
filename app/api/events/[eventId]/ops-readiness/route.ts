import { NextResponse } from "next/server";
import { requireManagerOrAuditor } from "@/lib/api-auth";
import { writeAuditLog } from "@/lib/audit-log";
import { buildEventOpsReadiness } from "@/lib/event-ops-readiness";

export { dynamic } from "@/lib/force-dynamic-api";

export async function GET(
  _request: Request,
  { params }: { params: { eventId: string } }
) {
  const auth = await requireManagerOrAuditor();
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const readiness = await buildEventOpsReadiness(params.eventId);
  await writeAuditLog({
    action: "ops_readiness.view",
    userId: auth.user.userId,
    metadata: {
      eventId: params.eventId,
      role: auth.user.role,
      score: readiness.score,
      status: readiness.status,
    },
  });

  return NextResponse.json({ ok: true, readiness });
}
