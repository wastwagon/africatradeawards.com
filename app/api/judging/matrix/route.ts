import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireManagerOrAuditor } from "@/lib/api-auth";

export { dynamic } from "@/lib/force-dynamic-api";

export async function GET(request: Request) {
  const auth = await requireManagerOrAuditor();
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const { searchParams } = new URL(request.url);
  const entryId = searchParams.get("entryId");
  if (!entryId) return NextResponse.json({ error: "entryId is required" }, { status: 400 });

  const scores = await prisma.score.findMany({
    where: { entryId },
    include: {
      judge: { select: { id: true, fullName: true, email: true } },
      stage: { select: { id: true, name: true, stageOrder: true } },
    },
    orderBy: [{ createdAt: "asc" }],
  });

  const matrix = scores.map((s) => ({
    scoreId: s.id,
    criteria: s.criteria,
    value: s.value,
    comment: s.comment,
    judge: s.judge,
    stage: s.stage,
    createdAt: s.createdAt,
  }));

  return NextResponse.json({ ok: true, matrix });
}
