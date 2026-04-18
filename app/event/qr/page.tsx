"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { extractJsonPayloadFromQrScan } from "@/lib/event-qr-scan";

type Payload = {
  type?: string;
  hint?: string;
  iat?: number;
};

function EventQrContent() {
  const searchParams = useSearchParams();
  const [payload, setPayload] = useState<Payload | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const t = searchParams.get("t");
    if (!t) {
      setError("Missing ticket parameter. Scan the QR from your registration email or confirmation page.");
      return;
    }
    const json =
      typeof window !== "undefined" ? extractJsonPayloadFromQrScan(window.location.href) : null;
    if (!json) {
      setError("Invalid ticket link.");
      return;
    }
    try {
      setPayload(JSON.parse(json) as Payload);
    } catch {
      setError("Could not read ticket data.");
    }
  }, [searchParams]);

  return (
    <main className="tg-main-wrapper">
      <section className="container" style={{ padding: "48px 16px 64px", maxWidth: 560 }}>
        <h1 style={{ marginBottom: 12 }}>Digital event pass</h1>
        {error ? (
          <p className="event-register-error" style={{ borderRadius: 10, padding: "12px 14px" }}>
            {error}
          </p>
        ) : null}
        {payload?.type === "ATA_EVENT_CHECKIN" ? (
          <>
            <p style={{ color: "var(--tg-paragraph-color)", lineHeight: 1.6 }}>
              This QR code is your <strong>check-in pass</strong> for Africa Trade Awards events. At the venue, staff use the{" "}
              <strong>admin check-in scanner</strong> to read the full code — not the number a phone camera may show from raw JSON.
            </p>
            {payload.hint ? (
              <p style={{ marginTop: 16, fontSize: "1.1rem" }}>
                Pass code: <strong>{payload.hint}</strong>
              </p>
            ) : null}
            <p style={{ marginTop: 20, fontSize: "0.92rem", opacity: 0.85, color: "var(--tg-paragraph-color)" }}>
              Issued: {payload.iat ? new Date(payload.iat).toLocaleString() : "—"}
            </p>
          </>
        ) : !error ? (
          <p style={{ color: "var(--tg-paragraph-color)" }}>Loading…</p>
        ) : null}
        <p style={{ marginTop: 28 }}>
          <Link href="/event/ticket/">Lost your pass?</Link>
          {" · "}
          <Link href="/">Home</Link>
        </p>
      </section>
    </main>
  );
}

export default function EventQrPage() {
  return (
    <Suspense
      fallback={
        <main className="tg-main-wrapper">
          <section className="container" style={{ padding: "48px 16px" }}>
            <p>Loading…</p>
          </section>
        </main>
      }
    >
      <EventQrContent />
    </Suspense>
  );
}
