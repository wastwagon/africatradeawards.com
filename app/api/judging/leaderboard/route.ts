import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireManagerOrAuditor } from "@/lib/api-auth";

export { dynamic } from "@/lib/force-dynamic-api";

export async function GET() {
  const auth = await requireManagerOrAuditor();
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const rows = await prisma.score.groupBy({
    by: ["entryId"],
    _avg: { value: true },
    _count: { _all: true },
    orderBy: {
      _avg: { value: "desc" },
    },
  });

  const entryIds = rows.map((r) => r.entryId);
  const entries = await prisma.entry.findMany({
    where: { id: { in: entryIds } },
    select: {
      id: true,
      title: true,
      status: true,
      program: { select: { name: true } },
      category: { select: { name: true } },
      season: { select: { year: true } },
    },
  });

  const map = new Map(entries.map((entry) => [entry.id, entry]));
  const leaderboard = rows.map((row, idx) => ({
    rank: idx + 1,
    entryId: row.entryId,
    averageScore: row._avg.value ?? 0,
    scoreCount: row._count._all,
    entry: map.get(row.entryId) ?? null,
  }));

  return NextResponse.json({ ok: true, leaderboard });
}
