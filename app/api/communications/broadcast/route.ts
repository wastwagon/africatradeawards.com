import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireRole } from "@/lib/api-auth";
import { redis } from "@/lib/redis";

export { dynamic } from "@/lib/force-dynamic-api";

const schema = z.object({
  audience: z.enum(["entrants", "judges", "managers", "all"]),
  subject: z.string().min(2).max(180),
  message: z.string().min(2).max(12000),
  sendAt: z.string().datetime().optional(),
});

export async function POST(request: Request) {
  const auth = await requireRole(UserRole.PROGRAM_MANAGER);
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const job = {
    id: crypto.randomUUID(),
    type: "broadcast_email",
    payload: parsed.data,
    createdAt: new Date().toISOString(),
    createdBy: auth.user.userId,
  };
  if (parsed.data.sendAt) {
    const sendAtMs = new Date(parsed.data.sendAt).getTime();
    if (Number.isNaN(sendAtMs) || sendAtMs <= Date.now()) {
      return NextResponse.json({ error: "sendAt must be a valid future datetime" }, { status: 400 });
    }
    await redis.zadd("jobs:broadcast:scheduled", sendAtMs, JSON.stringify(job));
  } else {
    await redis.lpush("jobs:broadcast", JSON.stringify(job));
  }

  return NextResponse.json({ ok: true, queued: true, scheduled: Boolean(parsed.data.sendAt) });
}
