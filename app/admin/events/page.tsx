'use client'

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import AdminActionModal from "@/components/admin/AdminActionModal";
import AdminDataTable, { type AdminTableColumn } from "@/components/admin/AdminDataTable";
import { AdminApiError, fetchJson, fetchJsonOrThrow, getApiErrorMessage, toErrorMessage } from "@/components/admin/admin-api";
import useAdminAsyncAction from "@/components/admin/useAdminAsyncAction";
import useAdminFeedback from "@/components/admin/useAdminFeedback";
import AdminToastViewport from "@/components/admin/AdminToastViewport";
import AdminPageHeader from "@/components/admin/AdminPageHeader";

type EventRow = {
  id: string;
  slug: string;
  name: string;
  type: "IN_PERSON" | "HYBRID" | "VIRTUAL";
  venueName: string;
  startsAt: string;
  endsAt: string;
  isPublished: boolean;
  _count: { registrations: number; checkIns: number };
};

type RegistrationRow = {
  id: string;
  createdAt: string;
  status: string;
  attendeeFullName: string;
  attendeeEmail: string;
  attendeePhone: string | null;
  organization: string | null;
  roleTitle: string | null;
  notes: string | null;
  qrTokenHint: string;
  checkedInAt: string | null;
  _count: { checkIns: number };
};

type CheckInRow = {
  id: string;
  createdAt: string;
  method: string;
  location: string | null;
  deviceLabel: string | null;
  registration: { attendeeFullName: string; attendeeEmail: string; qrTokenHint: string };
  checkedInBy: { id: string; fullName: string | null; email: string } | null;
};

