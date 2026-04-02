"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import PlatformSiteChrome from "@/components/platform/PlatformSiteChrome";

type VoteEntry = {
  id: string;
  title: string;
  status: string;
  voteCount: number;
  category?: { name: string };
  program?: { name: string };
  season?: { year: number };
};

function PublicVotingInner() {
  const searchParams = useSearchParams();
  const [entries, setEntries] = useState<VoteEntry[]>([]);
  const [email, setEmail] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [verifiedEntryId, setVerifiedEntryId] = useState("");
  const [selectedEntryId, setSelectedEntryId] = useState("");
  const [voteToken, setVoteToken] = useState("");
  const [challengeToken, setChallengeToken] = useState("");
  const [challengeReadyAt, setChallengeReadyAt] = useState<number>(0);
  const [honeypot, setHoneypot] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const fingerprint = useMemo(
    () =>
      typeof navigator !== "undefined"
        ? [navigator.userAgent, navigator.language, Intl.DateTimeFormat().resolvedOptions().timeZone].join("|")
        : "",
    [],
  );

  async function loadEntries() {
    const res = await fetch("/api/voting/entries");
    if (!res.ok) {
      setError("Failed to load entries");
      return;
    }
    const data = await res.json();
    setEntries(data.entries ?? []);
  }

  useEffect(() => {
    loadEntries();
    const token = searchParams.get("token");
    if (token) setVoteToken(token);
  }, [searchParams]);

  useEffect(() => {
    if (!selectedEntryId) return;
    void (async () => {
      const res = await fetch("/api/voting/challenge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entryId: selectedEntryId,
          voterEmail: email || undefined,
        }),
      });
      if (!res.ok) return;
      const data = await res.json();
      setChallengeToken(data.challengeToken ?? "");
      setChallengeReadyAt(Date.now() + (data.minWaitSeconds ?? 5) * 1000);
    })();
  }, [selectedEntryId, email]);

  async function castVote(entryId: string) {
    setError(null);
    setMessage(null);
    const res = await fetch("/api/voting/cast", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        entryId,
        voterEmail: email || undefined,
        verificationId: verificationId || undefined,
        voteToken: voteToken || undefined,
        challengeToken: challengeToken || undefined,
        fingerprint: fingerprint || undefined,
        hp: honeypot,
      }),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError((body.error as string) ?? "Vote failed");
      return;
    }
    setMessage(
      body.pendingReview
        ? (typeof body.message === "string" ? body.message : null) ??
            "Your vote is held for fraud review. It will count after an admin approves it."
        : "Vote submitted.",
    );
    await loadEntries();
  }

  async function requestCode() {
    setError(null);
    setMessage(null);
    if (!selectedEntryId || !email) {
      setError("Select an entry and enter email first");
      return;
    }
    const res = await fetch("/api/voting/request-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entryId: selectedEntryId, voterEmail: email }),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError((body.error as string) ?? "Could not request code");
      return;
    }
    setVerificationId(body.verificationId);
    setMessage("Verification code sent to your email.");
  }

  async function requestVoteLink() {
    setError(null);
    setMessage(null);
    if (!selectedEntryId || !email) {
      setError("Select an entry and enter email first");
      return;
    }
    const res = await fetch("/api/voting/request-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entryId: selectedEntryId, voterEmail: email }),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError((body.error as string) ?? "Could not send vote link");
      return;
    }
    setMessage("Secure vote link sent to your email.");
  }

  async function verifyCode() {
    setError(null);
    setMessage(null);
    const res = await fetch("/api/voting/verify-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ verificationId, code: verificationCode }),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError((body.error as string) ?? "Could not verify code");
      return;
    }
    setVerifiedEntryId(body.entryId);
    setMessage("Email verified. You can now vote.");
  }

  return (
    <PlatformSiteChrome>
      <section className="platform-page">
        <div className="container">
          <div className="platform-page-header">
            <p className="platform-eyebrow">Africa Trade Awards · Public vote</p>
            <h1 className="platform-title">Cast your vote</h1>
            <p className="platform-lead">
              Choose a shortlisted or winning entry, complete verification when required, and submit your vote. Duplicate
              votes from the same network are blocked to protect integrity.
            </p>
          </div>

          <div className="platform-card" style={{ marginBottom: 28 }}>
            <h2 className="platform-title" style={{ fontSize: "1.25rem", marginBottom: 16 }}>
              Verification
            </h2>
            <label className="platform-field">
              Optional email (for code or secure link)
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" type="email" />
            </label>
            <input
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              style={{ position: "absolute", left: -10000, top: "auto", width: 1, height: 1, overflow: "hidden" }}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden
            />
            <div className="platform-vote-row">
              <label className="platform-field" style={{ marginBottom: 0, minWidth: 240, flex: "1 1 220px" }}>
                Entry for verification
                <select value={selectedEntryId} onChange={(e) => setSelectedEntryId(e.target.value)}>
                  <option value="">Choose an entry…</option>
                  {entries.map((entry) => (
                    <option key={entry.id} value={entry.id}>
                      {entry.title}
                    </option>
                  ))}
                </select>
              </label>
              <button type="button" className="vl-btn1" onClick={requestCode}>
                Request code
              </button>
              <button type="button" className="vl-btn1" onClick={requestVoteLink}>
                Email secure link
              </button>
            </div>
            <div className="platform-vote-row">
              <input
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="6-digit code"
                maxLength={6}
                style={{
                  padding: "12px 14px",
                  borderRadius: 10,
                  border: "1px solid rgba(78, 43, 90, 0.18)",
                  maxWidth: 160,
                }}
              />
              <button type="button" className="vl-btn1" onClick={verifyCode} disabled={!verificationId || verificationCode.length !== 6}>
                Verify code
              </button>
            </div>
            {error ? <p className="platform-msg-error">{error}</p> : null}
            {message ? <p className="platform-msg-ok">{message}</p> : null}
            {challengeReadyAt > Date.now() ? (
              <p className="platform-muted">
                Security check in progress. You can vote in about {Math.ceil((challengeReadyAt - Date.now()) / 1000)} seconds.
              </p>
            ) : null}
          </div>

          <div className="platform-grid">
            {entries.map((entry) => (
              <div key={entry.id} className="platform-card">
                <h3 className="platform-title" style={{ fontSize: "1.15rem", marginBottom: 8 }}>
                  {entry.title}
                </h3>
                <p className="platform-muted" style={{ marginBottom: 8 }}>
                  {entry.program?.name} · {entry.category?.name} · {entry.season?.year} · {entry.status}
                </p>
                <p className="platform-muted" style={{ marginBottom: 16 }}>
                  <strong>{entry.voteCount}</strong> validated votes
                </p>
                <button
                  type="button"
                  className="vl-btn1"
                  onClick={() => castVote(entry.id)}
                  disabled={
                    Boolean(verificationId && verifiedEntryId && verifiedEntryId !== entry.id) ||
                    !challengeToken ||
                    challengeReadyAt > Date.now()
                  }
                >
                  Vote for this entry
                </button>
              </div>
            ))}
          </div>

          <p className="platform-muted text-center" style={{ marginTop: 32, marginBottom: 0 }}>
            <Link href="/login/">Staff or judge sign-in</Link>
            {" · "}
            <Link href="/">Back to website</Link>
          </p>
        </div>
      </section>
    </PlatformSiteChrome>
  );
}

function VoteFallback() {
  return (
    <PlatformSiteChrome>
      <section className="platform-page">
        <div className="container text-center">
          <p className="platform-lead">Loading voting…</p>
        </div>
      </section>
    </PlatformSiteChrome>
  );
}

export default function PublicVotingPage() {
  return (
    <Suspense fallback={<VoteFallback />}>
      <PublicVotingInner />
    </Suspense>
  );
}
