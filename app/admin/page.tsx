import Link from "next/link";
import { UserRole } from "@prisma/client";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminSection from "@/components/admin/AdminSection";
import { getRequestSessionUser, isAuditorRole } from "@/lib/api-auth";
import { getContactInquiryOpenCount } from "@/lib/contact-inquiry-open-count";
import { hasRoleAtLeast } from "@/lib/rbac";
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

  const openContactInquiries =
    session && hasRoleAtLeast(session.role, UserRole.PROGRAM_MANAGER)
      ? await getContactInquiryOpenCount()
      : undefined;

  return (
    <main>
      <AdminPageHeader
        eyebrow="Overview"
        title="Admin console"
        description={
          auditor
            ? "Auditor access: read-only exports, voting analytics, judging summaries, and quarantine review (no approvals)."
            : "Core backend is active. Manage programs, judging, voting, and governance from one control plane."
        }
      />

      <AdminKpis openContactInquiries={openContactInquiries} />

      <AdminSection title="Quick actions">
        <div className="admin-inline-actions">
          {quickActions.map((item) => (
            <Link key={item.href} href={item.href} className="admin-quick-action">
              {item.label}
            </Link>
          ))}
        </div>
      </AdminSection>

      <AdminSection title={auditor ? "Audit workspaces" : "Operations workspaces"}>
        <div className="admin-card-grid">
          {cards.map((item) => (
            <Link key={item.href} href={item.href} className="admin-card-link">
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </Link>
          ))}
        </div>
      </AdminSection>
    </main>
  );
}
