'use client'
import Layout from "@/components/layout/Layout"
import Link from "next/link"

export default function Legal() {
	return (
		<Layout headerStyle={1} footerStyle={1}>
			<div>
				<div className="inner-page-header" style={{ backgroundImage: 'url(assets/img/bg/header-bg5.png)' }}>
					<div className="container">
						<div className="row">
							<div className="col-lg-4 m-auto">
								<div className="heading1 text-center">
									<h1>Legal &amp; Administrative</h1>
									<div className="space20" />
									<Link href="/">Home <i className="fa-solid fa-angle-right" /> <span>Legal &amp; Administrative</span></Link>
								</div>
							</div>
						</div>
					</div>
				</div>
				{/*===== PRIVACY POLICY =======*/}
				<div className="about1-section-area sp1">
					<div className="container">
						<div className="row">
							<div className="col-lg-8 m-auto">
								<div className="heading2 text-center space-margin60">
									<h5 data-aos="fade-up" data-aos-duration={800}>Privacy Policy</h5>
									<div className="space16" />
									<h2 className="text-anime-style-3">Privacy Policy</h2>
									<div className="space24" />
									<div className="text-left" data-aos="fade-up" data-aos-duration={900}>
										<p>Personal data collected through nominations or registrations is used solely for event administration and never shared without consent.</p>
										<div className="space32" />
										<div className="btn-area1">
											<Link href="/contact" className="vl-btn1">Read Full Privacy Policy (PDF)</Link>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				{/*===== TERMS & CONDITIONS =======*/}
				<div className="about1-section-area sp2">
					<div className="container">
						<div className="row">
							<div className="col-lg-8 m-auto">
								<div className="heading2 text-center space-margin60">
									<h5 data-aos="fade-up" data-aos-duration={800}>Terms &amp; Conditions</h5>
									<div className="space16" />
									<h2 className="text-anime-style-3">Terms &amp; Conditions</h2>
									<div className="space24" />
									<div className="text-left" data-aos="fade-up" data-aos-duration={900}>
										<ul style={{ listStyle: 'disc', paddingLeft: '20px' }}>
											<li>Entries must meet deadlines and include verifiable evidence.</li>
											<li>Jury decisions are final and non-appealable.</li>
											<li>Participation implies acceptance of these terms.</li>
										</ul>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				{/*===== GOVERNANCE DISCLAIMER =======*/}
				<div className="about1-section-area sp2">
					<div className="container">
						<div className="row">
							<div className="col-lg-8 m-auto">
								<div className="heading2 text-center space-margin60">
									<h5 data-aos="fade-up" data-aos-duration={800}>Governance Disclaimer</h5>
									<div className="space16" />
									<h2 className="text-anime-style-3">Governance Disclaimer</h2>
									<div className="space24" />
									<p data-aos="fade-up" data-aos-duration={900}>The Africa Trade Awards is an initiative of the African Trade Chamber and Agile Media Solutions, in partnership with Forvis Mazars. The organisers reserve the right to modify event details while maintaining process integrity.</p>
								</div>
							</div>
						</div>
					</div>
				</div>
				{/*===== INTELLECTUAL PROPERTY =======*/}
				<div className="about1-section-area sp2">
					<div className="container">
						<div className="row">
							<div className="col-lg-8 m-auto">
								<div className="heading2 text-center space-margin60">
									<h5 data-aos="fade-up" data-aos-duration={800}>Intellectual Property Notice</h5>
									<div className="space16" />
									<h2 className="text-anime-style-3">Intellectual Property Notice</h2>
									<div className="space24" />
									<p data-aos="fade-up" data-aos-duration={900}>&quot;Africa Trade Awards,&quot; &quot;Africa Trade Summit,&quot; and all associated marks are registered intellectual property of Agile Media Solutions. All content on this site is protected under copyright law. Unauthorised reproduction is prohibited.</p>
								</div>
							</div>
						</div>
					</div>
				</div>
				{/*===== CONTACT INFORMATION =======*/}
				<div className="about1-section-area sp2">
					<div className="container">
						<div className="row">
							<div className="col-lg-8 m-auto">
								<div className="heading2 text-center space-margin60">
									<h5 data-aos="fade-up" data-aos-duration={800}>Contact Information</h5>
									<div className="space16" />
									<h2 className="text-anime-style-3">Africa Trade Awards Secretariat</h2>
									<div className="space24" />
									<div className="text-left" data-aos="fade-up" data-aos-duration={900}>
										<p><strong>African Trade Chamber</strong></p>
										<p>Accra, Ghana</p>
										<div className="space16" />
										<p>Email: <Link href="mailto:info@africantradechamber.org">info@africantradechamber.org</Link></p>
										<p>Website: <Link href="https://www.africatradeawards.com">www.africatradeawards.com</Link></p>
										<div className="space24" />
										<p><strong>Partnerships:</strong> <Link href="mailto:partnerships@africantradechamber.org">partnerships@africantradechamber.org</Link></p>
										<p><strong>Media:</strong> <Link href="mailto:media@agilemediasolutions.com">media@agilemediasolutions.com</Link></p>
										<p><strong>Phone:</strong> <Link href="tel:+233505366200">+233 50 536 6200</Link></p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				{/*===== COPYRIGHT =======*/}
				<div className="about1-section-area sp2">
					<div className="container">
						<div className="row">
							<div className="col-lg-8 m-auto">
								<div className="heading2 text-center space-margin60">
									<h5 data-aos="fade-up" data-aos-duration={800}>Copyright</h5>
									<div className="space16" />
									<p data-aos="fade-up" data-aos-duration={900}>&copy; 2026 African Trade Chamber &amp; Agile Media Solutions. All Rights Reserved.</p>
									<div className="space16" />
									<p data-aos="fade-up" data-aos-duration={900}>Designed and Powered by Agile Media Solutions in partnership with the African Trade Chamber.</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Layout>
	)
}



