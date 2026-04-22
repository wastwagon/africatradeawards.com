import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { getRequestSessionUser } from "@/lib/api-auth";
import "@/app/admin/theme.css";
import VoterShell from "./VoterShell";

export default async function VoterPortalLayout({ children }: { children: React.ReactNode }) {
  const session = await getRequestSessionUser();
  if (!session || session.role !== UserRole.VOTER) {
    redirect("/login?next=/portal/voter/");
  }

  const displayName = session.fullName?.trim() || session.email;

  return (
    <VoterShell email={session.email} fullName={displayName}>
      {children}
    </VoterShell>
  );
}
