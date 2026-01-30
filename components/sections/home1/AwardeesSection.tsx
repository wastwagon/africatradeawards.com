'use client'

import Link from 'next/link'
import Image from 'next/image'
import { awardees } from '@/data/awardees'
import { useMemo } from 'react'

const TIER_LABELS: Record<string, string> = {
	'Tier I': 'Continental Leadership',
	'Tier II': 'Industry & Strategic Value Chain',
	'Tier III': 'Markets, Capital & Enterprise',
	'Tier IV': 'Trade Policy, Systems & Market Impact',
	'Tier V': 'Distinguished Recognition',
}

const TIER_ORDER = ['Tier I', 'Tier II', 'Tier III', 'Tier IV', 'Tier V']

export default function AwardeesSection() {
	const byTier = useMemo(() => {
		const map: Record<string, typeof awardees> = {}
		TIER_ORDER.forEach((t) => { map[t] = [] })
		awardees.forEach((a) => {
			if (map[a.tier]) map[a.tier].push(a)
		})
		return map
	}, [])

	return (
		<section className="home-awardees-section">
			<div className="container">
				<div className="row">
					<div className="col-12">
						<div className="home-awardees-header" data-aos="fade-up" data-aos-duration={600}>
							<div className="home-awardees-badge">
								<span>AWARDEES</span>
							</div>
							<h2 className="home-awardees-title">Recognition Honours 2026</h2>
							<p className="home-awardees-subtitle">
								Individuals, institutions, and initiatives recognised for their contribution to Africa&apos;s trade and industrial landscape.
							</p>
						</div>

						{TIER_ORDER.map((tier) => {
							const list = byTier[tier]
							if (!list?.length) return null
							return (
								<div key={tier} className="home-awardees-tier-block" data-aos="fade-up" data-aos-duration={500}>
									<div className="home-awardees-tier-head">
										<span className="home-awardees-tier-name">{tier}</span>
										<span className="home-awardees-tier-desc">{TIER_LABELS[tier]}</span>
									</div>
									<div className="home-awardees-tier-grid">
										{list.map((a) => (
											<Link key={a.id} href="/awardees" className="home-awardee-compact-card">
												<div className="home-awardee-compact-media">
													{a.image ? (
														<Image
															src={a.image}
															alt={a.awardee}
															width={140}
															height={140}
															className="home-awardee-compact-img"
														/>
													) : a.logo ? (
														<Image
															src={a.logo}
															alt={a.awardee}
															width={140}
															height={88}
															className="home-awardee-compact-logo"
														/>
													) : (
														<div className="home-awardee-compact-placeholder">
															<i className="fa-solid fa-award" />
														</div>
													)}
												</div>
												<div className="home-awardee-compact-body">
													<span className="home-awardee-compact-name">{a.awardee}</span>
													<span className="home-awardee-compact-category">{a.category}</span>
												</div>
											</Link>
										))}
									</div>
								</div>
							)
						})}

						<div className="home-awardees-cta" data-aos="fade-up" data-aos-duration={500}>
							<Link href="/awardees" className="home-awardees-btn">
								<span>View Full Citations</span>
								<i className="fa-solid fa-arrow-right" />
							</Link>
						</div>
					</div>
				</div>
			</div>

			<style jsx>{`
				.home-awardees-section {
					padding: 64px 0 72px;
					background: linear-gradient(180deg, #f5f4f7 0%, #ebe8ef 40%, #f0eef2 100%);
					position: relative;
					overflow: hidden;
				}
				.home-awardees-header {
					text-align: center;
					margin-bottom: 44px;
				}
				.home-awardees-badge {
					display: inline-block;
					padding: 6px 18px;
					background: rgba(78, 43, 90, 0.1);
					border: 1px solid rgba(78, 43, 90, 0.2);
					border-radius: 50px;
					margin-bottom: 12px;
				}
				.home-awardees-badge span {
					font-size: 11px;
					font-weight: 700;
					letter-spacing: 1.5px;
					color: #4e2b5a;
				}
				.home-awardees-title {
					font-size: clamp(24px, 3vw, 34px);
					font-weight: 700;
					color: #1a1518;
					margin: 0 0 8px;
					letter-spacing: -0.02em;
				}
				.home-awardees-subtitle {
					font-size: 15px;
					color: #5a4d5e;
					margin: 0;
					max-width: 620px;
					margin-left: auto;
					margin-right: auto;
					line-height: 1.55;
				}
				.home-awardees-tier-block {
					margin-bottom: 32px;
				}
				.home-awardees-tier-head {
					display: flex;
					align-items: baseline;
					gap: 14px;
					margin-bottom: 20px;
					padding: 14px 20px;
					padding-bottom: 12px;
					background: rgba(78, 43, 90, 0.05);
					border-radius: 14px;
					border-left: 5px solid #4e2b5a;
					border-bottom: 1px solid rgba(78, 43, 90, 0.12);
				}
				.home-awardees-tier-name {
					font-size: 15px;
					font-weight: 700;
					letter-spacing: 0.4px;
					color: #4e2b5a;
					flex-shrink: 0;
				}
				.home-awardees-tier-desc {
					font-size: 14px;
					font-weight: 500;
					color: #6b5a70;
					line-height: 1.35;
				}
				.home-awardees-tier-grid {
					display: grid;
					grid-template-columns: repeat(4, 1fr);
					gap: 20px 24px;
				}
				.home-awardee-compact-card {
					display: flex;
					align-items: center;
					gap: 20px;
					background: #fff;
					border-radius: 14px;
					padding: 18px 20px;
					border: 1px solid rgba(78, 43, 90, 0.08);
					box-shadow: 0 2px 14px rgba(78, 43, 90, 0.06);
					transition: all 0.25s ease;
					text-decoration: none;
					color: inherit;
				}
				.home-awardee-compact-card:hover {
					border-color: rgba(78, 43, 90, 0.22);
					box-shadow: 0 8px 24px rgba(78, 43, 90, 0.14);
					transform: translateY(-3px);
				}
				.home-awardee-compact-media {
					width: 128px;
					height: 128px;
					flex-shrink: 0;
					border-radius: 12px;
					overflow: hidden;
					background: #f5f4f7;
					display: flex;
					align-items: center;
					justify-content: center;
				}
				:global(.home-awardee-compact-img),
				:global(.home-awardee-compact-logo) {
					width: 100% !important;
					height: 100% !important;
					object-fit: cover;
				}
				:global(.home-awardee-compact-logo) {
					object-fit: contain !important;
					padding: 10px;
				}
				.home-awardee-compact-placeholder {
					width: 100%;
					height: 100%;
					display: flex;
					align-items: center;
					justify-content: center;
					color: rgba(78, 43, 90, 0.2);
					font-size: 28px;
				}
				.home-awardee-compact-body {
					min-width: 0;
					display: flex;
					flex-direction: column;
					gap: 4px;
				}
				.home-awardee-compact-name {
					font-size: 15px;
					font-weight: 700;
					color: #1a1518;
					line-height: 1.35;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					overflow: hidden;
				}
				.home-awardee-compact-category {
					font-size: 12px;
					color: #5a4d5e;
					line-height: 1.4;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					overflow: hidden;
				}
				.home-awardees-cta {
					text-align: center;
					margin-top: 28px;
				}
				.home-awardees-btn {
					display: inline-flex;
					align-items: center;
					gap: 10px;
					padding: 12px 28px;
					background: #4e2b5a;
					color: #fff;
					font-size: 14px;
					font-weight: 600;
					border-radius: 10px;
					text-decoration: none;
					transition: all 0.25s ease;
					box-shadow: 0 4px 14px rgba(78, 43, 90, 0.3);
				}
				.home-awardees-btn:hover {
					background: #3d2245;
					color: #fff;
					transform: translateY(-2px);
					box-shadow: 0 6px 20px rgba(78, 43, 90, 0.4);
				}
				.home-awardees-btn i { font-size: 12px; }
				@media (min-width: 1400px) {
					.home-awardees-tier-grid {
						grid-template-columns: repeat(5, 1fr);
						gap: 22px 26px;
					}
					.home-awardee-compact-media {
						width: 140px;
						height: 140px;
					}
					.home-awardee-compact-card {
						padding: 20px 22px;
						gap: 22px;
					}
					.home-awardee-compact-name { font-size: 15px; }
					.home-awardee-compact-category { font-size: 12px; }
				}
				@media (max-width: 1199px) {
					.home-awardees-tier-grid {
						grid-template-columns: repeat(4, 1fr);
						gap: 16px 20px;
					}
					.home-awardee-compact-media {
						width: 100px;
						height: 100px;
					}
					.home-awardee-compact-card {
						padding: 14px 16px;
						gap: 16px;
					}
					.home-awardee-compact-name { font-size: 14px; }
					.home-awardee-compact-category { font-size: 12px; }
				}
				@media (max-width: 991px) {
					.home-awardees-section { padding: 48px 0 56px; }
					.home-awardees-header { margin-bottom: 32px; }
					.home-awardees-tier-block { margin-bottom: 28px; }
					.home-awardees-tier-head {
						padding: 10px 14px;
						margin-bottom: 14px;
					}
					.home-awardees-tier-grid {
						grid-template-columns: repeat(3, 1fr);
						gap: 12px 16px;
					}
					.home-awardee-compact-card {
						padding: 12px 14px;
						gap: 14px;
					}
					.home-awardee-compact-media {
						width: 80px;
						height: 80px;
					}
					.home-awardee-compact-name { font-size: 13px; }
					.home-awardee-compact-category { font-size: 11px; }
				}
				@media (max-width: 575px) {
					.home-awardees-section {
						padding: 36px 0 44px;
					}
					.home-awardees-header {
						margin-bottom: 24px;
					}
					.home-awardees-title {
						font-size: 22px;
					}
					.home-awardees-subtitle {
						font-size: 13px;
						padding: 0 8px;
					}
					.home-awardees-tier-block {
						margin-bottom: 24px;
					}
					.home-awardees-tier-head {
						flex-direction: column;
						align-items: flex-start;
						gap: 4px;
						margin-bottom: 14px;
						padding: 10px 14px;
						background: rgba(78, 43, 90, 0.06);
						border-radius: 10px;
						border-bottom: none;
						border-left: 4px solid #4e2b5a;
					}
					.home-awardees-tier-name {
						font-size: 14px;
					}
					.home-awardees-tier-desc {
						font-size: 11px;
						color: #5a4d5e;
						line-height: 1.35;
					}
					.home-awardees-tier-grid {
						grid-template-columns: repeat(2, 1fr);
						gap: 14px;
					}
					.home-awardee-compact-card {
						flex-direction: column;
						align-items: stretch;
						padding: 0;
						border-radius: 12px;
						overflow: hidden;
						box-shadow: 0 4px 14px rgba(78, 43, 90, 0.1);
						border: 1px solid rgba(78, 43, 90, 0.1);
					}
					.home-awardee-compact-card:active {
						opacity: 0.95;
					}
					.home-awardee-compact-media {
						width: 100%;
						height: 0;
						padding-bottom: 100%;
						position: relative;
						border-radius: 0;
						overflow: hidden;
					}
					.home-awardee-compact-media :global(.home-awardee-compact-img),
					.home-awardee-compact-media :global(.home-awardee-compact-logo) {
						position: absolute !important;
						top: 0 !important;
						left: 0 !important;
						width: 100% !important;
						height: 100% !important;
						object-fit: cover !important;
					}
					.home-awardee-compact-media :global(.home-awardee-compact-logo) {
						object-fit: contain !important;
						padding: 8px !important;
					}
					.home-awardee-compact-placeholder {
						position: absolute;
						inset: 0;
						font-size: 28px;
					}
					.home-awardee-compact-body {
						padding: 10px 12px;
						gap: 4px;
					}
					.home-awardee-compact-name {
						font-size: 12px;
						font-weight: 700;
						color: #1a1518;
						-webkit-line-clamp: 2;
					}
					.home-awardee-compact-category {
						font-size: 10px;
						color: #5a4d5e;
						-webkit-line-clamp: 2;
					}
					.home-awardees-cta {
						margin-top: 20px;
					}
					.home-awardees-btn {
						width: 100%;
						justify-content: center;
						padding: 14px 20px;
						font-size: 14px;
						border-radius: 10px;
					}
				}
			`}</style>
		</section>
	)
}
