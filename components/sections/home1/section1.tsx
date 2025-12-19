
import Link from 'next/link'

export default function Section1() {
	return (
		<>

			<div className="hero1-section-area">
				<div className="bg1" style={{ display: 'none' }}>
					<img src="/assets/img/bg/header-bg2.png" alt="" className="header-bg1" />
				</div>
				<div className="container">
					<div className="row">
						<div className="col-lg-6">
							<div className="hero1-header heading1">
								<h5 data-aos="fade-left" data-aos-duration={800}>Africa Trade Awards 2026</h5>
								<div className="space16" />
								<h1 className="text-anime-style-3">
									Celebrating Africa&apos;s <br className="d-lg-block d-none" />
									Trade Excellence <br className="d-lg-block d-none" />
									and Industrial Champions
								</h1>
								<div className="space16" />
								<p data-aos="fade-left" data-aos-duration={900}>
									The Africa Trade Awards honour the trailblazers, innovators, and institutions powering the continent&apos;s trade transformation and industrial renaissance.
								</p>
								<div className="space16" />
								<div className="theme-badge" data-aos="fade-left" data-aos-duration={1000}>
									<strong>Theme 2026:</strong> &quot;Honouring the Champions of Africa&apos;s Trade and Industrialisation.&quot;
								</div>
								<div className="space32" />
								<div className="btn-area1" data-aos="fade-left" data-aos-duration={1100}>
									<Link href="/nomination" className="vl-btn1">Nominate Now</Link>
								</div>
							</div>
						</div>
						<div className="col-lg-5">
							<div className="header-images">
								<div className="img1" data-aos="zoom-in" data-aos-duration={1000}>
									<img src="/assets/img/all-images/hero/hero-img1.png" alt="" />
								</div>
								<div className="images-content-area" data-aos="fade-up" data-aos-duration={900}>
									<h3>AFRICA TRADE AWARDS 2026</h3>
									<div className="space12" />
									<Link href="/#">28th and 29th January 2026</Link>
									<div className="space12" />
									<Link href="/#">Kempinski Gold Coast City Hotel, Accra</Link>
									<div className="space16" />
									<p>Join a historic moment of recognition, prestige, and progress. Nominate, partner, or attend the Awards and stand with the pioneers advancing Africa&apos;s trade and industrial future.</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

		</>
	)
}
