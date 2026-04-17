import { readFile } from "node:fs/promises";
import path from "node:path";
import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/api-auth";

export { dynamic } from "@/lib/force-dynamic-api";

const querySchema = z.object({
  entryId: z.string().min(1),
  storedAs: z.string().min(1),
});

type EntryFileMeta = {
  name?: string;
  size?: number;
  type?: string;
  storedAs?: string;
};

function inferMimeType(fileName: string): string {
  const ext = path.extname(fileName).toLowerCase();
  if (ext === ".pdf") return "application/pdf";
  if (ext === ".doc") return "application/msword";
  if (ext === ".docx") return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  if (ext === ".png") return "image/png";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  return "application/octet-stream";
}

export async function GET(request: Request) {
  const auth = await requireRole(UserRole.PROGRAM_MANAGER);
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const { searchParams } = new URL(request.url);
  const parsed = querySchema.safeParse({
    entryId: searchParams.get("entryId"),
    storedAs: searchParams.get("storedAs"),
  });
  if (!parsed.success) {
    return NextResponse.json({ error: "entryId and storedAs are required" }, { status: 400 });
  }

  const { entryId, storedAs } = parsed.data;
  if (path.basename(storedAs) !== storedAs || storedAs.includes("..")) {
    return NextResponse.json({ error: "Invalid file path" }, { status: 400 });
  }

  const entry = await prisma.entry.findUnique({
    where: { id: entryId },
    select: { id: true, submissionData: true },
  });
  if (!entry) return NextResponse.json({ error: "Entry not found" }, { status: 404 });

  const submissionData = (entry.submissionData ?? {}) as Record<string, unknown>;
  const files = Array.isArray(submissionData.files) ? (submissionData.files as EntryFileMeta[]) : [];
  const meta = files.find((file) => file?.storedAs === storedAs);
  if (!meta) return NextResponse.json({ error: "File metadata not found for entry" }, { status: 404 });

  const diskPath = path.join(process.cwd(), "uploads", "entries", entry.id, storedAs);
  const bytes = await readFile(diskPath).catch(() => null);
  if (!bytes) return NextResponse.json({ error: "File not found on disk" }, { status: 404 });

  const fileName = meta.name || storedAs;
  const contentType = meta.type || inferMimeType(fileName);
  return new NextResponse(bytes, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${fileName.replace(/"/g, "")}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
