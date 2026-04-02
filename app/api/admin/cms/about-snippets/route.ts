import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requireRole } from "@/lib/api-auth";
import { createCmsRevision } from "@/lib/cms-revisions";
import { DEFAULT_ABOUT_SNIPPETS } from "@/lib/cms-defaults";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { z } from "zod";

const snippetSchema = z.object({
  key: z.string().min(3, "Snippet key is required"),
  label: z.string().min(3, "Snippet label is required"),
  content: z.string().min(5, "Snippet content is required"),
  sortOrder: z.number().int().optional().default(0),
});

export async function GET() {
  const auth = await requireRole(UserRole.PROGRAM_MANAGER);
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const rows = await prisma.cmsSnippet.findMany({ orderBy: [{ sortOrder: "asc" }, { key: "asc" }] });
  if (rows.length === 0) {
    return NextResponse.json({ ok: true, snippets: DEFAULT_ABOUT_SNIPPETS });
  }
  return NextResponse.json({ ok: true, snippets: rows });
}

export async function PUT(request: Request) {
  const auth = await requireRole(UserRole.PROGRAM_MANAGER);
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const body = (await request.json().catch(() => null)) as {
    snippets?: Array<Record<string, unknown>>;
    revisionTitle?: string;
    revisionNote?: string;
  } | null;
  if (!body?.snippets || !Array.isArray(body.snippets)) {
    return NextResponse.json({ error: "Expected { snippets: [] }" }, { status: 400 });
  }

  const clean: Array<{ key: string; label: string; content: string; sortOrder: number }> = [];
  for (let index = 0; index < body.snippets.length; index += 1) {
    const row = body.snippets[index] ?? {};
    const candidate = {
      key: typeof row.key === "string" ? row.key.trim() : "",
      label: typeof row.label === "string" ? row.label.trim() : "",
      content: typeof row.content === "string" ? row.content.trim() : "",
      sortOrder: typeof row.sortOrder === "number" ? row.sortOrder : index + 1,
    };
    const parsed = snippetSchema.safeParse(candidate);
    if (!parsed.success) {
      return NextResponse.json(
        { error: `About snippet ${index + 1}: ${parsed.error.issues[0]?.message ?? "Invalid fields"}` },
        { status: 400 },
      );
    }
    clean.push(parsed.data);
  }

  await prisma.$transaction(async (tx) => {
    await tx.cmsSnippet.deleteMany();
    if (clean.length > 0) {
      await tx.cmsSnippet.createMany({ data: clean });
    }
  });
  await createCmsRevision("about-snippets", clean, auth.user.userId, {
    title: body.revisionTitle || "About page content update",
    note: body.revisionNote,
  });

  revalidatePath("/about");
  return NextResponse.json({ ok: true });
}
