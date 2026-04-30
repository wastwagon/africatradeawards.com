"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { UserRole } from "@prisma/client";
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

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

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
  const [challengeEntryId, setChallengeEntryId] = useState("");
  const [challengeReadyAt, setChallengeReadyAt] = useState(0);
  const [requireChallenge, setRequireChallenge] = useState(true);
  const [honeypot, setHoneypot] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isCasting, setIsCasting] = useState(false);
  const [votingEntryId, setVotingEntryId] = useState<string | null>(null);
  const [me, setMe] = useState<{ role: UserRole } | null | undefined>(undefined);
  const challengeCacheRef = useRef<{ token: string; entryId: string; readyAt: number }>({
    token: "",
    entryId: "",
    readyAt: 0,
  });
  const fingerprint = useMemo(
    () =>
      typeof navigator !== "undefined"
        ? [navigator.userAgent, navigator.language, Intl.DateTimeFormat().resolvedOptions().timeZone].join("|")
        : "",
    [],
  );

  function syncChallengeState(token: string, entryId: string, readyAt: number) {
    challengeCacheRef.current = { token, entryId, readyAt };
    setChallengeToken(token);
    setChallengeEntryId(entryId);
    setChallengeReadyAt(readyAt);
  }

  async function loadEntries() {
    const res = await fetch("/api/voting/entries/");
    if (!res.ok) {
      setError("Failed to load entries");
      return;
    }
    const data = await res.json();
    setEntries(data.entries ?? []);
    setRequireChallenge(data.requireChallenge !== false);
  }

  useEffect(() => {
    loadEntries();
    const token = searchParams.get("token");
    if (token) setVoteToken(token);
  }, [searchParams]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch("/api/auth/me/", { credentials: "include" });
        if (cancelled) return;
        if (!res.ok) {
          setMe(null);
          return;
        }
        const data = await res.json();
        const role = data.user?.role as UserRole | undefined;
        setMe(role ? { role } : null);
      } catch {
        if (!cancelled) setMe(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  /** Ensures a valid challenge JWT for entryId and waits until server dwell passes. */
  async function ensureChallengeForEntry(entryId: string): Promise<boolean> {
    const now = Date.now();
    const c = challengeCacheRef.current;
    if (c.token && c.entryId === entryId && now >= c.readyAt) {
      syncChallengeState(c.token, c.entryId, c.readyAt);
      return true;
    }
    if (c.token && c.entryId === entryId && now < c.readyAt) {
      await delay(Math.max(0, c.readyAt - now) + 150);
      return true;
    }

    const res = await fetch("/api/voting/challenge/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        entryId,
        voterEmail: email || undefined,
      }),
    });
    if (!res.ok) {
      return false;
    }
    const data = await res.json();
    const token = typeof data.challengeToken === "string" ? data.challengeToken : "";
    const resolvedEntryId = typeof data.entryId === "string" ? data.entryId : entryId;
    const minSec = typeof data.minWaitSeconds === "number" ? data.minWaitSeconds : 5;
    const readyAt = Date.now() + minSec * 1000;
    syncChallengeState(token, resolvedEntryId, readyAt);
    await delay(0);
    if (Date.now() < readyAt) {
      await delay(Math.max(0, readyAt - Date.now()) + 150);
    }
    return true;
  }

  async function castVote(entryId: string) {
    if (isCasting) return;
    setError(null);
    setMessage(null);
    setIsCasting(true);
    setVotingEntryId(entryId);
    try {
      if (requireChallenge) {
        const ok = await ensureChallengeForEntry(entryId);
        if (!ok) {
          setError("Could not start the voting security check. Please try again.");
          return;
        }
      }

      const res = await fetch("/api/voting/cast/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entryId,
          voterEmail: email || undefined,
          verificationId: verificationId || undefined,
          voteToken: voteToken || undefined,
          challengeToken: requireChallenge ? challengeCacheRef.current.token : undefined,
          fingerprint: fingerprint || undefined,
          hp: honeypot,
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        const raw = (body.error as string) ?? "Vote failed";
        if (raw.includes("Please wait a few seconds")) {
          setError("Almost ready — wait a few seconds after the security check, then try again.");
        } else {
          setError(raw);
        }
        return;
      }
      setMessage(
        body.pendingReview
          ? (typeof body.message === "string" ? body.message : null) ??
              "Your vote is held for fraud review. It will count after an admin approves it."
          : "Vote submitted.",
      );
      await loadEntries();
    } finally {
      setIsCasting(false);
      setVotingEntryId(null);
    }
  }

  async function requestCode() {
    setError(null);
    setMessage(null);
    if (!selectedEntryId || !email) {
      setError("Select an entry and enter email first");
      return;
    }
    const res = await fetch("/api/voting/request-code/", {
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
    if (typeof body.devCode === "string" && /^[0-9]{6}$/.test(body.devCode)) {
      setVerificationCode(body.devCode);
      setMessage(
        "Local bypass (no SMTP): code filled below. Use Verify code, then vote. Remove VOTING_DEV_EMAIL_BYPASS in production.",
      );
      return;
    }
    setMessage("Verification code sent to your email.");
  }

  async function requestVoteLink() {
    setError(null);
    setMessage(null);
    if (!selectedEntryId || !email) {
      setError("Select an entry and enter email first");
      return;
    }
    const res = await fetch("/api/voting/request-link/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entryId: selectedEntryId, voterEmail: email }),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError((body.error as string) ?? "Could not send vote link");
      return;
    }
    if (typeof body.devVoteUrl === "string" && body.devVoteUrl.startsWith("http")) {
      setMessage(
        `Local bypass (no SMTP): open this link in this browser: ${body.devVoteUrl} — remove VOTING_DEV_EMAIL_BYPASS in production.`,
      );
      return;
    }
    setMessage("Secure vote link sent to your email.");
  }

  async function verifyCode() {
    setError(null);
    setMessage(null);
    const res = await fetch("/api/voting/verify-code/", {
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

  const dwellActive = challengeReadyAt > Date.now() && Boolean(challengeEntryId);

  return (
    <PlatformSiteChrome>
      <section className="platform-page">
        <div className="container">
          <div className="platform-page-header platform-page-header--center">
            <p className="platform-eyebrow">Africa Trade Awards · Public vote</p>
            <h1 className="platform-title">Cast your vote</h1>
            <p className="platform-lead">
              Choose a shortlisted or winning entry, complete verification when required, and submit your vote. Duplicate
              votes from the same network are blocked to protect integrity.
            </p>
          </div>

          {me === undefined ? null : me?.role === UserRole.VOTER ? (
            <div className="platform-card" style={{ marginBottom: 24, borderColor: "rgba(78, 43, 90, 0.22)" }}>
              <p className="platform-lead" style={{ marginBottom: 12 }}>
                You are signed in as a voter. Votes you cast from this browser session are linked to your dashboard so you
                can follow standings.
              </p>
              <Link href="/portal/voter/" className="vl-btn1" style={{ display: "inline-block", textDecoration: "none" }}>
                Open my voter dashboard
              </Link>
            </div>
          ) : (
            <div className="platform-card" style={{ marginBottom: 24, borderColor: "rgba(78, 43, 90, 0.22)" }}>
              <p className="platform-lead" style={{ marginBottom: 12 }}>
                {me
                  ? "Want to track how your picks perform? Use a free voter account and stay signed in while you vote."
                  : "Create a free voter account and stay signed in while you vote to track how your picks perform in each category."}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                <Link href="/register/?next=%2Fvote%2F" className="vl-btn1" style={{ textDecoration: "none" }}>
                  Create voter account
                </Link>
                <Link
                  href="/login/?next=%2Fvote%2F"
                  className="vl-btn1"
                  style={{ textDecoration: "none", opacity: 0.92 }}
                >
                  Voter sign in
                </Link>
              </div>
            </div>
          )}

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
            {dwellActive ? (
              <p className="platform-muted">
                Security check for this vote: wait about {Math.ceil((challengeReadyAt - Date.now()) / 1000)} seconds, then
                use Vote on the same entry.
              </p>
            ) : null}
          </div>

          <div className="platform-grid">
            {entries.map((entry) => {
              const blockedByVerification = Boolean(verificationId && verifiedEntryId && verifiedEntryId !== entry.id);
              const votingThis = isCasting && votingEntryId === entry.id;
              const votingOther = isCasting && votingEntryId !== null && votingEntryId !== entry.id;
              const blockedByWarmup = dwellActive && challengeEntryId !== entry.id;
              const disabled = blockedByVerification || votingOther || blockedByWarmup || votingThis;

              return (
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
                  <button type="button" className="vl-btn1" onClick={() => castVote(entry.id)} disabled={disabled}>
                    {votingThis ? "Submitting…" : "Vote for this entry"}
                  </button>
                </div>
              );
            })}
          </div>

          <p className="platform-muted text-center" style={{ marginTop: 32, marginBottom: 0 }}>
            <Link href="/login/">Staff or entrant sign-in</Link>
            {" · "}
            <Link href="/register/">Voter registration</Link>
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
