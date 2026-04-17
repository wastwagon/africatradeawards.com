'use client'

import Link from "next/link";
import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";

type PublicEvent = {
  id: string;
  slug: string;
  name: string;
  venueName: string;
  startsAt: string;
};

export default function EventRegisterPage() {
  const [events, setEvents] = useState<PublicEvent[]>([]);
  const [eventId, setEventId] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [qrPayload, setQrPayload] = useState<string | null>(null);
  const [form, setForm] = useState({
    attendeeFullName: "",
    attendeeEmail: "",
    attendeePhone: "",
    organization: "",
    roleTitle: "",
  });

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

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!eventId) return;
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const response = await fetch(`/api/events/${eventId}/registrations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Could not complete registration");
      setMessage("Registration complete. Save your QR pass below for onsite check-in.");
      setQrDataUrl(data.qrDataUrl ?? null);
      setQrPayload(data.qrPayload ?? null);
      setForm({
        attendeeFullName: "",
        attendeeEmail: "",
        attendeePhone: "",
        organization: "",
        roleTitle: "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not complete registration");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="tg-main-wrapper">
      <section className="container" style={{ padding: "48px 16px 64px" }}>
        <h1 style={{ marginBottom: 8 }}>Event registration</h1>
        <p style={{ marginBottom: 24, color: "var(--tg-paragraph-color)" }}>
          Register for in-person attendance and receive your QR check-in pass instantly.
        </p>
        {message ? <p className="event-register-ok">{message}</p> : null}
        {error ? <p className="event-register-error">{error}</p> : null}
        <form className="event-register-form" onSubmit={submit}>
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
            <input
              required
              value={form.attendeeFullName}
              onChange={(e) => setForm((p) => ({ ...p, attendeeFullName: e.target.value }))}
            />
          </label>
          <label>
            Email
            <input
              required
              type="email"
              value={form.attendeeEmail}
              onChange={(e) => setForm((p) => ({ ...p, attendeeEmail: e.target.value }))}
            />
          </label>
          <label>
            Phone
            <input value={form.attendeePhone} onChange={(e) => setForm((p) => ({ ...p, attendeePhone: e.target.value }))} />
          </label>
          <label>
            Organization
            <input value={form.organization} onChange={(e) => setForm((p) => ({ ...p, organization: e.target.value }))} />
          </label>
          <label>
            Title / role
            <input value={form.roleTitle} onChange={(e) => setForm((p) => ({ ...p, roleTitle: e.target.value }))} />
          </label>
          <button disabled={busy} type="submit">
            {busy ? "Submitting..." : "Register now"}
          </button>
        </form>

        {qrDataUrl ? (
          <div style={{ marginTop: 24 }}>
            <h3>Your QR pass</h3>
            <Image src={qrDataUrl} alt="Registration QR code" width={240} height={240} style={{ borderRadius: 12 }} />
            <p style={{ marginTop: 10, wordBreak: "break-word", color: "var(--tg-paragraph-color)" }}>
              Scanning with a phone camera opens a short ticket page when the site URL is configured. Raw codes may look like a long
              number or URL — staff check-in uses the <strong>Admin → Event check-in</strong> scanner with the full QR data.
            </p>
            {qrPayload ? (
              <p style={{ marginTop: 8, fontSize: "0.88rem", wordBreak: "break-all", opacity: 0.85 }}>{qrPayload}</p>
            ) : null}
          </div>
        ) : null}
        <p style={{ marginTop: 20 }}>
          Staff? Use <Link href="/admin/events">Admin event operations</Link> for desk check-ins.
        </p>
        <p style={{ marginTop: 8 }}>
          Lost your QR later? <Link href="/event/ticket">Retrieve ticket</Link>.
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
