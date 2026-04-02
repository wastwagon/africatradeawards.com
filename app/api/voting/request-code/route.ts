import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";
import { sendVotingVerificationEmail } from "@/lib/email";
import { generateVoteCode, getClientIp, hashIp, hashVoteCode } from "@/lib/vote-security";

export { dynamic } from "@/lib/force-dynamic-api";

const schema = z.object({
  entryId: z.string().min(1),
  voterEmail: z.string().email(),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const ip = getClientIp(request.headers);
  const ipHash = hashIp(ip);
  const emailKey = parsed.data.voterEmail.toLowerCase();

  const ipLimit = await checkRateLimit(`vote:request:ip:${ipHash}`, 10, 3600);
  if (!ipLimit.allowed) return NextResponse.json({ error: "Too many requests from this IP" }, { status: 429 });
  const emailLimit = await checkRateLimit(`vote:request:email:${emailKey}`, 8, 3600);
  if (!emailLimit.allowed) return NextResponse.json({ error: "Too many requests for this email" }, { status: 429 });

  const entry = await prisma.entry.findUnique({
    where: { id: parsed.data.entryId },
    select: { id: true, title: true },
  });
  if (!entry) return NextResponse.json({ error: "Entry not found" }, { status: 404 });

  const code = generateVoteCode();
  const codeHash = hashVoteCode(code);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  const verification = await prisma.voteVerification.create({
    data: {
      entryId: parsed.data.entryId,
      voterEmail: parsed.data.voterEmail.toLowerCase(),
      codeHash,
      ipHash,
      expiresAt,
    },
    select: { id: true, expiresAt: true },
  });

  await sendVotingVerificationEmail({
    to: parsed.data.voterEmail.toLowerCase(),
    code,
    entryTitle: entry.title,
  });

  return NextResponse.json({ ok: true, verificationId: verification.id, expiresAt: verification.expiresAt });
}
