"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminSection from "@/components/admin/AdminSection";

type Program = { id: string; slug: string; name: string; description?: string | null };
type Season = { id: string; year: number; startDate: string; endDate: string };
type Category = { id: string; slug: string; name: string };

export default function AdminProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedProgramId, setSelectedProgramId] = useState<string>("");
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [programName, setProgramName] = useState("");
  const [programSlug, setProgramSlug] = useState("");
  const [programDescription, setProgramDescription] = useState("");

  const [seasonYear, setSeasonYear] = useState(new Date().getFullYear());
  const [seasonStart, setSeasonStart] = useState("");
  const [seasonEnd, setSeasonEnd] = useState("");
  const [editingSeasonId, setEditingSeasonId] = useState<string | null>(null);
  const [editSeasonYear, setEditSeasonYear] = useState(new Date().getFullYear());
  const [editSeasonStart, setEditSeasonStart] = useState("");
  const [editSeasonEnd, setEditSeasonEnd] = useState("");

  const [categoryName, setCategoryName] = useState("");
  const [categorySlug, setCategorySlug] = useState("");

  const selectedProgram = useMemo(() => programs.find((p) => p.id === selectedProgramId) ?? null, [programs, selectedProgramId]);

  const loadPrograms = useCallback(async () => {
    const res = await fetch("/api/programs");
    if (!res.ok) {
      setError("Failed to load programs");
      return;
    }
    const data = await res.json();
    setPrograms(data.programs ?? []);
    if (!selectedProgramId && data.programs?.[0]?.id) {
      setSelectedProgramId(data.programs[0].id);
    }
  }, [selectedProgramId]);

  const loadProgramMeta = useCallback(async (programId: string) => {
    const [seasonRes, categoryRes] = await Promise.all([
      fetch(`/api/programs/${programId}/seasons`),
      fetch(`/api/programs/${programId}/categories`),
    ]);
    if (!seasonRes.ok || !categoryRes.ok) {
      setError("Failed to load seasons/categories");
      return;
    }
    const [seasonData, categoryData] = await Promise.all([seasonRes.json(), categoryRes.json()]);
    setSeasons(seasonData.seasons ?? []);
    setCategories(categoryData.categories ?? []);
  }, []);

  useEffect(() => {
    void loadPrograms();
  }, [loadPrograms]);

  useEffect(() => {
    if (selectedProgramId) {
      void loadProgramMeta(selectedProgramId);
    }
  }, [selectedProgramId, loadProgramMeta]);

  useEffect(() => {
    setEditingSeasonId(null);
  }, [selectedProgramId]);

  async function createProgram(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch("/api/programs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: programName,
        slug: programSlug,
        description: programDescription || undefined,
      }),
    });
    if (!res.ok) {
      setError("Could not create program");
      return;
    }
    setProgramName("");
    setProgramSlug("");
    setProgramDescription("");
    await loadPrograms();
  }

  async function createSeason(e: FormEvent) {
    e.preventDefault();
    if (!selectedProgramId) return;

    const res = await fetch(`/api/programs/${selectedProgramId}/seasons`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        year: seasonYear,
        startDate: new Date(seasonStart).toISOString(),
        endDate: new Date(seasonEnd).toISOString(),
      }),
    });
    if (!res.ok) {
      setError("Could not create season");
      return;
    }
    setSeasonStart("");
    setSeasonEnd("");
    await loadProgramMeta(selectedProgramId);
  }

  function beginEditSeason(s: Season) {
    setEditingSeasonId(s.id);
    setEditSeasonYear(s.year);
    setEditSeasonStart(new Date(s.startDate).toISOString().slice(0, 10));
    setEditSeasonEnd(new Date(s.endDate).toISOString().slice(0, 10));
  }

  function cancelEditSeason() {
    setEditingSeasonId(null);
  }

  async function updateSeason(e: FormEvent) {
    e.preventDefault();
    if (!selectedProgramId || !editingSeasonId) return;
    setError(null);
    const res = await fetch(`/api/programs/${selectedProgramId}/seasons/${editingSeasonId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        year: editSeasonYear,
        startDate: new Date(editSeasonStart).toISOString(),
        endDate: new Date(editSeasonEnd).toISOString(),
      }),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(typeof body.error === "string" ? body.error : "Could not update season");
      return;
    }
    setEditingSeasonId(null);
    await loadProgramMeta(selectedProgramId);
  }

  async function createCategory(e: FormEvent) {
    e.preventDefault();
    if (!selectedProgramId) return;

    const res = await fetch(`/api/programs/${selectedProgramId}/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: categoryName,
        slug: categorySlug,
      }),
    });
    if (!res.ok) {
      setError("Could not create category");
      return;
    }
    setCategoryName("");
    setCategorySlug("");
    await loadProgramMeta(selectedProgramId);
  }

  return (
    <main>
      <AdminPageHeader title="Programs" description="Create programs, seasons and categories." />
      {error ? <p className="admin-error">{error}</p> : null}

      <AdminSection title="Create program">
        <form onSubmit={createProgram} className="admin-form">
          <input placeholder="Program name" value={programName} onChange={(e) => setProgramName(e.target.value)} required />
          <input placeholder="program-slug" value={programSlug} onChange={(e) => setProgramSlug(e.target.value)} required />
          <textarea
            placeholder="Description (optional)"
            value={programDescription}
            onChange={(e) => setProgramDescription(e.target.value)}
          />
          <button type="submit">Create Program</button>
        </form>
      </AdminSection>

      <AdminSection title="Select program">
        <select value={selectedProgramId} onChange={(e) => setSelectedProgramId(e.target.value)}>
          <option value="">Choose a program</option>
          {programs.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.slug})
            </option>
          ))}
        </select>
        {selectedProgram ? <p>Active: {selectedProgram.name}</p> : null}
      </AdminSection>

      <section className="admin-split-grid">
        <div className="admin-panel">
          <h2>Seasons</h2>
          <form onSubmit={createSeason} className="admin-form">
            <input
              type="number"
              placeholder="Year"
              value={seasonYear}
              onChange={(e) => setSeasonYear(Number(e.target.value))}
              required
            />
            <input type="date" value={seasonStart} onChange={(e) => setSeasonStart(e.target.value)} required />
            <input type="date" value={seasonEnd} onChange={(e) => setSeasonEnd(e.target.value)} required />
            <button type="submit" disabled={!selectedProgramId}>
              Add Season
            </button>
          </form>
          <ul className="admin-plain-list">
            {seasons.map((s) => (
              <li key={s.id}>
                {s.year} ({new Date(s.startDate).toLocaleDateString()} - {new Date(s.endDate).toLocaleDateString()})
                <button type="button" className="admin-ml-sm" onClick={() => beginEditSeason(s)}>
                  Edit
                </button>
              </li>
            ))}
          </ul>
          {editingSeasonId ? (
            <form onSubmit={updateSeason} className="admin-form admin-edit-panel">
              <h3 className="admin-edit-panel__title">Edit season</h3>
              <input
                type="number"
                placeholder="Year"
                value={editSeasonYear}
                onChange={(e) => setEditSeasonYear(Number(e.target.value))}
                required
              />
              <input type="date" value={editSeasonStart} onChange={(e) => setEditSeasonStart(e.target.value)} required />
              <input type="date" value={editSeasonEnd} onChange={(e) => setEditSeasonEnd(e.target.value)} required />
              <div className="admin-inline-actions admin-inline-wrap">
                <button type="submit">Save season</button>
                <button type="button" onClick={cancelEditSeason}>
                  Cancel
                </button>
              </div>
            </form>
          ) : null}
        </div>

        <div className="admin-panel">
          <h2>Categories</h2>
          <form onSubmit={createCategory} className="admin-form">
            <input placeholder="Category name" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} required />
            <input placeholder="category-slug" value={categorySlug} onChange={(e) => setCategorySlug(e.target.value)} required />
            <button type="submit" disabled={!selectedProgramId}>
              Add Category
            </button>
          </form>
          <ul>
            {categories.map((c) => (
              <li key={c.id}>
                {c.name} ({c.slug})
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
