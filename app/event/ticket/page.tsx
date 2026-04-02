'use client'

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

type PublicEvent = { id: string; name: string; venueName: string; startsAt: string };

export default function EventTicketPage() {
  const [events, setEvents] = useState<PublicEvent[]>([]);
  const [eventId, setEventId] = useState("");
  const [attendeeFullName, setAttendeeFullName] = useState("");
  const [attendeeEmail, setAttendeeEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [checkedInAt, setCheckedInAt] = useState<string | null>(null);
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [devCode, setDevCode] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      const response = await fetch("/api/events/public", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Could not load events");
        return;
      }
      setEvents(data.events ?? []);
      if (data.events?.[0]?.id) setEventId(data.events[0].id);
    })();
  }, []);

  async function submitRequestCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!eventId) return;
    setBusy(true);
    setError(null);
    setMessage(null);
    setDevCode(null);
    try {
      const response = await fetch(`/api/events/${eventId}/ticket-recovery/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attendeeEmail, attendeeFullName }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Could not send recovery code");
      setVerificationId(data.verificationId ?? null);
      setMessage(data.message ?? "If details match, a recovery code has been sent.");
      setDevCode(data.devCode ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send recovery code");
    } finally {
      setBusy(false);
    }
  }

  async function submitVerifyCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!eventId || !verificationId) return;
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const response = await fetch(`/api/events/${eventId}/ticket-recovery/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verificationId, code: verificationCode }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Could not verify code");
      setQrDataUrl(data.qrDataUrl ?? null);
      setCheckedInAt(data.attendee?.checkedInAt ?? null);
      setMessage("Code verified. Your new QR pass is ready.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not verify code");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="tg-main-wrapper">
      <section className="container" style={{ padding: "48px 16px 64px" }}>
        <h1 style={{ marginBottom: 8 }}>Retrieve your event ticket</h1>
        <p style={{ marginBottom: 24, color: "var(--tg-paragraph-color)" }}>
          Lost your QR pass? Request a one-time code and verify it to generate a fresh pass.
        </p>
        {message ? <p className="event-register-ok">{message}</p> : null}
        {error ? <p className="event-register-error">{error}</p> : null}
        <form className="event-register-form" onSubmit={submitRequestCode}>
          <label>
            Event
            <select required value={eventId} onChange={(e) => setEventId(e.target.value)}>
              <option value="">Select event</option>
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.name} ({new Date(event.startsAt).toLocaleDateString()}) - {event.venueName}
                </option>
              ))}
            </select>
          </label>
          <label>
            Full name
            <input required value={attendeeFullName} onChange={(e) => setAttendeeFullName(e.target.value)} />
          </label>
          <label>
            Email
            <input required type="email" value={attendeeEmail} onChange={(e) => setAttendeeEmail(e.target.value)} />
          </label>
          <button disabled={busy} type="submit">
            {busy ? "Sending..." : "Send recovery code"}
          </button>
        </form>
        {verificationId ? (
          <form className="event-register-form" onSubmit={submitVerifyCode} style={{ marginTop: 14 }}>
            <label>
              Verification code
              <input
                required
                inputMode="numeric"
                pattern="\d{6}"
                maxLength={6}
                placeholder="6-digit code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
              />
            </label>
            <button disabled={busy || verificationCode.length !== 6} type="submit">
              {busy ? "Verifying..." : "Verify code"}
            </button>
          </form>
        ) : null}
        {devCode ? (
          <p className="event-register-ok" style={{ marginTop: 10 }}>
            Dev fallback code: <strong>{devCode}</strong>
          </p>
        ) : null}
        {checkedInAt ? (
          <p style={{ marginTop: 16, color: "var(--tg-paragraph-color)" }}>
            Already checked in at {new Date(checkedInAt).toLocaleString()}.
          </p>
        ) : null}
        {qrDataUrl ? (
          <div style={{ marginTop: 18 }}>
            <Image src={qrDataUrl} alt="Recovered event ticket QR code" width={240} height={240} style={{ borderRadius: 12 }} />
          </div>
        ) : null}
        <p style={{ marginTop: 20 }}>
          New attendee? <Link href="/event/register">Register here</Link>
        </p>
      </section>
      <style jsx>{`
        .event-register-form {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
          max-width: 900px;
        }
        .event-register-form label {
          display: grid;
          gap: 6px;
          font-weight: 600;
          color: var(--tg-heading-color);
        }
        .event-register-form input,
        .event-register-form select {
          border: 1px solid rgba(0, 0, 0, 0.18);
          border-radius: 10px;
          padding: 10px 12px;
          font-size: 15px;
          background: #fff;
        }
        .event-register-form button {
          border: 0;
          border-radius: 10px;
          background: #f8c43d;
          color: #151515;
          font-weight: 700;
          padding: 12px 14px;
          cursor: pointer;
          grid-column: span 2;
          width: max-content;
        }
        .event-register-ok,
        .event-register-error {
          max-width: 900px;
          border-radius: 10px;
          padding: 10px 12px;
          margin-bottom: 14px;
        }
        .event-register-ok {
          background: #eaf9ed;
          color: #14532d;
          border: 1px solid #9ad8a7;
        }
        .event-register-error {
          background: #fef2f2;
          color: #991b1b;
          border: 1px solid #f3b0b0;
        }
        @media (max-width: 768px) {
          .event-register-form {
            grid-template-columns: 1fr;
          }
          .event-register-form button {
            grid-column: span 1;
            width: 100%;
          }
        }
      `}</style>
    </main>
  );
}
