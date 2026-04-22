import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { getRequestSessionUser } from "@/lib/api-auth";
import { hasRoleAtLeast } from "@/lib/rbac";
import { defaultDashboardPath } from "@/lib/post-login-redirect";
import "@/app/admin/theme.css";
import EntrantShell from "./EntrantShell";

export default async function EntrantPortalLayout({ children }: { children: React.ReactNode }) {
  const session = await getRequestSessionUser();
  if (!session) {
    redirect("/login?next=/portal/entrant/");
  }
  if (!hasRoleAtLeast(session.role, UserRole.ENTRANT)) {
    redirect(defaultDashboardPath(session.role));
  }

  const displayName = session.fullName?.trim() || session.email;

  return (
    <EntrantShell email={session.email} fullName={displayName}>
      {children}
    </EntrantShell>
  );
}
