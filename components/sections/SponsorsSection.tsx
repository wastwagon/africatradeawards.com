'use client'
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
		name: 'Collaborators of Africa Trade Summit', 
		folder: 'Collaborators of ATS', 
		displayName: 'Collaborators of Africa Trade Summit',
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

export default function SponsorsSection() {
	const getLogoPath = (category: string, filename: string) => {
		return `/assets/img/sponsors-partners/${category}/${filename}`
	}

	// Flatten all logos into a single array
	const allLogos = categories.flatMap(category => 
		category.logos.map(logo => ({
			path: getLogoPath(category.folder, logo),
			name: logo.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ")
		}))
	)

	return (
		<div className="sponsors-partners-section-premium sp4" style={{ backgroundColor: '#f9f9f9' }}>
			<style dangerouslySetInnerHTML={{ __html: `
				.homepage-logos-grid {
					display: flex !important;
					flex-wrap: wrap !important;
					gap: 16px !important;
					justify-content: center !important;
				}
				.premium-logo-card {
					width: 140px !important;
					flex: 0 0 auto !important;
				}
				.homepage-logo-wrapper {
					height: 90px !important;
					padding: 12px !important;
					border-radius: 10px !important;
				}
				.homepage-logo-image {
					max-width: 100px !important;
					max-height: 50px !important;
					object-fit: contain !important;
				}
			` }} />
			<div className="container">
				<div className="row">
					<div className="col-lg-10 m-auto">
						<div className="committee-text-content text-center" data-aos="fade-up" data-aos-duration={800}>
							<h2 className="committee-text-title">Our Sponsors & Partners</h2>
							<div className="space16" />
							<p className="committee-text-description" style={{ maxWidth: '800px', margin: '0 auto' }}>
								We are grateful to our sponsors, partners, and collaborators who make the Africa Trade Awards 2026 possible. Together, we celebrate excellence in African trade and industrial development.
							</p>
						</div>
					</div>
				</div>

				<div className="space60" />

				<div className="homepage-logos-grid">
					{allLogos.map((logo, index) => (
						<div 
							key={index} 
							className="premium-logo-card" 
							data-aos="fade-up" 
							data-aos-duration={600} 
							data-aos-delay={index * 20}
						>
							<div className="premium-logo-wrapper homepage-logo-wrapper">
								<div className="logo-shine-effect"></div>
								<Image
									src={logo.path}
									alt={logo.name}
									width={100}
									height={50}
									className="premium-logo-image homepage-logo-image"
									unoptimized
								/>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

