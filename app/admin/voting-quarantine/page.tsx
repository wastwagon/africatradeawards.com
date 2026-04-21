"use client";

import { UserRole } from "@prisma/client";
import { useEffect, useMemo, useState } from "react";
import AdminMetricStrip from "@/components/admin/AdminMetricStrip";
import AdminPageHeader from "@/components/admin/AdminPageHeader";

type QuarantineVote = {
  id: string;
  createdAt: string;
  ipHash: string;
  voterEmail: string | null;
  quarantineReason: string | null;
  entry: {
    id: string;
    title: string;
    program?: { name: string };
    category?: { name: string };
    season?: { year: number };
  };
};

export default function VotingQuarantinePage() {
  const [votes, setVotes] = useState<QuarantineVote[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [canReview, setCanReview] = useState(true);

  async function load() {
    const res = await fetch("/api/voting/quarantine");
    if (!res.ok) {
      setError("Failed to load quarantine queue");
      return;
    }
    const data = await res.json();
    setVotes(data.votes ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/auth/me");
      if (!res.ok) return;
      const data = await res.json();
      setCanReview(data.user?.role !== UserRole.AUDITOR);
    })();
  }, []);

  async function review(voteId: string, action: "approve" | "reject") {
    setError(null);
    const res = await fetch(`/api/voting/quarantine/${voteId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "Action failed");
      return;
    }
    await load();
  }

  const queueMetrics = useMemo(
    () => [
      {
        label: "Awaiting review",
        value: votes.length,
        tone: votes.length ? ("warn" as const) : ("ok" as const),
      },
    ],
    [votes.length],
  );

  return (
    <main className="admin-page--wide">
      <AdminPageHeader
        title="Vote quarantine queue"
        description="Approve to count the vote as valid, or reject to discard it and free the voter to try again."
      />
      <AdminMetricStrip mergeSnapshot appendItems={queueMetrics} />
      {!canReview ? (
        <p className="admin-muted">Auditor view: you can inspect the queue only. Approvals require a program manager.</p>
      ) : null}
      {error ? <p className="admin-error">{error}</p> : null}
      {votes.length === 0 ? <p>No votes awaiting review.</p> : null}
      <ul className="admin-card-list">
        {votes.map((v) => (
          <li key={v.id}>
            <strong>{v.entry.title}</strong>
            <div>
              {v.entry.program?.name} / {v.entry.category?.name} / {v.entry.season?.year}
            </div>
            <div className="admin-card-list__meta">
              <div>Email: {v.voterEmail ?? "—"}</div>
              <div>IP hash: {v.ipHash.slice(0, 16)}…</div>
              <div>Reason: {v.quarantineReason ?? "—"}</div>
              <div>Submitted: {new Date(v.createdAt).toLocaleString()}</div>
            </div>
            {canReview ? (
              <div className="admin-inline-actions admin-actions-row--tight">
                <button type="button" onClick={() => review(v.id, "approve")}>
                  Approve
                </button>
                <button type="button" onClick={() => review(v.id, "reject")}>
                  Reject
                </button>
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    </main>
  );
}
