import 'swiper/css';
import "swiper/css/navigation";
import "swiper/css/pagination";
import './globals.css'

import type { Metadata } from "next"
import { Figtree, Space_Grotesk } from "next/font/google"
import Script from 'next/script'

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
			<head>
				{/* Preload critical CSS files to prevent FOUC */}
				<link rel="preload" href="/assets/css/vendor/bootstrap.min.css" as="style" />
				<link rel="preload" href="/assets/css/vendor/fontawesome.css" as="style" />
				<link rel="preload" href="/assets/css/main.css" as="style" />
				
				{/* Load CSS synchronously in head to prevent FOUC */}
				<link rel="stylesheet" href="/assets/css/vendor/bootstrap.min.css" />
				<link rel="stylesheet" href="/assets/css/vendor/fontawesome.css" />
				<link rel="stylesheet" href="/assets/css/main.css" />
				<link rel="stylesheet" href="/assets/css/vendor/aos.css" />
				<link rel="stylesheet" href="/assets/css/vendor/magnific-popup.css" />
				<link rel="stylesheet" href="/assets/css/vendor/mobile.css" />
				<link rel="stylesheet" href="/assets/css/vendor/sidebar.css" />
				<link rel="stylesheet" href="/assets/css/vendor/slick-slider.css" />
				<link rel="stylesheet" href="/assets/css/vendor/nice-select.css" />
				<link rel="stylesheet" href="/assets/css/vendor/odometer.css" />
			</head>
			<body className={`${figtree.variable} ${grotesk.variable} homepage1-body`}>
				{children}
			</body>
		</html>
	)
}
