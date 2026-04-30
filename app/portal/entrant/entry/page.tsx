"use client";

import { EntryStatus } from "@prisma/client";
import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminSection from "@/components/admin/AdminSection";

type Program = {
  id: string;
  name: string;
  slug: string;
  seasons: { id: string; year: number }[];
  categories: { id: string; name: string; slug: string }[];
};

type Entry = {
  id: string;
  title: string;
  status: string;
  programId?: string;
  seasonId?: string;
  categoryId?: string;
  submissionData?: Record<string, unknown>;
};

export default function EntrantEntryWorkspacePage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [selectedProgramId, setSelectedProgramId] = useState("");
  const [selectedSeasonId, setSelectedSeasonId] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [selectedEntryId, setSelectedEntryId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const feedbackRef = useRef<HTMLDivElement | null>(null);
  const appliedSelectFromUrl = useRef(false);

  const selectedProgram = useMemo(() => programs.find((p) => p.id === selectedProgramId) ?? null, [programs, selectedProgramId]);
  const selectedEntry = useMemo(() => entries.find((e) => e.id === selectedEntryId) ?? null, [entries, selectedEntryId]);
  const currentFiles = useMemo(() => {
    if (!selectedEntry || !selectedEntry.submissionData) return [];
    const files = (selectedEntry.submissionData as Record<string, unknown>).files;
    return Array.isArray(files) ? files : [];
  }, [selectedEntry]);

  const loadEntries = useCallback(async () => {
    const res = await fetch("/api/entries/");
    if (!res.ok) {
      setError("Failed to load entries");
      return;
    }
    const data = await res.json();
    setEntries(data.entries ?? []);
  }, []);

  const loadMetadata = useCallback(async () => {
    const res = await fetch("/api/portal/metadata/");
    if (!res.ok) {
      setError("Failed to load program metadata");
      return;
    }
    const data = await res.json();
    setPrograms(data.programs ?? []);
  }, []);

  useEffect(() => {
    void loadMetadata();
    void loadEntries();
  }, [loadEntries, loadMetadata]);

  useEffect(() => {
    if (entries.length === 0 || appliedSelectFromUrl.current || typeof window === "undefined") return;
    const id = new URLSearchParams(window.location.search).get("select");
    if (id && entries.some((e) => e.id === id)) {
      setSelectedEntryId(id);
      appliedSelectFromUrl.current = true;
    }
  }, [entries]);

  useEffect(() => {
    if (!selectedEntryId || entries.length === 0) return;
    if (!entries.some((e) => e.id === selectedEntryId)) setSelectedEntryId("");
  }, [entries, selectedEntryId]);

  useEffect(() => {
    if (!selectedEntry) return;
    setTitle(selectedEntry.title || "");
    const saved = (selectedEntry.submissionData?.summary as string) || "";
    setSummary(saved);
  }, [selectedEntry]);

  useEffect(() => {
    if (!error && !message) return;
    feedbackRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [error, message]);

  async function createEntry(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    const res = await fetch("/api/entries/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        programId: selectedProgramId,
        seasonId: selectedSeasonId,
        categoryId: selectedCategoryId,
        submissionData: { summary },
      }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "Failed to create entry");
      return;
    }
    setTitle("");
    setSummary("");
    setMessage("Draft entry created.");
    await loadEntries();
  }

  const saveDraft = useCallback(async () => {
    if (!selectedEntryId) return;
    setError(null);
    setMessage(null);
    setSaving(true);
    const existingData = (selectedEntry?.submissionData ?? {}) as Record<string, unknown>;
    const res = await fetch(`/api/entries/${selectedEntryId}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        submissionData: {
          ...existingData,
          summary,
        },
        action: "save_draft",
      }),
    });
    setSaving(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "Failed to save draft");
      return;
    }
    setMessage("Draft saved.");
    await loadEntries();
  }, [loadEntries, selectedEntry?.submissionData, selectedEntryId, summary, title]);

  async function submitEntry() {
    if (!selectedEntryId) return;
    setError(null);
    setMessage(null);
    const existingData = (selectedEntry?.submissionData ?? {}) as Record<string, unknown>;
    const res = await fetch(`/api/entries/${selectedEntryId}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        submissionData: {
          ...existingData,
          summary,
        },
        action: "submit",
      }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "Failed to submit");
      return;
    }
    setMessage("Entry submitted.");
    await loadEntries();
  }

  async function uploadFile(file: File) {
    if (!selectedEntryId) {
      setError("Choose an existing entry before uploading");
      return;
    }
    setError(null);
    setMessage(null);
    setUploading(true);
    const formData = new FormData();
    formData.append("entryId", selectedEntryId);
    formData.append("file", file);
    const res = await fetch("/api/uploads/entry-files/", {
      method: "POST",
      body: formData,
    });
    setUploading(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "Upload failed");
      return;
    }
    setMessage("File uploaded.");
    await loadEntries();
  }

  return (
    <div className="admin-page--wide">
      <AdminPageHeader
        eyebrow="Entrant workspace"
        title="Manage entries"
        description="Create drafts, upload files, and submit when your season window is open."
      />

      <div ref={feedbackRef}>
        {error ? <p className="admin-error admin-mt-sm">{error}</p> : null}
        {message ? <p className="admin-ok admin-mt-sm">{message}</p> : null}
      </div>

      <AdminSection title="New entry">
        <form onSubmit={createEntry} className="platform-form-grid">
          <label className="platform-field">
            Title
            <input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Entry title" />
          </label>
          <label className="platform-field">
            Program
            <select value={selectedProgramId} onChange={(e) => setSelectedProgramId(e.target.value)} required>
              <option value="">Select program</option>
              {programs.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>
          <label className="platform-field">
            Season
            <select value={selectedSeasonId} onChange={(e) => setSelectedSeasonId(e.target.value)} required>
              <option value="">Select season</option>
              {(selectedProgram?.seasons ?? []).map((s) => (
                <option key={s.id} value={s.id}>
                  {s.year}
                </option>
              ))}
            </select>
          </label>
          <label className="platform-field">
            Category
            <select value={selectedCategoryId} onChange={(e) => setSelectedCategoryId(e.target.value)} required>
              <option value="">Select category</option>
              {(selectedProgram?.categories ?? []).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label className="platform-field">
            Summary
            <textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={4} placeholder="Submission summary" />
          </label>
          <button type="submit" className="vl-btn1">
            Create draft entry
          </button>
        </form>
      </AdminSection>

      <AdminSection title="Edit existing entry">
        <label className="platform-field">
          Select entry
          <select value={selectedEntryId} onChange={(e) => setSelectedEntryId(e.target.value)}>
            <option value="">Select your entry</option>
            {entries.map((entry) => (
              <option key={entry.id} value={entry.id}>
                {entry.title} ({entry.status})
              </option>
            ))}
          </select>
        </label>
        {selectedEntryId ? (
          <div className="platform-form-grid platform-subsection">
            <label className="platform-field">
              Title
              <input value={title} onChange={(e) => setTitle(e.target.value)} />
            </label>
            <label className="platform-field">
              Summary
              <textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={6} />
            </label>
            <div className="platform-actions">
              <button type="button" className="vl-btn1" onClick={saveDraft}>
                {saving ? "Saving…" : "Save draft"}
              </button>
              <button
                type="button"
                className="vl-btn1"
                onClick={submitEntry}
                disabled={selectedEntry?.status !== EntryStatus.DRAFT}
              >
                Submit entry
              </button>
            </div>
            {selectedEntry && selectedEntry.status !== EntryStatus.DRAFT ? (
              <p className="admin-muted admin-muted-flat">This entry is no longer a draft; submission cannot be repeated from here.</p>
            ) : null}
            <label className="platform-field">
              Upload file
              <input
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void uploadFile(file);
                }}
              />
            </label>
            {uploading ? <p className="platform-muted">Uploading…</p> : null}
            {currentFiles.length ? (
              <p className="platform-muted platform-field-hint">Uploaded files: {currentFiles.length}</p>
            ) : null}
          </div>
        ) : null}
      </AdminSection>
    </div>
  );
}
