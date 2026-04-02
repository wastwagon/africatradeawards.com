"use client";

import { useCallback, useEffect, useState } from "react";
import type { KeyboardEvent } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import AdminDataTable, { type AdminTableColumn } from "@/components/admin/AdminDataTable";

type Nomination = {
  id: string;
  status: string;
  nomineeFullName: string;
  nomineeEmail: string | null;
  nomineeOrganization: string | null;
  nomineeRoleTitle: string | null;
  summary: string;
  evidenceLinks: string | null;
  reviewNote: string | null;
  source: string;
  publicNominatorName: string | null;
  publicNominatorEmail: string | null;
  publicTrackingTokenExpiresAt: string | null;
  createdAt: string;
  nominator?: { id: string; fullName: string; email: string };
  program?: { id: string; name: string };
  season?: { id: string; year: number };
  category?: { id: string; name: string };
  convertedEntry?: { id: string; title: string; status: string } | null;
};
type NominationAuditRow = {
  id: string;
  action: string;
  createdAt: string;
  metadata: unknown;
  user: { id: string; fullName: string; email: string; role: string } | null;
};
type AuditFilter = "all" | "status" | "tracking" | "submission" | "conversion";
type SavedAuditView = {
  name: string;
  filter: AuditFilter;
  from: string;
  to: string;
  preset: "custom" | "24h" | "7d" | "30d";
};

function formatAuditMetadata(metadata: unknown): string {
  if (!metadata || typeof metadata !== "object") return "No extra metadata";
  const m = metadata as Record<string, unknown>;
  const pairs: Array<[string, unknown]> = [
    ["Nomination", m.nominationId],
    ["From status", m.previousStatus],
    ["To status", m.newStatus],
    ["Source", m.source],
    ["Nominator email", m.publicNominatorEmail],
    ["Nominee", m.nomineeFullName],
    ["Emailed", m.emailed],
    ["Expires", m.expiresAt],
    ["Entry", m.entryId],
  ];
  const parts = pairs
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .map(([label, value]) => `${label}: ${String(value)}`);
  return parts.length ? parts.join(" · ") : "No extra metadata";
}

