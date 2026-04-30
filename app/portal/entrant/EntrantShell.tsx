"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import LogoutButton from "@/components/auth/LogoutButton";
import SkipToMain from "@/components/a11y/SkipToMain";

const LOGO_SRC = "/assets/img/logo/logo1.png?v=2";

function isActive(pathname: string, href: string): boolean {
  const p = pathname.replace(/\/$/, "") || "/";
  const h = href.replace(/\/$/, "") || "/";
  if (h === "/portal/entrant/entry") {
    return p.startsWith("/portal/entrant/entry");
  }
  if (h === "/portal/entrant") {
    return p === "/portal/entrant";
  }
  return p === h;
}

const NAV: { href: string; label: string }[] = [
  { href: "/portal/entrant/", label: "Dashboard" },
  { href: "/portal/entrant/entry/", label: "Manage entries" },
  { href: "/portal/nominator/", label: "Nominator portal" },
  { href: "/vote/", label: "Public voting" },
  { href: "/", label: "Website home" },
];

export default function EntrantShell({
  email,
  fullName,
  children,
}: {
  email: string;
  fullName: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [navOpen, setNavOpen] = useState(false);

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
    <div className="admin-shell">
      <SkipToMain />
      <div className="admin-shell__rail">
        <header className="admin-shell__mobile-topbar">
          <Link href="/portal/entrant/" className="admin-shell__mobile-brand" onClick={closeNav}>
            <Image src={LOGO_SRC} alt="" width={120} height={36} className="admin-shell__logo-img" unoptimized />
            <span className="admin-shell__mobile-brand-text">Entrant</span>
          </Link>
          <button
            type="button"
            className="admin-shell__menu-trigger"
            aria-expanded={navOpen}
            aria-controls="entrant-sidebar-nav"
            onClick={() => setNavOpen((o) => !o)}
          >
            {navOpen ? "Close" : "Menu"}
          </button>
        </header>

        <div className={`admin-shell__scrim ${navOpen ? "is-visible" : ""}`} aria-hidden onClick={closeNav} />

        <aside className={`admin-shell__sidebar ${navOpen ? "is-open" : ""}`} id="entrant-sidebar">
          <div className="admin-shell__brand">
            <Link href="/portal/entrant/" className="admin-shell__logo-link" onClick={closeNav}>
              <Image
                src={LOGO_SRC}
                alt="Africa Trade Awards"
                width={140}
                height={42}
                className="admin-shell__logo-img admin-shell__logo-img--sidebar"
                unoptimized
              />
            </Link>
            <p className="admin-shell__kicker">Entrant workspace</p>
            <h2 className="admin-shell__title">Program portal</h2>
          </div>
          <p className="admin-shell__user">
            <span className="admin-shell__user-label">Signed in as</span>
            <strong>{fullName}</strong>
            <span className="admin-shell__user-label" style={{ marginTop: 8, display: "block" }}>
              {email}
            </span>
          </p>
          <nav className="admin-shell__nav" id="entrant-sidebar-nav" aria-label="Entrant navigation">
            <div className="admin-shell__nav-group">
              <p className="admin-shell__nav-group-label">Navigate</p>
              <ul className="admin-shell__nav-list">
                {NAV.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={isActive(pathname, item.href) ? "is-active" : undefined}
                      onClick={closeNav}
                    >
                      <span className="admin-shell__nav-link-text">{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
          <div className="admin-shell__logout-wrap">
            <LogoutButton className="admin-shell__logout" redirectTo="/">
              Log out
            </LogoutButton>
          </div>
        </aside>
      </div>
      <main className="admin-shell__content" id="main-content" tabIndex={-1}>
        {children}
      </main>
    </div>
  );
}
