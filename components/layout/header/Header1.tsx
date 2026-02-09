'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Header1({ scroll, isMobileMenu, handleMobileMenu, isSearch, handleSearch }: any) {
	const pathname = usePathname()

	const isActive = (href: string) => {
		if (href === '/') {
			return pathname === '/'
		}
		return pathname?.startsWith(href)
	}

	const isParentActive = (hrefs: string[]) => {
		return hrefs.some(href => isActive(href))
	}

	return (
		<>
			<header>
				<div className={`header-area homepage1 header header-sticky d-none d-lg-block ${scroll ? 'sticky' : ''}`} id="header">
					<div className="container">
						<div className="row">
							<div className="col-lg-12">
								<div className="header-elements">
									<div className="site-logo">
										<Link href="/"><img src="/assets/img/logo/logo1.png?v=2" alt="Africa Trade Awards" /></Link>
									</div>
									<div className="main-menu">
										<ul>
											<li className={isActive('/') ? 'active' : ''}>
												<Link href="/">Home</Link>
											</li>
											<li className={isActive('/about') ? 'active' : ''}>
												<Link href="/about">About</Link>
											</li>
											<li className={isActive('/awards-structure') ? 'active' : ''}>
												<Link href="/awards-structure">Awards Structure</Link>
											</li>
											<li className={isActive('/awardees') ? 'active' : ''}>
												<Link href="/awardees">Awardees</Link>
											</li>
											<li className={isActive('/sponsors-partners') ? 'active' : ''}>
												<Link href="/sponsors-partners">Sponsors & Partners</Link>
											</li>
											<li className={isActive('/gallery') ? 'active' : ''}>
												<Link href="/gallery">Gallery</Link>
											</li>
											<li className={isActive('/publications') ? 'active' : ''}>
												<Link href="/publications">Publications</Link>
											</li>
											<li className={isActive('/faq') ? 'active' : ''}>
												<Link href="/faq">FAQs</Link>
											</li>
											<li className={isActive('/contact') ? 'active' : ''}>
												<Link href="/contact">Contact</Link>
											</li>
										</ul>
									</div>
									<div className="btn-area">
										<ul>
											<li>
												<Link href="/#"><i className="fa-brands fa-facebook-f" /></Link>
											</li>
											<li>
												<Link href="/#"><i className="fa-brands fa-instagram" /></Link>
											</li>
											<li>
												<Link href="/#" className="m-0"><i className="fa-brands fa-linkedin-in" /></Link>
											</li>
										</ul>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</header>
		</>
	)
}
