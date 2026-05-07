'use client'

import Image from 'next/image'

type LogoCategory = {
	name: string
	folder: string
	displayName: string
	logos: string[]
	/** Optional narrative line under the tier label */
	subline?: string
}

const categories: LogoCategory[] = [
	{
		name: 'Organized By',
		folder: 'Organized By',
		displayName: 'Presented with',
		subline: 'The institutions anchoring the programme and the live production.',
		logos: ['AMS LOGO GREEN & WHITE.png', 'ATS_logo.png', 'WhatsApp Image 2025-12-22 at 12.42.27 PM.jpeg'],
	},
	{
		name: 'Sponsors',
		folder: 'Sponsors',
		displayName: 'Award partners',
		subline: 'Brands standing with the finalists and the communities they represent.',
		logos: ['bank hospital.png', 'blowgrouplogo-300x103.png', 'FEDCO-PLC.png', 'kgl.png'],
	},
	{
		name: 'Strategic Partners',
		folder: 'Strategic Partners',
		displayName: 'Strategic partners',
		subline: 'Co-creating the platform, policy, and industry conversation around the night.',
		logos: ['cbod.png', 'mfa.png'],
	},
	{
		name: 'Partners of the Chamber',
		folder: 'Partners of the Chamber',
		displayName: 'Chamber partners',
		subline: 'Institutions aligning trade development with the recognition moment.',
		logos: ['cropped-Pan-African-Chamber-of-C.png', 'GCM.png'],
	},
	{
		name: 'Collaborators of ATS',
		folder: 'Collaborators of ATS',
		displayName: 'Summit collaborators',
		subline: 'Allies connecting the awards story to broader continental trade momentum.',
		logos: [
			'afcffta.png',
			'ghana-investment-promotion-centre.png',
			'GNCCI.png',
			'Government of Ghana.png',
			'icclogonew.png',
			'MTAB .png',
			'NCO.png',
			'waba(2).png',
		],
	},
	{
		name: 'Hotel Partners',
		folder: 'Hotel Partners',
		displayName: 'Host city hospitality',
		subline: 'Where guests stay, gather, and celebrate across the week.',
		logos: [
			'Accra city hotel.png',
			'Alisa Hotel.png',
			'kempinski.png',
			'Marriott.png',
			'movenpick.png',
			'No 1 oxford street hotel.png',
			'pelican hotel.png',
		],
	},
	{
		name: 'Airline Partners',
		folder: 'Airline Partners',
		displayName: 'Travel partners',
		subline: 'Connecting delegates and finalists across the continent.',
		logos: ['asky-airlines-vector-logo.png', 'ethiopian-airlines-logo-png_seek.png'],
	},
]

function logoAlt(filename: string): string {
	return filename
		.replace(/\.[^/.]+$/, '')
		.replace(/[-_]/g, ' ')
		.replace(/\s+/g, ' ')
		.trim()
}

