"use client";

import { FormEvent, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Layout from "@/components/layout/Layout";

const SUMMARY_MIN_LENGTH = 20;

type NominationStatusResponse = {
  ok?: boolean;
  nomination?: {
    id: string;
    status: string;
    nomineeFullName: string;
    nomineeEmail: string | null;
    nomineeOrganization: string | null;
    nomineeRoleTitle: string | null;
    summary: string;
    evidenceLinks: string | null;
    createdAt: string;
    reviewedAt: string | null;
    reviewNote: string | null;
    source: string;
    publicTrackingTokenExpiresAt: string | null;
    program?: { name: string };
    season?: { year: number };
    category?: { name: string };
    convertedEntry?: { id: string; title: string; status: string } | null;
  };
  editable?: boolean;
  nextTrackingToken?: string;
  nextTrackingUrl?: string;
  error?: string;
};

export default function NominationStatusPage() {
  const searchParams = useSearchParams();
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [linkRequesting, setLinkRequesting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [editable, setEditable] = useState(false);
  const [trackingInfo, setTrackingInfo] = useState<{ token: string; url: string } | null>(null);
  const [data, setData] = useState<NominationStatusResponse["nomination"] | null>(null);
  const [form, setForm] = useState({
    nomineeFullName: "",
    nomineeEmail: "",
    nomineeOrganization: "",
    nomineeRoleTitle: "",
    summary: "",
    evidenceLinks: "",
  });
  const [linkRecovery, setLinkRecovery] = useState({
    nominatorEmail: "",
    nomineeFullName: "",
  });

  async function loadStatus(nextToken: string) {
    if (!nextToken.trim()) return;
    setLoading(true);
    setError(null);
    setMessage(null);
    const res = await fetch(`/api/nominations/public/status?token=${encodeURIComponent(nextToken)}`, { cache: "no-store" });
    const body = (await res.json().catch(() => ({}))) as NominationStatusResponse;
    setLoading(false);
    if (!res.ok) {
      setError(body.error ?? "Could not load nomination status.");
      return;
    }
    setTrackingInfo(null);
    setEditable(Boolean(body.editable));
    const nomination = body.nomination ?? null;
    setData(nomination);
    if (nomination) {
      setForm({
        nomineeFullName: nomination.nomineeFullName ?? "",
        nomineeEmail: nomination.nomineeEmail ?? "",
        nomineeOrganization: nomination.nomineeOrganization ?? "",
        nomineeRoleTitle: nomination.nomineeRoleTitle ?? "",
        summary: nomination.summary ?? "",
        evidenceLinks: nomination.evidenceLinks ?? "",
      });
    }
  }

  useEffect(() => {
    const tokenFromQuery = (searchParams.get("token") ?? "").trim();
    if (!tokenFromQuery) return;
    setToken(tokenFromQuery);
    void loadStatus(tokenFromQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setData(null);
    await loadStatus(token);
  }

  async function saveEdits() {
    if (!editable) return;
    setSaving(true);
    setError(null);
    setMessage(null);
    if (form.summary.trim().length < SUMMARY_MIN_LENGTH) {
      setError(`Summary must be at least ${SUMMARY_MIN_LENGTH} characters.`);
      setSaving(false);
      return;
    }
    const res = await fetch("/api/nominations/public/status", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token,
        nomineeFullName: form.nomineeFullName,
        nomineeEmail: form.nomineeEmail,
        nomineeOrganization: form.nomineeOrganization,
        nomineeRoleTitle: form.nomineeRoleTitle,
        summary: form.summary,
        evidenceLinks: form.evidenceLinks,
      }),
    });
    const body = (await res.json().catch(() => ({}))) as NominationStatusResponse;
    setSaving(false);
    if (!res.ok) {
      setError(body.error ?? "Could not update nomination.");
      return;
    }
    setMessage("Nomination details updated successfully.");
    const rotatedToken = typeof body.nextTrackingToken === "string" ? body.nextTrackingToken : "";
    const rotatedUrl =
      typeof body.nextTrackingUrl === "string" ? body.nextTrackingUrl : rotatedToken ? `/nominate/status?token=${encodeURIComponent(rotatedToken)}` : "";
    if (rotatedToken && rotatedUrl) {
      setToken(rotatedToken);
      setTrackingInfo({ token: rotatedToken, url: rotatedUrl });
      if (typeof window !== "undefined") {
        window.history.replaceState({}, "", `/nominate/status?token=${encodeURIComponent(rotatedToken)}`);
      }
    }
    setEditable(Boolean(body.editable));
    setData(body.nomination ?? null);
  }

  async function requestNewTrackingLink(e: FormEvent) {
    e.preventDefault();
    setLinkRequesting(true);
    setError(null);
    setMessage(null);
    const res = await fetch("/api/nominations/public/tracking-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(linkRecovery),
    });
    const body = (await res.json().catch(() => ({}))) as { error?: string; message?: string };
    setLinkRequesting(false);
    if (!res.ok) {
      setError(body.error ?? "Could not request a tracking link.");
      return;
    }
    setMessage(body.message ?? "If details match, a fresh tracking link has been sent.");
  }

  return (
    <Layout>
      <div className="platform-page">
        <div className="container" style={{ maxWidth: 860 }}>
          <div className="platform-page-header platform-page-header--center">
            <p className="platform-eyebrow">Nomination tracking</p>
            <h1 className="platform-title">Check nomination status</h1>
            <p className="platform-lead">Paste your tracking token from email to view your nomination progress.</p>
          </div>
          <section className="platform-card">
            <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
              <label className="platform-field">
                Tracking token
                <input value={token} onChange={(e) => setToken(e.target.value)} required placeholder="Paste token here" />
              </label>
              <button type="submit" className="vl-btn1" disabled={loading}>
                {loading ? "Checking..." : "Check status"}
              </button>
            </form>
            {error ? <p className="platform-msg-error" style={{ marginTop: 12 }}>{error}</p> : null}
            {message ? <p className="platform-msg-ok" style={{ marginTop: 12 }}>{message}</p> : null}
            {trackingInfo ? (
              <p className="platform-muted" style={{ marginTop: 12 }}>
                Security update: your tracking link was refreshed after edit. New token: <strong>{trackingInfo.token}</strong>
                {" "}(<Link href={trackingInfo.url}>open updated link</Link>)
              </p>
            ) : null}
            {data ? (
              <div style={{ marginTop: 16, display: "grid", gap: 8 }}>
                <p><strong>Status:</strong> {data.status}</p>
                <p><strong>Nominee:</strong> {data.nomineeFullName}</p>
                <p><strong>Program:</strong> {data.program?.name ?? "-"}</p>
                <p><strong>Category:</strong> {data.category?.name ?? "-"}</p>
                <p><strong>Season:</strong> {data.season?.year ?? "-"}</p>
                <p><strong>Submitted:</strong> {new Date(data.createdAt).toLocaleString()}</p>
                {data.publicTrackingTokenExpiresAt ? (
                  <p><strong>Tracking link expires:</strong> {new Date(data.publicTrackingTokenExpiresAt).toLocaleString()}</p>
                ) : null}
                {data.reviewedAt ? <p><strong>Last reviewed:</strong> {new Date(data.reviewedAt).toLocaleString()}</p> : null}
                {data.reviewNote ? <p><strong>Review note:</strong> {data.reviewNote}</p> : null}
                {data.convertedEntry ? <p><strong>Converted entry:</strong> {data.convertedEntry.title}</p> : null}
                {editable ? (
                  <div style={{ marginTop: 12 }}>
                    <h3 style={{ marginBottom: 8 }}>Edit submission</h3>
                    <div style={{ display: "grid", gap: 10 }}>
                      <label className="platform-field">
                        Nominee full name
                        <input
                          value={form.nomineeFullName}
                          onChange={(e) => setForm((prev) => ({ ...prev, nomineeFullName: e.target.value }))}
                        />
                      </label>
                      <label className="platform-field">
                        Nominee email
                        <input
                          type="email"
                          value={form.nomineeEmail}
                          onChange={(e) => setForm((prev) => ({ ...prev, nomineeEmail: e.target.value }))}
                        />
                      </label>
                      <label className="platform-field">
                        Nominee organization
                        <input
                          value={form.nomineeOrganization}
                          onChange={(e) => setForm((prev) => ({ ...prev, nomineeOrganization: e.target.value }))}
                        />
                      </label>
                      <label className="platform-field">
                        Nominee role/title
                        <input
                          value={form.nomineeRoleTitle}
                          onChange={(e) => setForm((prev) => ({ ...prev, nomineeRoleTitle: e.target.value }))}
                        />
                      </label>
                      <label className="platform-field">
                        Summary
                        <textarea
                          rows={6}
                          value={form.summary}
                          onChange={(e) => setForm((prev) => ({ ...prev, summary: e.target.value }))}
                          minLength={SUMMARY_MIN_LENGTH}
                          maxLength={6000}
                        />
                        <span className="platform-muted" style={{ display: "block", marginTop: 6, fontSize: "0.88rem" }}>
                          Minimum {SUMMARY_MIN_LENGTH} characters ({form.summary.trim().length}/{SUMMARY_MIN_LENGTH})
                        </span>
                      </label>
                      <label className="platform-field">
                        Evidence links
                        <textarea
                          rows={3}
                          value={form.evidenceLinks}
                          onChange={(e) => setForm((prev) => ({ ...prev, evidenceLinks: e.target.value }))}
                        />
                      </label>
                      <button type="button" className="vl-btn1" onClick={() => void saveEdits()} disabled={saving}>
                        {saving ? "Saving..." : "Save updates"}
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}
          </section>
          <section className="platform-card" style={{ marginTop: 14 }}>
            <h2 className="platform-title" style={{ fontSize: "1.1rem" }}>Need a new tracking link?</h2>
            <p className="platform-muted">Use the same nominator email from your submission. We will email a refreshed link if details match.</p>
            <form onSubmit={requestNewTrackingLink} style={{ display: "grid", gap: 10 }}>
              <label className="platform-field">
                Nominator email
                <input
                  type="email"
                  value={linkRecovery.nominatorEmail}
                  onChange={(e) => setLinkRecovery((prev) => ({ ...prev, nominatorEmail: e.target.value }))}
                  required
                />
              </label>
              <label className="platform-field">
                Nominee full name (optional)
                <input
                  value={linkRecovery.nomineeFullName}
                  onChange={(e) => setLinkRecovery((prev) => ({ ...prev, nomineeFullName: e.target.value }))}
                />
              </label>
              <button type="submit" className="vl-btn1" disabled={linkRequesting}>
                {linkRequesting ? "Requesting..." : "Email me a new tracking link"}
              </button>
            </form>
          </section>
        </div>
      </div>
    </Layout>
  );
}
