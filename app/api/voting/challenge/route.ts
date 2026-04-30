import { NextResponse } from "next/server";
import { z } from "zod";
import { getClientIp, hashIp } from "@/lib/vote-security";
import { signVotingToken } from "@/lib/voting-token";

export { dynamic } from "@/lib/force-dynamic-api";

const schema = z.object({
  entryId: z.string().min(1),
  voterEmail: z.string().email().optional(),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const ipHash = hashIp(getClientIp(request.headers));
  const token = await signVotingToken(
    {
      kind: "challenge",
      entryId: parsed.data.entryId,
      voterEmail: parsed.data.voterEmail?.toLowerCase() ?? "",
      ipHash,
    },
    "15m",
  );

  // Client must wait minimum dwell before casting vote (captcha-free friction).
  return NextResponse.json({
    ok: true,
    entryId: parsed.data.entryId,
    challengeToken: token,
    minWaitSeconds: 5,
  });
}
