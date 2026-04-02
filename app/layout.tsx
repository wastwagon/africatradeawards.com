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
import StylesLoadedGate from '@/components/layout/StylesLoadedGate'
import ImpersonationBanner from '@/components/platform/ImpersonationBanner'
import { SiteConfigProvider } from '@/components/site/SiteConfigProvider'
import { getPublicSiteSettings } from '@/lib/public-site-settings'

import type { Metadata, Viewport } from "next"
import { Figtree, Space_Grotesk } from "next/font/google"

const mainCssHref = `/assets/css/main.css?v=${process.env.NEXT_PUBLIC_CSS_BUST ?? '20260406'}`

/* Match theme tokens in scss/utils/_fonts-s.scss (400–800); skip 300/900 to cut font bytes */
const figtree = Figtree({
	weight: ['400', '500', '600', '700', '800'],
	style: ['normal', 'italic'],
	subsets: ['latin'],
	variable: "--figtree",
	display: 'swap',
	adjustFontFallback: true,
})
const grotesk = Space_Grotesk({
	weight: ['400', '500', '600', '700'],
	subsets: ['latin'],
	variable: "--grotesk",
	display: 'swap',
	adjustFontFallback: true,
})

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	viewportFit: "cover",
	themeColor: "#4e2b5a",
}

export const metadata: Metadata = {
	title: "Africa Trade Awards 2026 | Celebrating Africa's Trade Excellence",
	description: "The Africa Trade Awards honour the trailblazers, innovators, and institutions powering the continent's trade transformation and industrial renaissance. 28th and 29th January 2026, Kempinski Gold Coast City Hotel, Accra",
	icons: {
		icon: [
			{ url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
			{ url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
		],
		apple: [
			{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
		],
	},
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
			<body className={`${figtree.variable} ${grotesk.variable} homepage1-body`} suppressHydrationWarning>
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
