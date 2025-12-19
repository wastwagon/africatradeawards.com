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
	other: {
		// Preload critical CSS
		'preload-bootstrap': '/assets/css/vendor/bootstrap.min.css',
		'preload-fontawesome': '/assets/css/vendor/fontawesome.css',
		'preload-main': '/assets/css/main.css',
	},
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<head>
				{/* Critical CSS - load immediately to prevent FOUC */}
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
				{/* Hide body until CSS loads - prevents FOUC */}
				<style dangerouslySetInnerHTML={{
					__html: `
						body { visibility: hidden; opacity: 0; }
						body.css-loaded { visibility: visible; opacity: 1; transition: opacity 0.2s ease-in; }
					`
				}} />
				<script dangerouslySetInnerHTML={{
					__html: `
						(function() {
							// Check if CSS links are already loaded
							const cssLinks = document.querySelectorAll('link[rel="stylesheet"][href*="/assets/css/"]');
							let loadedCount = 0;
							const totalFiles = cssLinks.length;
							
							if (totalFiles === 0) {
								// No CSS links found, show body immediately
								document.body.classList.add('css-loaded');
								return;
							}
							
							// Wait for all CSS files to load
							cssLinks.forEach(function(link) {
								if (link.sheet || link.styleSheet) {
									// Already loaded
									loadedCount++;
									if (loadedCount === totalFiles) {
										document.body.classList.add('css-loaded');
									}
								} else {
									// Wait for load
									link.onload = function() {
										loadedCount++;
										if (loadedCount === totalFiles) {
											document.body.classList.add('css-loaded');
										}
									};
									link.onerror = function() {
										loadedCount++;
										if (loadedCount === totalFiles) {
											document.body.classList.add('css-loaded');
										}
									};
								}
							});
							
							// Fallback: show content after 1.5 seconds
							setTimeout(function() {
								document.body.classList.add('css-loaded');
							}, 1500);
						})();
					`
				}} />
			</head>
			<body className={`${figtree.variable} ${grotesk.variable} homepage1-body`}>
				{children}
			</body>
		</html>
	)
}
