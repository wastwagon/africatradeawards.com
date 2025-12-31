import Link from 'next/link'


export default function Footer1() {
	return (
		<>
			<div className="footer1-sertion-area">
				{/* Animated Decorative Elements */}
				<div className="footer-sparkle sparkle-1"></div>
				<div className="footer-sparkle sparkle-2"></div>
				<div className="footer-sparkle sparkle-3"></div>
				<div className="footer-sparkle sparkle-4"></div>
				<div className="footer-sparkle sparkle-5"></div>
				<div className="footer-sparkle sparkle-6"></div>
				
				<div className="container">
					<div className="row">
						<div className="col-lg-4 col-md-6">
							<div className="footer-logo-area">
								<h3>About The Awards</h3>
								<div className="space12" />
								<p>The Africa Trade Awards are recognition honours established by the African Trade Chamber to acknowledge individuals, institutions, enterprises, and public authorities whose work has materially shaped Africa&apos;s trade and industrial landscape.</p>
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
									<li><Link href="/awards-structure">Awards Structure</Link></li>
									<li><Link href="/faq">FAQs</Link></li>
									<li><Link href="/contact">Contact</Link></li>
								</ul>
							</div>
						</div>
						<div className="col-lg-3 col-md-6">
							<div className="link-content2">
								<h3>Contact Us</h3>
								<ul>
									<li>
										<Link href="mailto:secretariat@africatradeawards.com"><img src="/assets/img/icons/mail1.svg" alt="" />secretariat@africatradeawards.com</Link>
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
							</div>
						</div>
					</div>
				</div>
			</div>

		</>
	)
}
