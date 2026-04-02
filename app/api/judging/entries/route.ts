import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/api-auth";

export { dynamic } from "@/lib/force-dynamic-api";

export async function GET() {
  const auth = await requireRole(UserRole.JUDGE);
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const assignments = await prisma.judgeAssignment.findMany({
    where: { judgeId: auth.user.userId },
    include: {
      entry: {
        include: {
          category: { select: { id: true, name: true, slug: true } },
          season: { select: { id: true, year: true } },
          program: { select: { id: true, name: true, slug: true } },
          scores: { where: { judgeId: auth.user.userId } },
        },
      },
    },
    orderBy: [{ createdAt: "desc" }],
  });

  return NextResponse.json({ ok: true, assignments });
}
