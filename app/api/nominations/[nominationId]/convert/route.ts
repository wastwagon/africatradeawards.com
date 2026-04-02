import { EntryStatus, NominationStatus, UserRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { hashPassword } from "@/lib/auth";
import { safeSendNominationStatusEmail } from "@/lib/email";
import { queueNominationStatusEmail } from "@/lib/nomination-email-queue";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/api-auth";

export { dynamic } from "@/lib/force-dynamic-api";

type Params = { params: { nominationId: string } };

export async function POST(_: Request, { params }: Params) {
  const auth = await requireRole(UserRole.PROGRAM_MANAGER);
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const nomination = await prisma.nomination.findUnique({
    where: { id: params.nominationId },
    include: {
      category: true,
      season: true,
      program: true,
      nominator: { select: { id: true, fullName: true, email: true } },
    },
  });
  if (!nomination) return NextResponse.json({ error: "Nomination not found" }, { status: 404 });
  if (nomination.convertedEntryId) {
    return NextResponse.json({ error: "Nomination already converted to an entry." }, { status: 400 });
  }
  if (nomination.status === NominationStatus.WITHDRAWN || nomination.status === NominationStatus.REJECTED) {
    return NextResponse.json({ error: "Withdrawn or rejected nominations cannot be converted." }, { status: 400 });
  }

  let entrantId = nomination.nominatorId ?? null;
  if (!entrantId) {
    if (!nomination.publicNominatorEmail) {
      return NextResponse.json(
        { error: "This nomination has no nominator account or email to link for conversion." },
        { status: 400 },
      );
    }
    const email = nomination.publicNominatorEmail.trim().toLowerCase();
    const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } });
    if (existing) {
      entrantId = existing.id;
    } else {
      const generatedPassword = `Auto_${randomBytes(10).toString("hex")}`;
      const created = await prisma.user.create({
        data: {
          email,
          fullName: nomination.publicNominatorName?.trim() || nomination.nomineeFullName,
          role: "ENTRANT",
          passwordHash: await hashPassword(generatedPassword),
        },
        select: { id: true },
      });
      entrantId = created.id;
    }
  }

  const result = await prisma.$transaction(async (tx) => {
    const entry = await tx.entry.create({
      data: {
        title: nomination.nomineeFullName,
        entrantId,
        programId: nomination.programId,
        seasonId: nomination.seasonId,
        categoryId: nomination.categoryId,
        status: EntryStatus.SUBMITTED,
        submissionData: {
          nominationId: nomination.id,
          nomineeFullName: nomination.nomineeFullName,
          nomineeEmail: nomination.nomineeEmail,
          nomineeOrganization: nomination.nomineeOrganization,
          nomineeRoleTitle: nomination.nomineeRoleTitle,
          summary: nomination.summary,
          evidenceLinks: nomination.evidenceLinks,
          convertedByManagerId: auth.user.userId,
          convertedAt: new Date().toISOString(),
        },
      },
    });

    const updatedNomination = await tx.nomination.update({
      where: { id: nomination.id },
      data: {
        status: NominationStatus.CONVERTED,
        reviewedAt: new Date(),
        reviewedById: auth.user.userId,
        convertedAt: new Date(),
        convertedEntryId: entry.id,
        nominatorId: entrantId,
      },
    });

    await tx.auditLog.create({
      data: {
        userId: auth.user.userId,
        action: "nomination.converted_to_entry",
        metadata: {
          nominationId: nomination.id,
          entryId: entry.id,
          nomineeFullName: nomination.nomineeFullName,
        },
      },
    });

    return { entry, nomination: updatedNomination };
  });

  const notifyEmail = nomination.publicNominatorEmail ?? nomination.nominator?.email ?? null;
  const notifyName = nomination.publicNominatorName ?? nomination.nominator?.fullName ?? null;
  if (notifyEmail) {
    const statusPayload = {
      to: notifyEmail,
      nominatorName: notifyName,
      nomineeFullName: nomination.nomineeFullName,
      status: "CONVERTED",
      reviewNote: "Your nomination has been converted into an official entry for judging.",
    };
    await queueNominationStatusEmail(statusPayload, auth.user.userId).catch(() => safeSendNominationStatusEmail(statusPayload));
  }

  return NextResponse.json({ ok: true, ...result });
}
