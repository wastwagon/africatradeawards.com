"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import PlatformSiteChrome from "@/components/platform/PlatformSiteChrome";

type Assignment = {
  id: string;
  entry: {
    id: string;
    title: string;
    status: string;
    category?: { name: string };
    season?: { year: number };
    program?: { name: string };
  };
};

export default function JudgePortalPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedEntryId, setSelectedEntryId] = useState("");
  const [criteria, setCriteria] = useState("impact");
  const [score, setScore] = useState(7);
  const [comment, setComment] = useState("");
  const [recusalReason, setRecusalReason] = useState("");
  const [selectedStageId, setSelectedStageId] = useState("");
  const [stages, setStages] = useState<Array<{ id: string; name: string; stageOrder: number }>>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadAssignments = useCallback(async () => {
    const res = await fetch("/api/judging/entries");
    if (!res.ok) {
      setError("Failed to load assignments");
      return;
    }
    const data = await res.json();
    setAssignments(data.assignments ?? []);
    if (!selectedEntryId && data.assignments?.[0]?.entry?.id) {
      setSelectedEntryId(data.assignments[0].entry.id);
    }
    const stageRes = await fetch("/api/judging/stages");
    if (stageRes.ok) {
      const stageData = await stageRes.json();
      setStages(stageData.stages ?? []);
      if (!selectedStageId && stageData.stages?.[0]?.id) {
        setSelectedStageId(stageData.stages[0].id);
      }
    }
  }, [selectedEntryId, selectedStageId]);

  useEffect(() => {
    void loadAssignments();
  }, [loadAssignments]);

  async function submitScore(e: FormEvent) {
    e.preventDefault();
    setSuccess(null);
    const res = await fetch("/api/judging/scores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        entryId: selectedEntryId,
        criteria,
        value: Number(score),
        comment: comment || undefined,
        stageId: selectedStageId || undefined,
      }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "Failed to submit score");
      return;
    }
    setError(null);
    setComment("");
    setSuccess("Score submitted successfully.");
  }

  async function recuse() {
    setSuccess(null);
    const res = await fetch("/api/judging/recusals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        entryId: selectedEntryId,
        reason: recusalReason,
      }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "Failed to recuse");
      return;
    }
    setError(null);
    setRecusalReason("");
    setSuccess("Recusal submitted successfully.");
  }

  return (
    <PlatformSiteChrome>
      <section className="platform-page">
        <div className="container" style={{ maxWidth: 1000 }}>
          <div className="platform-page-header">
            <p className="platform-eyebrow">Judging workspace</p>
            <h1 className="platform-title">Assigned entries</h1>
            <p className="platform-lead">Review nominations allocated to you, record scores by criterion, and file recusals when needed.</p>
          </div>
          {error ? <p className="platform-msg-error">{error}</p> : null}
          {success ? <p className="platform-msg-ok">{success}</p> : null}

          <section className="platform-card" style={{ marginBottom: 24 }}>
            <h2 className="platform-title" style={{ fontSize: "1.2rem", marginBottom: 12 }}>
              Your assignments
            </h2>
            <ul className="platform-muted" style={{ margin: 0, paddingLeft: "1.25rem" }}>
              {assignments.map((a) => (
                <li key={a.id} style={{ marginBottom: 8 }}>
                  <strong>{a.entry.title}</strong> — {a.entry.program?.name} / {a.entry.category?.name} / {a.entry.season?.year}{" "}
                  <span>({a.entry.status})</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="platform-card">
            <h2 className="platform-title" style={{ fontSize: "1.2rem", marginBottom: 16 }}>
              Submit score
            </h2>
            <form onSubmit={submitScore} style={{ display: "grid", gap: 12, maxWidth: 640 }}>
              <label className="platform-field">
                Entry
                <select value={selectedEntryId} onChange={(e) => setSelectedEntryId(e.target.value)} required>
                  <option value="">Select assigned entry</option>
                  {assignments.map((a) => (
                    <option key={a.id} value={a.entry.id}>
                      {a.entry.title}
                    </option>
                  ))}
                </select>
              </label>
              <label className="platform-field">
                Criterion
                <input value={criteria} onChange={(e) => setCriteria(e.target.value)} placeholder="e.g. impact" required />
              </label>
              <label className="platform-field">
                Stage
                <select value={selectedStageId} onChange={(e) => setSelectedStageId(e.target.value)}>
                  <option value="">No stage</option>
                  {stages.map((stage) => (
                    <option key={stage.id} value={stage.id}>
                      {stage.stageOrder}. {stage.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="platform-field">
                Score (0–10)
                <input
                  type="number"
                  min={0}
                  max={10}
                  step={0.1}
                  value={score}
                  onChange={(e) => setScore(Number(e.target.value))}
                  required
                />
              </label>
              <label className="platform-field">
                Comment (optional)
                <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={4} />
              </label>
              <button type="submit" className="vl-btn1">
                Submit score
              </button>
            </form>
            <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid rgba(78, 43, 90, 0.12)" }}>
              <h3 className="platform-title" style={{ fontSize: "1.05rem", marginBottom: 12 }}>
                Conflict of interest — recusal
              </h3>
              <label className="platform-field">
                Reason
                <textarea
                  value={recusalReason}
                  onChange={(e) => setRecusalReason(e.target.value)}
                  placeholder="Explain the conflict of interest"
                  rows={3}
                />
              </label>
              <button type="button" className="vl-btn1" onClick={recuse} disabled={!selectedEntryId || recusalReason.trim().length < 3}>
                Submit recusal
              </button>
            </div>
          </section>

          <p className="platform-muted text-center" style={{ marginTop: 28 }}>
            <Link href="/login/">Account</Link>
            {" · "}
            <Link href="/">Home</Link>
          </p>
        </div>
      </section>
    </PlatformSiteChrome>
  );
}
