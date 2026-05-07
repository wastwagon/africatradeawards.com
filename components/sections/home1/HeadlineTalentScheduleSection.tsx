'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import ProfileModal from '@/components/elements/ProfileModal'
import { committeeMembers, type CommitteeMember } from '@/data/committeeMembers'

/** Featured portraits on the homepage; remaining members appear as compact cards in the same section. */
const FEATURED_COUNT = 3

function imageObjectPosition(id: string): string | undefined {
	if (id === 'beenzu-muleya') return 'center 18%'
	if (id === 'nana-ama-kusi-appouh') return 'center 35%'
	return undefined
}

export default function HeadlineTalentScheduleSection() {
	const featuredMembers = committeeMembers.slice(0, FEATURED_COUNT)
	const additionalMembers = committeeMembers.slice(FEATURED_COUNT)
	const [selectedMember, setSelectedMember] = useState<CommitteeMember | null>(null)
	const [isModalOpen, setIsModalOpen] = useState(false)

	const openProfile = (member: CommitteeMember) => {
		setSelectedMember(member)
		setIsModalOpen(true)
	}

	const closeModal = () => {
		setIsModalOpen(false)
		setTimeout(() => setSelectedMember(null), 300)
	}

	return (
		<section className="review-room-spotlight" id="committee-review-room" aria-labelledby="review-room-heading">
			<div className="review-room-spotlight__ambient" aria-hidden />
			<div className="container">
				<div className="review-room-spotlight__head text-center" data-aos="fade-up" data-aos-duration={600}>
					<p className="review-room-spotlight__eyebrow">Recognition &amp; validation</p>
					<h2 id="review-room-heading" className="review-room-spotlight__title">
						An independent review room
					</h2>
					<p className="review-room-spotlight__intro">
						Senior practitioners across finance, trade, law, data, and governance — open a bio when you want the full
						credential line.
					</p>
				</div>

				<div className="review-room-spotlight__main">
					<div className="review-room-spotlight__grid">
						{featuredMembers.map((member, i) => (
							<article
								key={member.id}
								className="review-room-card"
								data-aos="fade-up"
								data-aos-duration={650}
								data-aos-delay={i * 90}
							>
								<div className="review-room-card__media">
									<div className="review-room-card__ring" aria-hidden>
										<div className="review-room-card__media-inner">
											<Image
												src={member.image}
												alt={member.name}
												width={320}
												height={320}
												className="review-room-card__img"
												style={{ objectPosition: imageObjectPosition(member.id) }}
												sizes="(max-width: 767px) 72vw, 28vw"
												priority={i === 0}
											/>
										</div>
									</div>
									<p className="review-room-card__country">{member.country}</p>
								</div>
								<div className="review-room-card__body">
									<h3 className="review-room-card__name">{member.name}</h3>
									<p className="review-room-card__title">{member.title}</p>
									<p className="review-room-card__bio">{member.shortBio}</p>
									<ul className="review-room-card__tags" aria-label="Areas of expertise">
										{member.expertise.slice(0, 2).map((tag) => (
											<li key={tag}>{tag}</li>
										))}
									</ul>
									<button type="button" className="review-room-card__btn" onClick={() => openProfile(member)}>
										<span>Read full profile</span>
										<i className="fa-solid fa-arrow-right" aria-hidden />
									</button>
								</div>
							</article>
						))}
					</div>

					{additionalMembers.length > 0 ? (
						<div className="review-room-compact" data-aos="fade-up" data-aos-duration={650}>
							<h3 className="review-room-compact__heading">Also on the committee</h3>
							<p className="review-room-compact__lede">Two focus areas each — details in the bio.</p>
							<div className="review-room-compact__grid">
								{additionalMembers.map((member) => (
									<article key={member.id} className="review-room-compact-card">
										<div className="review-room-compact-card__ring" aria-hidden>
											<div className="review-room-compact-card__media">
												<Image
													src={member.image}
													alt={member.name}
													width={120}
													height={120}
													className="review-room-compact-card__img"
													style={{ objectPosition: imageObjectPosition(member.id) }}
												/>
											</div>
										</div>
										<div className="review-room-compact-card__body">
											<p className="review-room-compact-card__country">{member.country}</p>
											<h4 className="review-room-compact-card__name">{member.name}</h4>
											<ul className="review-room-compact-card__tags" aria-label="Expertise">
												{member.expertise.slice(0, 2).map((tag) => (
													<li key={tag}>{tag}</li>
												))}
											</ul>
											<button type="button" className="review-room-compact-card__btn" onClick={() => openProfile(member)}>
												<span>Full profile</span>
												<i className="fa-solid fa-arrow-right" aria-hidden />
											</button>
										</div>
									</article>
								))}
							</div>
						</div>
					) : null}

					<div className="review-room-spotlight__cta-row" data-aos="fade-up" data-aos-duration={600}>
						<Link href="/about/#committee" className="review-room-spotlight__link">
							<span>Committee charter &amp; full bios</span>
							<i className="fa-solid fa-arrow-right" aria-hidden />
						</Link>
						<Link href="/about/" className="review-room-spotlight__link review-room-spotlight__link--ghost">
							<span>How recognition works</span>
							<i className="fa-solid fa-arrow-right" aria-hidden />
						</Link>
					</div>
				</div>
			</div>

			<ProfileModal member={selectedMember} isOpen={isModalOpen} onClose={closeModal} />

			<style jsx>{`
				.review-room-spotlight {
					position: relative;
					padding: 64px 0 72px;
					overflow: hidden;
					background: linear-gradient(165deg, #f3f0f6 0%, #e8e2ee 38%, #efeaf4 100%);
				}
				.review-room-spotlight__ambient {
					position: absolute;
					inset: 0;
					pointer-events: none;
					background:
						radial-gradient(ellipse 85% 50% at 12% 0%, rgba(120, 80, 140, 0.11) 0%, transparent 55%),
						radial-gradient(ellipse 65% 45% at 96% 92%, rgba(201, 160, 99, 0.1) 0%, transparent 55%),
						linear-gradient(180deg, #faf8fc 0%, #f2eef7 48%, #f7f4fa 100%);
					opacity: 1;
				}
				.review-room-spotlight .container {
					position: relative;
					z-index: 1;
				}
				.review-room-spotlight__head {
					max-width: 720px;
					margin: 0 auto 52px;
				}
				.review-room-spotlight__eyebrow {
					margin: 0 0 10px;
					font-family: var(--grotesk), serif;
					font-size: 0.72rem;
					font-weight: 700;
					letter-spacing: 0.24em;
					text-transform: uppercase;
					color: #5c3d6b;
				}
				.review-room-spotlight__title {
					margin: 0 0 16px;
					font-family: var(--grotesk), serif;
					font-size: clamp(1.55rem, 3.4vw, 2.15rem);
					font-weight: 700;
					line-height: 1.12;
					letter-spacing: -0.02em;
					color: #1a1222;
				}
				.review-room-spotlight__intro {
					margin: 0 auto;
					max-width: 560px;
					font-family: var(--figtree), system-ui, sans-serif;
					font-size: 1rem;
					line-height: 1.62;
					color: rgba(26, 18, 34, 0.72);
				}
				.review-room-spotlight__main {
					max-width: 1100px;
					margin: 0 auto;
				}
				.review-room-spotlight__grid {
					display: grid;
					grid-template-columns: 1fr;
					gap: 26px;
				}
				@media (min-width: 768px) {
					.review-room-spotlight__grid {
						grid-template-columns: repeat(3, minmax(0, 1fr));
						gap: 22px;
					}
				}
				.review-room-card {
					display: flex;
					flex-direction: column;
					height: 100%;
					border-radius: 20px;
					background: #fff;
					border: 1px solid rgba(120, 80, 140, 0.12);
					box-shadow:
						0 12px 36px rgba(26, 18, 34, 0.07),
						inset 0 1px 0 rgba(255, 255, 255, 0.85);
					overflow: visible;
					transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
				}
				.review-room-card:hover {
					transform: translateY(-6px);
					border-color: rgba(201, 160, 99, 0.35);
					box-shadow:
						0 28px 64px rgba(26, 18, 34, 0.14),
						inset 0 1px 0 rgba(255, 255, 255, 0.9);
				}
				.review-room-card__media {
					display: flex;
					flex-direction: column;
					align-items: center;
					padding: 26px 14px 10px;
					background: linear-gradient(180deg, rgba(248, 246, 252, 0.95) 0%, #fff 100%);
					border-radius: 20px 20px 0 0;
				}
				.review-room-card__ring {
					padding: 4px;
					border-radius: 50%;
					background: linear-gradient(145deg, #d4a574 0%, #c9a063 22%, #6a4082 78%, #4e2b5a 100%);
					box-shadow: 0 14px 36px rgba(78, 43, 90, 0.18);
				}
				.review-room-card__media-inner {
					position: relative;
					width: clamp(168px, 42vw, 220px);
					height: clamp(168px, 42vw, 220px);
					border-radius: 50%;
					overflow: hidden;
					background: linear-gradient(145deg, #2a1f33 0%, #4a3560 100%);
				}
				@media (min-width: 768px) {
					.review-room-card__media-inner {
						width: clamp(140px, 18vw, 200px);
						height: clamp(140px, 18vw, 200px);
					}
				}
				.review-room-card__img {
					width: 100%;
					height: 100%;
					object-fit: cover;
					object-position: center top;
					transition: transform 0.45s ease;
				}
				.review-room-card:hover .review-room-card__img {
					transform: scale(1.06);
				}
				.review-room-card__country {
					margin: 14px 0 0;
					padding: 6px 14px;
					border-radius: 999px;
					font-family: var(--figtree), system-ui, sans-serif;
					font-size: 0.72rem;
					font-weight: 700;
					letter-spacing: 0.08em;
					text-transform: uppercase;
					color: #4a2e5c;
					background: rgba(120, 80, 140, 0.1);
					border: 1px solid rgba(120, 80, 140, 0.2);
				}
				.review-room-card__body {
					flex: 1 1 auto;
					display: flex;
					flex-direction: column;
					align-items: center;
					text-align: center;
					padding: 14px 20px 22px;
					border-top: 2px solid rgba(201, 160, 99, 0.55);
				}
				.review-room-card__name {
					margin: 0 0 8px;
					font-family: var(--grotesk), serif;
					font-size: 1.14rem;
					font-weight: 700;
					line-height: 1.25;
					color: #1a1222;
				}
				.review-room-card__title {
					margin: 0 0 10px;
					font-family: var(--figtree), system-ui, sans-serif;
					font-size: 0.84rem;
					font-weight: 600;
					line-height: 1.42;
					color: rgba(26, 18, 34, 0.78);
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
				}
				.review-room-card__bio {
					margin: 0 0 12px;
					font-family: var(--figtree), system-ui, sans-serif;
					font-size: 0.88rem;
					line-height: 1.52;
					color: rgba(26, 18, 34, 0.68);
					flex: 1 1 auto;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
				}
				.review-room-card__tags {
					display: flex;
					flex-wrap: wrap;
					gap: 8px;
					margin: 0 0 14px;
					padding: 0;
					list-style: none;
					justify-content: center;
				}
				.review-room-card__tags li {
					padding: 4px 10px;
					border-radius: 999px;
					font-size: 0.68rem;
					font-weight: 600;
					color: #4a2e5c;
					background: rgba(120, 80, 140, 0.07);
					border: 1px solid rgba(120, 80, 140, 0.14);
				}
				.review-room-card__btn {
					display: inline-flex;
					align-items: center;
					justify-content: center;
					gap: 10px;
					width: 100%;
					max-width: 280px;
					margin-top: auto;
					padding: 12px 14px;
					border-radius: 12px;
					border: none;
					cursor: pointer;
					font-family: var(--grotesk), serif;
					font-size: 0.78rem;
					font-weight: 700;
					letter-spacing: 0.08em;
					text-transform: uppercase;
					color: #fbf7f1;
					background: linear-gradient(135deg, #4e2b5a 0%, #6a3f84 100%);
					box-shadow: 0 12px 28px rgba(78, 43, 90, 0.28);
					transition: transform 0.18s ease, box-shadow 0.18s ease;
				}
				.review-room-card__btn:hover {
					transform: translateY(-2px);
					box-shadow: 0 16px 36px rgba(78, 43, 90, 0.34);
				}
				.review-room-card__btn:focus-visible {
					outline: 2px solid #e7cfaa;
					outline-offset: 3px;
				}
				.review-room-compact {
					margin-top: 40px;
					padding: 28px 20px 26px;
					border-radius: 18px;
					background: rgba(255, 255, 255, 0.55);
					border: 1px solid rgba(120, 80, 140, 0.1);
					box-shadow: 0 10px 28px rgba(26, 18, 34, 0.05);
					backdrop-filter: blur(10px);
				}
				.review-room-compact__heading {
					margin: 0 0 6px;
					font-family: var(--grotesk), serif;
					font-size: 1rem;
					font-weight: 700;
					color: #1a1222;
					text-align: center;
				}
				.review-room-compact__lede {
					margin: 0 0 20px;
					font-family: var(--figtree), system-ui, sans-serif;
					font-size: 0.86rem;
					line-height: 1.5;
					color: rgba(26, 18, 34, 0.65);
					text-align: center;
				}
				.review-room-compact__grid {
					display: grid;
					grid-template-columns: 1fr;
					gap: 14px;
				}
				@media (min-width: 768px) {
					.review-room-compact__grid {
						grid-template-columns: repeat(3, minmax(0, 1fr));
						gap: 12px;
					}
				}
				.review-room-compact-card {
					display: flex;
					flex-direction: column;
					align-items: center;
					text-align: center;
					padding: 20px 14px 18px;
					border-radius: 18px;
					background: #fff;
					border: 1px solid rgba(78, 43, 90, 0.09);
					box-shadow: 0 10px 26px rgba(26, 18, 34, 0.05);
					transition: border-color 0.2s ease, box-shadow 0.2s ease;
				}
				.review-room-compact-card:hover {
					border-color: rgba(201, 160, 99, 0.35);
					box-shadow: 0 14px 32px rgba(26, 18, 34, 0.08);
				}
				.review-room-compact-card__ring {
					padding: 3px;
					border-radius: 50%;
					background: linear-gradient(145deg, #d4a574 0%, #6a4082 100%);
					box-shadow: 0 10px 24px rgba(78, 43, 90, 0.14);
					margin-bottom: 12px;
				}
				.review-room-compact-card__media {
					position: relative;
					width: 104px;
					height: 104px;
					border-radius: 50%;
					overflow: hidden;
					background: linear-gradient(145deg, #e8e2ee 0%, #ddd7e6 100%);
				}
				.review-room-compact-card__img {
					width: 100%;
					height: 100%;
					object-fit: cover;
					object-position: center top;
				}
				.review-room-compact-card__body {
					width: 100%;
					display: flex;
					flex-direction: column;
					align-items: center;
				}
				.review-room-compact-card__country {
					margin: 0 0 6px;
					font-size: 0.68rem;
					font-weight: 700;
					letter-spacing: 0.08em;
					text-transform: uppercase;
					color: #6a4082;
				}
				.review-room-compact-card__name {
					margin: 0 0 10px;
					font-family: var(--grotesk), serif;
					font-size: 0.98rem;
					font-weight: 700;
					line-height: 1.25;
					color: #1a1222;
				}
				.review-room-compact-card__tags {
					display: flex;
					flex-wrap: wrap;
					gap: 6px;
					margin: 0 0 10px;
					padding: 0;
					list-style: none;
					justify-content: center;
				}
				.review-room-compact-card__tags li {
					padding: 3px 8px;
					border-radius: 999px;
					font-size: 0.65rem;
					font-weight: 600;
					color: #4a2e5c;
					background: rgba(120, 80, 140, 0.09);
					border: 1px solid rgba(120, 80, 140, 0.14);
				}
				.review-room-compact-card__btn {
					display: inline-flex;
					align-items: center;
					gap: 8px;
					padding: 0;
					border: none;
					background: none;
					cursor: pointer;
					font-family: var(--grotesk), serif;
					font-size: 0.74rem;
					font-weight: 700;
					letter-spacing: 0.06em;
					text-transform: uppercase;
					color: #4e2b5a;
					transition: gap 0.2s ease, color 0.2s ease;
				}
				.review-room-compact-card__btn:hover {
					color: #2d1b38;
					gap: 11px;
				}
				.review-room-compact-card__btn:focus-visible {
					outline: 2px solid #5c3d6b;
					outline-offset: 3px;
					border-radius: 4px;
				}
				.review-room-spotlight__cta-row {
					display: flex;
					flex-wrap: wrap;
					gap: 16px 28px;
					align-items: center;
					justify-content: center;
					margin-top: 36px;
					padding-top: 8px;
				}
				@media (min-width: 1200px) {
					.review-room-spotlight__cta-row {
						justify-content: flex-start;
					}
				}
				.review-room-spotlight__link {
					display: inline-flex;
					align-items: center;
					gap: 10px;
					font-family: var(--grotesk), serif;
					font-size: 0.85rem;
					font-weight: 700;
					letter-spacing: 0.06em;
					text-transform: uppercase;
					text-decoration: none;
					color: #4a2e5c;
					transition: color 0.2s ease, gap 0.2s ease;
				}
				.review-room-spotlight__link:hover {
					color: #2d1b38;
					gap: 14px;
				}
				.review-room-spotlight__link--ghost {
					color: rgba(74, 46, 92, 0.85);
					font-weight: 650;
				}
				.review-room-spotlight__link:focus-visible {
					outline: 2px solid #5c3d6b;
					outline-offset: 3px;
					border-radius: 4px;
				}
				.review-room-spotlight__link--inverse {
					color: #e7cfaa;
				}
				.review-room-spotlight__link--inverse:hover {
					color: #f5e6d3;
				}
				@media (max-width: 575px) {
					.review-room-spotlight {
						padding: 52px 0 60px;
					}
				}
			`}</style>
		</section>
	)
}
