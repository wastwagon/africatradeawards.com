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
						body.css-loaded { visibility: visible; opacity: 1; transition: opacity 0.1s ease-in; }
					`
				}} />
				<script dangerouslySetInnerHTML={{
					__html: `
						(function() {
							const cssFiles = [
								'/assets/css/vendor/bootstrap.min.css',
								'/assets/css/vendor/fontawesome.css',
								'/assets/css/main.css',
								'/assets/css/vendor/aos.css',
								'/assets/css/vendor/magnific-popup.css',
								'/assets/css/vendor/mobile.css',
								'/assets/css/vendor/sidebar.css',
								'/assets/css/vendor/slick-slider.css',
								'/assets/css/vendor/nice-select.css',
								'/assets/css/vendor/odometer.css'
							];
							let loadedCount = 0;
							const totalFiles = cssFiles.length;
							
							cssFiles.forEach(function(href) {
								const link = document.createElement('link');
								link.rel = 'stylesheet';
								link.href = href;
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
								document.head.appendChild(link);
							});
							
							// Fallback: show content after 2 seconds even if CSS hasn't loaded
							setTimeout(function() {
								document.body.classList.add('css-loaded');
							}, 2000);
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
