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
											<li className={isParentActive(['/about', '/jury', '/independent-audit']) ? 'active' : ''}>
												<Link href="/about">About <i className="fa-solid fa-angle-down" /></Link>
												<ul className="dropdown-padding">
													<li className={isActive('/about') ? 'active' : ''}>
														<Link href="/about" className={isActive('/about') ? 'active-link' : ''}>About The Awards</Link>
													</li>
													<li className={isActive('/jury') ? 'active' : ''}>
														<Link href="/jury" className={isActive('/jury') ? 'active-link' : ''}>Jury & Evaluation</Link>
													</li>
													<li className={isActive('/independent-audit') ? 'active' : ''}>
														<Link href="/independent-audit" className={isActive('/independent-audit') ? 'active-link' : ''}>Independent Audit</Link>
													</li>
												</ul>
											</li>
											<li className={isParentActive(['/award-categories', '/nomination']) ? 'active' : ''}>
												<Link href="/award-categories">Awards <i className="fa-solid fa-angle-down" /></Link>
												<ul className="dropdown-padding">
													<li className={isActive('/award-categories') ? 'active' : ''}>
														<Link href="/award-categories" className={isActive('/award-categories') ? 'active-link' : ''}>Award Categories</Link>
													</li>
													<li className={isActive('/nomination') ? 'active' : ''}>
														<Link href="/nomination" className={isActive('/nomination') ? 'active-link' : ''}>Nomination Process</Link>
													</li>
												</ul>
											</li>
											<li className={isParentActive(['/awards-night', '/travel-accommodation', '/media-centre']) ? 'active' : ''}>
												<Link href="/awards-night">Event <i className="fa-solid fa-angle-down" /></Link>
												<ul className="dropdown-padding">
													<li className={isActive('/awards-night') ? 'active' : ''}>
														<Link href="/awards-night" className={isActive('/awards-night') ? 'active-link' : ''}>Awards Night</Link>
													</li>
													<li className={isActive('/travel-accommodation') ? 'active' : ''}>
														<Link href="/travel-accommodation" className={isActive('/travel-accommodation') ? 'active-link' : ''}>Travel & Accommodation</Link>
													</li>
													<li className={isActive('/media-centre') ? 'active' : ''}>
														<Link href="/media-centre" className={isActive('/media-centre') ? 'active-link' : ''}>Media Centre</Link>
													</li>
												</ul>
											</li>
											<li className={isActive('/partnerships') ? 'active' : ''}>
												<Link href="/partnerships">Partnerships</Link>
											</li>
											<li className={isActive('/legal') ? 'active' : ''}>
												<Link href="/legal">Contact</Link>
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
