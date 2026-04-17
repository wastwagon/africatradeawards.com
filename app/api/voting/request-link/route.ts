import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";
import { isSmtpConfigured, sendVotingLinkEmail } from "@/lib/email";
import { getClientIp, hashIp } from "@/lib/vote-security";
import { signVotingToken } from "@/lib/voting-token";

export { dynamic } from "@/lib/force-dynamic-api";

function votingDevEmailBypass(): boolean {
  return process.env.VOTING_DEV_EMAIL_BYPASS === "true";
}

const schema = z.object({
  entryId: z.string().min(1),
  voterEmail: z.string().email(),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  if (!isSmtpConfigured() && !votingDevEmailBypass()) {
    return NextResponse.json(
      {
        error:
          "Email delivery is not configured on this server. Set SMTP_HOST, SMTP_USER, and SMTP_PASS (and optionally SMTP_FROM), or set VOTING_DEV_EMAIL_BYPASS=true for local testing only (see .env.example).",
      },
      { status: 503 },
    );
  }

  const ipHash = hashIp(getClientIp(request.headers));
  const email = parsed.data.voterEmail.toLowerCase();

  const ipLimit = await checkRateLimit(`vote:link:ip:${ipHash}`, 8, 3600);
  if (!ipLimit.allowed) return NextResponse.json({ error: "Too many requests from this IP" }, { status: 429 });
  const emailLimit = await checkRateLimit(`vote:link:email:${email}`, 6, 3600);
  if (!emailLimit.allowed) return NextResponse.json({ error: "Too many requests for this email" }, { status: 429 });

  const entry = await prisma.entry.findUnique({
    where: { id: parsed.data.entryId },
    select: { id: true, title: true },
  });
  if (!entry) return NextResponse.json({ error: "Entry not found" }, { status: 404 });

  const token = await signVotingToken(
    {
      kind: "vote_link",
      entryId: entry.id,
      voterEmail: email,
      ipHash,
    },
    "20m",
  );

  const baseUrl = process.env.PUBLIC_BASE_URL ?? "http://localhost:3003";
  const voteUrl = `${baseUrl}/vote/?token=${encodeURIComponent(token)}`;

  if (isSmtpConfigured()) {
    await sendVotingLinkEmail({
      to: email,
      voteUrl,
      entryTitle: entry.title,
    });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: true, devVoteUrl: voteUrl, devBypass: true });
}
