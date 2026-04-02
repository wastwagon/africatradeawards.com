import { VoteStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireManagerOrAuditor } from "@/lib/api-auth";

export { dynamic } from "@/lib/force-dynamic-api";

export async function GET() {
  const auth = await requireManagerOrAuditor();
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const votes = await prisma.publicVote.findMany({
    where: { status: VoteStatus.QUARANTINED },
    orderBy: { createdAt: "asc" },
    include: {
      entry: {
        select: {
          id: true,
          title: true,
          program: { select: { name: true } },
          category: { select: { name: true } },
          season: { select: { year: true } },
        },
      },
    },
  });

  return NextResponse.json({ ok: true, votes });
}
