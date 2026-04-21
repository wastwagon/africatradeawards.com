"use client";

import { useEffect, useMemo, useState } from "react";
import AdminDataTable, { type AdminTableColumn } from "@/components/admin/AdminDataTable";
import AdminMetricStrip from "@/components/admin/AdminMetricStrip";
import AdminPageHeader from "@/components/admin/AdminPageHeader";

type Row = {
  rank: number;
  averageScore: number;
  scoreCount: number;
  entry: {
    title: string;
    status: string;
    program?: { name: string };
    category?: { name: string };
    season?: { year: number };
  } | null;
};

export default function AdminLeaderboardPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<"all" | "top10" | "winners">("all");

  const columns: AdminTableColumn<Row>[] = [
    { key: "rank", header: "Rank", cell: (row) => row.rank, sortValue: (row) => row.rank },
    { key: "entry", header: "Entry", cell: (row) => row.entry?.title ?? "-", sortValue: (row) => row.entry?.title ?? "" },
    { key: "program", header: "Program", cell: (row) => row.entry?.program?.name ?? "-", sortValue: (row) => row.entry?.program?.name ?? "" },
    { key: "category", header: "Category", cell: (row) => row.entry?.category?.name ?? "-", sortValue: (row) => row.entry?.category?.name ?? "" },
    { key: "season", header: "Season", cell: (row) => row.entry?.season?.year ?? "-", sortValue: (row) => row.entry?.season?.year ?? 0 },
    {
      key: "status",
      header: "Status",
      cell: (row) => <span className={`admin-status-pill admin-status-pill--${(row.entry?.status ?? "unknown").toLowerCase()}`}>{row.entry?.status ?? "-"}</span>,
      sortValue: (row) => row.entry?.status ?? "",
    },
    { key: "average", header: "Average", cell: (row) => row.averageScore.toFixed(2), sortValue: (row) => row.averageScore },
    { key: "scores", header: "Scores", cell: (row) => row.scoreCount, sortValue: (row) => row.scoreCount },
  ];

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/judging/leaderboard");
      if (!res.ok) {
        setError("Failed to load leaderboard");
        return;
      }
      const data = await res.json();
      setRows(data.leaderboard ?? []);
    })();
  }, []);

  useEffect(() => {
    const saved = window.localStorage.getItem("admin_leaderboard_view");
    if (saved === "all" || saved === "top10" || saved === "winners") setView(saved);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("admin_leaderboard_view", view);
  }, [view]);

  const viewRows =
    view === "all" ? rows : view === "top10" ? rows.slice(0, 10) : rows.filter((row) => row.entry?.status === "WINNER");

  const boardAppend = useMemo(() => {
    if (!rows.length) return [];
    const avg = rows.reduce((s, r) => s + r.averageScore, 0) / rows.length;
    return [
      { label: "Judged entries", value: rows.length },
      { label: "Mean average", value: avg.toFixed(2) },
    ];
  }, [rows]);

  return (
    <main className="admin-page--wide">
      <AdminPageHeader title="Judging leaderboard" description="Average scores across judged entries." />
      <AdminMetricStrip mergeSnapshot appendItems={boardAppend} />
      {error ? <p className="admin-error">{error}</p> : null}
      <div className="admin-segment">
        <button type="button" className={view === "all" ? "is-active" : undefined} onClick={() => setView("all")}>
          All
        </button>
        <button type="button" className={view === "top10" ? "is-active" : undefined} onClick={() => setView("top10")}>
          Top 10
        </button>
        <button type="button" className={view === "winners" ? "is-active" : undefined} onClick={() => setView("winners")}>
          Winners only
        </button>
      </div>
      <AdminDataTable
        rows={viewRows}
        columns={columns}
        stickyFirstColumn
        rowKey={(row, index) => `${row.rank}-${row.entry?.title ?? "unknown"}-${index}`}
        rowSearchText={(row) =>
          [row.entry?.title, row.entry?.program?.name, row.entry?.category?.name, row.entry?.season?.year, row.entry?.status]
            .filter(Boolean)
            .join(" ")
        }
        searchPlaceholder="Search entry, status, program, category, or season"
        persistKey="leaderboard"
        exportFilename="judging-leaderboard.csv"
        exportRow={(row) => ({
          rank: row.rank,
          entry: row.entry?.title ?? "",
          program: row.entry?.program?.name ?? "",
          category: row.entry?.category?.name ?? "",
          season: row.entry?.season?.year ?? "",
          status: row.entry?.status ?? "",
          average: row.averageScore.toFixed(2),
          scores: row.scoreCount,
        })}
      />
    </main>
  );
}
