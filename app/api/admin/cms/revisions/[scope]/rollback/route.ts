import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requireRole } from "@/lib/api-auth";
import { createCmsRevision, getCmsRevisionById, isCmsScope } from "@/lib/cms-revisions";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";

export async function POST(request: Request, context: { params: { scope: string } }) {
  const auth = await requireRole(UserRole.PROGRAM_MANAGER);
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const scope = context.params.scope;
  if (!isCmsScope(scope)) {
    return NextResponse.json({ error: "Invalid revision scope" }, { status: 400 });
  }

  const body = (await request.json().catch(() => null)) as {
    revisionId?: string;
    revisionTitle?: string;
    revisionNote?: string;
  } | null;
  if (!body?.revisionId) {
    return NextResponse.json({ error: "revisionId is required" }, { status: 400 });
  }

  const revision = await getCmsRevisionById(scope, body.revisionId);
  if (!revision) {
    return NextResponse.json({ error: "Revision not found" }, { status: 404 });
  }
  if (!Array.isArray(revision.snapshot)) {
    return NextResponse.json({ error: "Revision snapshot is invalid" }, { status: 400 });
  }

  if (scope === "faqs") {
    const rows = revision.snapshot as Array<Record<string, unknown>>;
    const clean = rows.map((row, index) => {
      const publishAt =
        typeof row.publishAt === "string" && row.publishAt.trim() ? new Date(row.publishAt) : null;
      const unpublishAt =
        typeof row.unpublishAt === "string" && row.unpublishAt.trim() ? new Date(row.unpublishAt) : null;
      return {
      question: String(row.question ?? "").trim(),
      answer: String(row.answer ?? "").trim(),
      category: String(row.category ?? "General").trim(),
      sortOrder: Number(row.sortOrder ?? index + 1),
      published: Boolean(row.published ?? true),
      publishAt: publishAt && !Number.isNaN(publishAt.getTime()) ? publishAt : null,
      unpublishAt: unpublishAt && !Number.isNaN(unpublishAt.getTime()) ? unpublishAt : null,
      };
    });
    await prisma.$transaction(async (tx) => {
      await tx.cmsFaq.deleteMany();
      if (clean.length > 0) await tx.cmsFaq.createMany({ data: clean });
    });
    await createCmsRevision(
      "faqs",
      clean.map((row) => ({
        ...row,
        publishAt: row.publishAt ? row.publishAt.toISOString() : null,
        unpublishAt: row.unpublishAt ? row.unpublishAt.toISOString() : null,
      })),
      auth.user.userId,
      {
      title: body.revisionTitle || "FAQ rollback",
      note: body.revisionNote || `Restored from revision ${body.revisionId}`,
      },
    );
    revalidatePath("/faq");
    return NextResponse.json({ ok: true });
  }

  if (scope === "publications") {
    const rows = revision.snapshot as Array<Record<string, unknown>>;
    const clean = rows.map((row, index) => {
      const publishAt =
        typeof row.publishAt === "string" && row.publishAt.trim() ? new Date(row.publishAt) : null;
      const unpublishAt =
        typeof row.unpublishAt === "string" && row.unpublishAt.trim() ? new Date(row.unpublishAt) : null;
      return {
      slug: String(row.slug ?? "").trim().toLowerCase(),
      title: String(row.title ?? "").trim(),
      excerpt: String(row.excerpt ?? "").trim(),
      dateText: String(row.dateText ?? "").trim(),
      dateline: String(row.dateline ?? "").trim(),
      image: String(row.image ?? "").trim(),
      href: String(row.href ?? "").trim(),
      sortOrder: Number(row.sortOrder ?? index + 1),
      published: Boolean(row.published ?? true),
      publishAt: publishAt && !Number.isNaN(publishAt.getTime()) ? publishAt : null,
      unpublishAt: unpublishAt && !Number.isNaN(unpublishAt.getTime()) ? unpublishAt : null,
      };
    });
    await prisma.$transaction(async (tx) => {
      await tx.cmsPublication.deleteMany();
      if (clean.length > 0) await tx.cmsPublication.createMany({ data: clean });
    });
    await createCmsRevision(
      "publications",
      clean.map((row) => ({
        ...row,
        publishAt: row.publishAt ? row.publishAt.toISOString() : null,
        unpublishAt: row.unpublishAt ? row.unpublishAt.toISOString() : null,
      })),
      auth.user.userId,
      {
      title: body.revisionTitle || "Publications rollback",
      note: body.revisionNote || `Restored from revision ${body.revisionId}`,
      },
    );
    revalidatePath("/publications");
    return NextResponse.json({ ok: true });
  }

  const rows = revision.snapshot as Array<Record<string, unknown>>;
  const clean = rows.map((row, index) => ({
    key: String(row.key ?? "").trim(),
    label: String(row.label ?? "").trim(),
    content: String(row.content ?? "").trim(),
    sortOrder: Number(row.sortOrder ?? index + 1),
  }));
  await prisma.$transaction(async (tx) => {
    await tx.cmsSnippet.deleteMany();
    if (clean.length > 0) await tx.cmsSnippet.createMany({ data: clean });
  });
  await createCmsRevision("about-snippets", clean, auth.user.userId, {
    title: body.revisionTitle || "About page rollback",
    note: body.revisionNote || `Restored from revision ${body.revisionId}`,
  });
  revalidatePath("/about");
  return NextResponse.json({ ok: true });
}
