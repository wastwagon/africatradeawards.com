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
			<body className={`${figtree.variable} ${grotesk.variable} homepage1-body`}>
				{/* Blocking script to load CSS and prevent FOUC */}
				<Script
					id="load-critical-css"
					strategy="beforeInteractive"
					dangerouslySetInnerHTML={{
						__html: `
							(function() {
								// Hide body until CSS loads
								document.body.style.visibility = 'hidden';
								document.body.style.opacity = '0';
								
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
								
								function showBody() {
									document.body.style.visibility = 'visible';
									document.body.style.opacity = '1';
									document.body.style.transition = 'opacity 0.2s ease-in';
								}
								
								cssFiles.forEach(function(href) {
									if (!document.querySelector('link[href="' + href + '"]')) {
										const link = document.createElement('link');
										link.rel = 'stylesheet';
										link.href = href;
										link.onload = function() {
											loadedCount++;
											if (loadedCount === totalFiles) {
												showBody();
											}
										};
										link.onerror = function() {
											loadedCount++;
											if (loadedCount === totalFiles) {
												showBody();
											}
										};
										document.head.appendChild(link);
									} else {
										loadedCount++;
										if (loadedCount === totalFiles) {
											showBody();
										}
									}
								});
								
								// Fallback: show content after 1.5 seconds
								setTimeout(showBody, 1500);
							})();
						`,
					}}
				/>
				{children}
			</body>
		</html>
	)
}