function toLocalDateTimeInput(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

type ReviewAction = "under_review" | "shortlist" | "approve" | "reject";

export default function AdminNominationsPage() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [rows, setRows] = useState<Nomination[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [reviewNote, setReviewNote] = useState("");
  const [emailOnReset, setEmailOnReset] = useState(true);
  const [auditRows, setAuditRows] = useState<NominationAuditRow[]>([]);
  const [auditFilter, setAuditFilter] = useState<AuditFilter>("all");
  const [auditFrom, setAuditFrom] = useState("");
  const [auditTo, setAuditTo] = useState("");
  const [auditPreset, setAuditPreset] = useState<"custom" | "24h" | "7d" | "30d">("custom");
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditHasMore, setAuditHasMore] = useState(false);
  const [auditCursor, setAuditCursor] = useState<string | null>(null);
  const [auditViewName, setAuditViewName] = useState("");
  const [selectedAuditView, setSelectedAuditView] = useState("");
  const [savedAuditViews, setSavedAuditViews] = useState<SavedAuditView[]>([]);
  const [auditStorageKey, setAuditStorageKey] = useState("admin_nominations_audit_views");
  const [auditDefaultKey, setAuditDefaultKey] = useState("admin_nominations_audit_default");
  const [defaultAuditApplied, setDefaultAuditApplied] = useState(false);
  const [queryHydrated, setQueryHydrated] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/nominations", { cache: "no-store" });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(body.error ?? "Could not load nominations");
      return;
    }
    setRows(body.nominations ?? []);
    if (!selectedId && body.nominations?.[0]?.id) setSelectedId(body.nominations[0].id);
  }, [selectedId]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (queryHydrated) return;
    const qNominationId = (searchParams.get("nid") ?? "").trim();
    const qFilter = (searchParams.get("af") ?? "").trim().toLowerCase();
    const qFrom = (searchParams.get("afrom") ?? "").trim();
    const qTo = (searchParams.get("ato") ?? "").trim();
    const qPreset = (searchParams.get("apreset") ?? "").trim().toLowerCase();

    if (qNominationId) setSelectedId(qNominationId);
    if (qFilter === "all" || qFilter === "status" || qFilter === "tracking" || qFilter === "submission" || qFilter === "conversion") {
      setAuditFilter(qFilter);
    }
    if (qFrom) setAuditFrom(qFrom);
    if (qTo) setAuditTo(qTo);
    if (qPreset === "custom" || qPreset === "24h" || qPreset === "7d" || qPreset === "30d") {
      setAuditPreset(qPreset);
    }
    if (qNominationId || qFilter || qFrom || qTo || qPreset) {
      setDefaultAuditApplied(true);
    }
    setQueryHydrated(true);
  }, [queryHydrated, searchParams]);

  useEffect(() => {
    void (async () => {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      const body = await res.json().catch(() => ({}));
      const userId = body?.user?.id ? String(body.user.id) : "unknown";
      setAuditStorageKey(`admin_nominations_audit_views_${userId}`);
      setAuditDefaultKey(`admin_nominations_audit_default_${userId}`);
    })();
  }, []);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(auditStorageKey);
      if (!raw) {
        setSavedAuditViews([]);
        return;
      }
      const parsed = JSON.parse(raw) as SavedAuditView[];
      if (Array.isArray(parsed)) setSavedAuditViews(parsed);
    } catch {
      setSavedAuditViews([]);
    }
  }, [auditStorageKey]);

  useEffect(() => {
    window.localStorage.setItem(auditStorageKey, JSON.stringify(savedAuditViews.slice(0, 20)));
  }, [savedAuditViews, auditStorageKey]);

  const loadAudit = useCallback(
    async (mode: "replace" | "append") => {
      if (!selectedId) {
        setAuditRows([]);
        setAuditHasMore(false);
        setAuditCursor(null);
        return;
      }
      setAuditLoading(true);
      const params = new URLSearchParams();
      params.set("filter", auditFilter);
      if (auditFrom) params.set("from", auditFrom);
      if (auditTo) params.set("to", auditTo);
      params.set("limit", "20");
      if (mode === "append" && auditCursor) params.set("cursor", auditCursor);
      const res = await fetch(`/api/nominations/${selectedId}/audit?${params.toString()}`, { cache: "no-store" });
      const body = await res.json().catch(() => ({}));
      setAuditLoading(false);
      if (!res.ok) return;
      const rows = (body.logs ?? []) as NominationAuditRow[];
      setAuditRows((current) => (mode === "append" ? [...current, ...rows] : rows));
      setAuditHasMore(Boolean(body.hasMore));
      setAuditCursor(typeof body.nextCursor === "string" ? body.nextCursor : null);
    },
    [selectedId, auditFilter, auditFrom, auditTo, auditCursor],
  );

  useEffect(() => {
    void loadAudit("replace");
  }, [loadAudit]);

  async function applyAction(action: ReviewAction) {
    if (!selectedId) return;
    setBusy(true);
    setError(null);
    setMessage(null);
    const res = await fetch(`/api/nominations/${selectedId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, reviewNote }),
    });
    const body = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      setError(body.error ?? "Could not update nomination");
      return;
    }
    setMessage(`Nomination moved to ${body.nomination?.status ?? action}.`);
    await load();
  }

  async function convertToEntry() {
    if (!selectedId) return;
    setBusy(true);
    setError(null);
    setMessage(null);
    const res = await fetch(`/api/nominations/${selectedId}/convert`, { method: "POST" });
    const body = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      setError(body.error ?? "Could not convert nomination");
      return;
    }
    setMessage(`Converted to entry: ${body.entry?.title ?? "entry"}`);
    await load();
  }

  async function manageTrackingLink(action: "reset" | "revoke") {
    if (!selectedId) return;
    setBusy(true);
    setError(null);
    setMessage(null);
    const res = await fetch(`/api/nominations/${selectedId}/tracking-link`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action,
        emailNominator: action === "reset" ? emailOnReset : false,
      }),
    });
    const body = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      setError(body.error ?? "Could not manage tracking link");
      return;
    }
    if (action === "reset") {
      setMessage(
        body.trackingUrl
          ? `Tracking link reset. ${emailOnReset ? "Email sent if address exists." : "Share this link manually: " + body.trackingUrl}`
          : "Tracking link reset.",
      );
    } else {
      setMessage("Tracking link revoked.");
    }
    await load();
  }

  const columns: AdminTableColumn<Nomination>[] = [
    {
      key: "nominee",
      header: "Nominee",
      sortValue: (row) => row.nomineeFullName,
      cell: (row) => (
        <div>
          <strong>{row.nomineeFullName}</strong>
          <div className="admin-muted">{row.nomineeOrganization ?? "No organization"}</div>
        </div>
      ),
    },
    {
      key: "program",
      header: "Program",
      sortValue: (row) => row.program?.name ?? "",
      cell: (row) => `${row.program?.name ?? "-"} / ${row.category?.name ?? "-"} / ${row.season?.year ?? "-"}`,
    },
    { key: "status", header: "Status", sortValue: (row) => row.status, cell: (row) => row.status },
    {
      key: "nominator",
      header: "Nominator",
      sortValue: (row) => row.nominator?.fullName ?? row.nominator?.email ?? "",
      cell: (row) => row.nominator?.fullName ?? row.nominator?.email ?? row.publicNominatorName ?? row.publicNominatorEmail ?? "-",
    },
    { key: "source", header: "Source", sortValue: (row) => row.source, cell: (row) => row.source },
    {
      key: "tracking",
      header: "Tracking",
      sortValue: (row) => row.publicTrackingTokenExpiresAt ?? "",
      cell: (row) =>
        row.publicTrackingTokenExpiresAt
          ? `Active until ${new Date(row.publicTrackingTokenExpiresAt).toLocaleString()}`
          : "Not active",
    },
  ];

  const selectedRow = rows.find((row) => row.id === selectedId) ?? null;
  const filteredAuditRows = auditRows;

  const currentAuditSummary = [
    `Nomination: ${selectedId || "none"}`,
    `Filter: ${auditFilter}`,
    auditFrom ? `From: ${new Date(auditFrom).toLocaleString()}` : "From: any",
    auditTo ? `To: ${new Date(auditTo).toLocaleString()}` : "To: any",
    `Preset: ${auditPreset}`,
  ].join(" · ");

  function applyAuditPreset(preset: "custom" | "24h" | "7d" | "30d") {
    setAuditPreset(preset);
    if (preset === "custom") return;
    const now = new Date();
    const from = new Date(now);
    if (preset === "24h") from.setHours(now.getHours() - 24);
    if (preset === "7d") from.setDate(now.getDate() - 7);
    if (preset === "30d") from.setDate(now.getDate() - 30);
    setAuditFrom(toLocalDateTimeInput(from));
    setAuditTo(toLocalDateTimeInput(now));
  }

  function saveAuditView() {
    const name = auditViewName.trim();
    if (!name) {
      setError("Provide a view name before saving.");
      return;
    }
    setSavedAuditViews((current) => {
      const next: SavedAuditView = {
        name,
        filter: auditFilter,
        from: auditFrom,
        to: auditTo,
        preset: auditPreset,
      };
      const withoutSame = current.filter((view) => view.name !== name);
      return [next, ...withoutSame];
    });
    setSelectedAuditView(name);
    setAuditViewName("");
    setMessage(`Saved audit view: ${name}`);
  }

  function applySavedAuditView(name: string) {
    const view = savedAuditViews.find((item) => item.name === name);
    if (!view) return;
    setAuditFilter(view.filter);
    setAuditFrom(view.from);
    setAuditTo(view.to);
    setAuditPreset(view.preset);
    setSelectedAuditView(name);
    setMessage(`Loaded audit view: ${name}`);
  }

  function deleteSavedAuditView() {
    if (!selectedAuditView) return;
    setSavedAuditViews((current) => current.filter((view) => view.name !== selectedAuditView));
    if (window.localStorage.getItem(auditDefaultKey) === selectedAuditView) {
      window.localStorage.removeItem(auditDefaultKey);
    }
    setMessage(`Deleted audit view: ${selectedAuditView}`);
    setSelectedAuditView("");
  }

  function setDefaultAuditView() {
    if (!selectedAuditView) return;
    window.localStorage.setItem(auditDefaultKey, selectedAuditView);
    setMessage(`Default audit view set: ${selectedAuditView}`);
  }

  function clearDefaultAuditView() {
    window.localStorage.removeItem(auditDefaultKey);
    setMessage("Default audit view cleared.");
  }

  useEffect(() => {
    if (defaultAuditApplied) return;
    if (!savedAuditViews.length) return;
    const defaultName = window.localStorage.getItem(auditDefaultKey);
    if (!defaultName) return;
    const view = savedAuditViews.find((item) => item.name === defaultName);
    if (!view) return;
    setAuditFilter(view.filter);
    setAuditFrom(view.from);
    setAuditTo(view.to);
    setAuditPreset(view.preset);
    setSelectedAuditView(defaultName);
    setDefaultAuditApplied(true);
  }, [auditDefaultKey, defaultAuditApplied, savedAuditViews]);

  function exportAuditCsv() {
    if (!selectedId || filteredAuditRows.length === 0) return;
    const headers = ["action", "createdAt", "actorName", "actorEmail", "actorRole", "metadataSummary"];
    const escapeCell = (value: unknown) => {
      const text = value == null ? "" : String(value);
      const escaped = text.replace(/"/g, '""');
      return /[",\n]/.test(escaped) ? `"${escaped}"` : escaped;
    };
    const lines = [
      headers.join(","),
      ...filteredAuditRows.map((item) =>
        [
          item.action,
          item.createdAt,
          item.user?.fullName ?? "",
          item.user?.email ?? "",
          item.user?.role ?? "",
          formatAuditMetadata(item.metadata),
        ]
          .map((value) => escapeCell(value))
          .join(","),
      ),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nomination-${selectedId}-audit.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  async function copyShareableLink() {
    const params = new URLSearchParams();
    if (selectedId) params.set("nid", selectedId);
    params.set("af", auditFilter);
    if (auditFrom) params.set("afrom", auditFrom);
    if (auditTo) params.set("ato", auditTo);
    params.set("apreset", auditPreset);
    const relative = `${pathname}?${params.toString()}`;
    const absolute =
      typeof window !== "undefined" ? `${window.location.origin}${relative}` : relative;

    try {
      await navigator.clipboard.writeText(absolute);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 1500);
    } catch {
      setError("Could not copy link. Please copy URL from your browser.");
    }
  }

  function buildShareableLink(): string {
    const params = new URLSearchParams();
    if (selectedId) params.set("nid", selectedId);
    params.set("af", auditFilter);
    if (auditFrom) params.set("afrom", auditFrom);
    if (auditTo) params.set("ato", auditTo);
    params.set("apreset", auditPreset);
    const relative = `${pathname}?${params.toString()}`;
    return typeof window !== "undefined" ? `${window.location.origin}${relative}` : relative;
  }

  function openShareableLinkInNewTab() {
    const url = buildShareableLink();
    if (typeof window !== "undefined") {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  }

  function resetSharedView() {
    setAuditFilter("all");
    setAuditPreset("custom");
    setAuditFrom("");
    setAuditTo("");
    setSelectedId("");
    setMessage("Share parameters reset to default.");
  }

  function handleAuditShortcutKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (!selectedId) return;
    if (event.metaKey || event.ctrlKey || event.altKey || event.defaultPrevented) return;
    const target = event.target as HTMLElement | null;
    const tag = target?.tagName?.toLowerCase();
    if (tag === "input" || tag === "textarea" || tag === "select" || target?.isContentEditable) return;

    const key = event.key.toLowerCase();
    if (key === "c") {
      event.preventDefault();
      void copyShareableLink();
      return;
    }
    if (key === "o") {
      event.preventDefault();
      openShareableLinkInNewTab();
      return;
    }
    if (key === "r") {
      event.preventDefault();
      resetSharedView();
    }
  }

  return (
    <main>
      <h1>Nominations</h1>
      <p>Review nominations, add review notes, set outcome, and convert approved nominations to entries.</p>
      {error ? <p className="admin-error">{error}</p> : null}
      {message ? <p className="admin-ok">{message}</p> : null}

      <section>
        <h2>Review actions</h2>
        <label>
          Select nomination
          <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
            <option value="">Select nomination</option>
            {rows.map((row) => (
              <option key={row.id} value={row.id}>
                {row.nomineeFullName} ({row.status})
              </option>
            ))}
          </select>
        </label>
        <label>
          Review note
          <textarea value={reviewNote} onChange={(e) => setReviewNote(e.target.value)} rows={3} />
        </label>
        <div className="admin-inline-actions">
          <button type="button" disabled={busy || !selectedId} onClick={() => void applyAction("under_review")}>
            Mark under review
          </button>
          <button type="button" disabled={busy || !selectedId} onClick={() => void applyAction("shortlist")}>
            Mark shortlisted
          </button>
          <button type="button" disabled={busy || !selectedId} onClick={() => void applyAction("approve")}>
            Approve
          </button>
          <button type="button" disabled={busy || !selectedId} onClick={() => void applyAction("reject")}>
            Reject
          </button>
          <button type="button" disabled={busy || !selectedId} onClick={() => void convertToEntry()}>
            Convert to entry
          </button>
        </div>
        <div className="admin-inline-actions" style={{ marginTop: 8 }}>
          <label style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
            <input type="checkbox" checked={emailOnReset} onChange={(e) => setEmailOnReset(e.target.checked)} />
            Email nominator when resetting link
          </label>
          <button type="button" disabled={busy || !selectedId} onClick={() => void manageTrackingLink("reset")}>
            Reset tracking link
          </button>
          <button type="button" disabled={busy || !selectedId} onClick={() => void manageTrackingLink("revoke")}>
            Revoke tracking link
          </button>
        </div>
        {selectedRow ? (
          <p className="admin-muted" style={{ marginTop: 8 }}>
            Tracking status:{" "}
            {selectedRow.publicTrackingTokenExpiresAt
              ? `Active until ${new Date(selectedRow.publicTrackingTokenExpiresAt).toLocaleString()}`
              : "No active tracking link"}
          </p>
        ) : null}
      </section>

      <section>
        <h2>Nomination queue</h2>
        <AdminDataTable
          rows={rows}
          columns={columns}
          rowKey={(row) => row.id}
          rowSearchText={(row) =>
            [
              row.nomineeFullName,
              row.nomineeEmail,
              row.nomineeOrganization,
              row.status,
              row.nominator?.fullName,
              row.nominator?.email,
              row.publicNominatorName,
              row.publicNominatorEmail,
              row.source,
              row.program?.name,
              row.category?.name,
              row.season?.year,
            ]
              .filter(Boolean)
              .join(" ")
          }
          searchPlaceholder="Search nominee, status, nominator, program, category, season"
          persistKey="nominations"
          pageSize={12}
          exportFilename="nominations.csv"
          exportRow={(row) => ({
            nominee: row.nomineeFullName,
            nomineeEmail: row.nomineeEmail ?? "",
            nomineeOrganization: row.nomineeOrganization ?? "",
            status: row.status,
            nominator: row.nominator?.fullName ?? row.nominator?.email ?? "",
            program: row.program?.name ?? "",
            category: row.category?.name ?? "",
            season: row.season?.year ?? "",
            convertedEntry: row.convertedEntry?.title ?? "",
          })}
        />
      </section>
      <section
        tabIndex={0}
        onKeyDown={handleAuditShortcutKeyDown}
        aria-label="Audit timeline panel. Keyboard shortcuts: C copy link, O open link, R reset shared parameters."
      >
        <h2>Audit timeline</h2>
        <p className="admin-muted">{currentAuditSummary}</p>
        <p className="admin-muted">Shortcuts while this panel is focused: C copy, O open, R reset.</p>
        {!selectedId ? <p className="admin-muted">Select a nomination to view audit history.</p> : null}
        {selectedId && auditRows.length === 0 ? <p className="admin-muted">No audit records found.</p> : null}
        {auditRows.length > 0 ? (
          <>
            <div className="admin-segment">
              <button type="button" className={auditFilter === "all" ? "is-active" : undefined} onClick={() => setAuditFilter("all")}>
                All
              </button>
              <button
                type="button"
                className={auditFilter === "status" ? "is-active" : undefined}
                onClick={() => setAuditFilter("status")}
              >
                Status
              </button>
              <button
                type="button"
                className={auditFilter === "tracking" ? "is-active" : undefined}
                onClick={() => setAuditFilter("tracking")}
              >
                Tracking links
              </button>
              <button
                type="button"
                className={auditFilter === "submission" ? "is-active" : undefined}
                onClick={() => setAuditFilter("submission")}
              >
                Submission
              </button>
              <button
                type="button"
                className={auditFilter === "conversion" ? "is-active" : undefined}
                onClick={() => setAuditFilter("conversion")}
              >
                Conversion
              </button>
            </div>
            <div className="admin-inline-actions" style={{ marginBottom: 10 }}>
              <input
                value={auditViewName}
                onChange={(e) => setAuditViewName(e.target.value)}
                placeholder="Save filter as..."
                aria-label="Audit view name"
              />
              <button type="button" onClick={saveAuditView}>
                Save view
              </button>
              <select
                value={selectedAuditView}
                onChange={(e) => setSelectedAuditView(e.target.value)}
                aria-label="Saved audit views"
              >
                <option value="">Saved audit views</option>
                {savedAuditViews.map((view) => (
                  <option key={view.name} value={view.name}>
                    {view.name}
                  </option>
                ))}
              </select>
              <button type="button" disabled={!selectedAuditView} onClick={() => applySavedAuditView(selectedAuditView)}>
                Load view
              </button>
              <button type="button" disabled={!selectedAuditView} onClick={setDefaultAuditView}>
                Set default
              </button>
              <button type="button" onClick={clearDefaultAuditView}>
                Clear default
              </button>
              <button type="button" disabled={!selectedAuditView} onClick={deleteSavedAuditView}>
                Delete view
              </button>
            </div>
            <div className="admin-inline-actions" style={{ marginBottom: 10 }}>
              <div className="admin-segment" style={{ marginBottom: 0 }}>
                <button
                  type="button"
                  className={auditPreset === "24h" ? "is-active" : undefined}
                  onClick={() => applyAuditPreset("24h")}
                >
                  Last 24h
                </button>
                <button
                  type="button"
                  className={auditPreset === "7d" ? "is-active" : undefined}
                  onClick={() => applyAuditPreset("7d")}
                >
                  Last 7d
                </button>
                <button
                  type="button"
                  className={auditPreset === "30d" ? "is-active" : undefined}
                  onClick={() => applyAuditPreset("30d")}
                >
                  Last 30d
                </button>
                <button
                  type="button"
                  className={auditPreset === "custom" ? "is-active" : undefined}
                  onClick={() => applyAuditPreset("custom")}
                >
                  Custom
                </button>
              </div>
              <label>
                From
                <input
                  type="datetime-local"
                  value={auditFrom}
                  onChange={(e) => {
                    setAuditPreset("custom");
                    setAuditFrom(e.target.value);
                  }}
                />
              </label>
              <label>
                To
                <input
                  type="datetime-local"
                  value={auditTo}
                  onChange={(e) => {
                    setAuditPreset("custom");
                    setAuditTo(e.target.value);
                  }}
                />
              </label>
              <button type="button" onClick={() => {
                setAuditPreset("custom");
                setAuditFrom("");
                setAuditTo("");
              }}>
                Clear dates
              </button>
              <button type="button" onClick={() => void loadAudit("replace")} disabled={auditLoading}>
                {auditLoading ? "Loading..." : "Apply filters"}
              </button>
              <button type="button" onClick={exportAuditCsv} disabled={!selectedId || filteredAuditRows.length === 0}>
                Export timeline CSV
              </button>
              <details className="admin-row-menu">
                <summary>Share</summary>
                <div className="admin-row-menu__panel">
                  <button type="button" onClick={() => void copyShareableLink()}>
                    {linkCopied ? "Link copied" : "Copy shareable link"}
                  </button>
                  <button type="button" onClick={openShareableLinkInNewTab}>
                    Open shareable link
                  </button>
                  <button type="button" onClick={resetSharedView}>
                    Reset shared params
                  </button>
                </div>
              </details>
            </div>
          <ul className="admin-link-list">
            {filteredAuditRows.map((item) => (
              <li key={item.id}>
                <strong>{item.action}</strong> — {new Date(item.createdAt).toLocaleString()} by{" "}
                {item.user?.fullName || item.user?.email || "system"}
                <div className="admin-muted" style={{ marginTop: 4 }}>
                  {formatAuditMetadata(item.metadata)}
                </div>
              </li>
            ))}
          </ul>
            {auditHasMore ? (
              <div className="admin-inline-actions" style={{ marginTop: 10 }}>
                <button type="button" onClick={() => void loadAudit("append")} disabled={auditLoading}>
                  {auditLoading ? "Loading..." : "Load more"}
                </button>
              </div>
            ) : null}
          </>
        ) : null}
      </section>
    </main>
  );
}
