import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireManagerOrAuditor, requireRole } from "@/lib/api-auth";

export { dynamic } from "@/lib/force-dynamic-api";

const schema = z.object({
  name: z.string().min(2).max(120),
  stageOrder: z.number().int().min(1).max(20),
  programId: z.string().min(1),
  seasonId: z.string().min(1),
  isActive: z.boolean().optional(),
});

export async function GET(request: Request) {
  const auth = await requireManagerOrAuditor();
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const { searchParams } = new URL(request.url);
  const programId = searchParams.get("programId");
  const seasonId = searchParams.get("seasonId");

  const stages = await prisma.judgingStage.findMany({
    where: {
      ...(programId ? { programId } : {}),
      ...(seasonId ? { seasonId } : {}),
    },
    orderBy: [{ stageOrder: "asc" }],
  });

  return NextResponse.json({ ok: true, stages });
}

export async function POST(request: Request) {
  const auth = await requireRole(UserRole.PROGRAM_MANAGER);
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const stage = await prisma.judgingStage.create({
    data: {
      name: parsed.data.name,
      stageOrder: parsed.data.stageOrder,
      programId: parsed.data.programId,
      seasonId: parsed.data.seasonId,
      isActive: parsed.data.isActive ?? true,
    },
  });

  return NextResponse.json({ ok: true, stage }, { status: 201 });
}
