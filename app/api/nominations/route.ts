import { NominationStatus, UserRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getRequestSessionUser, requireRole } from "@/lib/api-auth";
import { hasRoleAtLeast } from "@/lib/rbac";

export { dynamic } from "@/lib/force-dynamic-api";

const createSchema = z.object({
  nomineeFullName: z.string().min(2).max(180),
  nomineeEmail: z.string().email().optional().or(z.literal("")),
  nomineeOrganization: z.string().max(180).optional().or(z.literal("")),
  nomineeRoleTitle: z.string().max(180).optional().or(z.literal("")),
  summary: z.string().min(20).max(6000),
  evidenceLinks: z.string().max(4000).optional().or(z.literal("")),
  programId: z.string().min(1),
  seasonId: z.string().min(1),
  categoryId: z.string().min(1),
});

export async function GET() {
  const session = await getRequestSessionUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const isManager = hasRoleAtLeast(session.role, UserRole.PROGRAM_MANAGER);
  const nominations = await prisma.nomination.findMany({
    where: isManager
      ? {}
      : {
          OR: [{ nominatorId: session.userId }, { publicNominatorEmail: session.email.toLowerCase() }],
        },
    include: {
      nominator: { select: { id: true, fullName: true, email: true } },
      reviewedBy: { select: { id: true, fullName: true, email: true } },
      program: { select: { id: true, name: true, slug: true } },
      season: { select: { id: true, year: true } },
      category: { select: { id: true, name: true, slug: true } },
      convertedEntry: { select: { id: true, title: true, status: true } },
    },
    orderBy: [{ createdAt: "desc" }],
  });
  return NextResponse.json({ ok: true, nominations });
}

export async function POST(request: Request) {
  const auth = await requireRole(UserRole.ENTRANT);
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const body = await request.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const season = await prisma.season.findUnique({
    where: { id: parsed.data.seasonId },
    select: { id: true, programId: true, startDate: true, endDate: true, isArchived: true },
  });
  if (!season) return NextResponse.json({ error: "Season not found" }, { status: 404 });
  if (season.isArchived) return NextResponse.json({ error: "Season is archived." }, { status: 400 });
  if (season.programId !== parsed.data.programId) {
    return NextResponse.json({ error: "Season does not belong to selected program." }, { status: 400 });
  }

  const category = await prisma.category.findUnique({
    where: { id: parsed.data.categoryId },
    select: { id: true, programId: true },
  });
  if (!category) return NextResponse.json({ error: "Category not found" }, { status: 404 });
  if (category.programId !== parsed.data.programId) {
    return NextResponse.json({ error: "Category does not belong to selected program." }, { status: 400 });
  }

  const nomination = await prisma.nomination.create({
    data: {
      nominatorId: auth.user.userId,
      source: "PORTAL",
      nomineeFullName: parsed.data.nomineeFullName.trim(),
      nomineeEmail: parsed.data.nomineeEmail?.trim() || null,
      nomineeOrganization: parsed.data.nomineeOrganization?.trim() || null,
      nomineeRoleTitle: parsed.data.nomineeRoleTitle?.trim() || null,
      summary: parsed.data.summary.trim(),
      evidenceLinks: parsed.data.evidenceLinks?.trim() || null,
      publicNominatorName: auth.user.fullName ?? auth.user.email,
      publicNominatorEmail: auth.user.email.toLowerCase(),
      programId: parsed.data.programId,
      seasonId: parsed.data.seasonId,
      categoryId: parsed.data.categoryId,
      status: NominationStatus.DRAFT,
    },
  });

  await prisma.auditLog.create({
    data: {
      userId: auth.user.userId,
      action: "nomination.created.portal",
      metadata: {
        nominationId: nomination.id,
        source: "PORTAL",
        nomineeFullName: nomination.nomineeFullName,
        programId: nomination.programId,
        seasonId: nomination.seasonId,
        categoryId: nomination.categoryId,
      },
    },
  });

  return NextResponse.json({ ok: true, nomination }, { status: 201 });
}
