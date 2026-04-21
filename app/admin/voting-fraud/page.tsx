"use client";

import { useEffect, useMemo, useState } from "react";
import AdminMetricStrip from "@/components/admin/AdminMetricStrip";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminSection from "@/components/admin/AdminSection";

type CountRow = {
  _count: { _all: number };
  ipHash?: string;
  fingerprintHash?: string | null;
};

type TokenUsage = {
  id: string;
  entryId: string;
  voterEmail?: string | null;
  usedAt: string;
};

export default function VotingFraudPage() {
  const [suspiciousIp, setSuspiciousIp] = useState<CountRow[]>([]);
  const [suspiciousFingerprint, setSuspiciousFingerprint] = useState<CountRow[]>([]);
  const [verificationStats, setVerificationStats] = useState<CountRow[]>([]);
  const [tokenUsageRecent, setTokenUsageRecent] = useState<TokenUsage[]>([]);
  const [quarantinePendingCount, setQuarantinePendingCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/voting/fraud-report");
      if (!res.ok) {
        setError("Failed to load fraud report");
        return;
      }
      const data = await res.json();
      setSuspiciousIp(data.suspiciousIp ?? []);
      setSuspiciousFingerprint(data.suspiciousFingerprint ?? []);
      setVerificationStats(data.verificationStats ?? []);
      setTokenUsageRecent(data.tokenUsageRecent ?? []);
      setQuarantinePendingCount(data.quarantinePendingCount ?? 0);
    })();
  }, []);

  const fraudAppend = useMemo(
    () => [
      {
        label: "Pending review",
        value: quarantinePendingCount,
        tone: quarantinePendingCount ? ("warn" as const) : ("ok" as const),
      },
      { label: "IP clusters (5+)", value: suspiciousIp.length },
      { label: "Device clusters (3+)", value: suspiciousFingerprint.length },
      { label: "Verify sources", value: verificationStats.length },
    ],
    [quarantinePendingCount, suspiciousIp.length, suspiciousFingerprint.length, verificationStats.length],
  );

  return (
    <main className="admin-page--wide">
      <AdminPageHeader
        title="Voting fraud analytics"
        description="Monitor suspicious clustering by IP and device fingerprint."
      />
      <AdminMetricStrip mergeSnapshot appendItems={fraudAppend} />
      {error ? <p className="admin-error">{error}</p> : null}

      <AdminSection title="Suspicious IP hash clusters (5+ votes)">
        <ul>
          {suspiciousIp.map((row) => (
            <li key={row.ipHash}>
              {row.ipHash}: {row._count._all} votes
            </li>
          ))}
          {suspiciousIp.length === 0 ? <li>No suspicious IP clusters detected.</li> : null}
        </ul>
      </AdminSection>

      <AdminSection title="Suspicious fingerprint clusters (3+ votes)">
        <ul>
          {suspiciousFingerprint.map((row) => (
            <li key={row.fingerprintHash ?? "unknown"}>
              {row.fingerprintHash}: {row._count._all} votes
            </li>
          ))}
          {suspiciousFingerprint.length === 0 ? <li>No suspicious fingerprint clusters detected.</li> : null}
        </ul>
      </AdminSection>

      <AdminSection title="Top verification request sources">
        <ul>
          {verificationStats.map((row) => (
            <li key={row.ipHash}>
              {row.ipHash}: {row._count._all} verification requests
            </li>
          ))}
        </ul>
      </AdminSection>

      <AdminSection title="Recent one-time token usage">
        <ul>
          {tokenUsageRecent.map((row) => (
            <li key={row.id}>
              {new Date(row.usedAt).toLocaleString()} - entry {row.entryId} - {row.voterEmail || "no-email"}
            </li>
          ))}
          {tokenUsageRecent.length === 0 ? <li>No token usage yet.</li> : null}
        </ul>
      </AdminSection>
    </main>
  );
}
