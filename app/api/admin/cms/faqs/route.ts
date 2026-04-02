import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requireRole } from "@/lib/api-auth";
import { createCmsRevision } from "@/lib/cms-revisions";
import { DEFAULT_FAQS } from "@/lib/cms-defaults";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { z } from "zod";

const faqSchema = z.object({
  question: z.string().min(5, "Question must be at least 5 characters"),
  answer: z.string().min(10, "Answer must be at least 10 characters"),
  category: z.string().optional().default("General"),
  sortOrder: z.number().int().optional().default(0),
  published: z.boolean().optional().default(true),
  publishAt: z.date().nullable().optional(),
  unpublishAt: z.date().nullable().optional(),
});

export async function GET() {
  const auth = await requireRole(UserRole.PROGRAM_MANAGER);
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const rows = await prisma.cmsFaq.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] });
  if (rows.length === 0) {
    return NextResponse.json({
      ok: true,
      faqs: DEFAULT_FAQS.map((faq, index) => ({ id: `default-${index + 1}`, ...faq })),
    });
  }
  return NextResponse.json({ ok: true, faqs: rows });
}

export async function PUT(request: Request) {
  const auth = await requireRole(UserRole.PROGRAM_MANAGER);
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const body = (await request.json().catch(() => null)) as {
    faqs?: Array<Record<string, unknown>>;
    revisionTitle?: string;
    revisionNote?: string;
  } | null;
  if (!body?.faqs || !Array.isArray(body.faqs)) {
    return NextResponse.json({ error: "Expected { faqs: [] }" }, { status: 400 });
  }

  const clean: Array<{
    question: string;
    answer: string;
    category: string;
    sortOrder: number;
    published: boolean;
    publishAt?: Date | null;
    unpublishAt?: Date | null;
  }> = [];

  for (let index = 0; index < body.faqs.length; index += 1) {
    const row = body.faqs[index] ?? {};
    const candidate = {
      question: typeof row.question === "string" ? row.question.trim() : "",
      answer: typeof row.answer === "string" ? row.answer.trim() : "",
      category: typeof row.category === "string" ? row.category.trim() : "",
      sortOrder: typeof row.sortOrder === "number" ? row.sortOrder : index + 1,
      published: typeof row.published === "boolean" ? row.published : true,
      publishAt:
        typeof row.publishAt === "string" && row.publishAt.trim() ? new Date(row.publishAt) : null,
      unpublishAt:
        typeof row.unpublishAt === "string" && row.unpublishAt.trim() ? new Date(row.unpublishAt) : null,
    };
    if (candidate.publishAt && Number.isNaN(candidate.publishAt.getTime())) candidate.publishAt = null;
    if (candidate.unpublishAt && Number.isNaN(candidate.unpublishAt.getTime())) candidate.unpublishAt = null;
    const parsed = faqSchema.safeParse(candidate);
    if (!parsed.success) {
      return NextResponse.json(
        { error: `FAQ ${index + 1}: ${parsed.error.issues[0]?.message ?? "Invalid fields"}` },
        { status: 400 },
      );
    }
    if (parsed.data.publishAt && parsed.data.unpublishAt && parsed.data.unpublishAt <= parsed.data.publishAt) {
      return NextResponse.json(
        { error: `FAQ ${index + 1}: Unpublish time must be later than publish time.` },
        { status: 400 },
      );
    }
    clean.push(parsed.data);
  }

  await prisma.$transaction(async (tx) => {
    await tx.cmsFaq.deleteMany();
    if (clean.length > 0) await tx.cmsFaq.createMany({ data: clean });
  });
  const snapshot = clean.map((row) => ({
    ...row,
    publishAt: row.publishAt ? row.publishAt.toISOString() : null,
    unpublishAt: row.unpublishAt ? row.unpublishAt.toISOString() : null,
  }));
  await createCmsRevision("faqs", snapshot, auth.user.userId, {
    title: body.revisionTitle || "FAQ content update",
    note: body.revisionNote,
  });

  revalidatePath("/faq");
  return NextResponse.json({ ok: true });
}
