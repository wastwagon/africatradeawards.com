import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Press & media',
	description:
		'Official boilerplate, key facts, and press contacts for the Africa Trade Awards — accreditation, interviews, and assets.',
	openGraph: {
		title: 'Press & media | Africa Trade Awards',
		description:
			'Official boilerplate, key facts, and press contacts for the Africa Trade Awards — accreditation, interviews, and assets.',
		type: 'website',
	},
}

export default function PressLayout({ children }: { children: React.ReactNode }) {
	return children
}
