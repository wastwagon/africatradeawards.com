import { createHash } from "node:crypto";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";
import { sendContactInquiryEmail } from "@/lib/email";
import { getPublicSiteSettings } from "@/lib/public-site-settings";
import { prisma } from "@/lib/prisma";
import { tryCheckRateLimit } from "@/lib/rate-limit";

const inquiryValues = [
  "general",
  "partnership",
  "media",
  "nomination",
  "awards",
  "event",
  "other",
] as const;

const schema = z.object({
  name: z.string().trim().min(2).max(180),
  email: z.string().trim().email().max(180),
  phone: z.string().trim().min(5).max(80),
  inquiryType: z.enum(inquiryValues),
  subject: z.string().trim().min(2).max(200),
  message: z.string().trim().min(10).max(500),
  website: z.string().optional(),
});

const WINDOW_SECONDS = 3600;
const MAX_PER_IP = 6;
const MAX_PER_EMAIL = 4;

function getClientIp(headers: Headers): string {
  const xff = headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]?.trim() ?? "0.0.0.0";
  const realIp = headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "0.0.0.0";
}

function ipKey(ip: string): string {
  return createHash("sha256").update(`contact:${ip}`).digest("hex").slice(0, 40);
}

const inquiryLabels: Record<(typeof inquiryValues)[number], string> = {
  general: "General inquiry",
  partnership: "Partnership",
  media: "Media inquiry",
  nomination: "Nomination support",
  awards: "Awards information",
  event: "Event information",
  other: "Other",
};

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check the form and try again." }, { status: 400 });
  }

  if (parsed.data.website && parsed.data.website.trim().length > 0) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const ip = getClientIp(request.headers);
  const ipHash = ipKey(ip);
  const emailKey = parsed.data.email.toLowerCase();

  const ipLimit = await tryCheckRateLimit(`site:contact:ip:${ipHash}`, MAX_PER_IP, WINDOW_SECONDS);
  if (!ipLimit.allowed) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again later." },
      { status: 429, headers: { "Retry-After": String(WINDOW_SECONDS) } },
    );
  }
  const emailLimit = await tryCheckRateLimit(`site:contact:email:${emailKey}`, MAX_PER_EMAIL, WINDOW_SECONDS);
  if (!emailLimit.allowed) {
    return NextResponse.json(
      { error: "Too many submissions for this email. Please try again later." },
      { status: 429, headers: { "Retry-After": String(WINDOW_SECONDS) } },
    );
  }

  const settings = await getPublicSiteSettings();
  const to = settings.supportEmail.trim();
  if (!to.includes("@")) {
    return NextResponse.json({ error: "Contact form is not configured." }, { status: 503 });
  }

  let inquiryId: string | null = null;
  try {
    const created = await prisma.contactInquiry.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email.toLowerCase(),
        phone: parsed.data.phone,
        inquiryType: parsed.data.inquiryType,
        subject: parsed.data.subject,
        message: parsed.data.message,
        ipHash,
      },
      select: { id: true },
    });
    inquiryId = created.id;
  } catch {
    // Continue even when persistence is unavailable; email is still attempted.
  }

  try {
    await sendContactInquiryEmail({
      to,
      replyTo: parsed.data.email,
      name: parsed.data.name,
      phone: parsed.data.phone,
      inquiryTypeLabel: inquiryLabels[parsed.data.inquiryType],
      subject: parsed.data.subject,
      message: parsed.data.message,
    });
    if (inquiryId) {
      await prisma.contactInquiry.update({
        where: { id: inquiryId },
        data: { status: "EMAILED", emailedAt: new Date(), emailError: null },
      });
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    if (inquiryId) {
      await prisma.contactInquiry.update({
        where: { id: inquiryId },
        data: { status: "DELIVERY_FAILED", emailError: msg.slice(0, 500) || "send_failed" },
      }).catch(() => {});
    }
    const missingSmtp = msg.includes("SMTP configuration is missing");
    return NextResponse.json(
      {
        error: missingSmtp
          ? "Email delivery is not configured on this server."
          : "Could not send your message. Please try again or email us directly.",
      },
      { status: 503 },
    );
  }

  if (inquiryId) {
    revalidatePath("/admin");
    revalidatePath("/admin/contact-inquiries");
  }

  return NextResponse.json({ ok: true, inquiryId });
}

export { dynamic } from "@/lib/force-dynamic-api";
