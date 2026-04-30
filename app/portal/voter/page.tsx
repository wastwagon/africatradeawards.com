"use client";

import { VoteStatus } from "@prisma/client";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminSection from "@/components/admin/AdminSection";

type DashboardVote = {
  id: string;
  createdAt: string;
  status: string;
  entry: {
    id: string;
    title: string;
    status: string;
    category: { name: string } | null;
    season: { year: number } | null;
    program: { name: string } | null;
  };
  stats: {
    validVoteCount: number;
    categoryRank: number | null;
    categoryEntryCount: number;
  };
};

function formatLabel(raw: string): string {
  return raw.replace(/_/g, " ");
}

function metricClassForVoteStatus(status: string): string {
  if (status === VoteStatus.VALID) return "admin-metric-chip--ok";
  if (status === VoteStatus.QUARANTINED) return "admin-metric-chip--warn";
  return "";
}

export default function VoterPortalPage() {
  const [votes, setVotes] = useState<DashboardVote[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/portal/voter/dashboard/", { cache: "no-store" });
    if (!res.ok) {
      setError("Could not load your dashboard.");
      setVotes([]);
      return;
    }
    const data = await res.json();
    setVotes(data.votes ?? []);
    setError(null);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const validCount = useMemo(
    () => (votes ? votes.filter((v) => v.status === VoteStatus.VALID).length : 0),
    [votes]
  );

  return (
    <div className="admin-page--wide">
      <AdminPageHeader
        eyebrow="Voter hub"
        title="Your votes and standings"
        description="Votes cast while you were signed in to this voter account appear here. Rank compares validated public votes within each category (shortlisted and winning entries)."
        actions={
          <div className="admin-inline-actions">
            <Link href="/vote/" className="admin-quick-action">
              Cast a vote
            </Link>
            <button type="button" className="admin-quick-action" onClick={() => void load()}>
              Refresh
            </button>
          </div>
        }
      />

      {error ? (
        <p className="admin-error admin-mt-sm" role="alert">
          {error}
        </p>
      ) : null}

      {votes === null ? (
        <AdminSection title="Loading">
          <p className="admin-muted admin-muted-flat">Loading your dashboard…</p>
        </AdminSection>
      ) : votes.length === 0 ? (
        <AdminSection title="Get started">
          <p className="admin-muted admin-muted-flat">
            No tracked votes yet. Stay signed in on the public voting page and cast your vote — each entry allows one vote per
            account.
          </p>
          <div className="admin-inline-actions admin-mt-md">
            <Link href="/vote/" className="admin-quick-action">
              Go to public voting
            </Link>
          </div>
        </AdminSection>
      ) : (
        <>
          <div className="admin-kpi-grid" style={{ marginBottom: 18 }}>
            <div className="admin-kpi-card">
              <p>Entries you support</p>
              <h3>{votes.length}</h3>
            </div>
            <div className="admin-kpi-card">
              <p>Validated votes</p>
              <h3>{validCount}</h3>
            </div>
          </div>

          <AdminSection title="Your picks">
            <div className="admin-card-grid">
              {votes.map((row) => {
                const statusChipClass = metricClassForVoteStatus(row.status);
                const rankLabel =
                  row.stats.categoryRank != null
                    ? `${row.stats.categoryRank} / ${row.stats.categoryEntryCount}`
                    : "—";

                return (
                  <article key={row.id} className="admin-panel" style={{ margin: 0 }}>
                    <h3 style={{ margin: "0 0 8px", fontSize: "1.05rem", color: "var(--admin-accent-strong)" }}>
                      {row.entry.title}
                    </h3>
                    <p className="admin-subline" style={{ marginBottom: 12 }}>
                      {row.entry.program?.name ?? "—"} · {row.entry.category?.name ?? "—"} · {row.entry.season?.year ?? "—"} ·{" "}
                      <span style={{ fontWeight: 600 }}>{formatLabel(row.entry.status)}</span>
                    </p>

                    <div className="admin-metric-strip">
                      <div className={`admin-metric-chip ${statusChipClass}`.trim()}>
                        <span className="admin-metric-chip__label">Your vote</span>
                        <span className="admin-metric-chip__value">{formatLabel(row.status)}</span>
                      </div>
                      <div className="admin-metric-chip">
                        <span className="admin-metric-chip__label">Public votes</span>
                        <span className="admin-metric-chip__value">{row.stats.validVoteCount}</span>
                      </div>
                      <div className="admin-metric-chip">
                        <span className="admin-metric-chip__label">Category rank</span>
                        <span className="admin-metric-chip__value">{rankLabel}</span>
                      </div>
                    </div>

                    <p className="admin-subline admin-muted-flat" style={{ marginTop: 12, marginBottom: 0 }}>
                      Cast {new Date(row.createdAt).toLocaleString()}
                    </p>
                  </article>
                );
              })}
            </div>
          </AdminSection>
        </>
      )}
    </div>
  );
}
