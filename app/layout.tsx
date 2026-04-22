import 'swiper/css';
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import "../public/assets/css/vendor/bootstrap.min.css";
import "../public/assets/css/vendor/fontawesome.css";
import "../public/assets/css/vendor/aos.css";
import "../public/assets/css/vendor/mobile.css";
import './globals.css'
import './design-tokens.css'
import './theme-dark.css'
import Script from 'next/script'
import StylesLoadedGate from '@/components/layout/StylesLoadedGate'
import ImpersonationBanner from '@/components/platform/ImpersonationBanner'
import { SiteConfigProvider } from '@/components/site/SiteConfigProvider'
import { getPublicSiteSettings } from '@/lib/public-site-settings'

import type { Metadata, Viewport } from "next"
import { Plus_Jakarta_Sans, Source_Sans_3 } from "next/font/google"

const mainCssHref = `/assets/css/main.css?v=${process.env.NEXT_PUBLIC_CSS_BUST ?? '20260422'}`

const DEFAULT_SITE_DESCRIPTION =
	"The Africa Trade Awards honour the trailblazers, innovators, and institutions powering the continent's trade transformation and industrial renaissance. 28th and 29th January 2026, Kempinski Gold Coast City Hotel, Accra"

const siteBaseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.africatradeawards.com').replace(/\/+$/, '')

/* Body: Source Sans 3; display/headings: Plus Jakarta Sans. Legacy --figtree/--grotesk var names match SCSS + main.css. */
const sourceSans = Source_Sans_3({
	weight: ['400', '500', '600', '700'],
	style: ['normal', 'italic'],
	subsets: ['latin'],
	variable: '--figtree',
	display: 'swap',
	adjustFontFallback: true,
})
const plusJakarta = Plus_Jakarta_Sans({
	weight: ['400', '500', '600', '700', '800'],
	subsets: ['latin'],
	variable: '--grotesk',
	display: 'swap',
	adjustFontFallback: true,
})

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	viewportFit: "cover",
	themeColor: "#4e2b5a",
}

function metadataBaseUrl(): URL {
	try {
		return new URL(siteBaseUrl)
	} catch {
		return new URL('https://www.africatradeawards.com')
	}
}

export async function generateMetadata(): Promise<Metadata> {
	const s = await getPublicSiteSettings()
	const description = s.seoDescription.trim() || DEFAULT_SITE_DESCRIPTION
	const title = "Africa Trade Awards 2026 | Celebrating Africa's Trade Excellence"
	return {
		metadataBase: metadataBaseUrl(),
		title,
		description,
		openGraph: {
			url: '/',
			title,
			description,
			type: 'website',
			locale: 'en',
			siteName: 'Africa Trade Awards',
		},
		twitter: {
			card: 'summary_large_image',
			title,
			description,
		},
		icons: {
			icon: [
				{ url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
				{ url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
			],
			apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
		},
	}
}

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	const siteConfig = await getPublicSiteSettings()
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<Script id="ata-theme-init" strategy="beforeInteractive">
					{`(function(){try{var k='ata-theme';var v=localStorage.getItem(k);var dark=v==='dark'||(v!=='light'&&window.matchMedia('(prefers-color-scheme:dark)').matches);if(dark)document.documentElement.classList.add('ata-dark-mode');}catch(e){}})();`}
				</Script>
				<style
					dangerouslySetInnerHTML={{
						__html: `
html:not(.styles-loaded) body{opacity:0}
html.styles-loaded body{opacity:1}
@media (prefers-reduced-motion:reduce){
  html:not(.styles-loaded) body{opacity:1}
}
@media (scripting:none){
  html:not(.styles-loaded) body{opacity:1}
}
`,
					}}
				/>
				<link rel="stylesheet" href={mainCssHref} />
			</head>
			<body className={`${sourceSans.variable} ${plusJakarta.variable} homepage1-body`} suppressHydrationWarning>
				<StylesLoadedGate />
				<noscript>
					<style>{'html:not(.styles-loaded) body{opacity:1!important}'}</style>
				</noscript>
				<SiteConfigProvider value={siteConfig}>
					<ImpersonationBanner />
					{children}
				</SiteConfigProvider>
			</body>
		</html>
	)
}
