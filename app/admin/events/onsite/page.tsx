'use client'

import { useEffect, useMemo, useState } from "react";
import AdminActionModal from "@/components/admin/AdminActionModal";
import { fetchJsonOrThrow, toErrorMessage } from "@/components/admin/admin-api";
import useAdminAsyncAction from "@/components/admin/useAdminAsyncAction";
import useAdminFeedback from "@/components/admin/useAdminFeedback";
import AdminToastViewport from "@/components/admin/AdminToastViewport";

type EventRow = {
  id: string;
  name: string;
  startsAt: string;
};

type OnsiteReport = {
  totals: {
    registrations: number;
    checkedIn: number;
    pending: number;
    attendanceRate: number;
    badgePrints: number;
    attempts24h: number;
    failedAttempts24h: number;
    successfulAttempts24h: number;
    incidentsOpen: number;
    incidentsResolved24h: number;
    incidentsBreachedAck: number;
    incidentsBreachedResolve: number;
    avgResolveMinutes: number;
  };
  byLocation: Array<{ name: string; count: number }>;
  byDevice: Array<{ name: string; count: number }>;
  hourlyThroughput: Array<{ hourIso: string; count: number }>;
  topFailureReasons: Array<{ reason: string; count: number }>;
  bySource: Array<{ source: string; count: number }>;
  heavyReprints: Array<{ registrationId: string; count: number }>;
  incidents: Array<{
    id: string;
    title: string;
    category: string;
    severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    status: "OPEN" | "IN_REVIEW" | "RESOLVED";
    location: string | null;
    createdAt: string;
    resolvedAt: string | null;
    slaState: "ON_TRACK" | "ACK_BREACHED" | "RESOLVE_BREACHED" | "RESOLVED_LATE";
  }>;
};

type IncidentRow = {
  id: string;
  title: string;
  category: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: "OPEN" | "IN_REVIEW" | "RESOLVED";
  location: string | null;
  deviceLabel: string | null;
  detail: string | null;
  createdAt: string;
  resolvedAt: string | null;
  slaState: "ON_TRACK" | "ACK_BREACHED" | "RESOLVE_BREACHED" | "RESOLVED_LATE";
};

type Role = "SUPER_ADMIN" | "PROGRAM_MANAGER" | "AUDITOR" | "JUDGE" | "ENTRANT";
type OpsReadiness = {
  eventId: string;
  score: number;
  status: "ready" | "needs_attention" | "blocked";
  checks: Array<{
    id: string;
    level: "ok" | "warn" | "blocker";
    title: string;
    detail: string;
  }>;
};

function incidentAgeLabel(createdAt: string): string {
  const ms = Math.max(0, Date.now() - new Date(createdAt).getTime());
  const minutes = Math.floor(ms / 60000);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const rem = minutes % 60;
  return `${hours}h ${rem}m`;
}

