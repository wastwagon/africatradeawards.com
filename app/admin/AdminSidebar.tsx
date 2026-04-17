"use client";

import Link from "next/link";
import Image from "next/image";
import { UserRole } from "@prisma/client";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import LogoutButton from "@/components/auth/LogoutButton";
import { useSyncOpenContactCount } from "@/lib/use-sync-open-contact-count";
import { getAdminNavItems } from "./navigation";

const LOGO_SRC = "/assets/img/logo/logo1.png?v=2";

/** Exact path match so parent routes (e.g. /admin/events) are not active on child pages. */
function isActive(pathname: string, href: string): boolean {
  const p = pathname.replace(/\/$/, "") || "/";
  const h = href.replace(/\/$/, "") || "/";
  if (h === "/admin") return p === "/admin";
  return p === h;
}

const CONTACT_INQUIRIES_HREF = "/admin/contact-inquiries";

export default function AdminSidebar({
  email,
  role,
  openContactInquiries,
}: {
  email: string;
  role: UserRole;
  /** Managers only — open (non-terminal) inquiry count for sidebar badge */
  openContactInquiries?: number;
}) {
  const pathname = usePathname();
  const [navOpen, setNavOpen] = useState(false);
  const contactBadge = useSyncOpenContactCount(openContactInquiries);

  const navItems = useMemo(() => getAdminNavItems(role).filter((item) => item.sidebar), [role]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof navItems>();
    for (const item of navItems) {
      const g = item.sidebarGroup ?? "More";
      if (!map.has(g)) map.set(g, []);
      map.get(g)!.push(item);
    }
    return Array.from(map.entries());
  }, [navItems]);

  const closeNav = useCallback(() => setNavOpen(false), []);

  useEffect(() => {
    closeNav();
  }, [pathname, closeNav]);

  useEffect(() => {
    if (!navOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setNavOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navOpen]);

  useEffect(() => {
    document.body.classList.toggle("admin-nav-open", navOpen);
    return () => document.body.classList.remove("admin-nav-open");
  }, [navOpen]);

  return (
    <div className="admin-shell__rail">
      <header className="admin-shell__mobile-topbar">
        <Link href="/admin/" className="admin-shell__mobile-brand" onClick={closeNav}>
          <Image src={LOGO_SRC} alt="" width={120} height={36} className="admin-shell__logo-img" unoptimized />
          <span className="admin-shell__mobile-brand-text">Admin</span>
        </Link>
        <button
          type="button"
          className="admin-shell__menu-trigger"
          aria-expanded={navOpen}
          aria-controls="admin-sidebar-nav"
          onClick={() => setNavOpen((o) => !o)}
        >
          {navOpen ? "Close" : "Menu"}
        </button>
      </header>

      <div
        className={`admin-shell__scrim ${navOpen ? "is-visible" : ""}`}
        aria-hidden
        onClick={closeNav}
      />

      <aside className={`admin-shell__sidebar ${navOpen ? "is-open" : ""}`} id="admin-sidebar">
        <div className="admin-shell__brand">
          <Link href="/admin/" className="admin-shell__logo-link" onClick={closeNav}>
            <Image
              src={LOGO_SRC}
              alt="Africa Trade Awards"
              width={140}
              height={42}
              className="admin-shell__logo-img admin-shell__logo-img--sidebar"
              unoptimized
            />
          </Link>
          <p className="admin-shell__kicker">Awards platform</p>
          <h2 className="admin-shell__title">Admin console</h2>
        </div>
        <p className="admin-shell__user">
          <span className="admin-shell__user-label">Signed in as</span>
          <strong>{email}</strong>
        </p>
        <nav className="admin-shell__nav" id="admin-sidebar-nav" aria-label="Admin navigation">
          {grouped.map(([group, items]) => (
            <div key={group} className="admin-shell__nav-group">
              <p className="admin-shell__nav-group-label">{group}</p>
              <ul className="admin-shell__nav-list">
                {items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={isActive(pathname, item.href) ? "is-active" : undefined}
                      onClick={closeNav}
                    >
                      <span className="admin-shell__nav-link-text">{item.label}</span>
                      {item.href === CONTACT_INQUIRIES_HREF &&
                      typeof contactBadge === "number" &&
                      contactBadge > 0 ? (
                        <span
                          className="admin-shell__nav-badge"
                          aria-label={`${contactBadge} open inquiries`}
                        >
                          {contactBadge > 99 ? "99+" : contactBadge}
                        </span>
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <div className="admin-shell__logout-wrap">
          <LogoutButton className="admin-shell__logout">Log out</LogoutButton>
        </div>
      </aside>
    </div>
  );
}
