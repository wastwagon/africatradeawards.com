import { EntryStatus, VoteStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireVoter } from "@/lib/api-auth";

export { dynamic } from "@/lib/force-dynamic-api";

/**
 * Public stats contract for the voter dashboard (stakeholder defaults):
 * - Exposes only aggregates for entries this voter has a vote row for: VALID vote total, rank among
 *   SHORTLISTED+WINNER entries in the same category (same ordering as public /vote cards).
 * - Does not expose other voters' emails, IPs, fingerprints, or verification identifiers.
 */

export async function GET() {
  const auth = await requireVoter();
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const myVotes = await prisma.publicVote.findMany({
    where: { voterId: auth.user.userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      createdAt: true,
      status: true,
      entryId: true,
      entry: {
        select: {
          id: true,
          title: true,
          status: true,
          categoryId: true,
          category: { select: { name: true } },
          season: { select: { year: true } },
          program: { select: { name: true } },
        },
      },
    },
  });

  const entryIds = [...new Set(myVotes.map((v) => v.entryId))];
  if (entryIds.length === 0) {
    return NextResponse.json({ ok: true, votes: [], statsByEntryId: {} });
  }

  const categoryIds = [
    ...new Set(
      myVotes
        .map((v) => v.entry.categoryId)
        .filter((id): id is string => typeof id === "string" && id.length > 0)
    ),
  ];

  const statsByEntryId: Record<
    string,
    { validVoteCount: number; categoryRank: number | null; categoryEntryCount: number }
  > = {};

  for (const categoryId of categoryIds) {
    const entriesInCategory = await prisma.entry.findMany({
      where: {
        categoryId,
        status: { in: [EntryStatus.SHORTLISTED, EntryStatus.WINNER] },
      },
      select: {
        id: true,
        _count: {
          select: {
            publicVotes: { where: { status: VoteStatus.VALID } },
          },
        },
      },
    });

    const sorted = [...entriesInCategory].sort(
      (a, b) =>
        b._count.publicVotes - a._count.publicVotes ||
        (a.id < b.id ? -1 : a.id > b.id ? 1 : 0)
    );

    sorted.forEach((e, idx) => {
      if (entryIds.includes(e.id)) {
        statsByEntryId[e.id] = {
          validVoteCount: e._count.publicVotes,
          categoryRank: idx + 1,
          categoryEntryCount: sorted.length,
        };
      }
    });
  }

  const votes = myVotes.map((v) => ({
    id: v.id,
    createdAt: v.createdAt.toISOString(),
    status: v.status,
    entry: v.entry,
    stats: statsByEntryId[v.entryId] ?? {
      validVoteCount: 0,
      categoryRank: null,
      categoryEntryCount: 0,
    },
  }));

  return NextResponse.json({ ok: true, votes });
}
