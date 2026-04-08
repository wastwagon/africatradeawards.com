import type { Prisma } from "@prisma/client";

export const CONTACT_INQUIRY_STATUS_VALUES = [
  "NEW",
  "EMAILED",
  "DELIVERY_FAILED",
  "REVIEWED",
  "CLOSED",
] as const;

export type ContactInquiryStatusValue = (typeof CONTACT_INQUIRY_STATUS_VALUES)[number];

/** Accepts `YYYY-MM-DD` from `<input type="date">`; empty if invalid. */
export function normalizeCalendarDateParam(raw: string | undefined): string {
  const t = (raw || "").trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(t)) return "";
  const d = new Date(`${t}T00:00:00.000Z`);
  return Number.isNaN(d.getTime()) ? "" : t;
}

export function parseContactInquiryStatusParam(raw: string | undefined): "" | ContactInquiryStatusValue {
  const u = (raw || "").trim().toUpperCase();
  return CONTACT_INQUIRY_STATUS_VALUES.includes(u as ContactInquiryStatusValue)
    ? (u as ContactInquiryStatusValue)
    : "";
}

function createdAtRangeFilter(from: string, to: string): Prisma.DateTimeFilter | null {
  const filter: Prisma.DateTimeFilter = {};
  if (from) {
    const start = new Date(`${from}T00:00:00.000Z`);
    if (!Number.isNaN(start.getTime())) filter.gte = start;
  }
  if (to) {
    const end = new Date(`${to}T00:00:00.000Z`);
    if (!Number.isNaN(end.getTime())) {
      end.setUTCDate(end.getUTCDate() + 1);
      filter.lt = end;
    }
  }
  return Object.keys(filter).length > 0 ? filter : null;
}

export function buildContactInquiryWhere(input: {
  q?: string;
  status?: string;
  from?: string;
  to?: string;
}): Prisma.ContactInquiryWhereInput {
  const q = (input.q || "").trim();
  const status = parseContactInquiryStatusParam(input.status);
  const from = normalizeCalendarDateParam(input.from);
  const to = normalizeCalendarDateParam(input.to);
  const createdAt = createdAtRangeFilter(from, to);

  return {
    ...(status ? { status } : {}),
    ...(createdAt ? { createdAt } : {}),
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
            { subject: { contains: q, mode: "insensitive" } },
            { message: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  };
}

export type ContactInquiryListQuery = {
  q?: string;
  status?: string;
  from?: string;
  to?: string;
  page?: number;
};

export function contactInquiryListQueryString(filters: ContactInquiryListQuery): string {
  const p = new URLSearchParams();
  const q = (filters.q || "").trim();
  if (q) p.set("q", q);
  if (filters.status) p.set("status", filters.status);
  const from = normalizeCalendarDateParam(filters.from);
  const to = normalizeCalendarDateParam(filters.to);
  if (from) p.set("from", from);
  if (to) p.set("to", to);
  if (filters.page != null && filters.page > 1) p.set("page", String(filters.page));
  return p.toString();
}
