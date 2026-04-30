"use client";

import { FormEvent, useEffect, useState } from "react";
import AdminMetricStrip from "@/components/admin/AdminMetricStrip";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminSection from "@/components/admin/AdminSection";

type Program = { id: string; name: string };
type Season = { id: string; year: number };
type Entry = { id: string; title: string };

export default function AdminAdvancedPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [selectedProgramId, setSelectedProgramId] = useState("");
  const [selectedSeasonId, setSelectedSeasonId] = useState("");
  const [selectedEntryId, setSelectedEntryId] = useState("");
  const [stageName, setStageName] = useState("");
  const [stageOrder, setStageOrder] = useState(1);
  const [matrix, setMatrix] = useState<Array<{ criteria: string; value: number; judge: { fullName: string } | null; stage: { name: string } | null }>>([]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState("all");
  const [sendAt, setSendAt] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [smtpConfigured, setSmtpConfigured] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const smtpRes = await fetch("/api/communications/broadcast/");
      if (smtpRes.ok) {
        const smtpData = await smtpRes.json().catch(() => null);
        if (typeof smtpData?.smtpConfigured === "boolean") setSmtpConfigured(smtpData.smtpConfigured);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const [programRes, entryRes] = await Promise.all([fetch("/api/programs"), fetch("/api/entries")]);
      if (!programRes.ok || !entryRes.ok) {
        setError("Failed to load data");
        return;
      }
      const [programData, entryData] = await Promise.all([programRes.json(), entryRes.json()]);
      setPrograms(programData.programs ?? []);
      setEntries(entryData.entries ?? []);
      if (programData.programs?.[0]?.id) setSelectedProgramId(programData.programs[0].id);
      if (entryData.entries?.[0]?.id) setSelectedEntryId(entryData.entries[0].id);
    })();
  }, []);

  useEffect(() => {
    if (!selectedProgramId) return;
    (async () => {
      const res = await fetch(`/api/programs/${selectedProgramId}/seasons`);
      if (!res.ok) return;
      const data = await res.json();
      setSeasons(data.seasons ?? []);
      if (data.seasons?.[0]?.id) setSelectedSeasonId(data.seasons[0].id);
    })();
  }, [selectedProgramId]);

  async function createStage(e: FormEvent) {
    e.preventDefault();
    setSuccess(null);
    const res = await fetch("/api/judging/stages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: stageName,
        stageOrder,
        programId: selectedProgramId,
        seasonId: selectedSeasonId,
      }),
    });
    if (!res.ok) {
      setError("Failed to create stage");
      return;
    }
    setError(null);
    setStageName("");
    setSuccess("Stage created successfully.");
  }

  async function loadMatrix() {
    if (!selectedEntryId) return;
    setSuccess(null);
    const res = await fetch(`/api/judging/matrix?entryId=${selectedEntryId}`);
    if (!res.ok) {
      setError("Failed to load score matrix");
      return;
    }
    const data = await res.json();
    setMatrix(data.matrix ?? []);
    setSuccess("Score matrix loaded.");
  }

  async function queueBroadcast(e: FormEvent) {
    e.preventDefault();
    setSuccess(null);
    const res = await fetch("/api/communications/broadcast/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        audience,
        subject,
        message,
        sendAt: sendAt ? new Date(sendAt).toISOString() : undefined,
      }),
    });
    if (!res.ok) {
      setError("Failed to queue broadcast");
      return;
    }
    setError(null);
    setSubject("");
    setMessage("");
    setSendAt("");
    setSuccess("Broadcast has been queued.");
  }

  return (
    <main>
      <AdminPageHeader
        title="Advanced workflow tools"
        description="Judging stages, score matrix review, and broadcast queue in one place."
      />
      <AdminMetricStrip mergeSnapshot />
      {error ? <p className="admin-error">{error}</p> : null}
      {success ? <p className="admin-muted">{success}</p> : null}

      <AdminSection title="Judging stages">
        <form onSubmit={createStage} className="admin-form">
          <select value={selectedProgramId} onChange={(e) => setSelectedProgramId(e.target.value)} required>
            <option value="">Select program</option>
            {programs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <select value={selectedSeasonId} onChange={(e) => setSelectedSeasonId(e.target.value)} required>
            <option value="">Select season</option>
            {seasons.map((s) => (
              <option key={s.id} value={s.id}>
                {s.year}
              </option>
            ))}
          </select>
          <input value={stageName} onChange={(e) => setStageName(e.target.value)} placeholder="Stage name" required />
          <input type="number" min={1} max={20} value={stageOrder} onChange={(e) => setStageOrder(Number(e.target.value))} />
          <button type="submit">Create Stage</button>
        </form>
      </AdminSection>

      <AdminSection title="Score matrix">
        <div className="admin-inline-actions">
          <select value={selectedEntryId} onChange={(e) => setSelectedEntryId(e.target.value)}>
            <option value="">Select entry</option>
            {entries.map((entry) => (
              <option key={entry.id} value={entry.id}>
                {entry.title}
              </option>
            ))}
          </select>
          <button type="button" onClick={loadMatrix}>
            Load Matrix
          </button>
        </div>
        <ul>
          {matrix.map((row, idx) => (
            <li key={`${row.criteria}-${idx}`}>
              {row.judge?.fullName ?? "Unknown judge"} / {row.stage?.name ?? "No stage"} / {row.criteria}: {row.value}
            </li>
          ))}
        </ul>
      </AdminSection>

      <AdminSection title="Broadcast queue">
        {smtpConfigured === false ? (
          <p className="admin-error" role="status">
            SMTP is not configured (set SMTP_HOST, SMTP_USER, SMTP_PASS, and optionally SMTP_FROM). Queued jobs will fail
            until email is enabled on the server.
          </p>
        ) : null}
        <form onSubmit={queueBroadcast} className="admin-form">
          <select value={audience} onChange={(e) => setAudience(e.target.value)}>
            <option value="all">All</option>
            <option value="entrants">Entrants</option>
            <option value="judges">Judges</option>
            <option value="managers">Managers</option>
          </select>
          <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" required />
          <label>
            Optional schedule (local datetime)
            <input type="datetime-local" value={sendAt} onChange={(e) => setSendAt(e.target.value)} />
          </label>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={5} placeholder="Message" required />
          <button type="submit">Queue Broadcast Job</button>
        </form>
      </AdminSection>
    </main>
  );
}
