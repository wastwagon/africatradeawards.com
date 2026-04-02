import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";
import { getClientIp, hashIp, hashVoteCode } from "@/lib/vote-security";

export { dynamic } from "@/lib/force-dynamic-api";

const schema = z.object({
  verificationId: z.string().min(1),
  code: z.string().regex(/^\d{6}$/),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const ipHash = hashIp(getClientIp(request.headers));
  const limit = await checkRateLimit(`vote:verify:ip:${ipHash}`, 20, 3600);
  if (!limit.allowed) return NextResponse.json({ error: "Too many verification attempts" }, { status: 429 });

  const verification = await prisma.voteVerification.findUnique({
    where: { id: parsed.data.verificationId },
  });
  if (!verification) return NextResponse.json({ error: "Verification not found" }, { status: 404 });
  if (verification.usedAt) return NextResponse.json({ error: "Verification already used" }, { status: 400 });
  if (verification.expiresAt < new Date()) return NextResponse.json({ error: "Verification expired" }, { status: 400 });
  if (verification.ipHash !== ipHash) return NextResponse.json({ error: "Verification/IP mismatch" }, { status: 403 });
  if (verification.codeHash !== hashVoteCode(parsed.data.code)) {
    return NextResponse.json({ error: "Invalid code" }, { status: 400 });
  }

  await prisma.voteVerification.update({
    where: { id: verification.id },
    data: { usedAt: new Date() },
  });

  return NextResponse.json({
    ok: true,
    voterEmail: verification.voterEmail,
    entryId: verification.entryId,
  });
}
