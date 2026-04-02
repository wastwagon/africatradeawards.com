import { VoteStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireManagerOrAuditor } from "@/lib/api-auth";

export { dynamic } from "@/lib/force-dynamic-api";

export async function GET() {
  const auth = await requireManagerOrAuditor();
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const byIp = await prisma.publicVote.groupBy({
    by: ["ipHash"],
    where: { status: VoteStatus.VALID },
    _count: { _all: true },
    orderBy: { _count: { ipHash: "desc" } },
    take: 25,
  });

  const byFingerprint = await prisma.publicVote.groupBy({
    by: ["fingerprintHash"],
    where: {
      status: VoteStatus.VALID,
      fingerprintHash: { not: null },
    },
    _count: { _all: true },
    orderBy: { _count: { fingerprintHash: "desc" } },
    take: 25,
  });

  const verificationStats = await prisma.voteVerification.groupBy({
    by: ["ipHash"],
    _count: { _all: true },
    orderBy: { _count: { ipHash: "desc" } },
    take: 25,
  });

  const quarantinePendingCount = await prisma.publicVote.count({
    where: { status: VoteStatus.QUARANTINED },
  });

  const tokenUsageRecent = await prisma.voteTokenUsage.findMany({
    orderBy: { usedAt: "desc" },
    take: 50,
    select: {
      id: true,
      entryId: true,
      voterEmail: true,
      usedAt: true,
    },
  });

  const suspiciousIp = byIp.filter((row) => row._count._all >= 5);
  const suspiciousFingerprint = byFingerprint.filter((row) => row._count._all >= 3);

  return NextResponse.json({
    ok: true,
    suspiciousIp,
    suspiciousFingerprint,
    verificationStats,
    tokenUsageRecent,
    quarantinePendingCount,
  });
}
