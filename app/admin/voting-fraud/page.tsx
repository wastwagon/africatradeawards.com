"use client";

import { useEffect, useState } from "react";

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

  return (
    <main>
      <h1>Voting Fraud Analytics</h1>
      <p>Monitor suspicious clustering by IP and device fingerprint.</p>
      <p>
        <strong>Votes pending fraud review:</strong> {quarantinePendingCount}
      </p>
      {error ? <p className="admin-error">{error}</p> : null}

      <section>
        <h2>Suspicious IP Hash Clusters (5+ votes)</h2>
        <ul>
          {suspiciousIp.map((row) => (
            <li key={row.ipHash}>
              {row.ipHash}: {row._count._all} votes
            </li>
          ))}
          {suspiciousIp.length === 0 ? <li>No suspicious IP clusters detected.</li> : null}
        </ul>
      </section>

      <section>
        <h2>Suspicious Fingerprint Clusters (3+ votes)</h2>
        <ul>
          {suspiciousFingerprint.map((row) => (
            <li key={row.fingerprintHash ?? "unknown"}>
              {row.fingerprintHash}: {row._count._all} votes
            </li>
          ))}
          {suspiciousFingerprint.length === 0 ? <li>No suspicious fingerprint clusters detected.</li> : null}
        </ul>
      </section>

      <section>
        <h2>Top Verification Request Sources</h2>
        <ul>
          {verificationStats.map((row) => (
            <li key={row.ipHash}>
              {row.ipHash}: {row._count._all} verification requests
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Recent One-Time Token Usage</h2>
        <ul>
          {tokenUsageRecent.map((row) => (
            <li key={row.id}>
              {new Date(row.usedAt).toLocaleString()} - entry {row.entryId} - {row.voterEmail || "no-email"}
            </li>
          ))}
          {tokenUsageRecent.length === 0 ? <li>No token usage yet.</li> : null}
        </ul>
      </section>
    </main>
  );
}
