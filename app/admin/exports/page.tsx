"use client";

import { useEffect, useMemo, useState } from "react";

type Program = { id: string; name: string; slug: string };
type Season = { id: string; year: number };

export default function AdminExportsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [programId, setProgramId] = useState("");
  const [seasonId, setSeasonId] = useState("");
  const [createdAfterLocal, setCreatedAfterLocal] = useState("");
  const [createdBeforeLocal, setCreatedBeforeLocal] = useState("");

  const query = useMemo(() => {
    const p = new URLSearchParams();
    if (programId) p.set("programId", programId);
    if (seasonId) p.set("seasonId", seasonId);
    if (createdAfterLocal) {
      const d = new Date(createdAfterLocal);
      if (!Number.isNaN(d.getTime())) p.set("createdAfter", d.toISOString());
    }
    if (createdBeforeLocal) {
      const d = new Date(createdBeforeLocal);
      if (!Number.isNaN(d.getTime())) p.set("createdBefore", d.toISOString());
    }
    const s = p.toString();
    return s ? `?${s}` : "";
  }, [programId, seasonId, createdAfterLocal, createdBeforeLocal]);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/programs");
      if (!res.ok) return;
      const data = await res.json();
      setPrograms(data.programs ?? []);
    })();
  }, []);

  useEffect(() => {
    if (!programId) {
      setSeasons([]);
      setSeasonId("");
      return;
    }
    (async () => {
      const res = await fetch(`/api/programs/${programId}/seasons`);
      if (!res.ok) return;
      const data = await res.json();
      setSeasons(data.seasons ?? []);
    })();
  }, [programId]);

  const rows = [
    { href: `/api/exports/entries${query}`, label: "Entries (CSV)" },
    { href: `/api/exports/users${query}`, label: "Users (CSV) — filtered by program when selected" },
    { href: `/api/exports/votes${query}`, label: "Public votes (CSV)" },
    { href: `/api/exports/scores${query}`, label: "Judge scores (CSV)" },
    { href: `/api/exports/pack${query}`, label: "ZIP — all four files above" },
  ];

  return (
    <main>
      <h1>Data exports</h1>
      <p>
        Optional filters apply to entries, votes, scores, and the ZIP pack. Program and season narrow rows; date range
        filters each file by its own timestamps (entry created, vote cast, score saved, user registered). Users CSV
        still respects program scope when a program is selected.
      </p>

      <div className="admin-form admin-form--compact">
        <label>
          Program (optional)
          <select
            value={programId}
            onChange={(e) => setProgramId(e.target.value)}
          >
            <option value="">All programs</option>
            {programs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.slug})
              </option>
            ))}
          </select>
        </label>
        <label>
          Season (optional)
          <select
            value={seasonId}
            onChange={(e) => setSeasonId(e.target.value)}
            disabled={!programId}
          >
            <option value="">All seasons in program</option>
            {seasons.map((s) => (
              <option key={s.id} value={s.id}>
                {s.year}
              </option>
            ))}
          </select>
        </label>
        <label>
          Created after (optional, local time)
          <input
            type="datetime-local"
            value={createdAfterLocal}
            onChange={(e) => setCreatedAfterLocal(e.target.value)}
          />
        </label>
        <label>
          Created before (optional, local time)
          <input
            type="datetime-local"
            value={createdBeforeLocal}
            onChange={(e) => setCreatedBeforeLocal(e.target.value)}
          />
        </label>
      </div>

      <ul className="admin-link-list">
        {rows.map((item) => (
          <li key={item.href}>
            <a href={item.href}>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
