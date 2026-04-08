'use client'

import { Fragment, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export type AdminTableColumn<T> = {
  key: string;
  header: string;
  cell: (row: T) => ReactNode;
  sortValue?: (row: T) => string | number;
};

type Props<T> = {
  rows: T[];
  columns: AdminTableColumn<T>[];
  rowKey: (row: T, index: number) => string;
  rowSearchText: (row: T) => string;
  searchPlaceholder?: string;
  pageSize?: number;
  exportFilename?: string;
  exportRow?: (row: T) => Record<string, string | number | boolean | null | undefined>;
  persistKey?: string;
  stickyFirstColumn?: boolean;
  expandedRow?: (row: T) => ReactNode;
};

type SavedView = {
  name: string;
  query: string;
  sortKey: string | null;
  sortDir: "asc" | "desc" | null;
  page: number;
};

export default function AdminDataTable<T>({
  rows,
  columns,
  rowKey,
  rowSearchText,
  searchPlaceholder = "Search",
  pageSize = 12,
  exportFilename,
  exportRow,
  persistKey,
  stickyFirstColumn = false,
  expandedRow,
}: Props<T>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const qKey = persistKey ? `${persistKey}_q` : "q";
  const pKey = persistKey ? `${persistKey}_p` : "p";
  const sKey = persistKey ? `${persistKey}_s` : "s";
  const dKey = persistKey ? `${persistKey}_d` : "d";

  const [query, setQuery] = useState(() => searchParams.get(qKey) ?? "");
  const [page, setPage] = useState(() => {
    const raw = Number(searchParams.get(pKey) ?? "1");
    return Number.isFinite(raw) && raw > 0 ? raw : 1;
  });
  const [sort, setSort] = useState<{ key: string; dir: "asc" | "desc" } | null>(() => {
    const key = searchParams.get(sKey);
    const dir = searchParams.get(dKey);
    if (!key || (dir !== "asc" && dir !== "desc")) return null;
    return { key, dir };
  });
  const searchRef = useRef<HTMLInputElement>(null);
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const [savedViews, setSavedViews] = useState<SavedView[]>([]);
  const [selectedView, setSelectedView] = useState("");
  const [draftViewName, setDraftViewName] = useState("");
  const savedViewsKey = persistKey ? `admin_table_views_${persistKey}` : "";
  const defaultViewKey = persistKey ? `admin_table_default_view_${persistKey}` : "";
  const defaultAppliedRef = useRef(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((row) => rowSearchText(row).toLowerCase().includes(q));
  }, [rows, query, rowSearchText]);

  const sorted = useMemo(() => {
    if (!sort) return filtered;
    const column = columns.find((c) => c.key === sort.key && c.sortValue);
    if (!column?.sortValue) return filtered;
    const dir = sort.dir === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      const av = column.sortValue!(a);
      const bv = column.sortValue!(b);
      if (typeof av === "number" && typeof bv === "number") return (av - bv) * dir;
      return String(av).localeCompare(String(bv), undefined, { numeric: true, sensitivity: "base" }) * dir;
    });
  }, [columns, filtered, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageRows = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => {
    if (!persistKey) return;
    const next = new URLSearchParams(searchParams.toString());
    if (query.trim()) next.set(qKey, query.trim());
    else next.delete(qKey);
    next.set(pKey, String(currentPage));
    if (sort) {
      next.set(sKey, sort.key);
      next.set(dKey, sort.dir);
    } else {
      next.delete(sKey);
      next.delete(dKey);
    }
    const qs = next.toString();
    if (qs === searchParams.toString()) return;
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [persistKey, query, currentPage, sort, searchParams, router, pathname, qKey, pKey, sKey, dKey]);

  useEffect(() => {
    if (!persistKey) return;
    try {
      const raw = window.localStorage.getItem(savedViewsKey);
      if (!raw) return;
      const parsed = JSON.parse(raw) as SavedView[];
      if (Array.isArray(parsed)) setSavedViews(parsed);
    } catch {
      /* ignore bad storage */
    }
  }, [persistKey, savedViewsKey]);

  useEffect(() => {
    if (!persistKey) return;
    window.localStorage.setItem(savedViewsKey, JSON.stringify(savedViews));
  }, [persistKey, savedViews, savedViewsKey]);

  useEffect(() => {
    if (!persistKey || defaultAppliedRef.current) return;
    const hasUrlState =
      searchParams.has(qKey) || searchParams.has(sKey) || searchParams.has(dKey) || (searchParams.get(pKey) ?? "1") !== "1";
    if (hasUrlState) {
      defaultAppliedRef.current = true;
      return;
    }
    const defaultName = window.localStorage.getItem(defaultViewKey);
    if (!defaultName) {
      defaultAppliedRef.current = true;
      return;
    }
    const view = savedViews.find((v) => v.name === defaultName);
    if (!view) {
      defaultAppliedRef.current = true;
      return;
    }
    setQuery(view.query);
    setSort(view.sortKey && view.sortDir ? { key: view.sortKey, dir: view.sortDir } : null);
    setPage(Math.max(1, view.page));
    setSelectedView(view.name);
    defaultAppliedRef.current = true;
  }, [persistKey, savedViews, searchParams, qKey, sKey, dKey, pKey, defaultViewKey]);

  function toggleSort(col: AdminTableColumn<T>) {
    if (!col.sortValue) return;
    setPage(1);
    setSort((prev) => {
      if (!prev || prev.key !== col.key) return { key: col.key, dir: "asc" };
      return { key: col.key, dir: prev.dir === "asc" ? "desc" : "asc" };
    });
  }

  const downloadCsv = useCallback(() => {
    if (!exportRow) return;
    const records = sorted.map(exportRow);
    if (records.length === 0) return;
    const headers = Object.keys(records[0]);
    const escapeCell = (value: unknown) => {
      const text = value == null ? "" : String(value);
      const escaped = text.replace(/"/g, '""');
      return /[",\n]/.test(escaped) ? `"${escaped}"` : escaped;
    };
    const lines = [
      headers.join(","),
      ...records.map((record) => headers.map((h) => escapeCell(record[h])).join(",")),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = exportFilename ?? "table-export.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, [exportFilename, exportRow, sorted]);

  function saveCurrentView() {
    const name = draftViewName.trim();
    if (!name) return;
    const next: SavedView = {
      name,
      query,
      sortKey: sort?.key ?? null,
      sortDir: sort?.dir ?? null,
      page: currentPage,
    };
    setSavedViews((prev) => {
      const withoutSame = prev.filter((v) => v.name !== name);
      return [next, ...withoutSame].slice(0, 12);
    });
    setSelectedView(name);
    setDraftViewName("");
  }

  function applySavedView(name: string) {
    const view = savedViews.find((v) => v.name === name);
    if (!view) return;
    setQuery(view.query);
    setSort(view.sortKey && view.sortDir ? { key: view.sortKey, dir: view.sortDir } : null);
    setPage(Math.max(1, view.page));
    setSelectedView(name);
  }

  function deleteSavedView() {
    if (!selectedView) return;
    setSavedViews((prev) => prev.filter((v) => v.name !== selectedView));
    if (persistKey && window.localStorage.getItem(defaultViewKey) === selectedView) {
      window.localStorage.removeItem(defaultViewKey);
    }
    setSelectedView("");
  }

  function setDefaultSavedView() {
    if (!persistKey || !selectedView) return;
    window.localStorage.setItem(defaultViewKey, selectedView);
  }

  function clearDefaultSavedView() {
    if (!persistKey) return;
    window.localStorage.removeItem(defaultViewKey);
  }

  useEffect(() => {
    const isTypingTarget = (target: EventTarget | null) => {
      if (!(target instanceof HTMLElement)) return false;
      const tag = target.tagName.toLowerCase();
      return tag === "input" || tag === "textarea" || target.isContentEditable;
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "/") {
        event.preventDefault();
        searchRef.current?.focus();
        searchRef.current?.select();
        return;
      }
      if (isTypingTarget(event.target)) return;
      if (event.key.toLowerCase() === "e" && exportRow) {
        event.preventDefault();
        downloadCsv();
        return;
      }
      if (event.key.toLowerCase() === "j" && currentPage < totalPages) {
        event.preventDefault();
        setPage((p) => Math.min(totalPages, p + 1));
        return;
      }
      if (event.key.toLowerCase() === "k" && currentPage > 1) {
        event.preventDefault();
        setPage((p) => Math.max(1, p - 1));
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [currentPage, totalPages, exportRow, downloadCsv]);

  useEffect(() => {
    const onExport = (event: Event) => {
      const custom = event as CustomEvent<{ persistKey?: string }>;
      if (!exportRow) return;
      if (custom.detail?.persistKey && custom.detail.persistKey !== persistKey) return;
      downloadCsv();
    };
    const onReset = (event: Event) => {
      const custom = event as CustomEvent<{ persistKey?: string }>;
      if (custom.detail?.persistKey && custom.detail.persistKey !== persistKey) return;
      setQuery("");
      setSort(null);
      setPage(1);
    };
    window.addEventListener("admin:table:export", onExport as EventListener);
    window.addEventListener("admin:table:reset", onReset as EventListener);
    return () => {
      window.removeEventListener("admin:table:export", onExport as EventListener);
      window.removeEventListener("admin:table:reset", onReset as EventListener);
    };
  }, [persistKey, exportRow, downloadCsv]);

  return (
    <div className="admin-data-table">
      <div className="admin-data-table__toolbar">
        <div className="admin-data-table__toolbar-main">
          <input
            ref={searchRef}
            className="admin-data-table__search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
          />
          <div className="admin-data-table__toolbar-end">
            <p className="admin-data-table__meta">
              {pageRows.length} of {sorted.length}
            </p>
            {exportRow ? (
              <button type="button" className="admin-data-table__export" onClick={downloadCsv}>
                Export CSV
              </button>
            ) : null}
          </div>
        </div>
      </div>
      {persistKey ? (
        <details className="admin-data-table__views-panel">
          <summary>Saved table views — optional</summary>
          <div className="admin-data-table__views-panel-body">
            <div className="admin-data-table__views-row">
              <input
                className="admin-data-table__views-save-name"
                value={draftViewName}
                onChange={(e) => setDraftViewName(e.target.value)}
                placeholder="Name this view…"
                aria-label="Name for saved view"
              />
              <button type="button" className="admin-data-table__btn-compact" onClick={saveCurrentView}>
                Save
              </button>
            </div>
            <div className="admin-data-table__views-row">
              <select value={selectedView} onChange={(e) => setSelectedView(e.target.value)} aria-label="Saved views">
                <option value="">Choose a saved view…</option>
                {savedViews.map((view) => (
                  <option key={view.name} value={view.name}>
                    {view.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="admin-data-table__btn-compact"
                onClick={() => applySavedView(selectedView)}
                disabled={!selectedView}
              >
                Apply
              </button>
            </div>
            <div className="admin-data-table__views-tertiary">
              <button type="button" onClick={setDefaultSavedView} disabled={!selectedView}>
                Set as default
              </button>
              <button type="button" onClick={clearDefaultSavedView}>
                Clear default
              </button>
              <button type="button" onClick={deleteSavedView} disabled={!selectedView}>
                Delete view
              </button>
            </div>
          </div>
        </details>
      ) : null}
      <p className="admin-data-table__hint">
        <kbd>/</kbd> focus search · <kbd>e</kbd> export · <kbd>j</kbd> / <kbd>k</kbd> page
      </p>

      <div className="admin-table-wrap">
        <table>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key} className={stickyFirstColumn && col.key === columns[0]?.key ? "admin-col-sticky" : undefined}>
                  {col.sortValue ? (
                    <button type="button" className="admin-data-table__sort-btn" onClick={() => toggleSort(col)}>
                      {col.header}
                      {sort?.key === col.key ? (sort.dir === "asc" ? " ▲" : " ▼") : " ↕"}
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.map((row, i) => (
              <Fragment key={rowKey(row, i)}>
                <tr>
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={stickyFirstColumn && col.key === columns[0]?.key ? "admin-col-sticky" : undefined}
                    >
                      <div className={col.key === columns[0]?.key && expandedRow ? "admin-first-col-cell" : undefined}>
                        {col.cell(row)}
                        {col.key === columns[0]?.key && expandedRow ? (
                          <button
                            type="button"
                            className="admin-row-expand"
                            onClick={() => setExpandedKey((prev) => (prev === rowKey(row, i) ? null : rowKey(row, i)))}
                            aria-expanded={expandedKey === rowKey(row, i)}
                          >
                            {expandedKey === rowKey(row, i) ? "Hide" : "Details"}
                          </button>
                        ) : null}
                      </div>
                    </td>
                  ))}
                </tr>
                {expandedRow && expandedKey === rowKey(row, i) ? (
                  <tr className="admin-expanded-row">
                    <td colSpan={columns.length}>{expandedRow(row)}</td>
                  </tr>
                ) : null}
              </Fragment>
            ))}
            {pageRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>No results for this filter.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="admin-data-table__pager">
        <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={currentPage <= 1}>
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          type="button"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage >= totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
