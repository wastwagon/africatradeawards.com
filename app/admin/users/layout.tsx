import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { getRequestSessionUser } from "@/lib/api-auth";

export default async function AdminUsersLayout({ children }: { children: React.ReactNode }) {
  const session = await getRequestSessionUser();
  if (!session || session.role !== UserRole.SUPER_ADMIN) {
    redirect("/admin");
  }
  return <>{children}</>;
}
