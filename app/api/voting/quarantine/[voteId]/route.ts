import { UserRole, VoteStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/api-auth";

export { dynamic } from "@/lib/force-dynamic-api";

const schema = z.object({
  action: z.enum(["approve", "reject"]),
});

type Params = { params: { voteId: string } };

export async function PATCH(request: Request, { params }: Params) {
  const auth = await requireRole(UserRole.PROGRAM_MANAGER);
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const vote = await prisma.publicVote.findUnique({
    where: { id: params.voteId },
  });
  if (!vote) return NextResponse.json({ error: "Vote not found" }, { status: 404 });
  if (vote.status !== VoteStatus.QUARANTINED) {
    return NextResponse.json({ error: "Vote is not in quarantine" }, { status: 400 });
  }

  if (parsed.data.action === "approve") {
    await prisma.publicVote.update({
      where: { id: vote.id },
      data: {
        status: VoteStatus.VALID,
        reviewedAt: new Date(),
        reviewedById: auth.user.userId,
        quarantineReason: vote.quarantineReason,
      },
    });
    await prisma.auditLog.create({
      data: {
        action: "vote_quarantine_approved",
        userId: auth.user.userId,
        metadata: { voteId: vote.id, entryId: vote.entryId },
      },
    });
    return NextResponse.json({ ok: true });
  }

  await prisma.auditLog.create({
    data: {
      action: "vote_quarantine_rejected",
      userId: auth.user.userId,
      metadata: {
        voteId: vote.id,
        entryId: vote.entryId,
        ipHash: vote.ipHash,
        voterEmail: vote.voterEmail,
        quarantineReason: vote.quarantineReason,
      },
    },
  });
  await prisma.publicVote.delete({ where: { id: vote.id } });

  return NextResponse.json({ ok: true });
}