type BadgePrintRow = {
  id: string;
  createdAt: string;
  printerLabel: string | null;
  note: string | null;
  registration: { attendeeFullName: string; attendeeEmail: string };
  printedBy: { fullName: string | null; email: string } | null;
};

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [registrations, setRegistrations] = useState<RegistrationRow[]>([]);
  const [checkIns, setCheckIns] = useState<CheckInRow[]>([]);
  const [badgePrints, setBadgePrints] = useState<BadgePrintRow[]>([]);
  const [totals, setTotals] = useState({ registrations: 0, checkedIn: 0, pending: 0, attendanceRate: 0 });
  const [latestQrDataUrl, setLatestQrDataUrl] = useState<string | null>(null);
  const [latestQrPayload, setLatestQrPayload] = useState<string | null>(null);
  const [latestQrToken, setLatestQrToken] = useState<string | null>(null);
  const [overridePrint, setOverridePrint] = useState<{ registrationId: string; reason: string } | null>(null);
  const { isBusy: busy, withBusy } = useAdminAsyncAction();
  const { toasts, dismissToast, setSuccessMessage: setMessage, setErrorMessage: setError } = useAdminFeedback();

  const [eventForm, setEventForm] = useState({
    slug: "",
    name: "",
    venueName: "",
    startsAt: "",
    endsAt: "",
  });

  const [registrationForm, setRegistrationForm] = useState({
    attendeeFullName: "",
    attendeeEmail: "",
    attendeePhone: "",
    organization: "",
    roleTitle: "",
  });

  const [checkInForm, setCheckInForm] = useState({
    registrationId: "",
    qrToken: "",
    qrPayload: "",
    location: "Main entrance",
    deviceLabel: "Desk scanner A",
  });

  const selectedEvent = useMemo(
    () => events.find((event) => event.id === selectedEventId) ?? null,
    [events, selectedEventId]
  );

  const loadEvents = useCallback(async () => {
    const data = await fetchJsonOrThrow<{ events?: EventRow[] }>("/api/events", { cache: "no-store" }, "Could not load events");
    setEvents(data.events ?? []);
    if (!selectedEventId && data.events?.[0]?.id) setSelectedEventId(data.events[0].id);
  }, [selectedEventId]);

  const loadEventDetails = useCallback(async (eventId: string) => {
    const [regsData, attendanceData, checkInsData, badgePrintsData] = await Promise.all([
      fetchJsonOrThrow<{ registrations?: RegistrationRow[] }>(
        `/api/events/${eventId}/registrations`,
        { cache: "no-store" },
        "Could not load registrations"
      ),
      fetchJsonOrThrow<{ totals?: typeof totals }>(
        `/api/events/${eventId}/attendance`,
        { cache: "no-store" },
        "Could not load attendance summary"
      ),
      fetchJsonOrThrow<{ checkIns?: CheckInRow[] }>(`/api/events/${eventId}/checkins`, { cache: "no-store" }, "Could not load check-ins"),
      fetchJsonOrThrow<{ logs?: BadgePrintRow[] }>(
        `/api/events/${eventId}/badge-prints`,
        { cache: "no-store" },
        "Could not load badge print logs"
      ),
    ]);

    setRegistrations(regsData.registrations ?? []);
    setTotals(attendanceData.totals ?? { registrations: 0, checkedIn: 0, pending: 0, attendanceRate: 0 });
    setCheckIns(checkInsData.checkIns ?? []);
    setBadgePrints(badgePrintsData.logs ?? []);
  }, []);

  useEffect(() => {
    void (async () => {
      try {
        await loadEvents();
      } catch (err) {
        setError(toErrorMessage(err, "Failed to load event operations"));
      }
    })();
  }, [loadEvents, setError]);

  useEffect(() => {
    if (!selectedEventId) return;
    void (async () => {
      try {
        await loadEventDetails(selectedEventId);
      } catch (err) {
        setError(toErrorMessage(err, "Failed to load event details"));
      }
    })();
  }, [loadEventDetails, selectedEventId, setError]);

  async function submitCreateEvent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    await withBusy(async () => {
      try {
        const data = await fetchJsonOrThrow<{ event: EventRow }>("/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            slug: eventForm.slug,
            name: eventForm.name,
            venueName: eventForm.venueName,
            startsAt: new Date(eventForm.startsAt).toISOString(),
            endsAt: new Date(eventForm.endsAt).toISOString(),
            isPublished: true,
          }),
        }, "Could not create event");
        setMessage(`Event created: ${data.event.name}`);
        setEventForm({ slug: "", name: "", venueName: "", startsAt: "", endsAt: "" });
        await loadEvents();
        setSelectedEventId(data.event.id);
      } catch (err) {
        setError(toErrorMessage(err, "Could not create event"));
      }
    });
  }

  async function submitRegistration(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedEventId) return;
    setError(null);
    setMessage(null);
    await withBusy(async () => {
      try {
        const data = await fetchJsonOrThrow<{
          registration: RegistrationRow;
          qrDataUrl?: string;
          qrPayload?: string;
          qrToken?: string;
        }>(`/api/events/${selectedEventId}/registrations`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(registrationForm),
        }, "Could not register attendee");
        setMessage(`Registered ${data.registration.attendeeFullName}. QR ready.`);
        setLatestQrDataUrl(data.qrDataUrl ?? null);
        setLatestQrPayload(data.qrPayload ?? null);
        setLatestQrToken(data.qrToken ?? null);
        setRegistrationForm({
          attendeeFullName: "",
          attendeeEmail: "",
          attendeePhone: "",
          organization: "",
          roleTitle: "",
        });
        await loadEventDetails(selectedEventId);
      } catch (err) {
        setError(toErrorMessage(err, "Could not register attendee"));
      }
    });
  }

  async function submitCheckIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedEventId) return;
    setError(null);
    setMessage(null);
    await withBusy(async () => {
      try {
        const data = await fetchJsonOrThrow<{ attendee: { fullName: string } }>(`/api/events/${selectedEventId}/checkins`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(checkInForm),
        }, "Check-in failed");
        setMessage(`Checked in ${data.attendee.fullName}`);
        setCheckInForm((prev) => ({ ...prev, registrationId: "", qrToken: "", qrPayload: "" }));
        await loadEventDetails(selectedEventId);
      } catch (err) {
        setError(toErrorMessage(err, "Check-in failed"));
      }
    });
  }

  async function logBadgePrint(registrationId: string) {
    if (!selectedEventId) return;
    setError(null);
    setMessage(null);
    await withBusy(async () => {
      try {
        const requestBody: {
          printerLabel: string;
          note: string;
          overridePolicy?: boolean;
          overrideReason?: string;
        } = {
          printerLabel: "Admin desk printer",
          note: "Manual print log",
        };

        const result = await fetchJson<{ attendee?: string; code?: string; error?: string }>(
          `/api/events/${selectedEventId}/registrations/${registrationId}/badge-print`,
          {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
          }
        );
        if (!result.ok && result.data?.code === "REPRINT_OVERRIDE_REQUIRED") {
          setOverridePrint({ registrationId, reason: "" });
          setError("Reprint policy triggered. Provide an override reason below to continue.");
          return;
        }
        if (!result.ok) {
          throw new AdminApiError(getApiErrorMessage(result.data, "Could not log badge print"), result.status, result.data);
        }
        setMessage(`Badge print logged for ${result.data.attendee ?? "attendee"}`);
        await loadEventDetails(selectedEventId);
      } catch (err) {
        setError(toErrorMessage(err, "Could not log badge print"));
      }
    });
  }

  async function submitOverridePrint() {
    if (!selectedEventId || !overridePrint) return;
    const reason = overridePrint.reason.trim();
    if (reason.length < 12) {
      setError("Override reason must be at least 12 characters.");
      return;
    }
    setError(null);
    setMessage(null);
    await withBusy(async () => {
      try {
        const data = await fetchJsonOrThrow<{ attendee?: string }>(
          `/api/events/${selectedEventId}/registrations/${overridePrint.registrationId}/badge-print`,
          {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            printerLabel: "Admin desk printer",
            note: "Manual print log",
            overridePolicy: true,
            overrideReason: reason,
          }),
          },
          "Could not log override badge print"
        );
        setMessage(`Override badge print logged for ${data.attendee ?? "attendee"}`);
        setOverridePrint(null);
        await loadEventDetails(selectedEventId);
      } catch (err) {
        setError(toErrorMessage(err, "Could not log override badge print"));
      }
    });
  }

  const registrationColumns: AdminTableColumn<RegistrationRow>[] = [
    {
      key: "name",
      header: "Attendee",
      sortValue: (row) => row.attendeeFullName,
      cell: (row) => (
        <div>
          <strong>{row.attendeeFullName}</strong>
          <div className="admin-muted">{row.attendeeEmail}</div>
        </div>
      ),
    },
    { key: "status", header: "Status", sortValue: (row) => row.status, cell: (row) => row.status },
    { key: "hint", header: "QR hint", sortValue: (row) => row.qrTokenHint, cell: (row) => row.qrTokenHint },
    {
      key: "checkin",
      header: "Checked in",
      sortValue: (row) => row.checkedInAt ?? "",
      cell: (row) => (row.checkedInAt ? new Date(row.checkedInAt).toLocaleString() : "No"),
    },
    {
      key: "actions",
      header: "Actions",
      cell: (row) => (
        <div className="admin-inline-actions">
          <button type="button" onClick={() => void logBadgePrint(row.id)} disabled={busy}>
            Log badge print
          </button>
          <Link href={`/admin/events/badge?eventId=${selectedEventId}&registrationId=${row.id}`} className="admin-quick-action">
            Open badge
          </Link>
        </div>
      ),
    },
  ];

  const checkInColumns: AdminTableColumn<CheckInRow>[] = [
    {
      key: "attendee",
      header: "Attendee",
      sortValue: (row) => row.registration.attendeeFullName,
      cell: (row) => row.registration.attendeeFullName,
    },
    {
      key: "time",
      header: "Time",
      sortValue: (row) => row.createdAt,
      cell: (row) => new Date(row.createdAt).toLocaleString(),
    },
    { key: "method", header: "Method", sortValue: (row) => row.method, cell: (row) => row.method },
    { key: "location", header: "Location", sortValue: (row) => row.location ?? "", cell: (row) => row.location ?? "—" },
  ];

  return (
    <main className="admin-page--wide">
      <AdminPageHeader
        title="Event operations"
        description="Manage registrations, QR ticketing, and in-person check-ins from one dashboard."
      />
      <AdminToastViewport toasts={toasts} onClose={dismissToast} />
      <AdminActionModal
        open={Boolean(overridePrint)}
        title="Reprint override required"
        description="Provide a policy override reason to continue with this reprint."
        onClose={() => setOverridePrint(null)}
      >
        <form
          className="admin-form"
          onSubmit={(event) => {
            event.preventDefault();
            void submitOverridePrint();
          }}
        >
          <label>
            Reason (min 12 characters)
            <textarea
              rows={3}
              value={overridePrint?.reason ?? ""}
              onChange={(e) => setOverridePrint((current) => (current ? { ...current, reason: e.target.value } : current))}
            />
          </label>
          <div className="admin-inline-actions">
            <button type="submit" disabled={busy}>
              {busy ? "Saving..." : "Submit override print"}
            </button>
            <button type="button" onClick={() => setOverridePrint(null)} disabled={busy}>
              Cancel
            </button>
          </div>
        </form>
      </AdminActionModal>

      <section>
        <h2>Create event</h2>
        <form className="admin-form" onSubmit={submitCreateEvent}>
          <label>
            Slug
            <input required value={eventForm.slug} onChange={(e) => setEventForm((p) => ({ ...p, slug: e.target.value }))} />
          </label>
          <label>
            Event name
            <input required value={eventForm.name} onChange={(e) => setEventForm((p) => ({ ...p, name: e.target.value }))} />
          </label>
          <label>
            Venue
            <input
              required
              value={eventForm.venueName}
              onChange={(e) => setEventForm((p) => ({ ...p, venueName: e.target.value }))}
            />
          </label>
          <label>
            Starts at
            <input
              required
              type="datetime-local"
              value={eventForm.startsAt}
              onChange={(e) => setEventForm((p) => ({ ...p, startsAt: e.target.value }))}
            />
          </label>
          <label>
            Ends at
            <input
              required
              type="datetime-local"
              value={eventForm.endsAt}
              onChange={(e) => setEventForm((p) => ({ ...p, endsAt: e.target.value }))}
            />
          </label>
          <button disabled={busy} type="submit">
            {busy ? "Saving..." : "Create event"}
          </button>
        </form>
      </section>

      <section>
        <h2>Current event</h2>
        <label>
          Select event
          <select value={selectedEventId} onChange={(e) => setSelectedEventId(e.target.value)}>
            <option value="">Choose an event</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.name} ({new Date(event.startsAt).toLocaleDateString()})
              </option>
            ))}
          </select>
        </label>
        {selectedEvent ? (
          <div className="admin-kpi-grid admin-mt-md">
            <article className="admin-kpi-card">
              <p className="admin-kpi-label">Registrations</p>
              <p className="admin-kpi-value">{totals.registrations}</p>
            </article>
            <article className="admin-kpi-card">
              <p className="admin-kpi-label">Checked in</p>
              <p className="admin-kpi-value">{totals.checkedIn}</p>
            </article>
            <article className="admin-kpi-card">
              <p className="admin-kpi-label">Pending</p>
              <p className="admin-kpi-value">{totals.pending}</p>
            </article>
            <article className="admin-kpi-card">
              <p className="admin-kpi-label">Attendance rate</p>
              <p className="admin-kpi-value">{totals.attendanceRate}%</p>
            </article>
          </div>
        ) : null}
      </section>

      {selectedEvent ? (
        <>
          <section>
            <h2>Onsite desk</h2>
            <p className="admin-muted">Use the camera scanner page for high-throughput check-ins and offline sync queue.</p>
            <div className="admin-inline-actions">
              <Link href="/admin/events/checkin" className="admin-quick-action">
                Open scanner desk
              </Link>
              <Link href="/admin/events/onsite" className="admin-quick-action">
                Open onsite analytics
              </Link>
            </div>
          </section>

          <section>
            <h2>Register attendee</h2>
            <form className="admin-form" onSubmit={submitRegistration}>
              <label>
                Full name
                <input
                  required
                  value={registrationForm.attendeeFullName}
                  onChange={(e) => setRegistrationForm((p) => ({ ...p, attendeeFullName: e.target.value }))}
                />
              </label>
              <label>
                Email
                <input
                  required
                  type="email"
                  value={registrationForm.attendeeEmail}
                  onChange={(e) => setRegistrationForm((p) => ({ ...p, attendeeEmail: e.target.value }))}
                />
              </label>
              <label>
                Phone
                <input
                  value={registrationForm.attendeePhone}
                  onChange={(e) => setRegistrationForm((p) => ({ ...p, attendeePhone: e.target.value }))}
                />
              </label>
              <label>
                Organization
                <input
                  value={registrationForm.organization}
                  onChange={(e) => setRegistrationForm((p) => ({ ...p, organization: e.target.value }))}
                />
              </label>
              <label>
                Role/title
                <input
                  value={registrationForm.roleTitle}
                  onChange={(e) => setRegistrationForm((p) => ({ ...p, roleTitle: e.target.value }))}
                />
              </label>
              <button disabled={busy} type="submit">
                {busy ? "Saving..." : "Register attendee + issue QR"}
              </button>
            </form>
            {latestQrDataUrl ? (
              <div className="admin-mt-md">
                <p className="admin-muted">
                  Last issued QR token: <code>{latestQrToken}</code>
                </p>
                <Image className="admin-image-qr" src={latestQrDataUrl} alt="Attendee QR code" width={210} height={210} />
                <p className="admin-muted admin-break-words admin-mt-sm">Payload: {latestQrPayload}</p>
              </div>
            ) : null}
          </section>

          <section>
            <h2>Check-in desk</h2>
            <form className="admin-form" onSubmit={submitCheckIn}>
              <label>
                QR payload JSON (preferred)
                <textarea
                  rows={4}
                  value={checkInForm.qrPayload}
                  onChange={(e) => setCheckInForm((p) => ({ ...p, qrPayload: e.target.value }))}
                />
              </label>
              <p className="admin-muted">Or enter registration ID + token manually.</p>
              <label>
                Registration ID
                <input value={checkInForm.registrationId} onChange={(e) => setCheckInForm((p) => ({ ...p, registrationId: e.target.value }))} />
              </label>
              <label>
                QR token
                <input value={checkInForm.qrToken} onChange={(e) => setCheckInForm((p) => ({ ...p, qrToken: e.target.value }))} />
              </label>
              <label>
                Location
                <input value={checkInForm.location} onChange={(e) => setCheckInForm((p) => ({ ...p, location: e.target.value }))} />
              </label>
              <label>
                Device label
                <input
                  value={checkInForm.deviceLabel}
                  onChange={(e) => setCheckInForm((p) => ({ ...p, deviceLabel: e.target.value }))}
                />
              </label>
              <button disabled={busy} type="submit">
                {busy ? "Processing..." : "Check in attendee"}
              </button>
            </form>
          </section>

          <section>
            <h2>Registrations</h2>
            <AdminDataTable
              rows={registrations}
              columns={registrationColumns}
              rowKey={(row) => row.id}
              rowSearchText={(row) => `${row.attendeeFullName} ${row.attendeeEmail} ${row.organization ?? ""} ${row.qrTokenHint}`}
              searchPlaceholder="Search registrations"
              persistKey="event_registrations"
              pageSize={10}
              exportFilename={`${selectedEvent.slug}-registrations.csv`}
              exportRow={(row) => ({
                fullName: row.attendeeFullName,
                email: row.attendeeEmail,
                status: row.status,
                organization: row.organization ?? "",
                qrHint: row.qrTokenHint,
                checkedInAt: row.checkedInAt ?? "",
              })}
            />
          </section>

          <section>
            <h2>Latest check-ins</h2>
            <AdminDataTable
              rows={checkIns}
              columns={checkInColumns}
              rowKey={(row) => row.id}
              rowSearchText={(row) => `${row.registration.attendeeFullName} ${row.registration.attendeeEmail} ${row.location ?? ""}`}
              searchPlaceholder="Search check-ins"
              persistKey="event_checkins"
              pageSize={10}
              exportFilename={`${selectedEvent.slug}-checkins.csv`}
              exportRow={(row) => ({
                attendee: row.registration.attendeeFullName,
                email: row.registration.attendeeEmail,
                method: row.method,
                location: row.location ?? "",
                at: row.createdAt,
                by: row.checkedInBy?.fullName ?? row.checkedInBy?.email ?? "",
              })}
            />
          </section>

          <section>
            <h2>Badge print logs</h2>
            <AdminDataTable
              rows={badgePrints}
              columns={[
                {
                  key: "attendee",
                  header: "Attendee",
                  sortValue: (row) => row.registration.attendeeFullName,
                  cell: (row) => row.registration.attendeeFullName,
                },
                {
                  key: "time",
                  header: "Printed at",
                  sortValue: (row) => row.createdAt,
                  cell: (row) => new Date(row.createdAt).toLocaleString(),
                },
                {
                  key: "printer",
                  header: "Printer",
                  sortValue: (row) => row.printerLabel ?? "",
                  cell: (row) => row.printerLabel ?? "—",
                },
              ]}
              rowKey={(row) => row.id}
              rowSearchText={(row) => `${row.registration.attendeeFullName} ${row.registration.attendeeEmail} ${row.printerLabel ?? ""}`}
              searchPlaceholder="Search badge logs"
              persistKey="event_badge_logs"
              pageSize={10}
              exportFilename={`${selectedEvent.slug}-badge-prints.csv`}
              exportRow={(row) => ({
                attendee: row.registration.attendeeFullName,
                email: row.registration.attendeeEmail,
                printedAt: row.createdAt,
                printer: row.printerLabel ?? "",
                by: row.printedBy?.fullName ?? row.printedBy?.email ?? "",
                note: row.note ?? "",
              })}
            />
          </section>
        </>
      ) : null}
    </main>
  );
}
