import { NominationStatus, UserRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { safeSendNominationManagerAlertEmail, safeSendNominationStatusEmail } from "@/lib/email";
import { queueNominationManagerAlertEmail, queueNominationStatusEmail } from "@/lib/nomination-email-queue";
import { prisma } from "@/lib/prisma";
import { getRequestSessionUser, requireRole } from "@/lib/api-auth";
import { hasRoleAtLeast } from "@/lib/rbac";

export { dynamic } from "@/lib/force-dynamic-api";

const patchSchema = z.object({
  nomineeFullName: z.string().min(2).max(180).optional(),
  nomineeEmail: z.string().email().optional().or(z.literal("")),
  nomineeOrganization: z.string().max(180).optional().or(z.literal("")),
  nomineeRoleTitle: z.string().max(180).optional().or(z.literal("")),
  summary: z.string().min(20).max(6000).optional(),
  evidenceLinks: z.string().max(4000).optional().or(z.literal("")),
  action: z.enum(["save_draft", "submit", "withdraw", "under_review", "shortlist", "approve", "reject"]).optional(),
  reviewNote: z.string().max(2000).optional().or(z.literal("")),
});

type Params = { params: { nominationId: string } };

export async function GET(_: Request, { params }: Params) {
  const session = await getRequestSessionUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const nomination = await prisma.nomination.findUnique({
    where: { id: params.nominationId },
    include: {
      nominator: { select: { id: true, fullName: true, email: true, role: true } },
      reviewedBy: { select: { id: true, fullName: true, email: true, role: true } },
      program: { select: { id: true, name: true, slug: true } },
      season: { select: { id: true, year: true } },
      category: { select: { id: true, name: true, slug: true } },
      convertedEntry: { select: { id: true, title: true, status: true } },
    },
  });
  if (!nomination) return NextResponse.json({ error: "Nomination not found" }, { status: 404 });

  const isManager = hasRoleAtLeast(session.role, UserRole.PROGRAM_MANAGER);
  const isOwner = nomination.nominatorId === session.userId || nomination.publicNominatorEmail?.toLowerCase() === session.email.toLowerCase();
  if (!isManager && !isOwner) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return NextResponse.json({ ok: true, nomination });
}

export async function PATCH(request: Request, { params }: Params) {
  const auth = await requireRole(UserRole.ENTRANT);
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const nomination = await prisma.nomination.findUnique({
    where: { id: params.nominationId },
    include: {
      season: true,
      program: { select: { id: true, name: true } },
      category: { select: { id: true, name: true } },
      nominator: { select: { id: true, fullName: true, email: true } },
    },
  });
  if (!nomination) return NextResponse.json({ error: "Nomination not found" }, { status: 404 });

  const isManager = hasRoleAtLeast(auth.user.role, UserRole.PROGRAM_MANAGER);
  const isOwner =
    nomination.nominatorId === auth.user.userId ||
    nomination.publicNominatorEmail?.toLowerCase() === auth.user.email.toLowerCase();
  if (!isManager && !isOwner) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const updates: {
    nomineeFullName?: string;
    nomineeEmail?: string | null;
    nomineeOrganization?: string | null;
    nomineeRoleTitle?: string | null;
    summary?: string;
    evidenceLinks?: string | null;
    reviewNote?: string | null;
    reviewedById?: string | null;
    reviewedAt?: Date | null;
    status?: NominationStatus;
  } = {};

  if (typeof parsed.data.nomineeFullName === "string") updates.nomineeFullName = parsed.data.nomineeFullName.trim();
  if (typeof parsed.data.nomineeEmail === "string") updates.nomineeEmail = parsed.data.nomineeEmail.trim() || null;
  if (typeof parsed.data.nomineeOrganization === "string") updates.nomineeOrganization = parsed.data.nomineeOrganization.trim() || null;
  if (typeof parsed.data.nomineeRoleTitle === "string") updates.nomineeRoleTitle = parsed.data.nomineeRoleTitle.trim() || null;
  if (typeof parsed.data.summary === "string") updates.summary = parsed.data.summary.trim();
  if (typeof parsed.data.evidenceLinks === "string") updates.evidenceLinks = parsed.data.evidenceLinks.trim() || null;

  const now = new Date();
  const action = parsed.data.action;
  if (action === "submit") {
    if (!isOwner && !isManager) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    if (!isManager && (now < nomination.season.startDate || now > nomination.season.endDate)) {
      return NextResponse.json({ error: "Nomination window is closed for this season." }, { status: 400 });
    }
    if (
      (nomination.status === NominationStatus.CONVERTED ||
        nomination.status === NominationStatus.REJECTED ||
        nomination.status === NominationStatus.WITHDRAWN) &&
      !isManager
    ) {
      return NextResponse.json({ error: "This nomination can no longer be submitted." }, { status: 400 });
    }
    updates.status = NominationStatus.SUBMITTED;
  } else if (action === "save_draft") {
    if (!isOwner && !isManager) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    if (!isManager && nomination.status !== NominationStatus.DRAFT) {
      return NextResponse.json({ error: "Only draft nominations can be edited by nominators." }, { status: 400 });
    }
    updates.status = NominationStatus.DRAFT;
  } else if (action === "withdraw") {
    if (!isOwner && !isManager) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    updates.status = NominationStatus.WITHDRAWN;
  } else if (action === "under_review" || action === "shortlist" || action === "approve" || action === "reject") {
    if (!isManager) return NextResponse.json({ error: "Only managers can review nominations." }, { status: 403 });
    updates.reviewedById = auth.user.userId;
    updates.reviewedAt = new Date();
    if (typeof parsed.data.reviewNote === "string") updates.reviewNote = parsed.data.reviewNote.trim() || null;
    if (action === "under_review") updates.status = NominationStatus.UNDER_REVIEW;
    if (action === "shortlist") updates.status = NominationStatus.SHORTLISTED;
    if (action === "approve") updates.status = NominationStatus.APPROVED;
    if (action === "reject") updates.status = NominationStatus.REJECTED;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No changes to save." }, { status: 400 });
  }

  const updated = await prisma.nomination.update({
    where: { id: params.nominationId },
    data: updates,
    include: {
      program: { select: { id: true, name: true } },
      season: { select: { id: true, year: true } },
      category: { select: { id: true, name: true } },
    },
  });

  await prisma.auditLog.create({
    data: {
      userId: auth.user.userId,
      action: `nomination.updated.${action ?? "fields"}`,
      metadata: {
        nominationId: nomination.id,
        previousStatus: nomination.status,
        newStatus: updated.status,
        isManagerAction: isManager,
      },
    },
  });

  const notifyEmail = nomination.publicNominatorEmail ?? nomination.nominator?.email ?? null;
  const notifyName = nomination.publicNominatorName ?? nomination.nominator?.fullName ?? null;

  if (action === "submit") {
    const managerPayload = {
      nominatorName: notifyName,
      nominatorEmail: notifyEmail,
      nomineeFullName: nomination.nomineeFullName,
      programName: nomination.program.name,
      categoryName: nomination.category.name,
      seasonYear: nomination.season.year,
      source: nomination.source,
    };
    await queueNominationManagerAlertEmail(managerPayload, auth.user.userId).catch(() =>
      safeSendNominationManagerAlertEmail(managerPayload),
    );
  }

  if (notifyEmail && action && ["under_review", "shortlist", "approve", "reject"].includes(action)) {
    const statusPayload = {
      to: notifyEmail,
      nominatorName: notifyName,
      nomineeFullName: nomination.nomineeFullName,
      status: updated.status,
      reviewNote: updated.reviewNote ?? null,
    };
    await queueNominationStatusEmail(statusPayload, auth.user.userId).catch(() => safeSendNominationStatusEmail(statusPayload));
  }

  return NextResponse.json({ ok: true, nomination: updated });
}
