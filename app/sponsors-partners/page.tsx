'use client'
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import Image from "next/image"

interface LogoCategory {
	name: string
	folder: string
	displayName: string
	logos: string[]
}

const categories: LogoCategory[] = [
	{ 
		name: 'Organized By', 
		folder: 'Organized By', 
		displayName: 'Organized By',
		logos: [
			'AMS LOGO GREEN & WHITE.png',
			'ATS_logo.png',
			'WhatsApp Image 2025-12-22 at 12.42.27 PM.jpeg'
		]
	},
	{ 
		name: 'Sponsors', 
		folder: 'Sponsors', 
		displayName: 'Sponsors',
		logos: [
			'bank hospital.png',
			'blowgrouplogo-300x103.png',
			'FEDCO-PLC.png',
			'kgl.png'
		]
	},
	{ 
		name: 'Strategic Partners', 
		folder: 'Strategic Partners', 
		displayName: 'Strategic Partners',
		logos: [
			'cbod.png',
			'mfa.png'
		]
	},
	{ 
		name: 'Partners of the Chamber', 
		folder: 'Partners of the Chamber', 
		displayName: 'Partners of the Chamber',
		logos: [
			'cropped-Pan-African-Chamber-of-C.png',
			'GCM.png'
		]
	},
	{ 
		name: 'Collaborators of ATS', 
		folder: 'Collaborators of ATS', 
		displayName: 'Collaborators of ATS',
		logos: [
			'afcffta.png',
			'ghana-investment-promotion-centre.png',
			'GNCCI.png',
			'Government of Ghana.png',
			'icclogonew.png',
			'MTAB .png',
			'NCO.png',
			'waba(2).png'
		]
	},
	{ 
		name: 'Hotel Partners', 
		folder: 'Hotel Partners', 
		displayName: 'Hotel Partners',
		logos: [
			'Accra city hotel.png',
			'Alisa Hotel.png',
			'kempinski.png',
			'Marriott.png',
			'movenpick.png',
			'No 1 oxford street hotel.png',
			'pelican hotel.png'
		]
	},
	{ 
		name: 'Airline Partners', 
		folder: 'Airline Partners', 
		displayName: 'Airline Partners',
		logos: [
			'asky-airlines-vector-logo.png',
			'ethiopian-airlines-logo-png_seek.png'
		]
	},
]

export default function SponsorsPartners() {
	// Helper function to get logo paths
	const getLogoPath = (category: string, filename: string) => {
		return `/assets/img/sponsors-partners/${category}/${filename}`
	}

	return (
		<>
			<Layout headerStyle={1} footerStyle={1}>
				<div>
					<div className="inner-page-header">
						<div className="container">
							<div className="row">
								<div className="col-lg-4 m-auto">
									<div className="heading1 text-center">
										<div className="space20" />
										<Link href="/">
											<span className="breadcrumb-home">Home</span> 
											<i className="fa-solid fa-angle-right" /> 
											<span className="breadcrumb-current">Sponsors & Partners</span>
										</Link>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Sponsors & Partners Section */}
					<div className="sponsors-partners-section-premium sp4">
						<div className="container">
							{/* Hero Header */}
							<div className="row">
								<div className="col-lg-10 m-auto">
									<div className="sponsors-hero-header" data-aos="fade-up" data-aos-duration={800}>
										<h1 className="sponsors-hero-title">Our Sponsors & Partners</h1>
										<p className="sponsors-hero-description">
											We are grateful to our sponsors, partners, and collaborators who make the Africa Trade Awards 2026 possible. Together, we celebrate excellence in African trade and industrial development.
										</p>
									</div>
								</div>
							</div>

							<div className="space60" />

							{/* Categories Grid */}
							<div className="sponsors-categories-container">
								{categories.map((category, index) => {
									if (category.logos.length === 0) return null

									return (
										<div key={category.name} className="sponsors-category-card" data-aos="fade-up" data-aos-duration={800} data-aos-delay={index * 100}>
											{/* Category Header */}
											<div className="category-card-header">
												<h2 className="category-card-title">{category.displayName}</h2>
											</div>

											{/* Logos Grid */}
											<div className="category-logos-grid">
												{category.logos.map((logo, logoIndex) => {
													const logoPath = getLogoPath(category.folder, logo)
													const logoName = logo.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ")
													
													return (
														<div 
															key={logoIndex} 
															className="premium-logo-card" 
															data-aos="fade-up" 
															data-aos-duration={600} 
															data-aos-delay={logoIndex * 30}
														>
															<div className="premium-logo-wrapper">
																<div className="logo-shine-effect"></div>
																<Image
																	src={logoPath}
																	alt={logoName}
																	width={220}
																	height={140}
																	className="premium-logo-image"
																	unoptimized
																/>
															</div>
														</div>
													)
												})}
											</div>
										</div>
									)
								})}
							</div>
						</div>
					</div>
				</div>
			</Layout>
		</>
	)
}

