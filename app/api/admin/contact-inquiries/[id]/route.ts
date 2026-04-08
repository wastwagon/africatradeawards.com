import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireManager } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

export { dynamic } from "@/lib/force-dynamic-api";

const patchSchema = z.object({
  status: z.enum(["REVIEWED", "CLOSED", "REOPEN"]),
});

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const auth = await requireManager();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  const id = params.id?.trim();
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const row = await prisma.contactInquiry.findUnique({
    where: { id },
    select: { id: true, emailedAt: true, emailError: true },
  });
  if (!row) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (parsed.data.status === "REVIEWED") {
    await prisma.contactInquiry.update({
      where: { id },
      data: { status: "REVIEWED" },
    });
  } else if (parsed.data.status === "CLOSED") {
    await prisma.contactInquiry.update({
      where: { id },
      data: { status: "CLOSED" },
    });
  } else {
    const nextStatus = row.emailedAt
      ? "EMAILED"
      : row.emailError
        ? "DELIVERY_FAILED"
        : "NEW";
    await prisma.contactInquiry.update({
      where: { id },
      data: { status: nextStatus },
    });
  }

  const updated = await prisma.contactInquiry.findUnique({
    where: { id },
    select: { id: true, status: true },
  });

  revalidatePath("/admin/contact-inquiries");
  revalidatePath("/admin");

  return NextResponse.json({ ok: true, inquiry: updated });
}
