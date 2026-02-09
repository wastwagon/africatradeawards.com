'use client'
import { useState } from 'react';
import Link from 'next/link'

export default function MobileMenu({ isMobileMenu, handleMobileMenu }: any) {
	const [isAccordion, setIsAccordion] = useState(1)

	const handleAccordion = (key: any) => {
		setIsAccordion(prevState => prevState === key ? null : key)
	}
	return (
		<>
			<div className="mobile-header mobile-haeder1 d-block d-lg-none">
				<div className="container-fluid">
					<div className="col-12">
						<div className="mobile-header-elements">
							<div className="mobile-logo">
								<Link href="/"><img src="/assets/img/logo/logo1.png?v=2" alt="Africa Trade Awards" /></Link>
							</div>
							<div className="mobile-nav-icon dots-menu" onClick={handleMobileMenu}>
								<i className="fa-solid fa-bars-staggered" />
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className={`mobile-sidebar mobile-sidebar1 ${isMobileMenu ? 'mobile-menu-active' : ''}`}>
				<div className="logosicon-area">
					<div className="menu-close" onClick={handleMobileMenu}>
						<i className="fa-solid fa-xmark" />
					</div>
				</div>
				<div className="mobile-nav mobile-nav1">
					<ul className="mobile-nav-list nav-list1">
						<li className="hash-has-sub"><Link href="/" className="hash-nav">Home</Link></li>
						<li className="hash-has-sub"><Link href="/about" className="hash-nav">About</Link></li>
						<li className="hash-has-sub"><Link href="/awards-structure" className="hash-nav">Awards Structure</Link></li>
						<li className="hash-has-sub"><Link href="/awardees" className="hash-nav">Awardees</Link></li>
						<li className="hash-has-sub"><Link href="/sponsors-partners" className="hash-nav">Sponsors & Partners</Link></li>
						<li className="hash-has-sub"><Link href="/gallery" className="hash-nav">Gallery</Link></li>
						<li className="hash-has-sub"><Link href="/publications" className="hash-nav">Publications</Link></li>
						<li className="hash-has-sub"><Link href="/faq" className="hash-nav">FAQs</Link></li>
						<li className="hash-has-sub"><Link href="/contact" className="hash-nav">Contact</Link></li>
					</ul>

					<div className="allmobilesection">
						<Link href="/contact" className="vl-btn1">Contact Now</Link>
						<div className="single-footer">
							<h3>Contact Info</h3>
							<div className="footer1-contact-info">
								<div className="contact-info-single">
									<div className="contact-info-icon">
										<span><i className="fa-solid fa-envelope" /></span>
									</div>
									<div className="contact-info-text">
										<Link href="mailto:secretariat@africatradeawards.com">secretariat@africatradeawards.com</Link>
									</div>
								</div>
								<div className="contact-info-single">
									<div className="contact-info-icon">
										<span><i className="fa-solid fa-globe" /></span>
									</div>
									<div className="contact-info-text">
										<Link href="https://www.africatradeawards.com" target="_blank" rel="noopener noreferrer">www.africatradeawards.com</Link>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
