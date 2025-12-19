'use client'
import { useEffect } from 'react'

export default function CriticalCSS() {
	useEffect(() => {
		// Load CSS files immediately - this runs as soon as component mounts
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
			'/assets/css/vendor/odometer.css',
		]

		// Load CSS synchronously - check if already loaded first
		cssFiles.forEach((href) => {
			const existingLink = document.querySelector(`link[href="${href}"]`)
			if (!existingLink) {
				const link = document.createElement('link')
				link.rel = 'stylesheet'
				link.href = href
				link.setAttribute('data-critical', 'true')
				
				// Insert at the beginning of head to ensure proper cascade
				const firstLink = document.head.querySelector('link[rel="stylesheet"]')
				if (firstLink) {
					document.head.insertBefore(link, firstLink)
				} else {
					document.head.appendChild(link)
				}
			}
		})
	}, []) // Empty dependency array - only run once on mount

	return null
}
