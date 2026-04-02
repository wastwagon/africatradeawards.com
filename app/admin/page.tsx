import Link from "next/link";
import { UserRole } from "@prisma/client";
import { getRequestSessionUser, isAuditorRole } from "@/lib/api-auth";
import AdminKpis from "./AdminKpis";
import { getAdminNavItems } from "./navigation";

export default async function AdminPage() {
  const session = await getRequestSessionUser();
  const auditor = session ? isAuditorRole(session.role) : false;
  const navItems = session ? getAdminNavItems(session.role) : [];

  const cards = navItems
    .filter((item) => item.dashboardCard)
    .map((item) => ({ href: item.href, title: item.label, desc: item.description ?? "Open workspace." }));

  const quickActions = navItems
    .filter((item) => item.quickActionLabel)
    .map((item) => ({ href: item.href, label: item.quickActionLabel as string }));

  return (
    <main>
      <h1>Admin console</h1>
      {auditor ? (
        <p className="admin-muted">
          Auditor access: read-only exports, voting analytics, judging summaries, and quarantine review (no approvals).
        </p>
      ) : (
        <p className="admin-muted">Core backend is active. Manage programs, judging, voting, and governance from one control plane.</p>
      )}

      <AdminKpis />

      <section>
        <h2>Quick actions</h2>
        <div className="admin-inline-actions">
          {quickActions.map((item) => (
            <Link key={item.href} href={item.href} className="admin-quick-action">
              {item.label}
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2>{auditor ? "Audit workspaces" : "Operations workspaces"}</h2>
        <div className="admin-card-grid">
          {cards.map((item) => (
            <Link key={item.href} href={item.href} className="admin-card-link">
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
