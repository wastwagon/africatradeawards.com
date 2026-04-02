import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getRequestSessionUser, requireRole } from "@/lib/api-auth";
import { hasRoleAtLeast } from "@/lib/rbac";

export { dynamic } from "@/lib/force-dynamic-api";

const schema = z.object({
  entryId: z.string().min(1),
  reason: z.string().min(3).max(2000),
  judgeId: z.string().min(1).optional(),
});

export async function POST(request: Request) {
  const auth = await requireRole(UserRole.JUDGE);
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const session = await getRequestSessionUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const managerOrAbove = hasRoleAtLeast(session.role, UserRole.PROGRAM_MANAGER);
  const judgeId = managerOrAbove && parsed.data.judgeId ? parsed.data.judgeId : session.userId;

  const exists = await prisma.judgeAssignment.findUnique({
    where: { judgeId_entryId: { judgeId, entryId: parsed.data.entryId } },
  });
  if (!exists) return NextResponse.json({ error: "Judge is not assigned to this entry" }, { status: 400 });

  const recusal = await prisma.judgeRecusal.upsert({
    where: { judgeId_entryId: { judgeId, entryId: parsed.data.entryId } },
    create: { judgeId, entryId: parsed.data.entryId, reason: parsed.data.reason },
    update: { reason: parsed.data.reason },
  });

  return NextResponse.json({ ok: true, recusal }, { status: 201 });
}
