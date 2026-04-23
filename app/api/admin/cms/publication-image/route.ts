import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { requireRole } from "@/lib/api-auth";
import { UserRole } from "@prisma/client";

export { dynamic } from "@/lib/force-dynamic-api";

const MAX_BYTES = Number(process.env.CMS_PUBLICATION_IMAGE_MAX_BYTES ?? 8 * 1024 * 1024);
const ALLOWED_EXT = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function POST(request: Request) {
  const auth = await requireRole(UserRole.PROGRAM_MANAGER);
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "file is required (multipart field name: file)" }, { status: 400 });
  }

  const extension = path.extname(file.name).toLowerCase();
  if (!ALLOWED_EXT.has(extension)) {
    return NextResponse.json({ error: "Only JPEG, PNG, or WebP images are allowed." }, { status: 415 });
  }
  if (file.type && !ALLOWED_MIME.has(file.type)) {
    return NextResponse.json({ error: "Unsupported image type." }, { status: 415 });
  }
  if (!Number.isFinite(file.size) || file.size <= 0) {
    return NextResponse.json({ error: "Empty file." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: `File too large. Max ${Math.floor(MAX_BYTES / (1024 * 1024))}MB.` },
      { status: 413 },
    );
  }

  const safeExt = extension === ".jpeg" ? ".jpg" : extension;
  const uniqueName = `${randomUUID()}${safeExt}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", "publications");
  await mkdir(uploadDir, { recursive: true });
  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadDir, uniqueName), bytes);

  const url = `/uploads/publications/${uniqueName}`;
  return NextResponse.json({ ok: true, url });
}
