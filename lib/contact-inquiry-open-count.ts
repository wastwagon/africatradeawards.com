import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { CONTACT_INQUIRY_OPEN_STATUSES } from "@/lib/contact-inquiry-status";

export async function countOpenContactInquiries() {
  return prisma.contactInquiry.count({
    where: { status: { in: CONTACT_INQUIRY_OPEN_STATUSES } },
  });
}

/** Deduped per RSC request — same logic as `countOpenContactInquiries` */
export const getContactInquiryOpenCount = cache(countOpenContactInquiries);
