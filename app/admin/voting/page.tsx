"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AdminDataTable, { type AdminTableColumn } from "@/components/admin/AdminDataTable";
import AdminMetricStrip from "@/components/admin/AdminMetricStrip";

type ResultRow = {
  rank: number;
  votes: number;
  entry: {
    title: string;
    program?: { name: string };
    category?: { name: string };
    season?: { year: number };
  } | null;
};

export default function AdminVotingResultsPage() {
  const [results, setResults] = useState<ResultRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<"all" | "top10" | "high">("all");

  const columns: AdminTableColumn<ResultRow>[] = [
    { key: "rank", header: "Rank", cell: (row) => row.rank, sortValue: (row) => row.rank },
    { key: "entry", header: "Entry", cell: (row) => row.entry?.title ?? "-", sortValue: (row) => row.entry?.title ?? "" },
    { key: "program", header: "Program", cell: (row) => row.entry?.program?.name ?? "-", sortValue: (row) => row.entry?.program?.name ?? "" },
    { key: "category", header: "Category", cell: (row) => row.entry?.category?.name ?? "-", sortValue: (row) => row.entry?.category?.name ?? "" },
    { key: "season", header: "Season", cell: (row) => row.entry?.season?.year ?? "-", sortValue: (row) => row.entry?.season?.year ?? 0 },
    { key: "votes", header: "Votes", cell: (row) => row.votes, sortValue: (row) => row.votes },
  ];

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/voting/results");
      if (!res.ok) {
        setError("Failed to load voting results");
        return;
      }
      const data = await res.json();
      setResults(data.results ?? []);
    })();
  }, []);

  useEffect(() => {
    const saved = window.localStorage.getItem("admin_voting_view");
    if (saved === "all" || saved === "top10" || saved === "high") setView(saved);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("admin_voting_view", view);
  }, [view]);

  const viewRows =
    view === "all" ? results : view === "top10" ? results.slice(0, 10) : results.filter((row) => row.votes >= 10);

  const voteAppend = useMemo(() => {
    if (!results.length) return [];
    const total = results.reduce((s, r) => s + r.votes, 0);
    return [
      { label: "Ranked entries", value: results.length },
      { label: "Votes (all ranks)", value: total },
    ];
  }, [results]);

  return (
    <main>
      <h1>Public Voting Results</h1>
      <p className="admin-muted">
        Rankings use the same rules as the public vote page: only{" "}
        <strong>shortlisted</strong> and <strong>winner</strong> entries, counting <strong>validated</strong> votes only.
        Order matches public ordering (by vote total). For quarantined or suspicious activity, see{" "}
        <Link href="/admin/voting-quarantine">Vote quarantine</Link> and{" "}
        <Link href="/admin/voting-fraud">Voting fraud analytics</Link>. Public page:{" "}
        <Link href="/vote">/vote</Link>.
      </p>
      <AdminMetricStrip mergeSnapshot appendItems={voteAppend} />
      {error ? <p className="admin-error">{error}</p> : null}
      <div className="admin-segment">
        <button type="button" className={view === "all" ? "is-active" : undefined} onClick={() => setView("all")}>
          All
        </button>
        <button type="button" className={view === "top10" ? "is-active" : undefined} onClick={() => setView("top10")}>
          Top 10
        </button>
        <button type="button" className={view === "high" ? "is-active" : undefined} onClick={() => setView("high")}>
          10+ votes
        </button>
      </div>
      <AdminDataTable
        rows={viewRows}
        columns={columns}
        stickyFirstColumn
        rowKey={(row, index) => `${row.rank}-${row.entry?.title ?? "unknown"}-${index}`}
        rowSearchText={(row) =>
          [row.entry?.title, row.entry?.program?.name, row.entry?.category?.name, row.entry?.season?.year]
            .filter(Boolean)
            .join(" ")
        }
        searchPlaceholder="Search entry, program, category, or season"
        persistKey="voting"
        exportFilename="voting-results.csv"
        exportRow={(row) => ({
          rank: row.rank,
          entry: row.entry?.title ?? "",
          program: row.entry?.program?.name ?? "",
          category: row.entry?.category?.name ?? "",
          season: row.entry?.season?.year ?? "",
          votes: row.votes,
        })}
      />
    </main>
  );
}
