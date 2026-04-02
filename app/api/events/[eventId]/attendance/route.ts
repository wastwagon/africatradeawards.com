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

  const [totalRegistrations, totalCheckedIn, latestCheckIns] = await Promise.all([
    prisma.eventRegistration.count({ where: { eventId: params.eventId } }),
    prisma.eventRegistration.count({ where: { eventId: params.eventId, NOT: { checkedInAt: null } } }),
    prisma.eventCheckIn.findMany({
      where: { eventId: params.eventId },
      orderBy: [{ createdAt: "desc" }],
      take: 10,
      include: {
        registration: { select: { attendeeFullName: true, attendeeEmail: true } },
      },
    }),
  ]);

  return NextResponse.json({
    ok: true,
    totals: {
      registrations: totalRegistrations,
      checkedIn: totalCheckedIn,
      pending: Math.max(totalRegistrations - totalCheckedIn, 0),
      attendanceRate: totalRegistrations > 0 ? Number(((totalCheckedIn / totalRegistrations) * 100).toFixed(2)) : 0,
    },
    latestCheckIns,
  });
}
