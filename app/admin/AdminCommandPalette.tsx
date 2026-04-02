'use client'

import { UserRole } from "@prisma/client";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getAdminNavItems } from "./navigation";

type NavItem = { type: "nav"; id: string; href: string; label: string; hint?: string; aliases?: string[] };
type ActionItem = { type: "action"; id: string; label: string; hint?: string; aliases?: string[]; run: () => void };
type Item = NavItem | ActionItem;

export default function AdminCommandPalette({ role }: { role: UserRole }) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  const recentKey = `admin_cmd_recent_${role}`;
  const favoriteKey = `admin_cmd_favorites_${role}`;
  const navItems = useMemo<NavItem[]>(() => {
    return getAdminNavItems(role)
      .filter((item) => item.palette)
      .map((item) => ({
        type: "nav",
        id: item.id,
        href: item.href,
        label: item.label,
        aliases: item.aliases,
      }));
  }, [role]);

  const activePersistKey = pathname.startsWith("/admin/entries")
    ? "entries"
    : pathname.startsWith("/admin/voting")
    ? "voting"
    : pathname.startsWith("/admin/leaderboard")
    ? "leaderboard"
    : null;

  const actionItems = useMemo<ActionItem[]>(
    () => [
      {
        type: "action",
        id: "export-current-table",
        label: "Export current table",
        hint: "Shortcut: E",
        aliases: ["qe", "export", "download"],
        run: () => window.dispatchEvent(new CustomEvent("admin:table:export", { detail: { persistKey: activePersistKey ?? undefined } })),
      },
      {
        type: "action",
        id: "reset-current-table",
        label: "Reset current table filters",
        hint: "Clear search/sort/page",
        aliases: ["reset", "clear", "rq"],
        run: () => window.dispatchEvent(new CustomEvent("admin:table:reset", { detail: { persistKey: activePersistKey ?? undefined } })),
      },
    ],
    [activePersistKey],
  );

  const items = useMemo<Item[]>(() => [...actionItems, ...navItems], [actionItems, navItems]);

  const goTo = useCallback(
    (href: string) => {
      const target = items.find((item) => item.type === "nav" && item.href === href);
      if (target) {
        setRecentIds((prev) => [target.id, ...prev.filter((id) => id !== target.id)]);
      }
      setOpen(false);
      setQuery("");
      router.push(href);
    },
    [items, router],
  );

  const runAction = useCallback((item: ActionItem) => {
    setRecentIds((prev) => [item.id, ...prev.filter((id) => id !== item.id)]);
    setOpen(false);
    setQuery("");
    item.run();
    setToast(item.label);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = !q
      ? items
      : items.filter((item) => `${item.label} ${item.hint ?? ""} ${(item.aliases ?? []).join(" ")}`.toLowerCase().includes(q));
    return [...base].sort((a, b) => {
      const favA = favoriteIds.includes(a.id) ? 1 : 0;
      const favB = favoriteIds.includes(b.id) ? 1 : 0;
      if (favA !== favB) return favB - favA;
      if (!q) {
        const recentA = recentIds.indexOf(a.id);
        const recentB = recentIds.indexOf(b.id);
        const scoreA = recentA === -1 ? 999 : recentA;
        const scoreB = recentB === -1 ? 999 : recentB;
        return scoreA - scoreB;
      }
      return a.label.localeCompare(b.label);
    });
  }, [items, query, favoriteIds, recentIds]);

  useEffect(() => {
    setActiveIndex(0);
  }, [open, query]);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 1800);
    return () => window.clearTimeout(id);
  }, [toast]);

  useEffect(() => {
    try {
      const r = JSON.parse(window.localStorage.getItem(recentKey) ?? "[]");
      const f = JSON.parse(window.localStorage.getItem(favoriteKey) ?? "[]");
      if (Array.isArray(r)) setRecentIds(r);
      if (Array.isArray(f)) setFavoriteIds(f);
    } catch {
      /* ignore bad storage */
    }
  }, [recentKey, favoriteKey]);

  useEffect(() => {
    window.localStorage.setItem(recentKey, JSON.stringify(recentIds.slice(0, 8)));
  }, [recentIds, recentKey]);

  useEffect(() => {
    window.localStorage.setItem(favoriteKey, JSON.stringify(favoriteIds.slice(0, 12)));
  }, [favoriteIds, favoriteKey]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((v) => !v);
      } else if (event.key === "Escape") {
        setOpen(false);
      } else if (open && event.key === "ArrowDown") {
        event.preventDefault();
        setActiveIndex((i) => (filtered.length === 0 ? 0 : Math.min(filtered.length - 1, i + 1)));
      } else if (open && event.key === "ArrowUp") {
        event.preventDefault();
        setActiveIndex((i) => (filtered.length === 0 ? 0 : Math.max(0, i - 1)));
      } else if (open && event.key === "Enter") {
        const item = filtered[activeIndex];
        if (!item) return;
        event.preventDefault();
        if (item.type === "nav") goTo(item.href);
        else runAction(item);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, filtered, activeIndex, goTo, runAction]);

  function toggleFavorite(id: string) {
    setFavoriteIds((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [id, ...prev]));
  }

  return (
    <>
      <button type="button" className="admin-command-launch" onClick={() => setOpen(true)}>
        Quick jump <span>Cmd/Ctrl + K</span>
      </button>
      {open ? (
        <div className="admin-command-overlay" role="dialog" aria-modal="true">
          <div className="admin-command">
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type a page name..."
              aria-label="Search admin pages"
            />
            <ul>
              {filtered.map((item, index) => (
                <li key={item.id} className="admin-command-item-row">
                  <button
                    type="button"
                    className={index === activeIndex ? "is-active" : undefined}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => (item.type === "nav" ? goTo(item.href) : runAction(item))}
                  >
                    <strong>
                      {item.label}{" "}
                      {favoriteIds.includes(item.id) ? <em className="admin-command-tag">Pinned</em> : null}
                      {recentIds.includes(item.id) ? <em className="admin-command-tag admin-command-tag--recent">Recent</em> : null}
                    </strong>
                    <span>{item.type === "nav" ? item.href : item.hint ?? "Action"}</span>
                  </button>
                  <button
                    type="button"
                    className={`admin-command-pin ${favoriteIds.includes(item.id) ? "is-active" : ""}`}
                    onClick={() => toggleFavorite(item.id)}
                    aria-label={favoriteIds.includes(item.id) ? "Unpin command" : "Pin command"}
                  >
                    ★
                  </button>
                </li>
              ))}
              {filtered.length === 0 ? <li className="admin-command-empty">No results.</li> : null}
            </ul>
          </div>
        </div>
      ) : null}
      {toast ? <div className="admin-command-toast">{toast}</div> : null}
    </>
  );
}
