import { createHash, randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { safeSendNominationTrackingLinkEmail } from "@/lib/email";
import { queueNominationTrackingLinkEmail } from "@/lib/nomination-email-queue";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/api-auth";
import { UserRole } from "@prisma/client";

export { dynamic } from "@/lib/force-dynamic-api";

const schema = z.object({
  action: z.enum(["reset", "revoke"]),
  emailNominator: z.boolean().optional(),
});

const TRACKING_TOKEN_TTL_DAYS = 45;

function hash(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

type Params = { params: { nominationId: string } };

export async function POST(request: Request, { params }: Params) {
  const auth = await requireRole(UserRole.PROGRAM_MANAGER);
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const nomination = await prisma.nomination.findUnique({
    where: { id: params.nominationId },
    include: {
      nominator: { select: { email: true, fullName: true } },
    },
  });
  if (!nomination) return NextResponse.json({ error: "Nomination not found" }, { status: 404 });

  if (parsed.data.action === "revoke") {
    await prisma.nomination.update({
      where: { id: nomination.id },
      data: {
        publicTrackingTokenHash: null,
        publicTrackingTokenExpiresAt: null,
      },
    });
    await prisma.auditLog.create({
      data: {
        userId: auth.user.userId,
        action: "nomination.tracking_link.revoked",
        metadata: { nominationId: nomination.id },
      },
    });
    return NextResponse.json({ ok: true, action: "revoke" });
  }

  const nextTrackingToken = randomBytes(18).toString("hex");
  const nextTrackingTokenHash = hash(`nomination-track:${nextTrackingToken}`);
  const nextTrackingTokenExpiresAt = new Date(Date.now() + TRACKING_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000);
  await prisma.nomination.update({
    where: { id: nomination.id },
    data: {
      publicTrackingTokenHash: nextTrackingTokenHash,
      publicTrackingTokenExpiresAt: nextTrackingTokenExpiresAt,
    },
  });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") || "";
  const trackingUrl = siteUrl
    ? `${siteUrl}/nominate/status?token=${nextTrackingToken}`
    : `/nominate/status?token=${nextTrackingToken}`;

  if (parsed.data.emailNominator) {
    const emailTo = nomination.publicNominatorEmail || nomination.nominator?.email;
    if (emailTo) {
      const trackingPayload = {
        to: emailTo,
        nominatorName: nomination.publicNominatorName || nomination.nominator?.fullName,
        nomineeFullName: nomination.nomineeFullName,
        trackingUrl,
        expiresAt: nextTrackingTokenExpiresAt,
      };
      await queueNominationTrackingLinkEmail(trackingPayload, auth.user.userId).catch(() =>
        safeSendNominationTrackingLinkEmail(trackingPayload),
      );
    }
  }

  await prisma.auditLog.create({
    data: {
      userId: auth.user.userId,
      action: "nomination.tracking_link.reset",
      metadata: {
        nominationId: nomination.id,
        emailed: Boolean(parsed.data.emailNominator),
        expiresAt: nextTrackingTokenExpiresAt.toISOString(),
      },
    },
  });

  return NextResponse.json({
    ok: true,
    action: "reset",
    trackingToken: nextTrackingToken,
    trackingUrl,
    expiresAt: nextTrackingTokenExpiresAt,
  });
}
