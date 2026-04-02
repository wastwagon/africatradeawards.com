import { EntryStatus, UserRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/api-auth";

export { dynamic } from "@/lib/force-dynamic-api";

const schema = z.object({
  entryId: z.string().min(1),
  criteria: z.string().min(1).max(150),
  value: z.number().min(0).max(10),
  comment: z.string().max(5000).optional(),
  stageId: z.string().min(1).optional(),
});

export async function POST(request: Request) {
  const auth = await requireRole(UserRole.JUDGE);
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const assignment = await prisma.judgeAssignment.findUnique({
    where: {
      judgeId_entryId: {
        judgeId: auth.user.userId,
        entryId: parsed.data.entryId,
      },
    },
    include: { entry: true },
  });

  if (!assignment) return NextResponse.json({ error: "Entry is not assigned to this judge" }, { status: 403 });
  const recusal = await prisma.judgeRecusal.findUnique({
    where: {
      judgeId_entryId: {
        judgeId: auth.user.userId,
        entryId: parsed.data.entryId,
      },
    },
  });
  if (recusal) {
    return NextResponse.json({ error: "Judge is recused for this entry" }, { status: 403 });
  }
  if (assignment.entry.status === EntryStatus.DRAFT) {
    return NextResponse.json({ error: "Draft entries cannot be scored" }, { status: 400 });
  }

  if (parsed.data.stageId) {
    const stage = await prisma.judgingStage.findUnique({
      where: { id: parsed.data.stageId },
      select: { id: true, isActive: true },
    });
    if (!stage || !stage.isActive) {
      return NextResponse.json({ error: "Invalid or inactive stage" }, { status: 400 });
    }
  }

  const score = await prisma.score.create({
    data: {
      judgeId: auth.user.userId,
      entryId: parsed.data.entryId,
      criteria: parsed.data.criteria,
      value: parsed.data.value,
      comment: parsed.data.comment,
      stageId: parsed.data.stageId,
    },
  });

  return NextResponse.json({ ok: true, score }, { status: 201 });
}
