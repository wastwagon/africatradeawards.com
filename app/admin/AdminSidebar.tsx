'use client'

import Link from "next/link";
import { UserRole } from "@prisma/client";
import { usePathname } from "next/navigation";
import { getAdminNavItems } from "./navigation";

function isActive(pathname: string, href: string): boolean {
  if (href === "/admin/") return pathname === "/admin" || pathname === "/admin/";
  return pathname.startsWith(href);
}

export default function AdminSidebar({ email, role }: { email: string; role: UserRole }) {
  const pathname = usePathname();
  const nav = getAdminNavItems(role).filter((item) => item.sidebar).map((item) => ({ href: item.href, label: item.label }));

  return (
    <aside className="admin-shell__sidebar">
      <p className="admin-shell__kicker">Awards Platform</p>
      <h2 className="admin-shell__title">Admin console</h2>
      <p className="admin-shell__user">
        Signed in as <strong>{email}</strong>
      </p>
      <nav className="admin-shell__nav" aria-label="Admin navigation">
        {nav.map((item) => (
          <Link key={item.href} href={item.href} className={isActive(pathname, item.href) ? "is-active" : undefined}>
            {item.label}
          </Link>
        ))}
      </nav>
      <form action="/api/auth/logout" method="post">
        <button type="submit" className="admin-shell__logout">
          Logout
        </button>
      </form>
    </aside>
  );
}
