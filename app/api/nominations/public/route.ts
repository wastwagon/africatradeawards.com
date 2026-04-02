import { createHash } from "node:crypto";
import { randomBytes } from "node:crypto";
import { NominationStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { safeSendNominationManagerAlertEmail, safeSendNominationReceivedEmail } from "@/lib/email";
import { queueNominationManagerAlertEmail, queueNominationReceivedEmail } from "@/lib/nomination-email-queue";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";

export { dynamic } from "@/lib/force-dynamic-api";

const schema = z.object({
  nominatorName: z.string().min(2).max(180),
  nominatorEmail: z.string().email().max(180),
  nomineeFullName: z.string().min(2).max(180),
  nomineeEmail: z.string().email().optional().or(z.literal("")),
  nomineeOrganization: z.string().max(180).optional().or(z.literal("")),
  nomineeRoleTitle: z.string().max(180).optional().or(z.literal("")),
  summary: z.string().min(20).max(6000),
  evidenceLinks: z.string().max(4000).optional().or(z.literal("")),
  programId: z.string().min(1),
  seasonId: z.string().min(1),
  categoryId: z.string().min(1),
  website: z.string().optional(), // honeypot
});

const WINDOW_SECONDS = 60 * 15;
const MAX_PER_IP = 8;
const MAX_PER_EMAIL = 4;
const TRACKING_TOKEN_TTL_DAYS = 45;

function getClientIp(headers: Headers): string {
  const xff = headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]?.trim() ?? "0.0.0.0";
  const realIp = headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "0.0.0.0";
}

function hash(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  if (parsed.data.website && parsed.data.website.trim()) {
    return NextResponse.json({ error: "Invalid submission." }, { status: 400 });
  }

  const ip = getClientIp(request.headers);
  const email = parsed.data.nominatorEmail.trim().toLowerCase();
  const ipLimiter = await checkRateLimit(`rl:nominations:public:ip:${hash(ip)}`, MAX_PER_IP, WINDOW_SECONDS);
  const emailLimiter = await checkRateLimit(`rl:nominations:public:email:${hash(email)}`, MAX_PER_EMAIL, WINDOW_SECONDS);
  if (!ipLimiter.allowed || !emailLimiter.allowed) {
    return NextResponse.json(
      { error: "Too many nominations from this source. Please try again later." },
      { status: 429, headers: { "Retry-After": `${WINDOW_SECONDS}` } },
    );
  }

  const season = await prisma.season.findUnique({
    where: { id: parsed.data.seasonId },
    select: { id: true, programId: true, isArchived: true, startDate: true, endDate: true, year: true },
  });
  if (!season) return NextResponse.json({ error: "Season not found" }, { status: 404 });
  if (season.isArchived) return NextResponse.json({ error: "Season is archived." }, { status: 400 });
  if (season.programId !== parsed.data.programId) {
    return NextResponse.json({ error: "Season does not belong to selected program." }, { status: 400 });
  }

  const category = await prisma.category.findUnique({
    where: { id: parsed.data.categoryId },
    select: { id: true, programId: true, name: true },
  });
  if (!category) return NextResponse.json({ error: "Category not found" }, { status: 404 });
  if (category.programId !== parsed.data.programId) {
    return NextResponse.json({ error: "Category does not belong to selected program." }, { status: 400 });
  }

  const program = await prisma.program.findUnique({
    where: { id: parsed.data.programId },
    select: { id: true, name: true },
  });
  if (!program) return NextResponse.json({ error: "Program not found" }, { status: 404 });

  const now = new Date();
  if (now < season.startDate || now > season.endDate) {
    return NextResponse.json({ error: "Nomination window is closed for this season." }, { status: 400 });
  }

  const trackingToken = randomBytes(18).toString("hex");
  const trackingTokenHash = hash(`nomination-track:${trackingToken}`);
  const trackingTokenExpiresAt = new Date(Date.now() + TRACKING_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000);
  const nomination = await prisma.nomination.create({
    data: {
      source: "PUBLIC_FORM",
      status: NominationStatus.SUBMITTED,
      publicTrackingTokenHash: trackingTokenHash,
      publicTrackingTokenExpiresAt: trackingTokenExpiresAt,
      publicNominatorName: parsed.data.nominatorName.trim(),
      publicNominatorEmail: email,
      nomineeFullName: parsed.data.nomineeFullName.trim(),
      nomineeEmail: parsed.data.nomineeEmail?.trim() || null,
      nomineeOrganization: parsed.data.nomineeOrganization?.trim() || null,
      nomineeRoleTitle: parsed.data.nomineeRoleTitle?.trim() || null,
      summary: parsed.data.summary.trim(),
      evidenceLinks: parsed.data.evidenceLinks?.trim() || null,
      programId: parsed.data.programId,
      seasonId: parsed.data.seasonId,
      categoryId: parsed.data.categoryId,
    },
    select: {
      id: true,
      status: true,
      nomineeFullName: true,
      createdAt: true,
    },
  });

  await prisma.auditLog.create({
    data: {
      action: "nomination.created.public",
      metadata: {
        nominationId: nomination.id,
        source: "PUBLIC_FORM",
        nomineeFullName: nomination.nomineeFullName,
        publicNominatorEmail: email,
        programId: parsed.data.programId,
        seasonId: parsed.data.seasonId,
        categoryId: parsed.data.categoryId,
      },
    },
  });

  const nominatorEmail = parsed.data.nominatorEmail.trim().toLowerCase();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") || "";
  const trackingUrl = siteUrl ? `${siteUrl}/nominate/status?token=${trackingToken}` : null;
  const receivedPayload = {
    to: nominatorEmail,
    nominatorName: parsed.data.nominatorName,
    nomineeFullName: parsed.data.nomineeFullName,
    programName: program.name,
    categoryName: category.name,
    seasonYear: season.year,
    trackingUrl,
  };
  const managerPayload = {
    nominatorName: parsed.data.nominatorName,
    nominatorEmail,
    nomineeFullName: parsed.data.nomineeFullName,
    programName: program.name,
    categoryName: category.name,
    seasonYear: season.year,
    source: "PUBLIC_FORM",
  };
  await Promise.all([
    queueNominationReceivedEmail(receivedPayload).catch(() => safeSendNominationReceivedEmail(receivedPayload)),
    queueNominationManagerAlertEmail(managerPayload).catch(() => safeSendNominationManagerAlertEmail(managerPayload)),
  ]);

  return NextResponse.json(
    {
      ok: true,
      nomination,
      trackingToken,
      trackingUrl: trackingUrl || `/nominate/status?token=${trackingToken}`,
    },
    { status: 201 },
  );
}
