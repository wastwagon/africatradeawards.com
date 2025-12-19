
'use client'
import AOS from 'aos'
import { useEffect, useState } from "react"
import AddClassBody from '../elements/AddClassBody'
import BackToTop from '../elements/BackToTop'
import Footer1 from './footer/Footer1'
import Footer10 from './footer/Footer10'
import Footer2 from './footer/Footer2'
import Footer3 from './footer/Footer3'
import Footer4 from './footer/Footer4'
import Footer5 from './footer/Footer5'
import Footer6 from './footer/Footer6'
import Footer7 from './footer/Footer7'
import Footer8 from './footer/Footer8'
import Footer9 from './footer/Footer9'
import Header1 from "./header/Header1"
import Header10 from './header/Header10'
import Header2 from './header/Header2'
import Header3 from './header/Header3'
import Header4 from './header/Header4'
import Header5 from './header/Header5'
import Header6 from './header/Header6'
import Header7 from './header/Header7'
import Header8 from './header/Header8'
import Header9 from './header/Header9'
import MobileMenu from './MobileMenu'
import MobileBottomNav from './MobileBottomNav'

interface LayoutProps {
	headerStyle?: Number
	footerStyle?: Number
	children?: React.ReactNode
}


export default function Layout({ headerStyle, footerStyle, children }: LayoutProps) {
	const [scroll, setScroll] = useState<boolean>(false)
	// Mobile Menu
	const [isMobileMenu, setMobileMenu] = useState<boolean>(false)
	const handleMobileMenu = (): void => setMobileMenu(!isMobileMenu)
	const [isSearch, setSearch] = useState<boolean>(false)
	const handleSearch = (): void => setSearch(!isSearch)

	useEffect(() => {
		AOS.init({
			once: true,
			mirror: false,
			duration: 800,
			easing: 'ease-in-out'
		})
		const handleScroll = (): void => {
			const scrollCheck: boolean = window.scrollY > 100
			if (scrollCheck !== scroll) {
				setScroll(scrollCheck)
			}
		}

		document.addEventListener("scroll", handleScroll)

		return () => {
			document.removeEventListener("scroll", handleScroll)
		}
	}, [scroll])


	return (
		<>
			<div id="top" />
			<AddClassBody />
			{/* <AnimatedText /> */}
		{!headerStyle && <Header1 scroll={scroll} isMobileMenu={isMobileMenu} handleMobileMenu={handleMobileMenu} isSearch={isSearch} handleSearch={handleSearch} />}
		{headerStyle === 1 && <Header1 scroll={scroll} isMobileMenu={isMobileMenu} handleMobileMenu={handleMobileMenu} isSearch={isSearch} handleSearch={handleSearch} />}
		{headerStyle === 2 && <Header2 scroll={scroll} isMobileMenu={isMobileMenu} handleMobileMenu={handleMobileMenu} isSearch={isSearch} handleSearch={handleSearch} />}
		{headerStyle === 3 && <Header3 scroll={scroll} isMobileMenu={isMobileMenu} handleMobileMenu={handleMobileMenu} isSearch={isSearch} handleSearch={handleSearch} />}
		{headerStyle === 4 && <Header4 scroll={scroll} isMobileMenu={isMobileMenu} handleMobileMenu={handleMobileMenu} isSearch={isSearch} handleSearch={handleSearch} />}
		{headerStyle === 5 && <Header5 scroll={scroll} isMobileMenu={isMobileMenu} handleMobileMenu={handleMobileMenu} isSearch={isSearch} handleSearch={handleSearch} />}
		{headerStyle === 6 && <Header6 scroll={scroll} isMobileMenu={isMobileMenu} handleMobileMenu={handleMobileMenu} isSearch={isSearch} handleSearch={handleSearch} />}
		{headerStyle === 7 && <Header7 scroll={scroll} isMobileMenu={isMobileMenu} handleMobileMenu={handleMobileMenu} isSearch={isSearch} handleSearch={handleSearch} />}
		{headerStyle === 8 && <Header8 scroll={scroll} isMobileMenu={isMobileMenu} handleMobileMenu={handleMobileMenu} isSearch={isSearch} handleSearch={handleSearch} />}
		{headerStyle === 9 && <Header9 scroll={scroll} isMobileMenu={isMobileMenu} handleMobileMenu={handleMobileMenu} isSearch={isSearch} handleSearch={handleSearch} />}
		{headerStyle === 10 && <Header10 scroll={scroll} isMobileMenu={isMobileMenu} handleMobileMenu={handleMobileMenu} isSearch={isSearch} handleSearch={handleSearch} />}
			<MobileMenu isMobileMenu={isMobileMenu} handleMobileMenu={handleMobileMenu} />


			{children}

			<MobileBottomNav />

		{!footerStyle && <Footer1 />}
		{footerStyle === 1 && <Footer1 />}
		{footerStyle === 2 && <Footer2 />}
		{footerStyle === 3 && <Footer3 />}
		{footerStyle === 4 && <Footer4 />}
		{footerStyle === 5 && <Footer5 />}
		{footerStyle === 6 && <Footer6 />}
		{footerStyle === 7 && <Footer7 />}
		{footerStyle === 8 && <Footer8 />}
		{footerStyle === 9 && <Footer9 />}
		{footerStyle === 10 && <Footer10 />}

			<BackToTop target="#top" />
		</>
	)
}
