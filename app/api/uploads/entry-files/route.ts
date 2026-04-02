import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { Prisma } from "@prisma/client";
import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/api-auth";

export { dynamic } from "@/lib/force-dynamic-api";

const metaSchema = z.object({
  entryId: z.string().min(1),
});

const MAX_UPLOAD_BYTES = Number(process.env.ENTRY_FILE_MAX_BYTES ?? 10 * 1024 * 1024);
const MAX_FILES_PER_ENTRY = Number(process.env.ENTRY_MAX_FILES ?? 20);
const ALLOWED_FILE_EXTENSIONS = new Set([
  ".pdf",
  ".doc",
  ".docx",
  ".png",
  ".jpg",
  ".jpeg",
]);
const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/png",
  "image/jpeg",
]);

export async function POST(request: Request) {
  const auth = await requireRole(UserRole.ENTRANT);
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const formData = await request.formData();
  const entryId = formData.get("entryId");
  const file = formData.get("file");

  const parsed = metaSchema.safeParse({ entryId });
  if (!parsed.success || !(file instanceof File)) {
    return NextResponse.json({ error: "entryId and file are required" }, { status: 400 });
  }

  const entry = await prisma.entry.findUnique({
    where: { id: parsed.data.entryId },
    select: { id: true, entrantId: true, submissionData: true },
  });
  if (!entry) return NextResponse.json({ error: "Entry not found" }, { status: 404 });
  if (entry.entrantId !== auth.user.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const extension = path.extname(file.name).toLowerCase();
  if (!ALLOWED_FILE_EXTENSIONS.has(extension)) {
    return NextResponse.json({ error: "Unsupported file extension" }, { status: 415 });
  }
  if (file.type && !ALLOWED_MIME_TYPES.has(file.type)) {
    return NextResponse.json({ error: "Unsupported file type" }, { status: 415 });
  }
  if (!Number.isFinite(file.size) || file.size <= 0) {
    return NextResponse.json({ error: "File is empty or invalid" }, { status: 400 });
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json(
      { error: `File too large. Max allowed is ${Math.floor(MAX_UPLOAD_BYTES / (1024 * 1024))}MB.` },
      { status: 413 }
    );
  }

  const previous = (entry.submissionData ?? {}) as Record<string, unknown>;
  const previousFiles = Array.isArray(previous.files) ? (previous.files as Array<Record<string, unknown>>) : [];
  if (previousFiles.length >= MAX_FILES_PER_ENTRY) {
    return NextResponse.json(
      { error: `Maximum ${MAX_FILES_PER_ENTRY} files are allowed per entry.` },
      { status: 400 }
    );
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const uniqueName = `${randomUUID()}-${safeName}`;
  const uploadDir = path.join(process.cwd(), "uploads", "entries", entry.id);
  await mkdir(uploadDir, { recursive: true });
  const filePath = path.join(uploadDir, uniqueName);
  await writeFile(filePath, bytes);

  const files = [
    ...previousFiles,
    {
      name: file.name,
      size: file.size,
      type: file.type,
      storedAs: uniqueName,
      uploadedAt: new Date().toISOString(),
    },
  ];

  await prisma.entry.update({
    where: { id: entry.id },
    data: {
      submissionData: {
        ...previous,
        files,
      } as Prisma.InputJsonValue,
    },
  });

  return NextResponse.json({
    ok: true,
    file: { name: file.name, size: file.size, type: file.type, storedAs: uniqueName },
  });
}
