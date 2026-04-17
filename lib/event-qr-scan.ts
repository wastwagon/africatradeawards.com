/**
 * Browser- and server-safe: extract signed JSON from a QR scan (raw JSON or /event/qr/?t=... URL).
 */

function base64UrlToUtf8(s: string): string {
  const pad = "=".repeat((4 - (s.length % 4)) % 4);
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/") + pad;
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

/**
 * Returns the inner JSON string for ATA_EVENT_CHECKIN payloads, or null.
 */
export function extractJsonPayloadFromQrScan(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("{")) {
    try {
      JSON.parse(trimmed);
      return trimmed;
    } catch {
      return null;
    }
  }
  try {
    const url = new URL(trimmed);
    const t = url.searchParams.get("t");
    if (!t) return null;
    const json = base64UrlToUtf8(decodeURIComponent(t));
    JSON.parse(json);
    return json;
  } catch {
    return null;
  }
}
