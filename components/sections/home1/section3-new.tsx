'use client'
import Link from 'next/link'

export default function Section3New() {
	return (
		<>
			<div className="choose-section-area premium-categories-section">
				<div className="container">
					<div className="row">
						<div className="col-lg-8 m-auto">
							<div className="heading2 text-center">
								<h2 className="text-anime-style-3 premium-section-title">Honouring Excellence Across Five Tiers</h2>
								<div className="space12" />
								<p className="premium-section-description" data-aos="fade-up" data-aos-duration={900}>Under the 2026 theme &quot;Honouring the Champions of Africa&apos;s Trade and Industrialisation,&quot; the Awards recognise individuals, enterprises, and institutions across five thematic tiers.</p>
							</div>
						</div>
					</div>
					<div className="space24" />
				</div>
			</div>
			<div className="image-cards-wrapper">
				<div className="container">
					<div className="image-cards-grid">
						<div className="image-card">
							<div className="card-image-wrapper">
								<img src="/assets/img/all-images/about/about-img8.png" alt="Continental Leadership" />
								<div className="card-icon-overlay">
									<i className="fa-solid fa-globe"></i>
								</div>
							</div>
							<div className="card-content-box">
								<h3 className="card-title">Continental Leadership</h3>
								<ul className="card-description">
									<li>Pan-African influence and reach</li>
									<li>Transformative policy leadership</li>
									<li>Continental trade integration</li>
									<li>Visionary economic transformation</li>
								</ul>
								<Link href="/award-categories" className="card-nominate-btn">
									Nominate Now
									<i className="fa-solid fa-arrow-right"></i>
								</Link>
							</div>
						</div>
						<div className="image-card">
							<div className="card-image-wrapper">
								<img src="/assets/img/all-images/about/about-img8.png" alt="Industry Excellence" />
								<div className="card-icon-overlay">
									<i className="fa-solid fa-industry"></i>
								</div>
							</div>
							<div className="card-content-box">
								<h3 className="card-title">Industry Excellence</h3>
								<ul className="card-description">
									<li>Five key industrial sectors</li>
									<li>Sectoral innovation leadership</li>
									<li>Market dominance and growth</li>
									<li>Industry transformation impact</li>
								</ul>
								<Link href="/award-categories" className="card-nominate-btn">
									Nominate Now
									<i className="fa-solid fa-arrow-right"></i>
								</Link>
							</div>
						</div>
						<div className="image-card">
							<div className="card-image-wrapper">
								<img src="/assets/img/all-images/about/about-img8.png" alt="Enterprise Awards" />
								<div className="card-icon-overlay">
									<i className="fa-solid fa-building"></i>
								</div>
							</div>
							<div className="card-content-box">
								<h3 className="card-title">Enterprise Awards</h3>
								<ul className="card-description">
									<li>Business innovation excellence</li>
									<li>Sustainable growth models</li>
									<li>Entrepreneurial impact</li>
									<li>Job creation and development</li>
								</ul>
								<Link href="/award-categories" className="card-nominate-btn">
									Nominate Now
									<i className="fa-solid fa-arrow-right"></i>
								</Link>
							</div>
						</div>
						<div className="image-card">
							<div className="card-image-wrapper">
								<img src="/assets/img/all-images/about/about-img8.png" alt="Institutional & Enabler" />
								<div className="card-icon-overlay">
									<i className="fa-solid fa-landmark"></i>
								</div>
							</div>
							<div className="card-content-box">
								<h3 className="card-title">Institutional &amp; Enabler</h3>
								<ul className="card-description">
									<li>Trade facilitation excellence</li>
									<li>Policy development leadership</li>
									<li>Infrastructure support systems</li>
									<li>Cross-border trade enablement</li>
								</ul>
								<Link href="/award-categories" className="card-nominate-btn">
									Nominate Now
									<i className="fa-solid fa-arrow-right"></i>
								</Link>
							</div>
						</div>
						<div className="image-card">
							<div className="card-image-wrapper">
								<img src="/assets/img/all-images/about/about-img8.png" alt="Special Recognition" />
								<div className="card-icon-overlay">
									<i className="fa-solid fa-trophy"></i>
								</div>
							</div>
							<div className="card-content-box">
								<h3 className="card-title">Special Recognition</h3>
								<ul className="card-description">
									<li>Lifetime achievement honours</li>
									<li>Exceptional contributions</li>
									<li>Non-competitive distinctions</li>
									<li>Legacy and impact recognition</li>
								</ul>
								<Link href="/award-categories" className="card-nominate-btn">
									Nominate Now
									<i className="fa-solid fa-arrow-right"></i>
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

