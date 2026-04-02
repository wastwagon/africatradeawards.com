import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/api-auth";

export { dynamic } from "@/lib/force-dynamic-api";

const schema = z.object({
  judgeId: z.string().min(1),
  entryId: z.string().min(1),
});

export async function POST(request: Request) {
  const auth = await requireRole(UserRole.PROGRAM_MANAGER);
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const judge = await prisma.user.findUnique({
    where: { id: parsed.data.judgeId },
    select: { id: true, role: true },
  });

  if (!judge) return NextResponse.json({ error: "Judge not found" }, { status: 404 });
  if (judge.role !== UserRole.JUDGE && judge.role !== UserRole.PROGRAM_MANAGER && judge.role !== UserRole.SUPER_ADMIN) {
    return NextResponse.json({ error: "User is not eligible for judging assignments" }, { status: 400 });
  }

  const assignment = await prisma.judgeAssignment.upsert({
    where: {
      judgeId_entryId: {
        judgeId: parsed.data.judgeId,
        entryId: parsed.data.entryId,
      },
    },
    create: {
      judgeId: parsed.data.judgeId,
      entryId: parsed.data.entryId,
    },
    update: {},
  });

  return NextResponse.json({ ok: true, assignment }, { status: 201 });
}
