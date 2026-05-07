'use client'

import Link from 'next/link'
import { useSiteConfig } from '@/components/site/SiteConfigProvider'

const HASHTAG_LABEL = '#AfricaTradeAwards2026'

const coverageTopics = [
	'Business & trade',
	'Policy & regional blocs',
	'Banking & enterprise',
	'Logistics & ports',
	'SME & innovation',
	'Broadcast & digital',
] as const

function mapsSearchUrl(query: string): string {
	return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}

export default function VenuePressStrip() {
	const { heroBarVenueLine, supportEmail } = useSiteConfig()
	const venue = heroBarVenueLine.trim() || 'Kempinski Gold Coast City Hotel, Accra-Ghana'
	const mapsQuery = venue.includes('Accra') ? venue : `${venue}, Accra, Ghana`
	const hashtagHref = `https://x.com/search?q=${encodeURIComponent(HASHTAG_LABEL)}`
	const pressMail = supportEmail.trim() ? `mailto:${supportEmail.trim()}?subject=Press%20%26%20media%20enquiry` : null

	return (
		<section className="venue-press-strip" aria-labelledby="venue-press-heading">
			<div className="venue-press-strip__bg" aria-hidden />
			<div className="container">
				<header className="venue-press-strip__section-head text-center" data-aos="fade-up" data-aos-duration={600}>
					<p className="venue-press-strip__section-eyebrow">Plan your visit</p>
					<h2 id="venue-press-heading" className="venue-press-strip__section-title">
						Location &amp; media
					</h2>
					<p className="venue-press-strip__section-intro">
						Ready to travel or tell the story — confirm where we meet, use the official hashtag, and route broadcast and
						press requests through one desk.
					</p>
				</header>
				<div className="venue-press-strip__venue-row">
					<div className="venue-press-strip__block venue-press-strip__block--venue">
						<h3 className="venue-press-strip__venue-title">Venue</h3>
						<p className="venue-press-strip__venue-line">
							<i className="fa-solid fa-location-dot venue-press-strip__inline-icon" aria-hidden />
							<span>{venue}</span>
						</p>
						<a
							href={mapsSearchUrl(mapsQuery)}
							target="_blank"
							rel="noopener noreferrer"
							className="venue-press-strip__directions"
						>
							<span>Directions</span>
							<i className="fa-solid fa-arrow-up-right-from-square" aria-hidden />
						</a>
					</div>
					<div className="venue-press-strip__divider" aria-hidden />
					<div className="venue-press-strip__block venue-press-strip__block--tag">
						<p className="venue-press-strip__eyebrow">Official hashtag</p>
						<a href={hashtagHref} target="_blank" rel="noopener noreferrer" className="venue-press-strip__hashtag">
							{HASHTAG_LABEL}
						</a>
						<p className="venue-press-strip__tag-hint">Follow and share moments from the room.</p>
					</div>
				</div>

				<div className="venue-press-strip__press" data-aos="fade-up" data-aos-duration={600}>
					<div className="venue-press-strip__press-head">
						<p className="venue-press-strip__press-eyebrow">Media</p>
						<h3 className="venue-press-strip__press-title">Where the awards story travels</h3>
						<p className="venue-press-strip__press-copy">
							Coverage spans trade desks, enterprise, policy, and broadcast. These are the lenses audiences use when the
							shortlists drop and the gala goes live — not an endorsement list.
						</p>
					</div>
					<ul className="venue-press-strip__topics" aria-label="Topics covered in media conversation">
						{coverageTopics.map((topic) => (
							<li key={topic} className="venue-press-strip__topic">
								{topic}
							</li>
						))}
					</ul>
					<div className="venue-press-strip__press-actions">
						<Link href="/press/" className="venue-press-strip__press-link">
							<span>Press centre</span>
							<i className="fa-solid fa-arrow-right" aria-hidden />
						</Link>
						{pressMail ? (
							<a href={pressMail} className="venue-press-strip__press-link venue-press-strip__press-link--ghost">
								<span>Email press desk</span>
								<i className="fa-solid fa-envelope" aria-hidden />
							</a>
						) : null}
						<Link href="/contact/" className="venue-press-strip__press-link venue-press-strip__press-link--ghost">
							<span>Contact the secretariat</span>
							<i className="fa-solid fa-arrow-right" aria-hidden />
						</Link>
					</div>
				</div>
			</div>

			<style jsx>{`
				.venue-press-strip {
					position: relative;
					padding: 44px 0 52px;
					overflow: hidden;
				}
				.venue-press-strip__bg {
					position: absolute;
					inset: 0;
					background: linear-gradient(180deg, #f0ecf4 0%, #e8e2ee 45%, #ebe6f0 100%);
				}
				.venue-press-strip__bg::after {
					content: '';
					position: absolute;
					inset: 0;
					background: radial-gradient(ellipse 80% 55% at 30% 0%, rgba(120, 80, 140, 0.12) 0%, transparent 55%),
						radial-gradient(ellipse 70% 50% at 100% 100%, rgba(201, 160, 99, 0.14) 0%, transparent 55%);
					pointer-events: none;
				}
				.venue-press-strip .container {
					position: relative;
					z-index: 1;
				}
				.venue-press-strip__section-head {
					max-width: 640px;
					margin: 0 auto 28px;
				}
				.venue-press-strip__section-eyebrow {
					margin: 0 0 10px;
					font-family: var(--grotesk), serif;
					font-size: 0.72rem;
					font-weight: 700;
					letter-spacing: 0.2em;
					text-transform: uppercase;
					color: #5c3d6b;
				}
				.venue-press-strip__section-title {
					margin: 0 0 12px;
					font-family: var(--grotesk), serif;
					font-size: clamp(1.45rem, 3vw, 1.85rem);
					font-weight: 700;
					line-height: 1.2;
					letter-spacing: -0.02em;
					color: #1e1528;
				}
				.venue-press-strip__section-intro {
					margin: 0;
					font-family: var(--figtree), system-ui, sans-serif;
					font-size: 1.02rem;
					line-height: 1.65;
					color: rgba(30, 21, 40, 0.78);
				}
				.venue-press-strip__venue-row {
					display: grid;
					grid-template-columns: 1fr;
					gap: 24px;
					align-items: stretch;
					margin-bottom: 36px;
				}
				@media (min-width: 768px) {
					.venue-press-strip__venue-row {
						grid-template-columns: 1fr auto 1fr;
						gap: 32px;
						align-items: center;
					}
				}
				.venue-press-strip__block {
					padding: 22px 20px;
					border-radius: 18px;
					background: rgba(255, 255, 255, 0.72);
					border: 1px solid rgba(78, 43, 90, 0.12);
					box-shadow: 0 16px 42px rgba(30, 21, 40, 0.08);
					backdrop-filter: blur(8px);
				}
				.venue-press-strip__venue-title {
					margin: 0 0 12px;
					font-family: var(--grotesk), serif;
					font-size: 0.72rem;
					font-weight: 700;
					letter-spacing: 0.2em;
					text-transform: uppercase;
					color: #5c3d6b;
				}
				.venue-press-strip__venue-line {
					margin: 0 0 14px;
					display: flex;
					align-items: flex-start;
					gap: 10px;
					font-family: var(--figtree), system-ui, sans-serif;
					font-size: 1.05rem;
					font-weight: 600;
					line-height: 1.45;
					color: #1e1528;
				}
				.venue-press-strip__inline-icon {
					margin-top: 4px;
					color: #6a4082;
					flex-shrink: 0;
				}
				.venue-press-strip__directions {
					display: inline-flex;
					align-items: center;
					gap: 8px;
					font-family: var(--grotesk), serif;
					font-size: 0.82rem;
					font-weight: 700;
					letter-spacing: 0.06em;
					text-transform: uppercase;
					text-decoration: none;
					color: #4a2e5c;
					transition: color 0.2s ease, gap 0.2s ease;
				}
				.venue-press-strip__directions:hover {
					color: #2d1b38;
					gap: 11px;
				}
				.venue-press-strip__directions:focus-visible {
					outline: 2px solid #5c3d6b;
					outline-offset: 3px;
					border-radius: 4px;
				}
				.venue-press-strip__divider {
					display: none;
				}
				@media (min-width: 768px) {
					.venue-press-strip__divider {
						display: block;
						width: 1px;
						min-height: 120px;
						background: linear-gradient(to bottom, transparent, rgba(94, 59, 138, 0.22), transparent);
						align-self: stretch;
					}
				}
				.venue-press-strip__block--tag {
					text-align: center;
				}
				@media (min-width: 768px) {
					.venue-press-strip__block--tag {
						text-align: left;
					}
				}
				.venue-press-strip__eyebrow {
					margin: 0 0 8px;
					font-family: var(--grotesk), serif;
					font-size: 0.72rem;
					font-weight: 700;
					letter-spacing: 0.18em;
					text-transform: uppercase;
					color: #5c3d6b;
				}
				.venue-press-strip__hashtag {
					display: inline-block;
					margin: 0 0 10px;
					font-family: var(--figtree), system-ui, sans-serif;
					font-size: clamp(1.25rem, 3vw, 1.55rem);
					font-weight: 700;
					letter-spacing: -0.02em;
					color: #1e1528;
					text-decoration: none;
					transition: color 0.2s ease;
				}
				.venue-press-strip__hashtag:hover {
					color: #4e2b5a;
				}
				.venue-press-strip__hashtag:focus-visible {
					outline: 2px solid #5c3d6b;
					outline-offset: 3px;
					border-radius: 4px;
				}
				.venue-press-strip__tag-hint {
					margin: 0;
					font-family: var(--figtree), system-ui, sans-serif;
					font-size: 0.9rem;
					line-height: 1.5;
					color: rgba(30, 21, 40, 0.65);
				}
				.venue-press-strip__press {
					padding: 26px 22px 24px;
					border-radius: 20px;
					background: linear-gradient(165deg, #1a1222 0%, #24182e 50%, #1e1528 100%);
					border: 1px solid rgba(201, 160, 99, 0.22);
					box-shadow: 0 22px 56px rgba(20, 12, 28, 0.28);
				}
				.venue-press-strip__press-head {
					margin-bottom: 18px;
					text-align: center;
				}
				@media (min-width: 768px) {
					.venue-press-strip__press-head {
						text-align: left;
						max-width: 640px;
					}
				}
				.venue-press-strip__press-eyebrow {
					margin: 0 0 8px;
					font-family: var(--grotesk), serif;
					font-size: 0.7rem;
					font-weight: 700;
					letter-spacing: 0.2em;
					text-transform: uppercase;
					color: #e7cfaa;
				}
				.venue-press-strip__press-title {
					margin: 0 0 10px;
					font-family: var(--grotesk), serif;
					font-size: clamp(1.25rem, 2.6vw, 1.5rem);
					font-weight: 700;
					line-height: 1.25;
					color: #fbf7f1;
				}
				.venue-press-strip__press-copy {
					margin: 0;
					font-family: var(--figtree), system-ui, sans-serif;
					font-size: 0.94rem;
					line-height: 1.6;
					color: rgba(251, 247, 241, 0.78);
				}
				.venue-press-strip__topics {
					display: flex;
					flex-wrap: wrap;
					gap: 10px;
					justify-content: center;
					margin: 0 0 22px;
					padding: 0;
					list-style: none;
				}
				@media (min-width: 768px) {
					.venue-press-strip__topics {
						justify-content: flex-start;
					}
				}
				.venue-press-strip__topic {
					padding: 8px 14px;
					border-radius: 999px;
					font-family: var(--figtree), system-ui, sans-serif;
					font-size: 0.8rem;
					font-weight: 600;
					letter-spacing: 0.02em;
					color: rgba(251, 247, 241, 0.92);
					background: rgba(255, 255, 255, 0.06);
					border: 1px solid rgba(255, 255, 255, 0.12);
				}
				.venue-press-strip__press-actions {
					display: flex;
					flex-wrap: wrap;
					gap: 12px 20px;
					align-items: center;
					justify-content: center;
				}
				@media (min-width: 768px) {
					.venue-press-strip__press-actions {
						justify-content: flex-start;
					}
				}
				.venue-press-strip__press-link {
					display: inline-flex;
					align-items: center;
					gap: 10px;
					font-family: var(--grotesk), serif;
					font-size: 0.82rem;
					font-weight: 700;
					letter-spacing: 0.05em;
					text-transform: uppercase;
					text-decoration: none;
					color: #e7cfaa;
					transition: color 0.2s ease, gap 0.2s ease;
				}
				.venue-press-strip__press-link:hover {
					color: #f5e6d3;
					gap: 13px;
				}
				.venue-press-strip__press-link:focus-visible {
					outline: 2px solid #e7cfaa;
					outline-offset: 3px;
					border-radius: 4px;
				}
				.venue-press-strip__press-link--ghost {
					color: rgba(251, 247, 241, 0.85);
				}
				.venue-press-strip__press-link--ghost:hover {
					color: #fff;
				}
				@media (max-width: 767px) {
					.venue-press-strip {
						padding: 40px 0 48px;
					}
				}
			`}</style>
		</section>
	)
}
