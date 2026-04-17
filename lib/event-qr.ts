import crypto from "crypto";
import QRCode from "qrcode";

const TOKEN_PREFIX = "ata_evt_";
const QR_SIGNING_VERSION = 2;

function eventQrSigningSecret(): string {
  const secret = process.env.EVENT_QR_SECRET ?? process.env.AUTH_JWT_SECRET;
  if (!secret) {
    throw new Error("EVENT_QR_SECRET or AUTH_JWT_SECRET is required");
  }
  return secret;
}

function signPayload(eventId: string, registrationId: string, token: string, issuedAt: number): string {
  return crypto
    .createHmac("sha256", eventQrSigningSecret())
    .update(`${eventId}.${registrationId}.${token}.${issuedAt}`)
    .digest("base64url");
}

export function createEventQrToken(): string {
  return `${TOKEN_PREFIX}${crypto.randomBytes(24).toString("hex")}`;
}

export function hashEventQrToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function eventQrHint(token: string): string {
  return token.slice(-6).toUpperCase();
}

export async function eventQrSvgDataUrl(payload: string): Promise<string> {
  return QRCode.toDataURL(payload, {
    type: "image/png",
    margin: 1,
    width: 360,
    errorCorrectionLevel: "M",
  });
}

export function buildEventQrPayload(eventId: string, registrationId: string, token: string): string {
  const iat = Date.now();
  const sig = signPayload(eventId, registrationId, token, iat);
  return JSON.stringify({
    type: "ATA_EVENT_CHECKIN",
    eventId,
    registrationId,
    token,
    hint: eventQrHint(token),
    iat,
    sig,
    v: QR_SIGNING_VERSION,
  });
}

/**
 * Value encoded in the QR image. When NEXT_PUBLIC_SITE_URL or PUBLIC_BASE_URL is set,
 * uses a site URL so phone cameras open a human-readable ticket page; otherwise raw JSON
 * (admin check-in scanner accepts both).
 */
export function buildEventQrScanValue(eventId: string, registrationId: string, token: string): string {
  const json = buildEventQrPayload(eventId, registrationId, token);
  const base = process.env.NEXT_PUBLIC_SITE_URL || process.env.PUBLIC_BASE_URL;
  if (!base || !String(base).trim()) return json;
  const root = String(base).replace(/\/$/, "");
  const t = Buffer.from(json, "utf8").toString("base64url");
  return `${root}/event/qr/?t=${encodeURIComponent(t)}`;
}

export function verifyEventQrSignature(input: {
  eventId: string;
  registrationId: string;
  token: string;
  iat?: number;
  sig?: string;
}): boolean {
  if (!input.sig || !input.iat) return false;
  const expected = signPayload(input.eventId, input.registrationId, input.token, input.iat);
  const expectedBuf = Buffer.from(expected);
  const actualBuf = Buffer.from(input.sig);
  if (expectedBuf.length !== actualBuf.length) return false;
  return crypto.timingSafeEqual(expectedBuf, actualBuf);
}
