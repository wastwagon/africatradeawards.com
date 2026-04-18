"use client";

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import PlatformSiteChrome from "@/components/platform/PlatformSiteChrome";

/** Matches `summary` validation in `app/api/nominations/route.ts` and `[nominationId]/route.ts`. */
const SUMMARY_MIN_LENGTH = 20;

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
  const [selectedNominationId, setSelectedNominationId] = useState("");

  const [newProgramId, setNewProgramId] = useState("");
  const [newSeasonId, setNewSeasonId] = useState("");
  const [newCategoryId, setNewCategoryId] = useState("");
  const [newNomineeFullName, setNewNomineeFullName] = useState("");
  const [newNomineeEmail, setNewNomineeEmail] = useState("");
  const [newNomineeOrganization, setNewNomineeOrganization] = useState("");
  const [newNomineeRoleTitle, setNewNomineeRoleTitle] = useState("");
  const [newSummary, setNewSummary] = useState("");
  const [newEvidenceLinks, setNewEvidenceLinks] = useState("");

  const [editNomineeFullName, setEditNomineeFullName] = useState("");
  const [editNomineeEmail, setEditNomineeEmail] = useState("");
  const [editNomineeOrganization, setEditNomineeOrganization] = useState("");
  const [editNomineeRoleTitle, setEditNomineeRoleTitle] = useState("");
  const [editSummary, setEditSummary] = useState("");
  const [editEvidenceLinks, setEditEvidenceLinks] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const feedbackRef = useRef<HTMLDivElement>(null);

  const newProgram = useMemo(() => programs.find((program) => program.id === newProgramId) ?? null, [programs, newProgramId]);

  const loadMetadata = useCallback(async () => {
    const res = await fetch("/api/portal/metadata/", { cache: "no-store" });
    if (!res.ok) {
      setError("Could not load program metadata.");
      return;
    }
    const data = await res.json();
    setPrograms(data.programs ?? []);
  }, []);

  const loadNominations = useCallback(async () => {
    const res = await fetch("/api/nominations/", { cache: "no-store" });
    if (!res.ok) {
      setError("Could not load nominations.");
      return;
    }
    const data = await res.json();
    setNominations(data.nominations ?? []);
  }, []);

  useEffect(() => {
    void loadMetadata();
    void loadNominations();
  }, [loadMetadata, loadNominations]);

  useEffect(() => {
    const nomination = nominations.find((item) => item.id === selectedNominationId);
    if (!nomination) {
      setEditNomineeFullName("");
      setEditNomineeEmail("");
      setEditNomineeOrganization("");
      setEditNomineeRoleTitle("");
      setEditSummary("");
      setEditEvidenceLinks("");
      return;
    }
    setEditNomineeFullName(nomination.nomineeFullName ?? "");
    setEditNomineeEmail(nomination.nomineeEmail ?? "");
    setEditNomineeOrganization(nomination.nomineeOrganization ?? "");
    setEditNomineeRoleTitle(nomination.nomineeRoleTitle ?? "");
    setEditSummary(nomination.summary ?? "");
    setEditEvidenceLinks(nomination.evidenceLinks ?? "");
  }, [selectedNominationId, nominations]);

  useEffect(() => {
    if (!message && !error) return;
    feedbackRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [message, error]);

  async function createNomination(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);
    const res = await fetch("/api/nominations/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nomineeFullName: newNomineeFullName,
        nomineeEmail: newNomineeEmail,
        nomineeOrganization: newNomineeOrganization,
        nomineeRoleTitle: newNomineeRoleTitle,
        summary: newSummary,
        evidenceLinks: newEvidenceLinks,
        programId: newProgramId,
        seasonId: newSeasonId,
        categoryId: newCategoryId,
      }),
    });
    setSaving(false);
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(body.error ?? "Could not create nomination.");
      return;
    }
    setMessage("Nomination draft created.");
    setNewNomineeFullName("");
    setNewNomineeEmail("");
    setNewNomineeOrganization("");
    setNewNomineeRoleTitle("");
    setNewSummary("");
    setNewEvidenceLinks("");
    await loadNominations();
  }

  async function updateNomination(action: "save_draft" | "submit" | "withdraw") {
    if (!selectedNominationId) return;
    setSaving(true);
    setError(null);
    setMessage(null);
    if (
      (action === "save_draft" || action === "submit") &&
      editSummary.trim().length < SUMMARY_MIN_LENGTH
    ) {
      setError(`Summary must be at least ${SUMMARY_MIN_LENGTH} characters.`);
      setSaving(false);
      return;
    }
    const res = await fetch(`/api/nominations/${selectedNominationId}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nomineeFullName: editNomineeFullName,
        nomineeEmail: editNomineeEmail,
        nomineeOrganization: editNomineeOrganization,
        nomineeRoleTitle: editNomineeRoleTitle,
        summary: editSummary,
        evidenceLinks: editEvidenceLinks,
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

  const selectedNomination = nominations.find((item) => item.id === selectedNominationId);

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
          <div ref={feedbackRef} tabIndex={-1} style={{ scrollMarginTop: 16 }}>
            {error ? <p className="platform-msg-error">{error}</p> : null}
            {message ? <p className="platform-msg-ok">{message}</p> : null}
          </div>

          <section className="platform-card" style={{ marginBottom: 24 }}>
            <h2 className="platform-title" style={{ fontSize: "1.2rem", marginBottom: 16 }}>
              New nomination
            </h2>
            <form onSubmit={createNomination} style={{ display: "grid", gap: 12 }}>
              <label className="platform-field">
                Nominee full name
                <input value={newNomineeFullName} onChange={(e) => setNewNomineeFullName(e.target.value)} required />
              </label>
              <label className="platform-field">
                Nominee email (optional)
                <input type="email" value={newNomineeEmail} onChange={(e) => setNewNomineeEmail(e.target.value)} />
              </label>
              <label className="platform-field">
                Nominee organization (optional)
                <input value={newNomineeOrganization} onChange={(e) => setNewNomineeOrganization(e.target.value)} />
              </label>
              <label className="platform-field">
                Nominee role/title (optional)
                <input value={newNomineeRoleTitle} onChange={(e) => setNewNomineeRoleTitle(e.target.value)} />
              </label>
              <label className="platform-field">
                Program
                <select value={newProgramId} onChange={(e) => setNewProgramId(e.target.value)} required>
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
                <select value={newSeasonId} onChange={(e) => setNewSeasonId(e.target.value)} required>
                  <option value="">Select season</option>
                  {(newProgram?.seasons ?? []).map((season) => (
                    <option key={season.id} value={season.id}>
                      {season.year}
                    </option>
                  ))}
                </select>
              </label>
              <label className="platform-field">
                Category
                <select value={newCategoryId} onChange={(e) => setNewCategoryId(e.target.value)} required>
                  <option value="">Select category</option>
                  {(newProgram?.categories ?? []).map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="platform-field">
                Why should this nominee be recognized?
                <textarea
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  rows={5}
                  required
                  minLength={SUMMARY_MIN_LENGTH}
                  maxLength={6000}
                />
                <span className="platform-muted" style={{ display: "block", marginTop: 6, fontSize: "0.88rem" }}>
                  Minimum {SUMMARY_MIN_LENGTH} characters ({newSummary.trim().length}/{SUMMARY_MIN_LENGTH})
                </span>
              </label>
              <label className="platform-field">
                Evidence links (optional)
                <textarea value={newEvidenceLinks} onChange={(e) => setNewEvidenceLinks(e.target.value)} rows={3} />
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
                  <input value={editNomineeFullName} onChange={(e) => setEditNomineeFullName(e.target.value)} />
                </label>
                <label className="platform-field">
                  Nominee email (optional)
                  <input type="email" value={editNomineeEmail} onChange={(e) => setEditNomineeEmail(e.target.value)} />
                </label>
                <label className="platform-field">
                  Nominee organization (optional)
                  <input value={editNomineeOrganization} onChange={(e) => setEditNomineeOrganization(e.target.value)} />
                </label>
                <label className="platform-field">
                  Nominee role/title (optional)
                  <input value={editNomineeRoleTitle} onChange={(e) => setEditNomineeRoleTitle(e.target.value)} />
                </label>
                <label className="platform-field">
                  Summary
                  <textarea
                    value={editSummary}
                    onChange={(e) => setEditSummary(e.target.value)}
                    rows={6}
                    minLength={SUMMARY_MIN_LENGTH}
                    maxLength={6000}
                  />
                  <span className="platform-muted" style={{ display: "block", marginTop: 6, fontSize: "0.88rem" }}>
                    Minimum {SUMMARY_MIN_LENGTH} characters ({editSummary.trim().length}/{SUMMARY_MIN_LENGTH})
                  </span>
                </label>
                <label className="platform-field">
                  Evidence links
                  <textarea value={editEvidenceLinks} onChange={(e) => setEditEvidenceLinks(e.target.value)} rows={3} />
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
                {selectedNomination?.reviewNote ? (
                  <p className="platform-muted">
                    Review note: <strong>{selectedNomination.reviewNote}</strong>
                  </p>
                ) : null}
                {selectedNomination?.source ? (
                  <p className="platform-muted">
                    Source: <strong>{selectedNomination.source}</strong>
                  </p>
                ) : null}
                {selectedNomination?.convertedEntry ? (
                  <p className="platform-muted">Converted to entry: {selectedNomination.convertedEntry.title}</p>
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
