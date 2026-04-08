"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export type AdminMetricItem = {
  label: string;
  value: string | number;
  tone?: "default" | "warn" | "ok";
};

type Props = {
  /** When defined (including []), only these metrics are shown—no snapshot fetch. */
  items?: AdminMetricItem[];
  /** Fetches cross-cutting ops counts and prepends them (unless `items` is set). */
  mergeSnapshot?: boolean;
  /** Appended after snapshot chips when using mergeSnapshot. */
  appendItems?: AdminMetricItem[];
  showDashboardLink?: boolean;
};

export default function AdminMetricStrip({
  items,
  mergeSnapshot = false,
  appendItems,
  showDashboardLink = true,
}: Props) {
  const [snapshot, setSnapshot] = useState<AdminMetricItem[]>([]);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (items !== undefined) return;
    if (!mergeSnapshot) return;

    let cancelled = false;
    (async () => {
      const [entriesRes, quarantineRes, votingRes, leaderboardRes] = await Promise.all([
        fetch("/api/entries"),
        fetch("/api/voting/quarantine"),
        fetch("/api/voting/results"),
        fetch("/api/judging/leaderboard"),
      ]);
      if (cancelled) return;
      if (!entriesRes.ok || !quarantineRes.ok || !votingRes.ok || !leaderboardRes.ok) {
        setFailed(true);
        return;
      }
      const [e, q, v, l] = await Promise.all([entriesRes.json(), quarantineRes.json(), votingRes.json(), leaderboardRes.json()]);
      const entries = e.entries ?? [];
      const quarantine = q.votes ?? [];
      const voteRows = v.results ?? [];
      const judged = l.leaderboard ?? [];
      const totalVotes = voteRows.reduce((s: number, r: { votes?: number }) => s + (r.votes ?? 0), 0);
      setSnapshot([
        { label: "Entries", value: entries.length },
        { label: "Quarantine", value: quarantine.length, tone: quarantine.length ? "warn" : "ok" },
        { label: "Vote rows", value: voteRows.length },
        { label: "Votes cast", value: totalVotes },
        { label: "Judged", value: judged.length },
      ]);
      setFailed(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [items, mergeSnapshot]);

  const display = useMemo(() => {
    if (items !== undefined) return items;
    if (mergeSnapshot) return [...snapshot, ...(appendItems ?? [])];
    return appendItems ?? [];
  }, [items, mergeSnapshot, snapshot, appendItems]);

  if (items !== undefined && items.length === 0) return null;
  if (!display.length && !failed && !mergeSnapshot && !(appendItems?.length)) return null;

  const loadingSnapshot =
    mergeSnapshot && items === undefined && snapshot.length === 0 && !failed && !(appendItems?.length);

  return (
    <div className="admin-metric-strip-wrap">
      <div className="admin-metric-strip" role="region" aria-label="Key metrics">
        {loadingSnapshot ? (
          <p className="admin-metric-strip__fallback">Loading live metrics…</p>
        ) : null}
        {display.map((m) => (
          <div
            key={`${m.label}-${String(m.value)}`}
            className={`admin-metric-chip admin-metric-chip--${m.tone ?? "default"}`}
          >
            <span className="admin-metric-chip__label">{m.label}</span>
            <span className="admin-metric-chip__value">{m.value}</span>
          </div>
        ))}
        {failed && snapshot.length === 0 && mergeSnapshot && !appendItems?.length ? (
          <p className="admin-metric-strip__fallback">Live metrics unavailable.</p>
        ) : null}
      </div>
      {showDashboardLink ? (
        <Link href="/admin/" className="admin-metric-strip__link">
          Full operations snapshot →
        </Link>
      ) : null}
    </div>
  );
}
