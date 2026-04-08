"use client";

import { useEffect, useMemo, useState } from "react";
import AdminMetricStrip from "@/components/admin/AdminMetricStrip";

type Entry = {
  id: string;
  title: string;
  status: string;
  entrantId: string;
  program?: { name: string };
  category?: { name: string };
  season?: { year: number };
};

export default function AdminCertificatesPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/entries");
      if (!res.ok) {
        setError("Failed to load entries");
        return;
      }
      const data = await res.json();
      const winners = (data.entries ?? []).filter((e: Entry) => e.status === "WINNER");
      setEntries(winners);
    })();
  }, []);

  async function downloadCertificate(entryId: string) {
    const res = await fetch("/api/certificates/winner", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entryId }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "Failed to generate certificate");
      return;
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `winner-certificate-${entryId}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  const certAppend = useMemo(() => [{ label: "Winners listed", value: entries.length }], [entries.length]);

  return (
    <main>
      <h1>Winner Certificates</h1>
      <p className="admin-muted">Generate downloadable PDF certificates for entries marked as WINNER.</p>
      <AdminMetricStrip mergeSnapshot appendItems={certAppend} />
      {error ? <p className="admin-error">{error}</p> : null}
      {entries.length === 0 ? <p>No winners found yet.</p> : null}
      <ul className="admin-card-list">
        {entries.map((entry) => (
          <li key={entry.id}>
            <div className="admin-first-col-cell">
              <span>
                {entry.title} — {entry.program?.name} / {entry.category?.name} / {entry.season?.year}
              </span>
              <div className="admin-inline-actions admin-actions-row--tight">
                <button type="button" onClick={() => downloadCertificate(entry.id)}>
                  Download PDF
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
