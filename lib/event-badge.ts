import { createHmac } from "crypto";

function badgeSecret(): string {
  return process.env.EVENT_BADGE_SECRET ?? process.env.EVENT_QR_SECRET ?? process.env.AUTH_JWT_SECRET ?? "event-badge-secret";
}

export function createBadgeSignature(input: {
  eventId: string;
  registrationId: string;
  attendeeEmail: string;
}): string {
  const raw = `${input.eventId}.${input.registrationId}.${input.attendeeEmail.toLowerCase()}`;
  return createHmac("sha256", badgeSecret()).update(raw).digest("hex").slice(0, 16).toUpperCase();
}
