/** Stored on ContactInquiry.status */
export const CONTACT_INQUIRY_STATUSES = [
  "NEW",
  "EMAILED",
  "DELIVERY_FAILED",
  "REVIEWED",
  "CLOSED",
] as const;

export type ContactInquiryStatus = (typeof CONTACT_INQUIRY_STATUSES)[number];

/** Count as “open” on dashboard — not yet triaged. */
export const CONTACT_INQUIRY_OPEN_STATUSES: ContactInquiryStatus[] = [
  "NEW",
  "EMAILED",
  "DELIVERY_FAILED",
];