export default function SponsorsSection() {
	const getLogoPath = (categoryFolder: string, filename: string) =>
		`/assets/img/sponsors-partners/${categoryFolder}/${filename}`

	return (
		<section className="ata-partners-wall" aria-labelledby="ata-partners-heading">
			<div className="ata-partners-wall__bg" aria-hidden />
			<div className="container ata-partners-wall__inner">
				<div className="ata-partners-wall__head text-center" data-aos="fade-up" data-aos-duration={700}>
					<p className="ata-partners-wall__eyebrow">Partners & patrons</p>
					<h2 id="ata-partners-heading" className="ata-partners-wall__title">
						The coalition behind the night
					</h2>
					<p className="ata-partners-wall__lead">
						Recognition needs convening power. These institutions and brands help deliver the summit, the gala, and the
						experience around them — tiered and legible, like credits that belong on the main stage.
					</p>
				</div>

				<div className="ata-partners-wall__tiers">
					{categories.map((tier) => (
						<div key={tier.name} className="ata-partners-tier" data-aos="fade-up" data-aos-duration={650}>
							<div className="ata-partners-tier__rule" aria-hidden />
							<div className="ata-partners-tier__meta">
								<h3 className="ata-partners-tier__label">{tier.displayName}</h3>
								{tier.subline ? <p className="ata-partners-tier__sub">{tier.subline}</p> : null}
							</div>
							<div className="ata-partners-tier__logos" role="list">
								{tier.logos.map((file) => (
									<div key={`${tier.folder}:${file}`} className="ata-partners-logo" role="listitem">
										<div className="ata-partners-logo__frame">
											<Image
												src={getLogoPath(tier.folder, file)}
												alt={logoAlt(file)}
												width={160}
												height={80}
												className="ata-partners-logo__img"
												unoptimized
											/>
										</div>
									</div>
								))}
							</div>
						</div>
					))}
				</div>
			</div>

			<style jsx>{`
				.ata-partners-wall {
					position: relative;
					padding: 72px 0 84px;
					overflow: hidden;
				}
				.ata-partners-wall__bg {
					position: absolute;
					inset: 0;
					background:
						radial-gradient(ellipse 90% 55% at 20% 0%, rgba(201, 160, 99, 0.16) 0%, transparent 58%),
						radial-gradient(ellipse 80% 50% at 90% 100%, rgba(78, 43, 90, 0.16) 0%, transparent 58%),
						linear-gradient(180deg, #0f0b12 0%, #14101a 45%, #fbf7f1 100%);
				}
				.ata-partners-wall__inner {
					position: relative;
					z-index: 1;
				}
				.ata-partners-wall__head {
					max-width: 880px;
					margin: 0 auto 44px;
				}
				.ata-partners-wall__eyebrow {
					margin: 0 0 10px;
					font-family: var(--grotesk), sans-serif;
					font-size: 0.72rem;
					font-weight: 700;
					letter-spacing: 0.22em;
					text-transform: uppercase;
					color: rgba(231, 207, 170, 0.95);
				}
				.ata-partners-wall__title {
					margin: 0 0 12px;
					font-family: var(--grotesk), sans-serif;
					font-size: clamp(1.55rem, 3.4vw, 2.15rem);
					font-weight: 700;
					line-height: 1.12;
					color: #fbf7f1;
					letter-spacing: -0.02em;
				}
				.ata-partners-wall__lead {
					margin: 0;
					font-family: var(--figtree), system-ui, sans-serif;
					font-size: 1.02rem;
					line-height: 1.65;
					color: rgba(251, 247, 241, 0.78);
				}
				.ata-partners-wall__tiers {
					display: flex;
					flex-direction: column;
					gap: 26px;
				}
				.ata-partners-tier {
					border-radius: 18px;
					border: 1px solid rgba(255, 255, 255, 0.12);
					background: rgba(255, 255, 255, 0.04);
					box-shadow: 0 18px 46px rgba(0, 0, 0, 0.22);
					backdrop-filter: blur(10px);
					padding: 18px 16px 16px;
				}
				.ata-partners-tier__rule {
					height: 1px;
					background: linear-gradient(90deg, transparent, rgba(231, 207, 170, 0.55), transparent);
					margin: 0 0 14px;
				}
				.ata-partners-tier__meta {
					margin-bottom: 12px;
				}
				.ata-partners-tier__label {
					margin: 0 0 6px;
					font-family: var(--grotesk), sans-serif;
					font-size: 0.92rem;
					font-weight: 700;
					letter-spacing: 0.08em;
					text-transform: uppercase;
					color: #f4efe8;
				}
				.ata-partners-tier__sub {
					margin: 0;
					font-family: var(--figtree), system-ui, sans-serif;
					font-size: 0.92rem;
					line-height: 1.55;
					color: rgba(251, 247, 241, 0.72);
					max-width: 900px;
				}
				.ata-partners-tier__logos {
					display: flex;
					flex-wrap: wrap;
					gap: 12px;
					justify-content: center;
					align-items: center;
				}
				.ata-partners-logo {
					flex: 0 0 auto;
				}
				.ata-partners-logo__frame {
					width: 156px;
					height: 84px;
					display: flex;
					align-items: center;
					justify-content: center;
					padding: 12px 14px;
					border-radius: 14px;
					border: 1px solid rgba(255, 255, 255, 0.14);
					background: rgba(255, 255, 255, 0.06);
				}
				:global(.ata-partners-logo__img) {
					max-width: 118px;
					max-height: 52px;
					width: auto;
					height: auto;
					object-fit: contain;
					filter: grayscale(1) contrast(1.05);
					opacity: 0.92;
					transition: filter 0.25s ease, opacity 0.25s ease, transform 0.25s ease;
				}
				.ata-partners-logo__frame:hover :global(.ata-partners-logo__img) {
					filter: grayscale(0);
					opacity: 1;
					transform: translateY(-1px);
				}
				@media (max-width: 575px) {
					.ata-partners-wall {
						padding: 56px 0 68px;
					}
					.ata-partners-tier {
						padding: 16px 14px 14px;
					}
					.ata-partners-logo__frame {
						width: calc(50% - 6px);
						min-width: 140px;
						height: 78px;
					}
				}
			`}</style>
		</section>
	)
}
