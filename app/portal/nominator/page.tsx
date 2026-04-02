"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import PlatformSiteChrome from "@/components/platform/PlatformSiteChrome";

type Program = {
  id: string;
  name: string;
  slug: string;
  seasons: { id: string; year: number }[];
  categories: { id: string; name: string; slug: string }[];
};

type Nomination = {
  id: string;
  status: string;
  nomineeFullName: string;
  nomineeEmail: string | null;
  nomineeOrganization: string | null;
  nomineeRoleTitle: string | null;
  summary: string;
  evidenceLinks: string | null;
  reviewNote: string | null;
  source: string;
  publicNominatorName: string | null;
  publicNominatorEmail: string | null;
  program?: { id: string; name: string };
  season?: { id: string; year: number };
  category?: { id: string; name: string };
  convertedEntry?: { id: string; title: string; status: string } | null;
};

export default function NominatorPortalPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [nominations, setNominations] = useState<Nomination[]>([]);
  const [selectedProgramId, setSelectedProgramId] = useState("");
  const [selectedSeasonId, setSelectedSeasonId] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedNominationId, setSelectedNominationId] = useState("");
  const [nomineeFullName, setNomineeFullName] = useState("");
  const [nomineeEmail, setNomineeEmail] = useState("");
  const [nomineeOrganization, setNomineeOrganization] = useState("");
  const [nomineeRoleTitle, setNomineeRoleTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [evidenceLinks, setEvidenceLinks] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const selectedProgram = useMemo(() => programs.find((program) => program.id === selectedProgramId) ?? null, [programs, selectedProgramId]);

  const loadMetadata = useCallback(async () => {
    const res = await fetch("/api/portal/metadata", { cache: "no-store" });
    if (!res.ok) {
      setError("Could not load program metadata.");
      return;
    }
    const data = await res.json();
    setPrograms(data.programs ?? []);
  }, []);

  const loadNominations = useCallback(async () => {
    const res = await fetch("/api/nominations", { cache: "no-store" });
    if (!res.ok) {
      setError("Could not load nominations.");
      return;
    }
    const data = await res.json();
    setNominations(data.nominations ?? []);
    if (!selectedNominationId && data.nominations?.[0]?.id) setSelectedNominationId(data.nominations[0].id);
  }, [selectedNominationId]);

  useEffect(() => {
    void loadMetadata();
    void loadNominations();
  }, [loadMetadata, loadNominations]);

  useEffect(() => {
    const nomination = nominations.find((item) => item.id === selectedNominationId);
    if (!nomination) return;
    setNomineeFullName(nomination.nomineeFullName ?? "");
    setNomineeEmail(nomination.nomineeEmail ?? "");
    setNomineeOrganization(nomination.nomineeOrganization ?? "");
    setNomineeRoleTitle(nomination.nomineeRoleTitle ?? "");
    setSummary(nomination.summary ?? "");
    setEvidenceLinks(nomination.evidenceLinks ?? "");
  }, [selectedNominationId, nominations]);

  async function createNomination(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);
    const res = await fetch("/api/nominations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nomineeFullName,
        nomineeEmail,
        nomineeOrganization,
        nomineeRoleTitle,
        summary,
        evidenceLinks,
        programId: selectedProgramId,
        seasonId: selectedSeasonId,
        categoryId: selectedCategoryId,
      }),
    });
    setSaving(false);
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(body.error ?? "Could not create nomination.");
      return;
    }
    setMessage("Nomination draft created.");
    setNomineeFullName("");
    setNomineeEmail("");
    setNomineeOrganization("");
    setNomineeRoleTitle("");
    setSummary("");
    setEvidenceLinks("");
    await loadNominations();
  }

  async function updateNomination(action: "save_draft" | "submit" | "withdraw") {
    if (!selectedNominationId) return;
    setSaving(true);
    setError(null);
    setMessage(null);
    const res = await fetch(`/api/nominations/${selectedNominationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nomineeFullName,
        nomineeEmail,
        nomineeOrganization,
        nomineeRoleTitle,
        summary,
        evidenceLinks,
        action,
      }),
    });
    setSaving(false);
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(body.error ?? "Could not save nomination.");
      return;
    }
    setMessage(action === "submit" ? "Nomination submitted." : action === "withdraw" ? "Nomination withdrawn." : "Draft saved.");
    await loadNominations();
  }

  return (
    <PlatformSiteChrome>
      <section className="platform-page">
        <div className="container" style={{ maxWidth: 1100 }}>
          <div className="platform-page-header">
            <p className="platform-eyebrow">Nominator workspace</p>
            <h1 className="platform-title">Nominate awardees</h1>
            <p className="platform-lead">
              Submit and track awardee nominations. Managers review nominations and can convert approved nominations into official entries.
            </p>
          </div>
          {error ? <p className="platform-msg-error">{error}</p> : null}
          {message ? <p className="platform-msg-ok">{message}</p> : null}

          <section className="platform-card" style={{ marginBottom: 24 }}>
            <h2 className="platform-title" style={{ fontSize: "1.2rem", marginBottom: 16 }}>
              New nomination
            </h2>
            <form onSubmit={createNomination} style={{ display: "grid", gap: 12 }}>
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
                Program
                <select value={selectedProgramId} onChange={(e) => setSelectedProgramId(e.target.value)} required>
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
                <select value={selectedSeasonId} onChange={(e) => setSelectedSeasonId(e.target.value)} required>
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
                <select value={selectedCategoryId} onChange={(e) => setSelectedCategoryId(e.target.value)} required>
                  <option value="">Select category</option>
                  {(selectedProgram?.categories ?? []).map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="platform-field">
                Why should this nominee be recognized?
                <textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={5} required />
              </label>
              <label className="platform-field">
                Evidence links (optional)
                <textarea value={evidenceLinks} onChange={(e) => setEvidenceLinks(e.target.value)} rows={3} />
              </label>
              <button type="submit" className="vl-btn1" disabled={saving}>
                {saving ? "Saving..." : "Create nomination draft"}
              </button>
            </form>
          </section>

          <section className="platform-card">
            <h2 className="platform-title" style={{ fontSize: "1.2rem", marginBottom: 16 }}>
              Your nominations
            </h2>
            <label className="platform-field">
              Select nomination
              <select value={selectedNominationId} onChange={(e) => setSelectedNominationId(e.target.value)}>
                <option value="">Select nomination</option>
                {nominations.map((nomination) => (
                  <option key={nomination.id} value={nomination.id}>
                    {nomination.nomineeFullName} ({nomination.status})
                  </option>
                ))}
              </select>
            </label>
            {selectedNominationId ? (
              <div style={{ marginTop: 16, display: "grid", gap: 12 }}>
                <label className="platform-field">
                  Nominee full name
                  <input value={nomineeFullName} onChange={(e) => setNomineeFullName(e.target.value)} />
                </label>
                <label className="platform-field">
                  Summary
                  <textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={6} />
                </label>
                <label className="platform-field">
                  Evidence links
                  <textarea value={evidenceLinks} onChange={(e) => setEvidenceLinks(e.target.value)} rows={3} />
                </label>
                <div className="platform-actions">
                  <button type="button" className="vl-btn1" onClick={() => void updateNomination("save_draft")} disabled={saving}>
                    Save draft
                  </button>
                  <button type="button" className="vl-btn1" onClick={() => void updateNomination("submit")} disabled={saving}>
                    Submit nomination
                  </button>
                  <button type="button" className="vl-btn1" onClick={() => void updateNomination("withdraw")} disabled={saving}>
                    Withdraw nomination
                  </button>
                </div>
                {nominations.find((item) => item.id === selectedNominationId)?.reviewNote ? (
                  <p className="platform-muted">
                    Review note: <strong>{nominations.find((item) => item.id === selectedNominationId)?.reviewNote}</strong>
                  </p>
                ) : null}
                {nominations.find((item) => item.id === selectedNominationId)?.source ? (
                  <p className="platform-muted">
                    Source: <strong>{nominations.find((item) => item.id === selectedNominationId)?.source}</strong>
                  </p>
                ) : null}
                {nominations.find((item) => item.id === selectedNominationId)?.convertedEntry ? (
                  <p className="platform-muted">
                    Converted to entry: {nominations.find((item) => item.id === selectedNominationId)?.convertedEntry?.title}
                  </p>
                ) : null}
              </div>
            ) : null}
          </section>
          <p className="platform-muted text-center" style={{ marginTop: 28 }}>
            <Link href="/portal/entrant/">Entrant workspace</Link>
            {" · "}
            <Link href="/login/">Sign In</Link>
            {" · "}
            <Link href="/">Home</Link>
          </p>
        </div>
      </section>
    </PlatformSiteChrome>
  );
}
