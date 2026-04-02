"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import PlatformSiteChrome from "@/components/platform/PlatformSiteChrome";

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

export default function EntrantPortalPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [selectedProgramId, setSelectedProgramId] = useState("");
  const [selectedSeasonId, setSelectedSeasonId] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [selectedEntryId, setSelectedEntryId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const selectedProgram = useMemo(() => programs.find((p) => p.id === selectedProgramId) ?? null, [programs, selectedProgramId]);

  const loadEntries = useCallback(async () => {
    const res = await fetch("/api/entries");
    if (!res.ok) {
      setError("Failed to load entries");
      return;
    }
    const data = await res.json();
    setEntries(data.entries ?? []);
  }, []);

  const loadMetadata = useCallback(async () => {
    const res = await fetch("/api/portal/metadata");
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
    const entry = entries.find((e) => e.id === selectedEntryId);
    if (!entry) return;
    setTitle(entry.title || "");
    const saved = (entry.submissionData?.summary as string) || "";
    setSummary(saved);
  }, [selectedEntryId, entries]);

  async function createEntry(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch("/api/entries", {
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
    await loadEntries();
  }

  const saveDraft = useCallback(async () => {
    if (!selectedEntryId) return;
    setSaving(true);
    const res = await fetch(`/api/entries/${selectedEntryId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        submissionData: { summary },
        action: "save_draft",
      }),
    });
    setSaving(false);
    if (!res.ok) setError("Failed to save draft");
    await loadEntries();
  }, [loadEntries, selectedEntryId, summary, title]);

  async function submitEntry() {
    if (!selectedEntryId) return;
    const res = await fetch(`/api/entries/${selectedEntryId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        submissionData: { summary },
        action: "submit",
      }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "Failed to submit");
      return;
    }
    await loadEntries();
  }

  async function uploadFile(file: File) {
    if (!selectedEntryId) {
      setError("Choose an existing entry before uploading");
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append("entryId", selectedEntryId);
    formData.append("file", file);
    const res = await fetch("/api/uploads/entry-files", {
      method: "POST",
      body: formData,
    });
    setUploading(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "Upload failed");
      return;
    }
    await loadEntries();
  }

  useEffect(() => {
    if (!selectedEntryId) return;
    const timer = setTimeout(() => {
      void saveDraft();
    }, 1200);
    return () => clearTimeout(timer);
  }, [title, summary, selectedEntryId, saveDraft]);

  return (
    <PlatformSiteChrome>
      <section className="platform-page">
        <div className="container" style={{ maxWidth: 1100 }}>
          <div className="platform-page-header">
            <p className="platform-eyebrow">Entrant workspace</p>
            <h1 className="platform-title">Your entries</h1>
            <p className="platform-lead">
              Create entries, auto-save drafts, upload files, and submit when your season window is open.
            </p>
          </div>
          {error ? <p className="platform-msg-error">{error}</p> : null}

          <section className="platform-card" style={{ marginBottom: 24 }}>
            <h2 className="platform-title" style={{ fontSize: "1.2rem", marginBottom: 16 }}>
              New entry
            </h2>
            <form onSubmit={createEntry} style={{ display: "grid", gap: 12 }}>
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
          </section>

          <section className="platform-card">
            <h2 className="platform-title" style={{ fontSize: "1.2rem", marginBottom: 16 }}>
              Edit existing entry
            </h2>
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
              <div style={{ marginTop: 16, display: "grid", gap: 12 }}>
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
                  <button type="button" className="vl-btn1" onClick={submitEntry}>
                    Submit entry
                  </button>
                </div>
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
              </div>
            ) : null}
          </section>

          <p className="platform-muted text-center" style={{ marginTop: 28 }}>
            <Link href="/vote/">Public vote</Link>
            {" · "}
            <Link href="/login/">Sign In</Link>
            {" · "}
            <Link href="/">Home</Link>
          </p>
        </div>
      </section>
    </PlatformSiteChrome>
  );
}
