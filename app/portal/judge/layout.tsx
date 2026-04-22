import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { getRequestSessionUser } from "@/lib/api-auth";
import { hasRoleAtLeast } from "@/lib/rbac";
import { defaultDashboardPath } from "@/lib/post-login-redirect";
import "@/app/admin/theme.css";
import JudgeShell from "./JudgeShell";

export default async function JudgePortalLayout({ children }: { children: React.ReactNode }) {
  const session = await getRequestSessionUser();
  if (!session) {
    redirect("/login?next=/portal/judge/");
  }
  if (!hasRoleAtLeast(session.role, UserRole.JUDGE)) {
    redirect(defaultDashboardPath(session.role));
  }

  const displayName = session.fullName?.trim() || session.email;

  return (
    <JudgeShell email={session.email} fullName={displayName}>
      {children}
    </JudgeShell>
  );
}

