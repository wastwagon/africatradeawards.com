import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { getRequestSessionUser, isAuditorRole } from "@/lib/api-auth";
import { defaultDashboardPath } from "@/lib/post-login-redirect";
import { hasRoleAtLeast } from "@/lib/rbac";
import AdminSidebar from "./AdminSidebar";
import AdminCommandPalette from "./AdminCommandPalette";
import "./theme.css";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getRequestSessionUser();
  if (!session) {
    redirect("/login?next=/admin/");
  }

  const allowed =
    isAuditorRole(session.role) || hasRoleAtLeast(session.role, UserRole.PROGRAM_MANAGER);
  if (!allowed) {
    redirect(defaultDashboardPath(session.role));
  }

  return (
    <div className="admin-shell">
      <AdminSidebar email={session.email} role={session.role} />
      <section className="admin-shell__content">{children}</section>
      <AdminCommandPalette role={session.role} />
    </div>
  );
}
