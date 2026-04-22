"use client";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminSection from "@/components/admin/AdminSection";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
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

const CRITERIA_OPTIONS = [
  { value: "impact", label: "Impact" },
  { value: "innovation", label: "Innovation" },
  { value: "execution", label: "Execution" },
  { value: "sustainability", label: "Sustainability" },
  { value: "governance", label: "Governance" },
] as const;

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
  const feedbackRef = useRef<HTMLDivElement | null>(null);

  const loadAssignments = useCallback(async () => {
    const res = await fetch("/api/judging/entries/");
    if (!res.ok) {
      setError("Failed to load assignments");
      return;
    }
    const data = await res.json();
    setAssignments(data.assignments ?? []);
    if (!selectedEntryId && data.assignments?.[0]?.entry?.id) {
      setSelectedEntryId(data.assignments[0].entry.id);
    }
    const stageRes = await fetch("/api/judging/stages/");
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

  useEffect(() => {
    if (!error && !success) return;
    feedbackRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [error, success]);

  useEffect(() => {
    if (!selectedEntryId || !criteria) return;
    void (async () => {
      const params = new URLSearchParams({
        entryId: selectedEntryId,
        criteria,
      });
      if (selectedStageId) params.set("stageId", selectedStageId);
      const res = await fetch(`/api/judging/scores/?${params.toString()}`, { cache: "no-store" });
      if (!res.ok) return;
      const body = await res.json().catch(() => ({}));
      if (!body?.score) {
        setScore(7);
        setComment("");
        return;
      }
      if (typeof body.score.value === "number") setScore(body.score.value);
      setComment(typeof body.score.comment === "string" ? body.score.comment : "");
    })();
  }, [selectedEntryId, selectedStageId, criteria]);

  async function submitScore(e: FormEvent) {
    e.preventDefault();
    setSuccess(null);
    const res = await fetch("/api/judging/scores/", {
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
    <div className="admin-page--wide">
      <AdminPageHeader
        eyebrow="Judging workspace"
        title="Assigned entries"
        description="Review nominations allocated to you, record scores by criterion, and file recusals when needed."
      />

      <div ref={feedbackRef}>
        {error ? (
          <p className="admin-error admin-mt-sm" role="alert">
            {error}
          </p>
        ) : null}
        {success ? <p className="admin-ok admin-mt-sm">{success}</p> : null}
      </div>

      <AdminSection title="Your assignments">
              <ul className="platform-list">
                {assignments.map((a) => (
                  <li key={a.id}>
                    <strong>{a.entry.title}</strong> — {a.entry.program?.name} / {a.entry.category?.name} / {a.entry.season?.year}{" "}
                    <span>({a.entry.status})</span>
                  </li>
                ))}
              </ul>
      </AdminSection>

      <AdminSection title="Submit score">
              <form onSubmit={submitScore} className="platform-form-grid platform-form-grid--limit">
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
                  <select value={criteria} onChange={(e) => setCriteria(e.target.value)} required>
                    {CRITERIA_OPTIONS.map((criterion) => (
                      <option key={criterion.value} value={criterion.value}>
                        {criterion.label}
                      </option>
                    ))}
                  </select>
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
              <div className="platform-subsection">
                <h3 className="platform-subsection-title">Conflict of interest — recusal</h3>
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
      </AdminSection>
    </div>
  );
}
