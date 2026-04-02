import type { Prisma } from "@prisma/client";
import { EntryStatus, UserRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getRequestSessionUser, requireRole } from "@/lib/api-auth";
import { hasRoleAtLeast } from "@/lib/rbac";

export { dynamic } from "@/lib/force-dynamic-api";

const updateEntrySchema = z.object({
  title: z.string().min(2).max(200).optional(),
  submissionData: z.record(z.string(), z.any()).optional(),
  action: z.enum(["save_draft", "submit"]).optional(),
});

type Params = { params: { entryId: string } };

export async function GET(_: Request, { params }: Params) {
  const session = await getRequestSessionUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const entry = await prisma.entry.findUnique({
    where: { id: params.entryId },
    include: {
      category: true,
      season: true,
      program: true,
      scores: true,
      judgeAssignments: true,
    },
  });

  if (!entry) return NextResponse.json({ error: "Entry not found" }, { status: 404 });

  const isManager = hasRoleAtLeast(session.role, UserRole.PROGRAM_MANAGER);
  const isOwner = entry.entrantId === session.userId;
  const isAssignedJudge = entry.judgeAssignments.some((a) => a.judgeId === session.userId);

  if (!isManager && !isOwner && !isAssignedJudge) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({ ok: true, entry });
}

export async function PATCH(request: Request, { params }: Params) {
  const auth = await requireRole(UserRole.ENTRANT);
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const entry = await prisma.entry.findUnique({
    where: { id: params.entryId },
    include: { season: true },
  });
  if (!entry) return NextResponse.json({ error: "Entry not found" }, { status: 404 });

  const isManager = hasRoleAtLeast(auth.user.role, UserRole.PROGRAM_MANAGER);
  const isOwner = entry.entrantId === auth.user.userId;
  if (!isOwner && !isManager) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = updateEntrySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const updates: {
    title?: string;
    submissionData?: Record<string, unknown>;
    status?: EntryStatus;
  } = {};
  if (parsed.data.title) updates.title = parsed.data.title;
  if (parsed.data.submissionData) updates.submissionData = parsed.data.submissionData;

  if (parsed.data.action === "submit") {
    if (entry.status !== EntryStatus.DRAFT && !isManager) {
      return NextResponse.json({ error: "Only draft entries can be submitted" }, { status: 400 });
    }
    const now = new Date();
    if (!isManager && (now < entry.season.startDate || now > entry.season.endDate)) {
      return NextResponse.json({ error: "Submission window is closed" }, { status: 400 });
    }
    updates.status = EntryStatus.SUBMITTED;
  }

  if (parsed.data.action === "save_draft") {
    if (!isManager && entry.status !== EntryStatus.DRAFT) {
      return NextResponse.json({ error: "Only draft entries can be edited by entrant" }, { status: 400 });
    }
    updates.status = EntryStatus.DRAFT;
  }

  const updated = await prisma.entry.update({
    where: { id: params.entryId },
    data: updates as Prisma.EntryUpdateInput,
  });

  return NextResponse.json({ ok: true, entry: updated });
}
