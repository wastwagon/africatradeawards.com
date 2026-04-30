"use client";

import { EntryStatus } from "@prisma/client";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminSection from "@/components/admin/AdminSection";

type EntryRow = {
  id: string;
  title: string;
  status: string;
};

function formatLabel(raw: string): string {
  return raw.replace(/_/g, " ");
}

export default function EntrantDashboardPage() {
  const [entries, setEntries] = useState<EntryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/entries/", { cache: "no-store" });
    if (!res.ok) {
      setError("Could not load your entries.");
      setEntries([]);
      setLoading(false);
      return;
    }
    const data = await res.json();
    setEntries(data.entries ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const stats = useMemo(() => {
    const total = entries.length;
    const drafts = entries.filter((e) => e.status === EntryStatus.DRAFT).length;
    const submitted = entries.filter((e) => e.status !== EntryStatus.DRAFT).length;
    return { total, drafts, submitted };
  }, [entries]);

  return (
    <div className="admin-page--wide">
      <AdminPageHeader
        eyebrow="Entrant hub"
        title="Dashboard"
        description="Overview of your award submissions. Manage drafts, uploads, and submission from Manage entries."
        actions={
          <div className="admin-inline-actions">
            <Link href="/portal/entrant/entry/" className="admin-quick-action">
              Manage entries
            </Link>
            <button type="button" className="admin-quick-action" onClick={() => void load()} disabled={loading}>
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

      {loading ? (
        <AdminSection title="Loading">
          <p className="admin-muted admin-muted-flat">Loading your entries…</p>
        </AdminSection>
      ) : (
        <>
          <div className="admin-kpi-grid" style={{ marginBottom: 18 }}>
            <div className="admin-kpi-card">
              <p>Total entries</p>
              <h3>{stats.total}</h3>
            </div>
            <div className="admin-kpi-card">
              <p>Drafts</p>
              <h3>{stats.drafts}</h3>
            </div>
            <div className="admin-kpi-card">
              <p>Submitted / in review</p>
              <h3>{stats.submitted}</h3>
            </div>
          </div>

          <AdminSection title="Your entries">
            {entries.length === 0 ? (
              <p className="admin-muted admin-muted-flat">
                You have no entries yet.{" "}
                <Link href="/portal/entrant/entry/" style={{ fontWeight: 700 }}>
                  Create a draft
                </Link>{" "}
                to get started.
              </p>
            ) : (
              <div className="admin-card-grid">
                {entries.map((entry) => (
                  <article key={entry.id} className="admin-panel" style={{ margin: 0 }}>
                    <h3 style={{ margin: "0 0 8px", fontSize: "1.05rem", color: "var(--admin-accent-strong)" }}>
                      {entry.title}
                    </h3>
                    <p className="admin-subline" style={{ marginBottom: 12 }}>
                      Status: <strong>{formatLabel(entry.status)}</strong>
                    </p>
                    <Link
                      href={`/portal/entrant/entry/?select=${encodeURIComponent(entry.id)}`}
                      className="admin-quick-action"
                    >
                      Open in workspace
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </AdminSection>
        </>
      )}
    </div>
  );
}
