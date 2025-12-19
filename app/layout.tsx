import 'swiper/css';
import "swiper/css/navigation";
import "swiper/css/pagination";
import './globals.css'
import CriticalCSS from '@/components/layout/CriticalCSS'

import type { Metadata } from "next"
import { Figtree, Space_Grotesk } from "next/font/google"

const figtree = Figtree({
	weight: ['300', '400', '500', '600', '700', '800', '900'],
	subsets: ['latin'],
	variable: "--figtree",
	display: 'swap',
})
const grotesk = Space_Grotesk({
	weight: ['300', '400', '500', '600', '700'],
	subsets: ['latin'],
	variable: "--grotesk",
	display: 'swap',
})

export const metadata: Metadata = {
	title: "Africa Trade Awards 2026 | Celebrating Africa's Trade Excellence",
	description: "The Africa Trade Awards honour the trailblazers, innovators, and institutions powering the continent's trade transformation and industrial renaissance. 30 January 2026, Kempinski Gold Coast City Hotel, Accra",
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body className={`${figtree.variable} ${grotesk.variable} homepage1-body`}>
				<CriticalCSS />
				{children}
			</body>
		</html>
	)
}
