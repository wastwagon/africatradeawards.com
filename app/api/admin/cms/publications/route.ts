import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requireRole } from "@/lib/api-auth";
import { createCmsRevision } from "@/lib/cms-revisions";
import { DEFAULT_PUBLICATIONS } from "@/lib/cms-defaults";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { z } from "zod";

const publicationSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
  title: z.string().min(3, "Title must be at least 3 characters"),
  excerpt: z.string().min(10, "Summary must be at least 10 characters"),
  dateText: z.string().min(3, "Date is required"),
  dateline: z.string().optional().default(""),
  image: z.string().optional().default(""),
  href: z.string().optional().default(""),
  sortOrder: z.number().int().optional().default(0),
  published: z.boolean().optional().default(true),
  publishAt: z.date().nullable().optional(),
  unpublishAt: z.date().nullable().optional(),
});

export async function GET() {
  const auth = await requireRole(UserRole.PROGRAM_MANAGER);
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const rows = await prisma.cmsPublication.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] });
  if (rows.length === 0) {
    return NextResponse.json({
      ok: true,
      publications: DEFAULT_PUBLICATIONS.map((item, index) => ({ id: `default-${index + 1}`, ...item })),
    });
  }
  return NextResponse.json({ ok: true, publications: rows });
}

export async function PUT(request: Request) {
  const auth = await requireRole(UserRole.PROGRAM_MANAGER);
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const body = (await request.json().catch(() => null)) as {
    publications?: Array<Record<string, unknown>>;
    revisionTitle?: string;
    revisionNote?: string;
  } | null;
  if (!body?.publications || !Array.isArray(body.publications)) {
    return NextResponse.json({ error: "Expected { publications: [] }" }, { status: 400 });
  }

  const clean: Array<{
    slug: string;
    title: string;
    excerpt: string;
    dateText: string;
    dateline: string;
    image: string;
    href: string;
    sortOrder: number;
    published: boolean;
    publishAt?: Date | null;
    unpublishAt?: Date | null;
  }> = [];

  for (let index = 0; index < body.publications.length; index += 1) {
    const row = body.publications[index] ?? {};
    const candidate = {
      slug: typeof row.slug === "string" ? row.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-") : "",
      title: typeof row.title === "string" ? row.title.trim() : "",
      excerpt: typeof row.excerpt === "string" ? row.excerpt.trim() : "",
      dateText: typeof row.dateText === "string" ? row.dateText.trim() : "",
      dateline: typeof row.dateline === "string" ? row.dateline.trim() : "",
      image: typeof row.image === "string" ? row.image.trim() : "",
      href: typeof row.href === "string" ? row.href.trim() : "",
      sortOrder: typeof row.sortOrder === "number" ? row.sortOrder : index + 1,
      published: typeof row.published === "boolean" ? row.published : true,
      publishAt:
        typeof row.publishAt === "string" && row.publishAt.trim() ? new Date(row.publishAt) : null,
      unpublishAt:
        typeof row.unpublishAt === "string" && row.unpublishAt.trim() ? new Date(row.unpublishAt) : null,
    };
    if (candidate.publishAt && Number.isNaN(candidate.publishAt.getTime())) candidate.publishAt = null;
    if (candidate.unpublishAt && Number.isNaN(candidate.unpublishAt.getTime())) candidate.unpublishAt = null;
    const parsed = publicationSchema.safeParse(candidate);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: `Publication ${index + 1}: ${parsed.error.issues[0]?.message ?? "Invalid fields"}`,
        },
        { status: 400 },
      );
    }
    if (parsed.data.publishAt && parsed.data.unpublishAt && parsed.data.unpublishAt <= parsed.data.publishAt) {
      return NextResponse.json(
        { error: `Publication ${index + 1}: Unpublish time must be later than publish time.` },
        { status: 400 },
      );
    }
    clean.push(parsed.data);
  }

  const seen = new Set<string>();
  for (const row of clean) {
    if (seen.has(row.slug)) {
      return NextResponse.json({ error: `Duplicate slug "${row.slug}". Each publication needs a unique slug.` }, { status: 400 });
    }
    seen.add(row.slug);
  }

  await prisma.$transaction(async (tx) => {
    await tx.cmsPublication.deleteMany();
    if (clean.length > 0) await tx.cmsPublication.createMany({ data: clean });
  });
  const snapshot = clean.map((row) => ({
    ...row,
    publishAt: row.publishAt ? row.publishAt.toISOString() : null,
    unpublishAt: row.unpublishAt ? row.unpublishAt.toISOString() : null,
  }));
  await createCmsRevision("publications", snapshot, auth.user.userId, {
    title: body.revisionTitle || "Publications update",
    note: body.revisionNote,
  });

  revalidatePath("/publications");
  return NextResponse.json({ ok: true });
}
