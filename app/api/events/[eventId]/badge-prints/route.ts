import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireManager } from "@/lib/api-auth";

export { dynamic } from "@/lib/force-dynamic-api";

export async function GET(
  _request: Request,
  { params }: { params: { eventId: string } }
) {
  const auth = await requireManager();
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const logs = await prisma.eventBadgePrintLog.findMany({
    where: { eventId: params.eventId },
    include: {
      registration: { select: { attendeeFullName: true, attendeeEmail: true } },
      printedBy: { select: { fullName: true, email: true } },
    },
    orderBy: [{ createdAt: "desc" }],
    take: 100,
  });

  return NextResponse.json({ ok: true, logs });
}
