import SiteContentForm from "@/components/admin/SiteContentForm";
import CmsContentManager from "@/components/admin/CmsContentManager";
import Link from "next/link";
import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";
import { defaultDashboardPath } from "@/lib/post-login-redirect";
import { getRequestSessionUser } from "@/lib/api-auth";
import { hasRoleAtLeast } from "@/lib/rbac";
import { getPublicSiteSettings } from "@/lib/public-site-settings";
import { getAdminCmsEditorBundle } from "@/lib/cms-content";

export default async function AdminSiteContentPage() {
	const session = await getRequestSessionUser();
	if (!session) {
		redirect("/login?next=/admin/site-content");
	}
	if (!hasRoleAtLeast(session.role, UserRole.PROGRAM_MANAGER)) {
		redirect(defaultDashboardPath(session.role));
	}

	const settings = await getPublicSiteSettings();
	const cmsEditor = await getAdminCmsEditorBundle();
	return (
		<main>
			<SiteContentForm initial={settings} />
			<p className="admin-muted admin-mt-sm">
				Need to respond to inbound messages? Open <Link href="/admin/contact-inquiries">contact inquiries</Link>.
			</p>
			<CmsContentManager initialBundle={cmsEditor} />
		</main>
	);
}
