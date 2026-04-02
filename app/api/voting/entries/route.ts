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

  return NextResponse.json({
    ok: true,
    entries: entries.map((e) => ({
      ...e,
      voteCount: e._count.publicVotes,
    })),
  });
}
