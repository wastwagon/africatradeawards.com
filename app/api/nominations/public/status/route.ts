import { createHash, randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { NominationStatus } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export { dynamic } from "@/lib/force-dynamic-api";

function hash(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

const patchSchema = z.object({
  token: z.string().min(6),
  nomineeFullName: z.string().min(2).max(180).optional(),
  nomineeEmail: z.string().email().optional().or(z.literal("")),
  nomineeOrganization: z.string().max(180).optional().or(z.literal("")),
  nomineeRoleTitle: z.string().max(180).optional().or(z.literal("")),
  summary: z.string().min(20).max(6000).optional(),
  evidenceLinks: z.string().max(4000).optional().or(z.literal("")),
});
const TRACKING_TOKEN_TTL_DAYS = 45;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = (searchParams.get("token") ?? "").trim();
  if (!token) return NextResponse.json({ error: "Tracking token is required." }, { status: 400 });

  const tokenHash = hash(`nomination-track:${token}`);
  const nomination = await prisma.nomination.findFirst({
    where: { publicTrackingTokenHash: tokenHash },
    select: {
      id: true,
      status: true,
      nomineeFullName: true,
      nomineeEmail: true,
      nomineeOrganization: true,
      nomineeRoleTitle: true,
      summary: true,
      evidenceLinks: true,
      createdAt: true,
      reviewedAt: true,
      reviewNote: true,
      source: true,
      publicTrackingTokenExpiresAt: true,
      program: { select: { name: true } },
      season: { select: { year: true } },
      category: { select: { name: true } },
      convertedEntry: { select: { id: true, title: true, status: true } },
    },
  });
  if (!nomination) return NextResponse.json({ error: "Nomination not found for this tracking link." }, { status: 404 });
  if (nomination.publicTrackingTokenExpiresAt && nomination.publicTrackingTokenExpiresAt < new Date()) {
    return NextResponse.json({ error: "Tracking link has expired. Please request a fresh status link." }, { status: 410 });
  }

  const editable =
    nomination.status === NominationStatus.SUBMITTED &&
    !nomination.reviewedAt &&
    !nomination.convertedEntry;

  return NextResponse.json({ ok: true, nomination, editable });
}

export async function PATCH(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const tokenHash = hash(`nomination-track:${parsed.data.token.trim()}`);
  const nomination = await prisma.nomination.findFirst({
    where: { publicTrackingTokenHash: tokenHash },
    select: {
      id: true,
      status: true,
      reviewedAt: true,
      convertedEntryId: true,
      publicTrackingTokenExpiresAt: true,
    },
  });
  if (!nomination) return NextResponse.json({ error: "Nomination not found for this tracking link." }, { status: 404 });
  if (nomination.publicTrackingTokenExpiresAt && nomination.publicTrackingTokenExpiresAt < new Date()) {
    return NextResponse.json({ error: "Tracking link has expired. Please request a fresh status link." }, { status: 410 });
  }

  const editable =
    nomination.status === NominationStatus.SUBMITTED &&
    !nomination.reviewedAt &&
    !nomination.convertedEntryId;
  if (!editable) {
    return NextResponse.json({ error: "This nomination can no longer be edited." }, { status: 400 });
  }

  const updates: {
    nomineeFullName?: string;
    nomineeEmail?: string | null;
    nomineeOrganization?: string | null;
    nomineeRoleTitle?: string | null;
    summary?: string;
    evidenceLinks?: string | null;
  } = {};
  if (typeof parsed.data.nomineeFullName === "string") updates.nomineeFullName = parsed.data.nomineeFullName.trim();
  if (typeof parsed.data.nomineeEmail === "string") updates.nomineeEmail = parsed.data.nomineeEmail.trim() || null;
  if (typeof parsed.data.nomineeOrganization === "string") updates.nomineeOrganization = parsed.data.nomineeOrganization.trim() || null;
  if (typeof parsed.data.nomineeRoleTitle === "string") updates.nomineeRoleTitle = parsed.data.nomineeRoleTitle.trim() || null;
  if (typeof parsed.data.summary === "string") updates.summary = parsed.data.summary.trim();
  if (typeof parsed.data.evidenceLinks === "string") updates.evidenceLinks = parsed.data.evidenceLinks.trim() || null;
  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No changes to save." }, { status: 400 });
  }

  const nextTrackingToken = randomBytes(18).toString("hex");
  const nextTrackingTokenHash = hash(`nomination-track:${nextTrackingToken}`);
  const nextTrackingTokenExpiresAt = new Date(Date.now() + TRACKING_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000);

  const updated = await prisma.nomination.update({
    where: { id: nomination.id },
    data: {
      ...updates,
      publicTrackingTokenHash: nextTrackingTokenHash,
      publicTrackingTokenExpiresAt: nextTrackingTokenExpiresAt,
    },
    select: {
      id: true,
      status: true,
      nomineeFullName: true,
      nomineeEmail: true,
      nomineeOrganization: true,
      nomineeRoleTitle: true,
      summary: true,
      evidenceLinks: true,
      createdAt: true,
      reviewedAt: true,
      reviewNote: true,
      source: true,
      publicTrackingTokenExpiresAt: true,
      program: { select: { name: true } },
      season: { select: { year: true } },
      category: { select: { name: true } },
      convertedEntry: { select: { id: true, title: true, status: true } },
    },
  });

  await prisma.auditLog.create({
    data: {
      action: "nomination.updated.public_tracking",
      metadata: {
        nominationId: nomination.id,
        previousStatus: nomination.status,
        newStatus: updated.status,
      },
    },
  });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") || "";
  const nextTrackingUrl = siteUrl
    ? `${siteUrl}/nominate/status?token=${nextTrackingToken}`
    : `/nominate/status?token=${nextTrackingToken}`;

  return NextResponse.json({
    ok: true,
    nomination: updated,
    editable: true,
    nextTrackingToken,
    nextTrackingUrl,
  });
}
