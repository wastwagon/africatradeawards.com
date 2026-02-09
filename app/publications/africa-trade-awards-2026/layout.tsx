import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Africa Trade Awards 2026 Honour Leaders Driving Africa\'s Industrialisation | Press Release',
	description: 'The Africa Trade Awards 2026 concluded in Accra as a landmark celebration of leadership, innovation, and execution in advancing Africa\'s industrialisation and intra-African trade agenda under the AfCFTA.',
}

export default function PressReleaseLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return <>{children}</>
}
