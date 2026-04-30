import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { getRequestSessionUser } from "@/lib/api-auth";
import { hasRoleAtLeast } from "@/lib/rbac";
import { defaultDashboardPath } from "@/lib/post-login-redirect";
import "@/app/admin/theme.css";
import NominatorShell from "./NominatorShell";

export default async function NominatorPortalLayout({ children }: { children: React.ReactNode }) {
  const session = await getRequestSessionUser();
  if (!session) {
    redirect("/login?next=/portal/nominator/");
  }
  if (!hasRoleAtLeast(session.role, UserRole.ENTRANT)) {
    redirect(defaultDashboardPath(session.role));
  }

  const displayName = session.fullName?.trim() || session.email;

  return (
    <NominatorShell email={session.email} fullName={displayName}>
      {children}
    </NominatorShell>
  );
}

