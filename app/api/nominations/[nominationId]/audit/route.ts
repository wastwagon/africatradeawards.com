import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { requireRole } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

export { dynamic } from "@/lib/force-dynamic-api";

type Params = { params: { nominationId: string } };

export async function GET(_: Request, { params }: Params) {
  const auth = await requireRole(UserRole.PROGRAM_MANAGER);
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const requestUrl = new URL(_.url);
  const filter = (requestUrl.searchParams.get("filter") ?? "all").trim().toLowerCase();
  const from = (requestUrl.searchParams.get("from") ?? "").trim();
  const to = (requestUrl.searchParams.get("to") ?? "").trim();
  const cursor = (requestUrl.searchParams.get("cursor") ?? "").trim();
  const limitRaw = Number(requestUrl.searchParams.get("limit") ?? "20");
  const limit = Number.isFinite(limitRaw) ? Math.min(100, Math.max(5, limitRaw)) : 20;

  const nomination = await prisma.nomination.findUnique({
    where: { id: params.nominationId },
    select: { id: true },
  });
  if (!nomination) return NextResponse.json({ error: "Nomination not found" }, { status: 404 });

  const actionWhere =
    filter === "tracking"
      ? { contains: "tracking_link" }
      : filter === "conversion"
      ? { contains: "converted" }
      : filter === "submission"
      ? { in: ["nomination.created.portal", "nomination.created.public", "nomination.updated.submit"] }
      : filter === "status"
      ? { in: ["nomination.updated.under_review", "nomination.updated.shortlist", "nomination.updated.approve", "nomination.updated.reject"] }
      : { startsWith: "nomination." };

  const createdAtWhere: { gte?: Date; lte?: Date } = {};
  if (from) {
    const fromDate = new Date(from);
    if (!Number.isNaN(fromDate.getTime())) createdAtWhere.gte = fromDate;
  }
  if (to) {
    const toDate = new Date(to);
    if (!Number.isNaN(toDate.getTime())) createdAtWhere.lte = toDate;
  }

  const logs = await prisma.auditLog.findMany({
    where: {
      action: actionWhere,
      ...(Object.keys(createdAtWhere).length ? { createdAt: createdAtWhere } : {}),
      metadata: {
        path: ["nominationId"],
        equals: params.nominationId,
      },
    },
    include: {
      user: { select: { id: true, fullName: true, email: true, role: true } },
    },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    take: limit + 1,
  });
  const hasMore = logs.length > limit;
  const items = hasMore ? logs.slice(0, limit) : logs;
  const nextCursor = hasMore ? items[items.length - 1]?.id ?? null : null;
  return NextResponse.json({ ok: true, logs: items, hasMore, nextCursor });
}
