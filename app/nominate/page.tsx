"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Layout from "@/components/layout/Layout";
import Link from "next/link";

const SUMMARY_MIN_LENGTH = 20;

type Program = {
  id: string;
  name: string;
  seasons: { id: string; year: number }[];
  categories: { id: string; name: string }[];
};

export default function NominatePage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [programId, setProgramId] = useState("");
  const [seasonId, setSeasonId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [nominatorName, setNominatorName] = useState("");
  const [nominatorEmail, setNominatorEmail] = useState("");
  const [nomineeFullName, setNomineeFullName] = useState("");
  const [nomineeEmail, setNomineeEmail] = useState("");
  const [nomineeOrganization, setNomineeOrganization] = useState("");
  const [nomineeRoleTitle, setNomineeRoleTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [evidenceLinks, setEvidenceLinks] = useState("");
  const [website, setWebsite] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [trackingToken, setTrackingToken] = useState<string | null>(null);
  const [trackingUrl, setTrackingUrl] = useState<string | null>(null);

  const selectedProgram = useMemo(() => programs.find((program) => program.id === programId) ?? null, [programs, programId]);

  useEffect(() => {
    void (async () => {
      const res = await fetch("/api/portal/metadata", { cache: "no-store" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) return;
      setPrograms(data.programs ?? []);
    })();
  }, []);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    setTrackingToken(null);
    setTrackingUrl(null);

    const res = await fetch("/api/nominations/public", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nominatorName,
        nominatorEmail,
        nomineeFullName,
        nomineeEmail,
        nomineeOrganization,
        nomineeRoleTitle,
        summary,
        evidenceLinks,
        programId,
        seasonId,
        categoryId,
        website,
      }),
    });

    setLoading(false);
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(body.error ?? "Could not submit nomination.");
      return;
    }

    setMessage("Nomination submitted successfully. Our team will review it.");
    setTrackingToken(typeof body.trackingToken === "string" ? body.trackingToken : null);
    setTrackingUrl(typeof body.trackingUrl === "string" ? body.trackingUrl : null);
    setNominatorName("");
    setNominatorEmail("");
    setNomineeFullName("");
    setNomineeEmail("");
    setNomineeOrganization("");
    setNomineeRoleTitle("");
    setSummary("");
    setEvidenceLinks("");
    setWebsite("");
  }

  return (
    <Layout>
      <div className="platform-page">
        <div className="container" style={{ maxWidth: 900 }}>
          <div className="platform-page-header platform-page-header--center">
            <p className="platform-eyebrow">Public nomination</p>
            <h1 className="platform-title">Nominate an awardee</h1>
            <p className="platform-lead">
              Submit a nomination in plain English. Our review committee will assess submissions against program and category criteria.
            </p>
          </div>
          {error ? <p className="platform-msg-error">{error}</p> : null}
          {message ? <p className="platform-msg-ok">{message}</p> : null}
          {trackingToken ? (
            <p className="platform-muted">
              Tracking token: <strong>{trackingToken}</strong>.{" "}
              <Link href={trackingUrl || `/nominate/status?token=${encodeURIComponent(trackingToken)}`}>Check nomination status</Link>
            </p>
          ) : null}

          <section className="platform-card">
            <form onSubmit={submit} style={{ display: "grid", gap: 12 }}>
              <label className="platform-field">
                Your full name
                <input value={nominatorName} onChange={(e) => setNominatorName(e.target.value)} required />
              </label>
              <label className="platform-field">
                Your email
                <input type="email" value={nominatorEmail} onChange={(e) => setNominatorEmail(e.target.value)} required />
              </label>
              <label className="platform-field">
                Program
                <select value={programId} onChange={(e) => setProgramId(e.target.value)} required>
                  <option value="">Select program</option>
                  {programs.map((program) => (
                    <option key={program.id} value={program.id}>
                      {program.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="platform-field">
                Season
                <select value={seasonId} onChange={(e) => setSeasonId(e.target.value)} required>
                  <option value="">Select season</option>
                  {(selectedProgram?.seasons ?? []).map((season) => (
                    <option key={season.id} value={season.id}>
                      {season.year}
                    </option>
                  ))}
                </select>
              </label>
              <label className="platform-field">
                Category
                <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
                  <option value="">Select category</option>
                  {(selectedProgram?.categories ?? []).map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="platform-field">
                Nominee full name
                <input value={nomineeFullName} onChange={(e) => setNomineeFullName(e.target.value)} required />
              </label>
              <label className="platform-field">
                Nominee email (optional)
                <input type="email" value={nomineeEmail} onChange={(e) => setNomineeEmail(e.target.value)} />
              </label>
              <label className="platform-field">
                Nominee organization (optional)
                <input value={nomineeOrganization} onChange={(e) => setNomineeOrganization(e.target.value)} />
              </label>
              <label className="platform-field">
                Nominee role/title (optional)
                <input value={nomineeRoleTitle} onChange={(e) => setNomineeRoleTitle(e.target.value)} />
              </label>
              <label className="platform-field">
                Why this nominee should be recognized
                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  rows={6}
                  required
                  minLength={SUMMARY_MIN_LENGTH}
                  maxLength={6000}
                />
                <span className="platform-muted" style={{ display: "block", marginTop: 6, fontSize: "0.88rem" }}>
                  Minimum {SUMMARY_MIN_LENGTH} characters ({summary.trim().length}/{SUMMARY_MIN_LENGTH})
                </span>
              </label>
              <label className="platform-field">
                Evidence links (optional)
                <textarea value={evidenceLinks} onChange={(e) => setEvidenceLinks(e.target.value)} rows={3} />
              </label>
              <input
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                style={{ position: "absolute", left: "-9999px", opacity: 0 }}
                aria-hidden="true"
              />
              <button type="submit" className="vl-btn1" disabled={loading}>
                {loading ? "Submitting..." : "Submit nomination"}
              </button>
            </form>
          </section>
        </div>
      </div>
    </Layout>
  );
}