export default function EventOnsiteAnalyticsPage() {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [eventId, setEventId] = useState("");
  const [report, setReport] = useState<OnsiteReport | null>(null);
  const [readiness, setReadiness] = useState<OpsReadiness | null>(null);
  const [incidents, setIncidents] = useState<IncidentRow[]>([]);
  const [userRole, setUserRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(false);
  const [incidentForm, setIncidentForm] = useState({
    title: "",
    category: "Queue backlog",
    severity: "MEDIUM" as "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
    detail: "",
    location: "Main entrance",
    deviceLabel: "",
  });
  const [resolveModal, setResolveModal] = useState<{ incidentId: string; note: string } | null>(null);
  const { isBusy: incidentBusy, withBusy } = useAdminAsyncAction();
  const { toasts, dismissToast, setSuccessMessage: setMessage, setErrorMessage: setError } = useAdminFeedback();

  const selectedEvent = useMemo(() => events.find((e) => e.id === eventId) ?? null, [events, eventId]);
  const canManageIncidents = userRole === "PROGRAM_MANAGER" || userRole === "SUPER_ADMIN";

  async function loadIncidents(currentEventId: string) {
    const data = await fetchJsonOrThrow<{ incidents?: IncidentRow[]; userRole?: Role }>(
      `/api/events/${currentEventId}/onsite-incidents`,
      { cache: "no-store" },
      "Could not load incidents"
    );
    setIncidents((data.incidents ?? []) as IncidentRow[]);
    setUserRole((data.userRole ?? null) as Role | null);
  }

  async function loadReadiness(currentEventId: string) {
    const data = await fetchJsonOrThrow<{ readiness?: OpsReadiness }>(
      `/api/events/${currentEventId}/ops-readiness`,
      { cache: "no-store" },
      "Could not load readiness"
    );
    setReadiness((data.readiness ?? null) as OpsReadiness | null);
  }

  useEffect(() => {
    void (async () => {
      try {
        const data = await fetchJsonOrThrow<{ events?: EventRow[] }>("/api/events", { cache: "no-store" }, "Could not load events");
        const rows = (data.events ?? []) as EventRow[];
        setEvents(rows);
        if (rows[0]?.id) setEventId(rows[0].id);
      } catch (err) {
        setError(toErrorMessage(err, "Could not load events"));
      }
    })();
  }, [setError]);

  useEffect(() => {
    if (!eventId) return;
    setLoading(true);
    setError(null);
    void (async () => {
      try {
        const [reportData] = await Promise.all([
          fetchJsonOrThrow<OnsiteReport>(`/api/events/${eventId}/onsite-report`, { cache: "no-store" }, "Could not load onsite analytics"),
          loadIncidents(eventId),
          loadReadiness(eventId),
        ]);
        setReport(reportData);
      } catch (err) {
        setError(toErrorMessage(err, "Could not load onsite analytics"));
      } finally {
        setLoading(false);
      }
    })();
  }, [eventId, setError]);

  async function createIncident() {
    if (!eventId || !canManageIncidents) return;
    setError(null);
    setMessage(null);
    await withBusy(async () => {
      try {
        await fetchJsonOrThrow(
          `/api/events/${eventId}/onsite-incidents`,
          {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(incidentForm),
          },
          "Could not create incident"
        );
        setMessage("Incident logged");
        setIncidentForm((prev) => ({ ...prev, title: "", detail: "", deviceLabel: "" }));
        await loadIncidents(eventId);
      } catch (err) {
        setError(toErrorMessage(err, "Could not create incident"));
      }
    });
  }

  async function updateIncidentStatus(incidentId: string, status: "IN_REVIEW" | "RESOLVED") {
    if (!eventId || !canManageIncidents) return;
    const resolutionNote = status === "RESOLVED" ? resolveModal?.note?.trim() || "Resolved by onsite operations" : undefined;
    setError(null);
    setMessage(null);
    await withBusy(async () => {
      try {
        await fetchJsonOrThrow(
          `/api/events/${eventId}/onsite-incidents/${incidentId}`,
          {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status, resolutionNote }),
          },
          "Could not update incident"
        );
        setMessage(status === "RESOLVED" ? "Incident resolved" : "Incident marked in review");
        if (status === "RESOLVED") {
          setResolveModal(null);
        }
        await loadIncidents(eventId);
      } catch (err) {
        setError(toErrorMessage(err, "Could not update incident"));
      }
    });
  }

  return (
    <main>
      <h1>Onsite analytics</h1>
      <p className="admin-muted">Live operational visibility for throughput, scanner quality, and reprint risk.</p>
      <AdminToastViewport toasts={toasts} onClose={dismissToast} />
      <AdminActionModal
        open={Boolean(resolveModal)}
        title="Resolve incident"
        description="Add a resolution note and confirm incident closure."
        onClose={() => setResolveModal(null)}
      >
        <form
          className="admin-form"
          onSubmit={(event) => {
            event.preventDefault();
            if (!resolveModal) return;
            void updateIncidentStatus(resolveModal.incidentId, "RESOLVED");
          }}
        >
          <label>
            Resolution note
            <textarea
              rows={3}
              value={resolveModal?.note ?? ""}
              onChange={(e) =>
                setResolveModal((current) => (current ? { ...current, note: e.target.value } : current))
              }
            />
          </label>
          <div className="admin-inline-actions">
            <button type="submit" disabled={incidentBusy}>
              {incidentBusy ? "Saving..." : "Resolve incident"}
            </button>
            <button type="button" onClick={() => setResolveModal(null)} disabled={incidentBusy}>
              Cancel
            </button>
          </div>
        </form>
      </AdminActionModal>

      <section>
        <label>
          Event
          <select value={eventId} onChange={(e) => setEventId(e.target.value)}>
            <option value="">Select event</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.name} ({new Date(event.startsAt).toLocaleDateString()})
              </option>
            ))}
          </select>
        </label>
        {eventId ? (
          <div className="admin-inline-actions" style={{ marginTop: 10 }}>
            <a className="admin-quick-action" href={`/api/events/${eventId}/onsite-report?format=csv`}>
              Export onsite report (CSV)
            </a>
            <a className="admin-quick-action" href={`/api/events/${eventId}/onsite-report/shift-summary`} target="_blank" rel="noreferrer">
              Download shift summary (PDF)
            </a>
            <a className="admin-quick-action" href={`/api/events/${eventId}/onsite-report/bundle`}>
              Download export bundle (ZIP)
            </a>
          </div>
        ) : null}
      </section>

      {loading ? <p className="admin-muted">Loading onsite analytics...</p> : null}

      {selectedEvent && report ? (
        <>
          <section>
            <h2>Operations readiness</h2>
            {readiness ? (
              <>
                <div className="admin-kpi-grid">
                  <article className="admin-kpi-card">
                    <p className="admin-kpi-label">Readiness score</p>
                    <p className="admin-kpi-value">{readiness.score}</p>
                  </article>
                  <article className="admin-kpi-card">
                    <p className="admin-kpi-label">Status</p>
                    <p className="admin-kpi-value">{readiness.status}</p>
                  </article>
                </div>
                <div className="admin-table-wrap" style={{ marginTop: 12 }}>
                  <table>
                    <thead>
                      <tr>
                        <th>Check</th>
                        <th>Level</th>
                        <th>Detail</th>
                      </tr>
                    </thead>
                    <tbody>
                      {readiness.checks.map((check) => (
                        <tr key={check.id}>
                          <td>{check.title}</td>
                          <td>{check.level}</td>
                          <td>{check.detail}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <p className="admin-muted">Loading readiness checks...</p>
            )}
          </section>

          <section>
            <h2>Overview</h2>
            <div className="admin-kpi-grid">
              <article className="admin-kpi-card"><p className="admin-kpi-label">Registrations</p><p className="admin-kpi-value">{report.totals.registrations}</p></article>
              <article className="admin-kpi-card"><p className="admin-kpi-label">Checked in</p><p className="admin-kpi-value">{report.totals.checkedIn}</p></article>
              <article className="admin-kpi-card"><p className="admin-kpi-label">Pending</p><p className="admin-kpi-value">{report.totals.pending}</p></article>
              <article className="admin-kpi-card"><p className="admin-kpi-label">Attendance %</p><p className="admin-kpi-value">{report.totals.attendanceRate}%</p></article>
              <article className="admin-kpi-card"><p className="admin-kpi-label">Attempts (24h)</p><p className="admin-kpi-value">{report.totals.attempts24h}</p></article>
              <article className="admin-kpi-card"><p className="admin-kpi-label">Failed (24h)</p><p className="admin-kpi-value">{report.totals.failedAttempts24h}</p></article>
              <article className="admin-kpi-card"><p className="admin-kpi-label">Open incidents</p><p className="admin-kpi-value">{report.totals.incidentsOpen}</p></article>
              <article className="admin-kpi-card"><p className="admin-kpi-label">Resolved (24h)</p><p className="admin-kpi-value">{report.totals.incidentsResolved24h}</p></article>
              <article className="admin-kpi-card"><p className="admin-kpi-label">Ack SLA breaches</p><p className="admin-kpi-value">{report.totals.incidentsBreachedAck}</p></article>
              <article className="admin-kpi-card"><p className="admin-kpi-label">Resolve SLA breaches</p><p className="admin-kpi-value">{report.totals.incidentsBreachedResolve}</p></article>
              <article className="admin-kpi-card"><p className="admin-kpi-label">Avg resolve (min)</p><p className="admin-kpi-value">{report.totals.avgResolveMinutes}</p></article>
            </div>
          </section>

          <section>
            <h2>Gate throughput by location</h2>
            <div className="admin-table-wrap">
              <table>
                <thead><tr><th>Location</th><th>Check-ins</th></tr></thead>
                <tbody>
                  {report.byLocation.map((row) => (
                    <tr key={row.name}><td>{row.name}</td><td>{row.count}</td></tr>
                  ))}
                  {report.byLocation.length === 0 ? <tr><td colSpan={2}>No data yet.</td></tr> : null}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2>Scanner quality</h2>
            <div className="admin-table-wrap">
              <table>
                <thead><tr><th>Failure reason</th><th>Count (24h)</th></tr></thead>
                <tbody>
                  {report.topFailureReasons.map((row) => (
                    <tr key={row.reason}><td>{row.reason}</td><td>{row.count}</td></tr>
                  ))}
                  {report.topFailureReasons.length === 0 ? <tr><td colSpan={2}>No failures recorded in last 24h.</td></tr> : null}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2>High reprint watchlist</h2>
            <div className="admin-table-wrap">
              <table>
                <thead><tr><th>Registration ID</th><th>Reprints</th></tr></thead>
                <tbody>
                  {report.heavyReprints.map((row) => (
                    <tr key={row.registrationId}><td>{row.registrationId}</td><td>{row.count}</td></tr>
                  ))}
                  {report.heavyReprints.length === 0 ? <tr><td colSpan={2}>No high-reprint attendees.</td></tr> : null}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2>Incident log</h2>
            {canManageIncidents ? (
              <form
                className="admin-form"
                onSubmit={(event) => {
                  event.preventDefault();
                  void createIncident();
                }}
              >
                <label>
                  Title
                  <input
                    required
                    value={incidentForm.title}
                    onChange={(e) => setIncidentForm((prev) => ({ ...prev, title: e.target.value }))}
                  />
                </label>
                <label>
                  Category
                  <input
                    required
                    value={incidentForm.category}
                    onChange={(e) => setIncidentForm((prev) => ({ ...prev, category: e.target.value }))}
                  />
                </label>
                <label>
                  Severity
                  <select
                    value={incidentForm.severity}
                    onChange={(e) =>
                      setIncidentForm((prev) => ({
                        ...prev,
                        severity: e.target.value as "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
                      }))
                    }
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="CRITICAL">CRITICAL</option>
                  </select>
                </label>
                <label>
                  Location
                  <input value={incidentForm.location} onChange={(e) => setIncidentForm((prev) => ({ ...prev, location: e.target.value }))} />
                </label>
                <label>
                  Device label
                  <input value={incidentForm.deviceLabel} onChange={(e) => setIncidentForm((prev) => ({ ...prev, deviceLabel: e.target.value }))} />
                </label>
                <label>
                  Detail
                  <textarea rows={3} value={incidentForm.detail} onChange={(e) => setIncidentForm((prev) => ({ ...prev, detail: e.target.value }))} />
                </label>
                <button type="submit" disabled={incidentBusy}>
                  {incidentBusy ? "Saving..." : "Log incident"}
                </button>
              </form>
            ) : (
              <p className="admin-muted">Read-only access: managers can create or resolve incidents.</p>
            )}

            <div className="admin-table-wrap" style={{ marginTop: 12 }}>
              <table>
                <thead>
                  <tr>
                    <th>Created</th>
                    <th>Severity</th>
                    <th>Status</th>
                    <th>SLA</th>
                    <th>Age</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Location</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {incidents.map((incident) => (
                    <tr key={incident.id}>
                      <td>{new Date(incident.createdAt).toLocaleString()}</td>
                      <td>{incident.severity}</td>
                      <td>{incident.status}</td>
                      <td>{incident.slaState}</td>
                      <td>{incidentAgeLabel(incident.createdAt)}</td>
                      <td>{incident.title}</td>
                      <td>{incident.category}</td>
                      <td>{incident.location ?? "—"}</td>
                      <td>
                        {canManageIncidents ? (
                          <div className="admin-inline-actions">
                            {incident.status === "OPEN" ? (
                              <button type="button" onClick={() => void updateIncidentStatus(incident.id, "IN_REVIEW")} disabled={incidentBusy}>
                                Mark in review
                              </button>
                            ) : null}
                            {incident.status !== "RESOLVED" ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setResolveModal({
                                      incidentId: incident.id,
                                      note: "Resolved by onsite operations",
                                    })
                                  }
                                  disabled={incidentBusy}
                                >
                                  Resolve
                                </button>
                              </>
                            ) : null}
                          </div>
                        ) : (
                          "—"
                        )}
                      </td>
                    </tr>
                  ))}
                  {incidents.length === 0 ? (
                    <tr>
                      <td colSpan={9}>No incidents logged.</td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </section>
        </>
      ) : null}
    </main>
  );
}
