import SiteContentForm from '@/components/admin/SiteContentForm'
import CmsContentManager from '@/components/admin/CmsContentManager'
import Link from 'next/link'
import { getPublicSiteSettings } from '@/lib/public-site-settings'

export default async function AdminSiteContentPage() {
	const settings = await getPublicSiteSettings()
	return (
		<>
			<SiteContentForm initial={settings} />
			<p className="admin-muted" style={{ marginTop: '-4px' }}>
				Need to respond to inbound messages? Open <Link href="/admin/contact-inquiries">contact inquiries</Link>.
			</p>
			<CmsContentManager />
		</>
	)
}
