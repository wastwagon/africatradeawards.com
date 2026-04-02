'use client'

import { useEffect, useState } from "react";

type Entry = { id: string; status: string; title: string; createdAt?: string };
type LeaderRow = { entry: { title: string } | null; averageScore: number };
type VoteRow = { entry: { title: string } | null; votes: number };
type QuarantineVote = { id: string; createdAt: string };

type KpiState = {
  totalEntries: number;
  underReview: number;
  winners: number;
  quarantine: number;
  topVoteEntry: string;
  topJudgeEntry: string;
  entriesLast7: number[];
  quarantineLast7: number[];
  statusMix: Array<{ label: string; value: number }>;
};

const emptyState: KpiState = {
  totalEntries: 0,
  underReview: 0,
  winners: 0,
  quarantine: 0,
  topVoteEntry: "—",
  topJudgeEntry: "—",
  entriesLast7: [0, 0, 0, 0, 0, 0, 0],
  quarantineLast7: [0, 0, 0, 0, 0, 0, 0],
  statusMix: [],
};

function dailyBucketsLast7(dates: Date[]): number[] {
  const buckets = [0, 0, 0, 0, 0, 0, 0];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (const date of dates) {
    if (Number.isNaN(date.getTime())) continue;
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const diff = Math.floor((today.getTime() - d.getTime()) / 86400000);
    if (diff >= 0 && diff < 7) {
      buckets[6 - diff] += 1;
    }
  }
  return buckets;
}

function Sparkline({ points }: { points: number[] }) {
  const max = Math.max(1, ...points);
  const coords = points
    .map((p, i) => {
      const x = (i / Math.max(1, points.length - 1)) * 100;
      const y = 100 - (p / max) * 100;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg viewBox="0 0 100 100" className="admin-kpi-sparkline" role="img" aria-label="7-day trend">
      <polyline points={coords} fill="none" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function MiniBars({ items }: { items: Array<{ label: string; value: number }> }) {
  const max = Math.max(1, ...items.map((i) => i.value));
  return (
    <div className="admin-mini-bars">
      {items.map((item) => (
        <div key={item.label} className="admin-mini-bars__row">
          <span>{item.label}</span>
          <div>
            <em style={{ width: `${(item.value / max) * 100}%` }} />
          </div>
          <strong>{item.value}</strong>
        </div>
      ))}
    </div>
  );
}

export default function AdminKpis() {
  const [state, setState] = useState<KpiState>(emptyState);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setError(null);
      const [entriesRes, quarantineRes, votingRes, leaderboardRes] = await Promise.all([
        fetch("/api/entries"),
        fetch("/api/voting/quarantine"),
        fetch("/api/voting/results"),
        fetch("/api/judging/leaderboard"),
      ]);

      if (!entriesRes.ok || !quarantineRes.ok || !votingRes.ok || !leaderboardRes.ok) {
        setError("Could not load live metrics.");
        return;
      }

      const [entriesData, quarantineData, votingData, leaderboardData] = await Promise.all([
        entriesRes.json(),
        quarantineRes.json(),
        votingRes.json(),
        leaderboardRes.json(),
      ]);

      const entries = (entriesData.entries ?? []) as Entry[];
      const quarantineVotes = (quarantineData.votes ?? []) as QuarantineVote[];
      const underReview = entries.filter((e) => e.status === "UNDER_REVIEW").length;
      const winners = entries.filter((e) => e.status === "WINNER").length;
      const quarantine = quarantineVotes.length;
      const topVote = ((votingData.results ?? []) as VoteRow[])[0]?.entry?.title ?? "—";
      const topJudge = ((leaderboardData.leaderboard ?? []) as LeaderRow[])[0]?.entry?.title ?? "—";
      const entriesLast7 = dailyBucketsLast7(entries.map((e) => new Date(e.createdAt ?? "")));
      const quarantineLast7 = dailyBucketsLast7(quarantineVotes.map((v) => new Date(v.createdAt)));
      const statusMap = new Map<string, number>();
      for (const entry of entries) {
        statusMap.set(entry.status, (statusMap.get(entry.status) ?? 0) + 1);
      }
      const statusMix = ["DRAFT", "SUBMITTED", "UNDER_REVIEW", "SHORTLISTED", "WINNER", "REJECTED"].map((label) => ({
        label,
        value: statusMap.get(label) ?? 0,
      }));

      setState({
        totalEntries: entries.length,
        underReview,
        winners,
        quarantine,
        topVoteEntry: topVote,
        topJudgeEntry: topJudge,
        entriesLast7,
        quarantineLast7,
        statusMix,
      });
    })();
  }, []);

  return (
    <section>
      <h2>Operations snapshot</h2>
      <div className="admin-kpi-grid">
        <article className="admin-kpi-card">
          <p>Total entries</p>
          <h3>{state.totalEntries}</h3>
        </article>
        <article className="admin-kpi-card">
          <p>Under review</p>
          <h3>{state.underReview}</h3>
        </article>
        <article className="admin-kpi-card">
          <p>Winners</p>
          <h3>{state.winners}</h3>
        </article>
        <article className="admin-kpi-card">
          <p>Quarantined votes</p>
          <h3>{state.quarantine}</h3>
        </article>
        <article className="admin-kpi-card admin-kpi-card--wide">
          <p>Top by public voting</p>
          <h3>{state.topVoteEntry}</h3>
        </article>
        <article className="admin-kpi-card admin-kpi-card--wide">
          <p>Top by judging average</p>
          <h3>{state.topJudgeEntry}</h3>
        </article>
        <article className="admin-kpi-card admin-kpi-card--wide">
          <p>Entries trend (last 7 days)</p>
          <Sparkline points={state.entriesLast7} />
        </article>
        <article className="admin-kpi-card admin-kpi-card--wide">
          <p>Quarantine trend (last 7 days)</p>
          <Sparkline points={state.quarantineLast7} />
        </article>
        <article className="admin-kpi-card admin-kpi-card--wide">
          <p>Entry status distribution</p>
          <MiniBars items={state.statusMix} />
        </article>
      </div>
      {error ? <p className="admin-error">{error}</p> : null}
    </section>
  );
}
