import Link from 'next/link'


export default function Footer1() {
	return (
		<>
			<div className="footer1-sertion-area">
				<div className="container">
					<div className="row">
						<div className="col-lg-4 col-md-6">
							<div className="footer-logo-area">
								<h3>About The Awards</h3>
								<div className="space12" />
								<p>The Africa Trade Awards celebrates the visionaries transforming Africa&apos;s economy—those who innovate, lead, and build pathways to prosperity across borders. As the flagship recognition platform of the Africa Trade Summit, the Awards honour individuals and institutions advancing enterprise, policy, and investment.</p>
								<div className="space16" />
								<ul>
									<li>
										<Link href="https://www.facebook.com/AfricaTradeChamber" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-facebook-f" /></Link>
									</li>
									<li>
										<Link href="https://www.instagram.com/AfricaTradeChamber" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-instagram" /></Link>
									</li>
									<li>
										<Link href="https://www.linkedin.com/company/AfricaTradeChamber" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-linkedin-in" /></Link>
									</li>
									<li>
										<Link href="https://www.youtube.com/@AfricaTradeChamber" target="_blank" rel="noopener noreferrer" className="m-0"><i className="fa-brands fa-youtube" /></Link>
									</li>
								</ul>
							</div>
						</div>
						<div className="col-lg-2 col-md-6">
							<div className="link-content">
								<h3>Quick Links</h3>
								<ul>
									<li><Link href="/about">About The Awards</Link></li>
									<li><Link href="/award-categories">Award Categories</Link></li>
									<li><Link href="/nomination">Nomination Process</Link></li>
									<li><Link href="/jury">Jury & Evaluation</Link></li>
									<li><Link href="/awards-night">Awards Night</Link></li>
									<li><Link href="/media-centre">Media Centre</Link></li>
								</ul>
							</div>
						</div>
						<div className="col-lg-3 col-md-6">
							<div className="link-content2">
								<h3>Contact Us</h3>
								<ul>
									<li>
										<Link href="tel:+233505366200"><img src="/assets/img/icons/phn1.svg" alt="" />+233 50 536 6200</Link>
									</li>
									<li>
										<Link href="mailto:info@africantradechamber.org"><img src="/assets/img/icons/mail1.svg" alt="" />info@africantradechamber.org</Link>
									</li>
									<li>
										<Link href="https://www.africatradeawards.com" target="_blank" rel="noopener noreferrer"> <img src="/assets/img/icons/world1.svg" alt="" />www.africatradeawards.com</Link>
									</li>
								</ul>
							</div>
						</div>
						<div className="col-lg-3 col-md-6">
							<div className="footer-social-box">
								<h3>Event Gallery</h3>
								<div className="space12" />
								<div className="row">
									<div className="col-lg-4 col-md-4 col-4">
										<div className="img1">
											<img src="/assets/img/all-images/about/about-img8.png" alt="Event Gallery" />
											<div className="icons">
												<Link href="/media-centre"><i className="fa-brands fa-instagram" /></Link>
											</div>
										</div>
									</div>
									<div className="col-lg-4 col-md-4 col-4">
										<div className="img1">
											<img src="/assets/img/all-images/about/about-img8.png" alt="Event Gallery" />
											<div className="icons">
												<Link href="/media-centre"><i className="fa-brands fa-instagram" /></Link>
											</div>
										</div>
									</div>
									<div className="col-lg-4 col-md-4 col-4">
										<div className="img1">
											<img src="/assets/img/all-images/about/about-img8.png" alt="Event Gallery" />
											<div className="icons">
												<Link href="/media-centre"><i className="fa-brands fa-instagram" /></Link>
											</div>
										</div>
									</div>
									<div className="col-lg-4 col-md-4 col-4">
										<div className="img1">
											<img src="/assets/img/all-images/about/about-img8.png" alt="Event Gallery" />
											<div className="icons">
												<Link href="/media-centre"><i className="fa-brands fa-instagram" /></Link>
											</div>
										</div>
									</div>
									<div className="col-lg-4 col-md-4 col-4">
										<div className="img1">
											<img src="/assets/img/all-images/about/about-img8.png" alt="Event Gallery" />
											<div className="icons">
												<Link href="/media-centre"><i className="fa-brands fa-instagram" /></Link>
											</div>
										</div>
									</div>
									<div className="col-lg-4 col-md-4 col-4">
										<div className="img1">
											<img src="/assets/img/all-images/about/about-img8.png" alt="Event Gallery" />
											<div className="icons">
												<Link href="/media-centre"><i className="fa-brands fa-instagram" /></Link>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="space24" />
					<div className="row">
						<div className="col-lg-12">
							<div className="copyright">
								<p>© 2026 African Trade Chamber & Agile Media Solutions. All Rights Reserved.</p>
								<p style={{ marginTop: '8px', fontSize: '14px' }}>Designed and Powered by <Link href="https://agilemediasolutions.com" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>Agile Media Solutions</Link> in partnership with the <Link href="https://africantradechamber.org" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>African Trade Chamber</Link>.</p>
								<p style={{ marginTop: '8px', fontSize: '12px', opacity: 0.8 }}>An official initiative of the African Trade Chamber in partnership with Agile Media Solutions. Independently audited by Forvis Mazars Ghana.</p>
							</div>
						</div>
					</div>
				</div>
			</div>

		</>
	)
}
