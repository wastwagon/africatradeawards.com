
'use client'
import AOS from 'aos'
import { useEffect, useState } from "react"
import AddClassBody from '../elements/AddClassBody'
import BackToTop from '../elements/BackToTop'
import AnnouncementBar from '@/components/site/AnnouncementBar'
import { useSiteConfig } from '@/components/site/SiteConfigProvider'
import Footer1 from './footer/Footer1'
import Header1 from "./header/Header1"
import MobileMenu from './MobileMenu'
import MobileBottomNav from './MobileBottomNav'

interface LayoutProps {
	children?: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
	const { supportEmail, eventLiveStreamEnabled } = useSiteConfig()
	const [scroll, setScroll] = useState<boolean>(false)
	const [isMobileMenu, setMobileMenu] = useState<boolean>(false)
	const handleMobileMenu = (): void => setMobileMenu(!isMobileMenu)
	const [isSearch, setSearch] = useState<boolean>(false)
	const handleSearch = (): void => setSearch(!isSearch)

	useEffect(() => {
		const handleScroll = (): void => {
			setScroll((prev) => {
				const next = window.scrollY > 100
				return next === prev ? prev : next
			})
		}
		handleScroll()
		document.addEventListener("scroll", handleScroll, { passive: true })

		const initAos = (): void => {
			AOS.init({
				once: true,
				mirror: false,
				duration: 800,
				easing: 'ease-in-out',
				disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
			})
		}

		let idleId: ReturnType<typeof requestIdleCallback> | undefined
		if (typeof window.requestIdleCallback === 'function') {
			idleId = window.requestIdleCallback(() => initAos(), { timeout: 400 })
		} else {
			requestAnimationFrame(() => initAos())
		}

		return () => {
			if (idleId !== undefined && typeof window.cancelIdleCallback === 'function') {
				window.cancelIdleCallback(idleId)
			}
			document.removeEventListener("scroll", handleScroll)
		}
	}, [])

	return (
		<>
			<div id="top" />
			<AddClassBody />
			<Header1 scroll={scroll} isMobileMenu={isMobileMenu} handleMobileMenu={handleMobileMenu} isSearch={isSearch} handleSearch={handleSearch} />
			<MobileMenu isMobileMenu={isMobileMenu} handleMobileMenu={handleMobileMenu} />
			<AnnouncementBar />

			<div className="site-layout-chrome">
				{children}

				<MobileBottomNav />

				<Footer1 supportEmail={supportEmail} showLiveStream={eventLiveStreamEnabled} />
			</div>

			<BackToTop target="#top" />
		</>
	)
}
