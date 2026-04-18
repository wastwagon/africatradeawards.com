"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import AdminDataTable, { type AdminTableColumn } from "@/components/admin/AdminDataTable";

type Entry = {
  id: string;
  title: string;
  status: string;
  entrantId: string;
  submissionData?: Record<string, unknown>;
  category?: { name: string };
  season?: { year: number };
  program?: { name: string };
};

type EntryFileMeta = {
  name?: string;
  size?: number;
  type?: string;
  storedAs?: string;
  uploadedAt?: string;
};

type Judge = { id: string; fullName: string; email: string };
type EntryStatus = "UNDER_REVIEW" | "SHORTLISTED" | "WINNER" | "REJECTED" | "SUBMITTED";

export default function AdminEntriesPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [judges, setJudges] = useState<Judge[]>([]);
  const [selectedEntryId, setSelectedEntryId] = useState("");
  const [selectedJudgeId, setSelectedJudgeId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [statusAction, setStatusAction] = useState<EntryStatus>("UNDER_REVIEW");
  const [view, setView] = useState<"all" | "actionable" | "winners">("all");
  const [message, setMessage] = useState<string | null>(null);

  const columns: AdminTableColumn<Entry>[] = [
    { key: "title", header: "Title", cell: (entry) => entry.title, sortValue: (entry) => entry.title },
    { key: "program", header: "Program", cell: (entry) => entry.program?.name ?? "-", sortValue: (entry) => entry.program?.name ?? "" },
    { key: "season", header: "Season", cell: (entry) => entry.season?.year ?? "-", sortValue: (entry) => entry.season?.year ?? 0 },
    { key: "category", header: "Category", cell: (entry) => entry.category?.name ?? "-", sortValue: (entry) => entry.category?.name ?? "" },
    {
      key: "status",
      header: "Status",
      cell: (entry) => <span className={`admin-status-pill admin-status-pill--${entry.status.toLowerCase()}`}>{entry.status}</span>,
      sortValue: (entry) => entry.status,
    },
    {
      key: "action",
      header: "Action",
      cell: (entry) => (
        <details className="admin-row-menu">
          <summary>Actions</summary>
          <div className="admin-row-menu__panel">
            <button type="button" onClick={() => updateStatus(entry.id)}>
              Apply selected status
            </button>
            <button type="button" onClick={() => updateStatus(entry.id, "UNDER_REVIEW")}>
              Mark under review
            </button>
            <button type="button" onClick={() => updateStatus(entry.id, "SHORTLISTED")}>
              Mark shortlisted
            </button>
            <button type="button" onClick={() => updateStatus(entry.id, "WINNER")}>
              Mark winner
            </button>
            <button type="button" onClick={() => updateStatus(entry.id, "REJECTED")}>
              Mark rejected
            </button>
          </div>
        </details>
      ),
    },
  ];

  const loadData = useCallback(async () => {
    const [entryRes, judgeRes] = await Promise.all([fetch("/api/entries"), fetch("/api/users/?role=JUDGE")]);
    if (!entryRes.ok || !judgeRes.ok) {
      setError("Failed to load entries or judges");
      return;
    }
    const [entryData, judgeData] = await Promise.all([entryRes.json(), judgeRes.json()]);
    setEntries(entryData.entries ?? []);
    setJudges(judgeData.users ?? []);
    if (!selectedEntryId && entryData.entries?.[0]?.id) setSelectedEntryId(entryData.entries[0].id);
    if (!selectedJudgeId && judgeData.users?.[0]?.id) setSelectedJudgeId(judgeData.users[0].id);
  }, [selectedEntryId, selectedJudgeId]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  useEffect(() => {
    const saved = window.localStorage.getItem("admin_entries_view");
    if (saved === "all" || saved === "actionable" || saved === "winners") setView(saved);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("admin_entries_view", view);
  }, [view]);

  async function assignJudge(e: FormEvent) {
    e.preventDefault();
    if (!selectedEntryId || !selectedJudgeId) return;

    const res = await fetch("/api/judging/assignments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entryId: selectedEntryId, judgeId: selectedJudgeId }),
    });

    if (!res.ok) {
      setError("Failed to assign judge");
      setMessage(null);
      return;
    }
    setError(null);
    setMessage("Judge assigned successfully.");
  }

  async function updateStatus(entryId: string, override?: EntryStatus) {
    const res = await fetch(`/api/entries/${entryId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: override ?? statusAction }),
    });
    if (!res.ok) {
      setError("Failed to update entry status");
      setMessage(null);
      return;
    }
    setError(null);
    setMessage("Entry status updated.");
    await loadData();
  }

  const viewRows =
    view === "all"
      ? entries
      : view === "actionable"
      ? entries.filter((e) => e.status === "SUBMITTED" || e.status === "UNDER_REVIEW" || e.status === "SHORTLISTED")
      : entries.filter((e) => e.status === "WINNER");

  return (
    <main>
      <h1>Entries and Judging</h1>
      <p>Assign judges and move entries through review outcomes.</p>
      {error ? <p className="admin-error">{error}</p> : null}
      {message ? <p className="admin-ok">{message}</p> : null}

      <section>
        <h2>Assign Judge</h2>
        <form onSubmit={assignJudge} className="admin-form">
          <select value={selectedEntryId} onChange={(e) => setSelectedEntryId(e.target.value)} required>
            <option value="">Select entry</option>
            {entries.map((entry) => (
              <option key={entry.id} value={entry.id}>
                {entry.title} ({entry.status})
              </option>
            ))}
          </select>
          <select value={selectedJudgeId} onChange={(e) => setSelectedJudgeId(e.target.value)} required>
            <option value="">Select judge</option>
            {judges.map((judge) => (
              <option key={judge.id} value={judge.id}>
                {judge.fullName} ({judge.email})
              </option>
            ))}
          </select>
          <button type="submit">Assign</button>
        </form>
      </section>

      <section>
        <h2>Entry Status Management</h2>
        <div className="admin-segment">
          <button type="button" className={view === "all" ? "is-active" : undefined} onClick={() => setView("all")}>
            All
          </button>
          <button
            type="button"
            className={view === "actionable" ? "is-active" : undefined}
            onClick={() => setView("actionable")}
          >
            Actionable
          </button>
          <button type="button" className={view === "winners" ? "is-active" : undefined} onClick={() => setView("winners")}>
            Winners
          </button>
        </div>
        <label>
          Status action:
          <select value={statusAction} onChange={(e) => setStatusAction(e.target.value as EntryStatus)}>
            <option value="UNDER_REVIEW">UNDER_REVIEW</option>
            <option value="SHORTLISTED">SHORTLISTED</option>
            <option value="WINNER">WINNER</option>
            <option value="REJECTED">REJECTED</option>
            <option value="SUBMITTED">SUBMITTED</option>
          </select>
        </label>
        <AdminDataTable
          rows={viewRows}
          columns={columns}
          rowKey={(entry) => entry.id}
          stickyFirstColumn
          expandedRow={(entry) => (
            <div className="admin-expanded-content">
              <p>
                <strong>Entry ID:</strong> {entry.id}
              </p>
              <p>
                <strong>Entrant ID:</strong> {entry.entrantId}
              </p>
              <p>
                <strong>Current status:</strong> {entry.status}
              </p>
              <div>
                <strong>Uploaded files:</strong>
                {Array.isArray((entry.submissionData as Record<string, unknown> | undefined)?.files) &&
                ((entry.submissionData as Record<string, unknown>).files as EntryFileMeta[]).length > 0 ? (
                  <ul style={{ marginTop: 8, marginBottom: 0 }}>
                    {((entry.submissionData as Record<string, unknown>).files as EntryFileMeta[]).map((file, idx) => {
                      const storedAs = file.storedAs ?? "";
                      const href = `/api/uploads/entry-files/download/?entryId=${encodeURIComponent(entry.id)}&storedAs=${encodeURIComponent(storedAs)}`;
                      const sizeLabel = typeof file.size === "number" ? ` (${Math.max(1, Math.round(file.size / 1024))} KB)` : "";
                      return (
                        <li key={`${storedAs}-${idx}`}>
                          {storedAs ? (
                            <a href={href} target="_blank" rel="noreferrer">
                              {file.name ?? storedAs}
                            </a>
                          ) : (
                            <span>{file.name ?? "Unnamed file"}</span>
                          )}
                          {sizeLabel}
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="admin-muted" style={{ marginTop: 8 }}>
                    No uploaded files.
                  </p>
                )}
              </div>
            </div>
          )}
          rowSearchText={(entry) =>
            [entry.title, entry.status, entry.program?.name, entry.category?.name, entry.season?.year].filter(Boolean).join(" ")
          }
          searchPlaceholder="Search entry, status, program, category, or season"
          exportFilename="entries-status.csv"
          persistKey="entries"
          exportRow={(entry) => ({
            title: entry.title,
            program: entry.program?.name ?? "",
            season: entry.season?.year ?? "",
            category: entry.category?.name ?? "",
            status: entry.status,
          })}
        />
      </section>
    </main>
  );
}
