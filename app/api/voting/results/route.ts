import { VoteStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireManagerOrAuditor } from "@/lib/api-auth";

export { dynamic } from "@/lib/force-dynamic-api";

export async function GET() {
  const auth = await requireManagerOrAuditor();
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const grouped = await prisma.publicVote.groupBy({
    by: ["entryId"],
    where: { status: VoteStatus.VALID },
    _count: { _all: true },
    orderBy: { _count: { entryId: "desc" } },
  });

  const entries = await prisma.entry.findMany({
    where: { id: { in: grouped.map((g) => g.entryId) } },
    select: {
      id: true,
      title: true,
      category: { select: { name: true } },
      season: { select: { year: true } },
      program: { select: { name: true } },
    },
  });
  const map = new Map(entries.map((e) => [e.id, e]));

  const results = grouped.map((g, idx) => ({
    rank: idx + 1,
    votes: g._count._all,
    entry: map.get(g.entryId) ?? null,
  }));

  return NextResponse.json({ ok: true, results });
}
