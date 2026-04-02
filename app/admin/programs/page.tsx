"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";

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
      <h1>Programs</h1>
      <p>Create programs, seasons and categories.</p>
      {error ? <p className="admin-error">{error}</p> : null}

      <section>
        <h2>Create Program</h2>
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
      </section>

      <section>
        <h2>Select Program</h2>
        <select value={selectedProgramId} onChange={(e) => setSelectedProgramId(e.target.value)}>
          <option value="">Choose a program</option>
          {programs.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.slug})
            </option>
          ))}
        </select>
        {selectedProgram ? <p>Active: {selectedProgram.name}</p> : null}
      </section>

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
          <ul>
            {seasons.map((s) => (
              <li key={s.id}>
                {s.year} ({new Date(s.startDate).toLocaleDateString()} - {new Date(s.endDate).toLocaleDateString()})
              </li>
            ))}
          </ul>
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
