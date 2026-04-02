import { createHash, randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { safeSendNominationTrackingLinkEmail } from "@/lib/email";
import { queueNominationTrackingLinkEmail } from "@/lib/nomination-email-queue";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";

export { dynamic } from "@/lib/force-dynamic-api";

const schema = z.object({
  nominatorEmail: z.string().email().max(180),
  nomineeFullName: z.string().min(2).max(180).optional().or(z.literal("")),
});

const WINDOW_SECONDS = 60 * 15;
const MAX_PER_IP = 6;
const MAX_PER_EMAIL = 6;
const TRACKING_TOKEN_TTL_DAYS = 45;

function hash(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function getClientIp(headers: Headers): string {
  const xff = headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]?.trim() ?? "0.0.0.0";
  const realIp = headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "0.0.0.0";
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const ip = getClientIp(request.headers);
  const email = parsed.data.nominatorEmail.trim().toLowerCase();
  const nomineeName = parsed.data.nomineeFullName?.trim() || "";

  const ipLimiter = await checkRateLimit(`rl:nominations:tracking:ip:${hash(ip)}`, MAX_PER_IP, WINDOW_SECONDS);
  const emailLimiter = await checkRateLimit(`rl:nominations:tracking:email:${hash(email)}`, MAX_PER_EMAIL, WINDOW_SECONDS);
  if (!ipLimiter.allowed || !emailLimiter.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": `${WINDOW_SECONDS}` } },
    );
  }

  const nomination = await prisma.nomination.findFirst({
    where: {
      publicNominatorEmail: email,
      ...(nomineeName
        ? { nomineeFullName: { equals: nomineeName, mode: "insensitive" as const } }
        : {}),
    },
    orderBy: [{ createdAt: "desc" }],
    select: {
      id: true,
      nomineeFullName: true,
      publicNominatorName: true,
      publicNominatorEmail: true,
    },
  });

  // Always return generic success to avoid exposing whether a nomination exists.
  if (!nomination) {
    return NextResponse.json({ ok: true, message: "If your details match, a fresh tracking link has been sent." });
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

  await prisma.auditLog.create({
    data: {
      action: "nomination.tracking_link.self_service_reset",
      metadata: {
        nominationId: nomination.id,
        publicNominatorEmail: email,
        expiresAt: nextTrackingTokenExpiresAt.toISOString(),
      },
    },
  });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") || "";
  const trackingUrl = siteUrl
    ? `${siteUrl}/nominate/status?token=${nextTrackingToken}`
    : `/nominate/status?token=${nextTrackingToken}`;

  const trackingPayload = {
    to: nomination.publicNominatorEmail ?? email,
    nominatorName: nomination.publicNominatorName,
    nomineeFullName: nomination.nomineeFullName,
    trackingUrl,
    expiresAt: nextTrackingTokenExpiresAt,
  };
  await queueNominationTrackingLinkEmail(trackingPayload).catch(() => safeSendNominationTrackingLinkEmail(trackingPayload));

  return NextResponse.json({ ok: true, message: "If your details match, a fresh tracking link has been sent." });
}
