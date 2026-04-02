import { NextResponse } from "next/server";
import { requireRole } from "@/lib/api-auth";
import { isCmsScope, listCmsRevisions } from "@/lib/cms-revisions";
import { UserRole } from "@prisma/client";

export async function GET(_request: Request, context: { params: { scope: string } }) {
  const auth = await requireRole(UserRole.PROGRAM_MANAGER);
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const scope = context.params.scope;
  if (!isCmsScope(scope)) {
    return NextResponse.json({ error: "Invalid revision scope" }, { status: 400 });
  }

  const revisions = await listCmsRevisions(scope, 12);
  return NextResponse.json({ ok: true, revisions });
}
