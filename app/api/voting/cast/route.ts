import { VoteStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getRequestSessionUser } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { evaluateVoteQuarantine } from "@/lib/vote-quarantine";
import { getClientIp, hashFingerprint, hashIp } from "@/lib/vote-security";
import { hashVoteToken, verifyVotingToken } from "@/lib/voting-token";

export { dynamic } from "@/lib/force-dynamic-api";

const schema = z.object({
  entryId: z.string().min(1),
  voterEmail: z.string().email().optional(),
  verificationId: z.string().min(1).optional(),
  voteToken: z.string().optional(),
  challengeToken: z.string().optional(),
  fingerprint: z.string().min(8).optional(),
  hp: z.string().optional(), // honeypot field, should stay empty
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const ip = getClientIp(request.headers);
  const ipHash = hashIp(ip);
  const fingerprintHash = parsed.data.fingerprint ? hashFingerprint(parsed.data.fingerprint) : null;
  const userAgent = request.headers.get("user-agent") ?? null;
  const requireVerification = process.env.VOTING_REQUIRE_EMAIL_VERIFICATION === "true";
  const requireChallenge = process.env.VOTING_REQUIRE_CHALLENGE !== "false";
  let tokenUsageData: { tokenHash: string; entryId: string; voterEmail: string | null } | null = null;

  if (parsed.data.hp && parsed.data.hp.trim().length > 0) {
    return NextResponse.json({ error: "Bot validation failed" }, { status: 400 });
  }

  if (requireChallenge) {
    if (!parsed.data.challengeToken) {
      return NextResponse.json({ error: "challengeToken is required" }, { status: 400 });
    }
    const challenge = await verifyVotingToken(parsed.data.challengeToken).catch(() => null);
    if (!challenge || challenge.kind !== "challenge") {
      return NextResponse.json({ error: "Invalid challenge token" }, { status: 400 });
    }
    if (challenge.entryId !== parsed.data.entryId || challenge.ipHash !== ipHash) {
      return NextResponse.json({ error: "Challenge mismatch" }, { status: 400 });
    }
    const issuedAt = (challenge.iat ?? 0) * 1000;
    if (Date.now() - issuedAt < 5000) {
      return NextResponse.json({ error: "Please wait a few seconds and try again" }, { status: 400 });
    }
  }

  if (requireVerification) {
    if (!parsed.data.verificationId) {
      return NextResponse.json({ error: "verificationId is required" }, { status: 400 });
    }
    const verification = await prisma.voteVerification.findUnique({
      where: { id: parsed.data.verificationId },
    });
    if (!verification) return NextResponse.json({ error: "Verification not found" }, { status: 404 });
    if (!verification.usedAt) return NextResponse.json({ error: "Verification code not confirmed" }, { status: 400 });
    if (verification.entryId !== parsed.data.entryId) {
      return NextResponse.json({ error: "Verification does not match selected entry" }, { status: 400 });
    }
    if (verification.ipHash !== ipHash) {
      return NextResponse.json({ error: "Verification/IP mismatch" }, { status: 403 });
    }
  }

  if (parsed.data.voteToken) {
    const tokenHash = hashVoteToken(parsed.data.voteToken);
    const alreadyUsed = await prisma.voteTokenUsage.findUnique({
      where: { tokenHash },
      select: { id: true },
    });
    if (alreadyUsed) {
      return NextResponse.json({ error: "Vote token already used" }, { status: 409 });
    }

    const token = await verifyVotingToken(parsed.data.voteToken).catch(() => null);
    if (!token || token.kind !== "vote_link") {
      return NextResponse.json({ error: "Invalid vote token" }, { status: 400 });
    }
    if (token.entryId !== parsed.data.entryId || token.ipHash !== ipHash) {
      return NextResponse.json({ error: "Vote token mismatch" }, { status: 400 });
    }

    tokenUsageData = {
      tokenHash,
      entryId: token.entryId,
      voterEmail: token.voterEmail || null,
    };
  }

  const sessionUser = await getRequestSessionUser();
  const voterId = sessionUser?.userId ?? null;

  if (voterId) {
    const existingAccount = await prisma.publicVote.findUnique({
      where: {
        entryId_voterId: {
          entryId: parsed.data.entryId,
          voterId,
        },
      },
      select: { id: true },
    });
    if (existingAccount) {
      return NextResponse.json({ ok: false, error: "Duplicate vote blocked" }, { status: 429 });
    }
  }

  const existing = await prisma.publicVote.findUnique({
    where: {
      entryId_ipHash: {
        entryId: parsed.data.entryId,
        ipHash,
      },
    },
  });

  if (existing) {
    return NextResponse.json({ ok: false, error: "Duplicate vote blocked" }, { status: 429 });
  }

  if (fingerprintHash) {
    const existingFingerprint = await prisma.publicVote.findFirst({
      where: {
        entryId: parsed.data.entryId,
        fingerprintHash,
        status: { not: VoteStatus.REJECTED },
      },
      select: { id: true },
    });
    if (existingFingerprint) {
      return NextResponse.json({ ok: false, error: "Duplicate device vote blocked" }, { status: 429 });
    }
  }

  const risk = await evaluateVoteQuarantine({
    ipHash,
    fingerprintHash,
  });

  const voteStatus = risk.quarantine ? VoteStatus.QUARANTINED : VoteStatus.VALID;

  await prisma.publicVote.create({
    data: {
      entryId: parsed.data.entryId,
      ipHash,
      fingerprintHash,
      userAgent,
      voterEmail: parsed.data.voterEmail,
      voterId,
      status: voteStatus,
      quarantineReason: risk.reason,
    },
  });

  if (tokenUsageData) {
    await prisma.voteTokenUsage.create({ data: tokenUsageData }).catch(() => null);
  }

  if (risk.quarantine) {
    return NextResponse.json({
      ok: true,
      pendingReview: true,
      message: "Your vote is held for fraud review. It will count after an admin approves it.",
    });
  }

  return NextResponse.json({ ok: true });
}
