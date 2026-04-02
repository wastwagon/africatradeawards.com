import { EntryStatus, UserRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getRequestSessionUser, requireRole } from "@/lib/api-auth";
import { hasRoleAtLeast } from "@/lib/rbac";

export { dynamic } from "@/lib/force-dynamic-api";

const createEntrySchema = z.object({
  title: z.string().min(2).max(200),
  programId: z.string().min(1),
  seasonId: z.string().min(1),
  categoryId: z.string().min(1),
  submissionData: z.record(z.string(), z.any()).optional(),
});

export async function GET() {
  const session = await getRequestSessionUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const isManager = hasRoleAtLeast(session.role, UserRole.PROGRAM_MANAGER);

  const entries = await prisma.entry.findMany({
    where: isManager ? {} : { entrantId: session.userId },
    include: {
      category: { select: { id: true, name: true, slug: true } },
      season: { select: { id: true, year: true } },
      program: { select: { id: true, name: true, slug: true } },
    },
    orderBy: [{ createdAt: "desc" }],
  });

  return NextResponse.json({ ok: true, entries });
}

export async function POST(request: Request) {
  const auth = await requireRole(UserRole.ENTRANT);
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const body = await request.json().catch(() => null);
  const parsed = createEntrySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const season = await prisma.season.findUnique({
    where: { id: parsed.data.seasonId },
    select: { id: true, startDate: true, endDate: true, programId: true },
  });
  if (!season) return NextResponse.json({ error: "Season not found" }, { status: 404 });
  if (season.programId !== parsed.data.programId) {
    return NextResponse.json({ error: "Season does not belong to program" }, { status: 400 });
  }

  const category = await prisma.category.findUnique({
    where: { id: parsed.data.categoryId },
    select: { id: true, programId: true },
  });
  if (!category) return NextResponse.json({ error: "Category not found" }, { status: 404 });
  if (category.programId !== parsed.data.programId) {
    return NextResponse.json({ error: "Category does not belong to program" }, { status: 400 });
  }

  const now = new Date();
  if (now < season.startDate || now > season.endDate) {
    return NextResponse.json({ error: "Season is not accepting entries at this time" }, { status: 400 });
  }

  const entry = await prisma.entry.create({
    data: {
      title: parsed.data.title,
      entrantId: auth.user.userId,
      programId: parsed.data.programId,
      seasonId: parsed.data.seasonId,
      categoryId: parsed.data.categoryId,
      status: EntryStatus.DRAFT,
      submissionData: parsed.data.submissionData ?? {},
    },
  });

  return NextResponse.json({ ok: true, entry }, { status: 201 });
}
