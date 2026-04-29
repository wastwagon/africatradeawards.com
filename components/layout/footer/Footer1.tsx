import Image from 'next/image'
import Link from 'next/link'

type Props = {
	supportEmail?: string
	showLiveStream?: boolean
}

const DEFAULT_SUPPORT = 'secretariat@africatradeawards.com'

export default function Footer1({ supportEmail = DEFAULT_SUPPORT, showLiveStream = false }: Props) {
	const mailHref = `mailto:${supportEmail}`
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
								<p>A premium recognition platform celebrating institutions, leaders, and enterprises delivering measurable trade and industrial outcomes across Africa.</p>
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
							<div className="link-content" style={{ paddingLeft: '30px' }}>
								<h3>Explore</h3>
								<ul>
									<li><Link href="/about">About The Awards</Link></li>
									<li><Link href="/awards-structure">Awards Structure</Link></li>
									<li><Link href="/awardees">Awardees</Link></li>
									<li><Link href="/gallery">Gallery</Link></li>
									<li><Link href="/publications">Publications</Link></li>
									<li><Link href="/faq">FAQs</Link></li>
									<li><Link href="/nominate">Nominate</Link></li>
									<li><Link href="/vote">Public Vote</Link></li>
									<li><Link href="/login/">Sign In</Link></li>
									{showLiveStream ? (
										<li><Link href="/live">Live stream</Link></li>
									) : null}
									<li><Link href="/portal/entrant">Entrant portal</Link></li>
									<li><Link href="/portal/judge">Judge portal</Link></li>
									<li><Link href="/login/?next=/admin/">Staff admin</Link></li>
									<li><Link href="/contact">Contact</Link></li>
								</ul>
							</div>
						</div>
						<div className="col-lg-3 col-md-6">
							<div className="link-content2">
								<h3>Contact Us</h3>
								<ul>
									<li>
										<Link href="tel:+233554014753"><Image src="/assets/img/icons/phn1.svg" alt="" width={18} height={18} />+233 55 401 4753</Link>
									</li>
									<li>
										<Link href={mailHref}>
											<Image src="/assets/img/icons/mail1.svg" alt="" width={18} height={18} />
											{supportEmail}
										</Link>
									</li>
									<li>
										<Link href="https://www.africatradeawards.com" target="_blank" rel="noopener noreferrer"> <Image src="/assets/img/icons/world1.svg" alt="" width={18} height={18} />www.africatradeawards.com</Link>
									</li>
								</ul>
							</div>
						</div>
						<div className="col-lg-3 col-md-6">
							<div className="footer-social-box">
								<h3>Featured Sponsors</h3>
								<div className="space12" />
								<div className="footer-sponsors-grid" style={{ 
									display: 'grid', 
									gridTemplateColumns: 'repeat(2, 1fr)', 
									gap: '10px'
								}}>
									<div className="footer-logo-card" style={{ background: '#fff', borderRadius: '8px', padding: '8px', height: '55px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
										<Image src="/assets/img/sponsors-partners/Sponsors/bank hospital.png" alt="Bank Hospital" width={160} height={55} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
									</div>
									<div className="footer-logo-card" style={{ background: '#fff', borderRadius: '8px', padding: '8px', height: '55px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
										<Image src="/assets/img/sponsors-partners/Sponsors/blowgrouplogo-300x103.png" alt="Blow Group" width={160} height={55} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
									</div>
									<div className="footer-logo-card" style={{ background: '#fff', borderRadius: '8px', padding: '8px', height: '55px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
										<Image src="/assets/img/sponsors-partners/Sponsors/FEDCO-PLC.png" alt="FEDCO PLC" width={160} height={55} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
									</div>
									<div className="footer-logo-card" style={{ background: '#fff', borderRadius: '8px', padding: '8px', height: '55px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
										<Image src="/assets/img/sponsors-partners/Sponsors/kgl.png" alt="KGL Group" width={160} height={55} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
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
