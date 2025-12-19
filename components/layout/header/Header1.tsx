import Link from 'next/link'


export default function Header1({ scroll, isMobileMenu, handleMobileMenu, isSearch, handleSearch }: any) {
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
											<li><Link href="/">Home</Link></li>
											<li>
												<Link href="/about">About <i className="fa-solid fa-angle-down" /></Link>
												<ul className="dropdown-padding">
													<li><Link href="/about">About The Awards</Link></li>
													<li><Link href="/jury">Jury & Evaluation</Link></li>
													<li><Link href="/independent-audit">Independent Audit</Link></li>
												</ul>
											</li>
											<li>
												<Link href="/award-categories">Awards <i className="fa-solid fa-angle-down" /></Link>
												<ul className="dropdown-padding">
													<li><Link href="/award-categories">Award Categories</Link></li>
													<li><Link href="/nomination">Nomination Process</Link></li>
												</ul>
											</li>
											<li>
												<Link href="/awards-night">Event <i className="fa-solid fa-angle-down" /></Link>
												<ul className="dropdown-padding">
													<li><Link href="/awards-night">Awards Night</Link></li>
													<li><Link href="/travel-accommodation">Travel & Accommodation</Link></li>
													<li><Link href="/media-centre">Media Centre</Link></li>
												</ul>
											</li>
											<li><Link href="/partnerships">Partnerships</Link></li>
											<li><Link href="/legal">Contact</Link></li>
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
