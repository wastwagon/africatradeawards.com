import type { Metadata } from 'next'

/** List and detail pages load CMS-driven content; do not treat the segment as static. */
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
	title: 'Publications | Africa Trade Awards 2026',
	description: 'Press releases and official announcements from the Africa Trade Chamber and Africa Trade Awards.',
}

export default function PublicationsLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return <>{children}</>
}
