import type { Metadata } from 'next'

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
