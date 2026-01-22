'use client'
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { awardees, Awardee } from "@/data/awardees"
import CitationModal from "@/components/elements/CitationModal"

export default function Awardees() {
	const [selectedAwardee, setSelectedAwardee] = useState<Awardee | null>(null)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [selectedTier, setSelectedTier] = useState<string | null>(null)

	const openCitation = (awardee: Awardee) => {
		setSelectedAwardee(awardee)
		setIsModalOpen(true)
	}

	const closeCitation = () => {
		setIsModalOpen(false)
		setTimeout(() => {
			setSelectedAwardee(null)
		}, 300)
	}

	const tiers = ['Tier I', 'Tier II', 'Tier III', 'Tier IV', 'Tier V']
	const filteredAwardees = selectedTier 
		? awardees.filter(a => a.tier === selectedTier)
		: awardees

	const getTierColor = (tier: string) => {
		switch(tier) {
			case 'Tier I': return '#4e2b5a'
			case 'Tier II': return '#6b3d7a'
			case 'Tier III': return '#8b5a9a'
			case 'Tier IV': return '#a877ba'
			case 'Tier V': return '#c095da'
			default: return '#4e2b5a'
		}
	}

	const getTierColorRgba = (tier: string, opacity: number) => {
		switch(tier) {
			case 'Tier I': return `rgba(78, 43, 90, ${opacity})`
			case 'Tier II': return `rgba(107, 61, 122, ${opacity})`
			case 'Tier III': return `rgba(139, 90, 154, ${opacity})`
			case 'Tier IV': return `rgba(168, 119, 186, ${opacity})`
			case 'Tier V': return `rgba(192, 149, 218, ${opacity})`
			default: return `rgba(78, 43, 90, ${opacity})`
		}
	}

	return (
		<>
			<Layout headerStyle={1} footerStyle={1}>
				<div>
					{/* Page Header */}
					<div className="inner-page-header">
						<div className="container">
							<div className="row">
								<div className="col-lg-4 m-auto">
									<div className="heading1 text-center">
										<div className="space20" />
										<Link href="/">
											<span className="breadcrumb-home">Home</span> 
											<i className="fa-solid fa-angle-right" /> 
											<span className="breadcrumb-current">Awardees 2026</span>
										</Link>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Hero Section */}
					<div className="awardees-hero-section">
						<div className="container">
							<div className="row">
								<div className="col-lg-10 m-auto">
									<div className="awardees-hero-content" data-aos="fade-up" data-aos-duration={800}>
										<div className="awardees-year-badge">
											<span>AFRICA TRADE AWARDS 2026</span>
										</div>
										<h1 className="awardees-hero-title">Recognition Honours for Africa's Trade and Industrialization</h1>
										<div className="space24" />
										<div className="awardees-basis-card">
											<h3 className="awardees-basis-title">Awards Basis</h3>
											<p className="awardees-basis-text">
												The Africa Trade Awards are recognition honours, conferred to acknowledge demonstrated contribution and delivered outcomes that have advanced Africa's trade, industrial capacity, and market integration. The Awards do not operate as competitive prizes and do not involve ranking or comparison. Recognition is conferred at the discretion of the Awards Committee, based on evidence of substantive impact within the reference period.
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Tier Filter */}
					<div className="awardees-filter-section">
						<div className="container">
							<div className="awardees-filter-wrapper">
								<button
									className={`awardees-filter-btn ${selectedTier === null ? 'active' : ''}`}
									onClick={() => setSelectedTier(null)}
								>
									All Tiers
								</button>
								{tiers.map(tier => (
									<button
										key={tier}
										className={`awardees-filter-btn ${selectedTier === tier ? 'active' : ''}`}
										onClick={() => setSelectedTier(tier)}
										style={{ '--tier-color': getTierColor(tier) } as React.CSSProperties}
									>
										{tier}
									</button>
								))}
							</div>
						</div>
					</div>

					{/* Awardees Grid */}
					<div className="awardees-main-section">
						<div className="container">
							{/* Group by Tier */}
							{tiers.map(tier => {
								const tierAwardees = filteredAwardees.filter(a => a.tier === tier)
								if (tierAwardees.length === 0) return null

								return (
									<div key={tier} className="awardees-tier-section" data-aos="fade-up" data-aos-duration={800}>
										<div className="awardees-tier-header">
											<h2 className="awardees-tier-title" style={{ '--tier-color': getTierColor(tier) } as React.CSSProperties}>
												{tier}
											</h2>
										</div>

										<div className="awardees-grid">
											{tierAwardees.map((awardee, index) => (
												<div 
													key={awardee.id} 
													className="awardee-card"
													data-aos="fade-up" 
													data-aos-duration={600}
													data-aos-delay={index * 100}
												>
													{/* Awardee Image/Logo */}
													<div className="awardee-image-wrapper">
														{awardee.type === 'individual' ? (
															<div className="awardee-profile-image">
																{awardee.image ? (
																	<Image
																		src={awardee.image}
																		alt={awardee.awardee}
																		width={200}
																		height={200}
																		className="awardee-image"
																	/>
																) : (
																	<div className="awardee-image-placeholder">
																		<i className="fa-solid fa-user"></i>
																	</div>
																)}
															</div>
														) : (
															<div className="awardee-logo-wrapper">
																{awardee.logo ? (
																	<Image
																		src={awardee.logo}
																		alt={awardee.awardee}
																		width={240}
																		height={120}
																		className="awardee-logo"
																		unoptimized
																	/>
																) : (
																	<div className="awardee-logo-placeholder">
																		<i className="fa-solid fa-building"></i>
																	</div>
																)}
															</div>
														)}
													</div>

													{/* Awardee Content */}
													<div className="awardee-content">
														<div 
															className="awardee-category-badge" 
															style={{ 
																'--tier-color': getTierColor(tier),
																backgroundColor: getTierColorRgba(tier, 0.1),
																borderColor: getTierColorRgba(tier, 0.2),
																color: getTierColor(tier)
															} as React.CSSProperties}
														>
															{awardee.category}
														</div>
														<h3 className="awardee-name">{awardee.awardee}</h3>
														
														<div className="awardee-excerpt">
															{awardee.citation.split('\n\n')[0].substring(0, 150)}
															{awardee.citation.split('\n\n')[0].length > 150 ? '...' : ''}
														</div>
														
														<button
															className="awardee-citation-btn"
															onClick={() => openCitation(awardee)}
														>
															<span>Read Full Citation</span>
															<i className="fa-solid fa-arrow-right"></i>
														</button>
													</div>
												</div>
											))}
										</div>
									</div>
								)
							})}
						</div>
					</div>
				</div>

				{/* Citation Modal */}
				<CitationModal 
					awardee={selectedAwardee}
					isOpen={isModalOpen}
					onClose={closeCitation}
				/>

				{/* Styles */}
				<style jsx global>{`
					.awardees-hero-section {
						background: linear-gradient(135deg, 
							#f8f8f8 0%, 
							#f0f0f0 25%, 
							#fafafa 50%, 
							#f5f5f5 75%, 
							#f8f8f8 100%);
						padding: 40px 0 30px;
						position: relative;
						overflow: hidden;
					}

					@media (min-width: 576px) {
						.awardees-hero-section {
							padding: 60px 0 40px;
						}
					}

					@media (min-width: 992px) {
						.awardees-hero-section {
							padding: 80px 0 60px;
						}
					}

					.awardees-hero-section::before {
						content: "";
						position: absolute;
						top: 0;
						left: 0;
						right: 0;
						bottom: 0;
						background: 
							radial-gradient(circle at 20% 30%, rgba(78, 43, 90, 0.08) 0%, transparent 50%),
							radial-gradient(circle at 80% 70%, rgba(78, 43, 90, 0.06) 0%, transparent 50%);
						pointer-events: none;
						z-index: 0;
					}

					.awardees-hero-content {
						position: relative;
						z-index: 1;
						text-align: center;
					}

					.awardees-year-badge {
						display: inline-block;
						padding: 10px 24px;
						background: rgba(78, 43, 90, 0.1);
						border: 1px solid rgba(78, 43, 90, 0.2);
						border-radius: 50px;
						margin-bottom: 24px;
					}

					.awardees-year-badge span {
						color: #4e2b5a;
						font-family: var(--grotesk);
						font-size: 12px;
						font-weight: 600;
						letter-spacing: 2px;
						text-transform: uppercase;
					}

					.awardees-hero-title {
						font-size: clamp(20px, 2.5vw, 28px);
						font-weight: 700;
						color: #1a1a1a;
						line-height: 1.3;
						margin: 0;
						font-family: var(--grotesk);
					}

					.awardees-basis-card {
						background: #ffffff;
						border-radius: 16px;
						padding: 20px;
						margin-top: 24px;
						box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
						border: 1px solid rgba(78, 43, 90, 0.1);
						text-align: left;
					}

					@media (min-width: 576px) {
						.awardees-basis-card {
							padding: 24px 28px;
							margin-top: 32px;
						}
					}

					@media (min-width: 992px) {
						.awardees-basis-card {
							padding: 32px 40px;
							margin-top: 40px;
						}
					}

					.awardees-basis-title {
						font-size: clamp(16px, 2vw, 18px);
						font-weight: 700;
						color: #4e2b5a;
						margin: 0 0 12px 0;
						font-family: var(--grotesk);
					}

					.awardees-basis-text {
						font-size: clamp(14px, 1.8vw, 15px);
						line-height: 1.7;
						color: #4a4a4a;
						margin: 0;
						font-family: var(--figtree);
					}

					.awardees-filter-section {
						background: #ffffff;
						padding: 30px 0;
						border-bottom: 1px solid rgba(78, 43, 90, 0.1);
						position: sticky;
						top: 0;
						z-index: 100;
						box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
					}

					.awardees-filter-wrapper {
						display: flex;
						justify-content: center;
						flex-wrap: wrap;
						gap: 12px;
					}

					.awardees-filter-btn {
						padding: 10px 24px;
						background: #f5f5f5;
						border: 1px solid rgba(78, 43, 90, 0.15);
						border-radius: 50px;
						color: #666;
						font-size: 14px;
						font-weight: 600;
						cursor: pointer;
						transition: all 0.3s ease;
						font-family: var(--grotesk);
					}

					.awardees-filter-btn:hover {
						background: rgba(78, 43, 90, 0.05);
						border-color: rgba(78, 43, 90, 0.3);
						color: #4e2b5a;
					}

					.awardees-filter-btn.active {
						background: var(--tier-color, #4e2b5a);
						border-color: var(--tier-color, #4e2b5a);
						color: #ffffff;
					}

					.awardees-main-section {
						background: linear-gradient(135deg, 
							#fafafa 0%, 
							#f5f5f5 50%, 
							#fafafa 100%);
						padding: 30px 0 60px;
					}

					@media (min-width: 576px) {
						.awardees-main-section {
							padding: 40px 0 80px;
						}
					}

					@media (min-width: 992px) {
						.awardees-main-section {
							padding: 60px 0 100px;
						}
					}

					.awardees-tier-section {
						margin-bottom: 40px;
					}

					@media (min-width: 576px) {
						.awardees-tier-section {
							margin-bottom: 60px;
						}
					}

					@media (min-width: 992px) {
						.awardees-tier-section {
							margin-bottom: 80px;
						}
					}

					.awardees-tier-section:last-child {
						margin-bottom: 0;
					}

					.awardees-tier-header {
						margin-bottom: 24px;
						text-align: center;
					}

					@media (min-width: 576px) {
						.awardees-tier-header {
							margin-bottom: 32px;
						}
					}

					@media (min-width: 992px) {
						.awardees-tier-header {
							margin-bottom: 40px;
						}
					}

					.awardees-tier-title {
						font-size: clamp(18px, 2.5vw, 24px);
						font-weight: 700;
						color: var(--tier-color, #4e2b5a);
						margin: 0;
						font-family: var(--grotesk);
						text-transform: uppercase;
						letter-spacing: 1.5px;
					}

					.awardees-grid {
						display: grid;
						grid-template-columns: 1fr;
						gap: 20px;
						align-items: stretch;
					}

					@media (min-width: 576px) {
						.awardees-grid {
							grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
							gap: 24px;
							align-items: stretch;
						}
					}

					@media (min-width: 992px) {
						.awardees-grid {
							grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
							gap: 32px;
							align-items: stretch;
						}
					}

					.awardee-card {
						background: #ffffff;
						border-radius: 20px;
						overflow: hidden;
						box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
						border: 1px solid rgba(78, 43, 90, 0.1);
						transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
						display: flex;
						flex-direction: column;
						height: 100%;
					}

					.awardee-card:hover {
						transform: translateY(-8px);
						box-shadow: 0 12px 40px rgba(78, 43, 90, 0.15);
						border-color: rgba(78, 43, 90, 0.2);
					}

					.awardee-image-wrapper {
						width: 100%;
						background: linear-gradient(135deg, #f8f8f8 0%, #f0f0f0 100%);
						padding: 24px 20px;
						display: flex;
						justify-content: center;
						align-items: center;
						min-height: 160px;
					}

					@media (min-width: 576px) {
						.awardee-image-wrapper {
							padding: 32px 24px;
							min-height: 180px;
						}
					}

					@media (min-width: 992px) {
						.awardee-image-wrapper {
							padding: 40px 30px;
							min-height: 200px;
						}
					}

					.awardee-profile-image {
						width: 120px;
						height: 120px;
						border-radius: 50%;
						overflow: hidden;
						border: 3px solid #ffffff;
						box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
					}

					@media (min-width: 576px) {
						.awardee-profile-image {
							width: 150px;
							height: 150px;
							border-width: 3px;
						}
					}

					@media (min-width: 992px) {
						.awardee-profile-image {
							width: 180px;
							height: 180px;
							border-width: 4px;
						}
					}

					.awardee-profile-image .awardee-image {
						width: 100%;
						height: 100%;
						object-fit: cover;
					}

					.awardee-image-placeholder {
						width: 100%;
						height: 100%;
						background: linear-gradient(135deg, rgba(78, 43, 90, 0.1) 0%, rgba(78, 43, 90, 0.05) 100%);
						display: flex;
						align-items: center;
						justify-content: center;
					}

					.awardee-image-placeholder i {
						font-size: 60px;
						color: rgba(78, 43, 90, 0.3);
					}

					.awardee-logo-wrapper {
						width: 100%;
						max-width: 240px;
						height: 120px;
						display: flex;
						align-items: center;
						justify-content: center;
					}

					.awardee-logo {
						max-width: 100%;
						max-height: 100%;
						object-fit: contain;
					}

					.awardee-logo-placeholder {
						width: 100%;
						height: 100%;
						background: linear-gradient(135deg, rgba(78, 43, 90, 0.1) 0%, rgba(78, 43, 90, 0.05) 100%);
						border-radius: 12px;
						display: flex;
						align-items: center;
						justify-content: center;
					}

					.awardee-logo-placeholder i {
						font-size: 48px;
						color: rgba(78, 43, 90, 0.3);
					}

					.awardee-content {
						padding: 20px;
						flex: 1;
						display: flex;
						flex-direction: column;
					}

					@media (min-width: 576px) {
						.awardee-content {
							padding: 24px;
						}
					}

					@media (min-width: 992px) {
						.awardee-content {
							padding: 32px;
						}
					}

					.awardee-category-badge {
						display: inline-block;
						padding: 6px 16px;
						background: rgba(78, 43, 90, 0.1);
						border: 1px solid rgba(78, 43, 90, 0.2);
						border-radius: 20px;
						margin-bottom: 16px;
						font-size: 11px;
						font-weight: 600;
						color: var(--tier-color, #4e2b5a);
						letter-spacing: 0.5px;
						text-transform: uppercase;
						font-family: var(--grotesk);
						width: fit-content;
					}

					.awardee-name {
						font-size: clamp(14px, 1.8vw, 18px);
						font-weight: 700;
						color: #1a1a1a;
						margin: 0 0 12px 0;
						line-height: 1.3;
						font-family: var(--grotesk);
					}

					.awardee-excerpt {
						font-size: clamp(13px, 1.6vw, 14px);
						line-height: 1.6;
						color: #666;
						margin: 0 0 20px 0;
						font-family: var(--figtree);
						flex: 1;
					}

					.awardee-citation-btn {
						padding: 10px 20px;
						background: transparent;
						border: 2px solid var(--tier-color, #4e2b5a);
						border-radius: 50px;
						color: var(--tier-color, #4e2b5a);
						font-size: clamp(12px, 1.5vw, 13px);
						font-weight: 600;
						cursor: pointer;
						transition: all 0.3s ease;
						display: flex;
						align-items: center;
						justify-content: center;
						gap: 6px;
						font-family: var(--grotesk);
						margin-top: auto;
					}

					@media (min-width: 576px) {
						.awardee-citation-btn {
							padding: 11px 22px;
							font-size: 13px;
							gap: 7px;
						}
					}

					@media (min-width: 992px) {
						.awardee-citation-btn {
							padding: 12px 24px;
							font-size: 14px;
							gap: 8px;
						}
					}

					.awardee-citation-btn:hover {
						background: var(--tier-color, #4e2b5a);
						color: #ffffff;
						transform: translateY(-2px);
						box-shadow: 0 4px 12px rgba(78, 43, 90, 0.2);
					}

					/* Mobile-first responsive adjustments */
					.awardees-filter-section {
						padding: 16px 0;
					}

					@media (min-width: 576px) {
						.awardees-filter-section {
							padding: 24px 0;
						}
					}

					@media (min-width: 992px) {
						.awardees-filter-section {
							padding: 30px 0;
						}
					}

					.awardees-filter-wrapper {
						gap: 8px;
					}

					@media (min-width: 576px) {
						.awardees-filter-wrapper {
							gap: 10px;
						}
					}

					@media (min-width: 992px) {
						.awardees-filter-wrapper {
							gap: 12px;
						}
					}

					.awardees-filter-btn {
						padding: 8px 16px;
						font-size: 12px;
					}

					@media (min-width: 576px) {
						.awardees-filter-btn {
							padding: 9px 20px;
							font-size: 13px;
						}
					}

					@media (min-width: 992px) {
						.awardees-filter-btn {
							padding: 10px 24px;
							font-size: 14px;
						}
					}
				`}</style>
			</Layout>
		</>
	)
}
