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
						<li className="has-sub hash-has-sub">
							<span className={`submenu-button ${isAccordion == 1 ? "submenu-opened" : ""}`} onClick={() => handleAccordion(1)}><em /></span>
							<Link href="/about" className="hash-nav">About</Link>
							<ul className={`sub-menu ${isAccordion == 1 ? "open-sub" : ""}`} style={{ display: `${isAccordion == 1 ? "block" : "none"}` }}>
								<li className="hash-has-sub"><Link href="/about" className="hash-nav">About The Awards</Link></li>
								<li className="hash-has-sub"><Link href="/independent-audit" className="hash-nav">Independent Audit</Link></li>
							</ul>
						</li>
						<li className="hash-has-sub"><Link href="/award-categories" className="hash-nav">Awards</Link></li>
						<li className="has-sub hash-has-sub">
							<span className={`submenu-button ${isAccordion == 3 ? "submenu-opened" : ""}`} onClick={() => handleAccordion(3)}><em /></span>
							<Link href="/awards-night" className="hash-nav">Event</Link>
							<ul className={`sub-menu ${isAccordion == 3 ? "open-sub" : ""}`} style={{ display: `${isAccordion == 3 ? "block" : "none"}` }}>
								<li className="hash-has-sub"><Link href="/awards-night" className="hash-nav">Awards Night</Link></li>
								<li className="hash-has-sub"><Link href="/travel-accommodation" className="hash-nav">Travel & Accommodation</Link></li>
								<li className="hash-has-sub"><Link href="/media-centre" className="hash-nav">Media Centre</Link></li>
							</ul>
						</li>
						<li className="hash-has-sub"><Link href="/partnerships" className="hash-nav">Partnerships</Link></li>
						<li className="hash-has-sub"><Link href="/legal" className="hash-nav">Legal</Link></li>
						<li className="hash-has-sub"><Link href="/contact" className="hash-nav">Contact Us</Link></li>
					</ul>

					<div className="allmobilesection">
						<Link href="/contact" className="vl-btn1">Contact Now</Link>
						<div className="single-footer">
							<h3>Contact Info</h3>
							<div className="footer1-contact-info">
								<div className="contact-info-single">
									<div className="contact-info-icon">
										<span><i className="fa-solid fa-phone-volume" /></span>
									</div>
									<div className="contact-info-text">
										<Link href="tel:+233505366200">+233 50 536 6200</Link>
									</div>
								</div>
								<div className="contact-info-single">
									<div className="contact-info-icon">
										<span><i className="fa-solid fa-envelope" /></span>
									</div>
									<div className="contact-info-text">
										<Link href="mailto:info@africantradechamber.org">info@africantradechamber.org</Link>
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
