import SiteContentForm from '@/components/admin/SiteContentForm'
import CmsContentManager from '@/components/admin/CmsContentManager'
import { getPublicSiteSettings } from '@/lib/public-site-settings'

export default async function AdminSiteContentPage() {
	const settings = await getPublicSiteSettings()
	return (
		<>
			<SiteContentForm initial={settings} />
			<CmsContentManager />
		</>
	)
}
