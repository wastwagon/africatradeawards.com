import { EntryStatus, VoteStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export { dynamic } from "@/lib/force-dynamic-api";

export async function GET() {
  const entries = await prisma.entry.findMany({
    where: {
      status: {
        in: [EntryStatus.SHORTLISTED, EntryStatus.WINNER],
      },
    },
    select: {
      id: true,
      title: true,
      status: true,
      category: { select: { name: true } },
      season: { select: { year: true } },
      program: { select: { name: true } },
      _count: {
        select: {
          publicVotes: { where: { status: VoteStatus.VALID } },
        },
      },
    },
    orderBy: [{ createdAt: "desc" }],
  });

  const mapped = entries.map((e) => ({
    id: e.id,
    title: e.title,
    status: e.status,
    category: e.category,
    season: e.season,
    program: e.program,
    voteCount: e._count.publicVotes,
  }));
  mapped.sort((a, b) => b.voteCount - a.voteCount || a.title.localeCompare(b.title));

  return NextResponse.json({
    ok: true,
    entries: mapped,
  });
}
