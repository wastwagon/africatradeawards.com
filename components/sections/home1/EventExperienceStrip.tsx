'use client'

import Link from 'next/link'

const tiles = [
	{
		href: '/event/',
		title: 'Programme',
		body: 'Keynotes, panels, and recognition moments across two days.',
		icon: 'fa-solid fa-calendar-days',
	},
	{
		href: '/speakers/',
		title: 'Speakers',
		body: 'Voices shaping trade, policy, and industry execution.',
		icon: 'fa-solid fa-microphone-lines',
	},
	{
		href: '/event-schedule/',
		title: 'Schedule',
		body: 'See timings, sessions, and what to expect on site.',
		icon: 'fa-solid fa-clock',
	},
	{
		href: '/memories/',
		title: 'Moments',
		body: 'Highlights and atmosphere from past celebrations.',
		icon: 'fa-solid fa-camera',
	},
] as const

export default function EventExperienceStrip() {
	return (
		<section className="event-experience-strip" aria-labelledby="event-experience-heading">
			<div className="event-experience-strip__bg" aria-hidden />
			<div className="container">
				<div className="event-experience-strip__head text-center" data-aos="fade-up" data-aos-duration={600}>
					<p className="event-experience-strip__eyebrow">The experience</p>
					<h2 id="event-experience-heading" className="event-experience-strip__title">
						What you will feel on the ground
					</h2>
					<p className="event-experience-strip__intro">
						When you are ready to go deeper: programme, speakers, schedule, or moments from past celebrations.
					</p>
				</div>
				<div className="row g-3 g-md-4 event-experience-strip__row">
					{tiles.map((tile, i) => (
						<div key={tile.href} className="col-6 col-lg-3 d-flex">
							<Link
								href={tile.href}
								className="event-experience-tile w-100"
								data-aos="fade-up"
								data-aos-duration={600}
								data-aos-delay={i * 70}
							>
								<div className="event-experience-tile__icon" aria-hidden>
									<i className={tile.icon} />
								</div>
								<h3 className="event-experience-tile__title">{tile.title}</h3>
								<p className="event-experience-tile__body">{tile.body}</p>
								<span className="event-experience-tile__cta">
									Open
									<i className="fa-solid fa-arrow-up-right-from-square" aria-hidden />
								</span>
							</Link>
						</div>
					))}
				</div>
			</div>
			<style jsx>{`
				.event-experience-strip {
					position: relative;
					padding: 56px 0 64px;
					overflow: hidden;
				}
				.event-experience-strip__bg {
					position: absolute;
					inset: 0;
					background: radial-gradient(ellipse 80% 55% at 10% 0%, rgba(201, 160, 99, 0.16) 0%, transparent 55%),
						radial-gradient(ellipse 70% 50% at 95% 100%, rgba(78, 43, 90, 0.2) 0%, transparent 55%),
						linear-gradient(180deg, #0f0b12 0%, #14101a 45%, #0f0b12 100%);
				}
				.event-experience-strip__head {
					position: relative;
					z-index: 1;
					max-width: 820px;
					margin: 0 auto 40px;
				}
				.event-experience-strip__eyebrow {
					margin: 0 0 10px;
					font-family: var(--grotesk), sans-serif;
					font-size: 0.72rem;
					font-weight: 700;
					letter-spacing: 0.2em;
					text-transform: uppercase;
					color: #e7cfaa;
				}
				.event-experience-strip__title {
					margin: 0 0 12px;
					font-family: var(--grotesk), sans-serif;
					font-size: clamp(1.45rem, 3.2vw, 2rem);
					font-weight: 700;
					line-height: 1.15;
					color: #fbf7f1;
				}
				.event-experience-strip__intro {
					margin: 0;
					font-family: var(--figtree), system-ui, sans-serif;
					font-size: 1.02rem;
					line-height: 1.6;
					color: rgba(251, 247, 241, 0.78);
				}
				.event-experience-strip__row {
					position: relative;
					z-index: 1;
				}
				.event-experience-tile {
					display: flex;
					flex-direction: column;
					height: 100%;
					padding: 18px 16px 16px;
					border-radius: 16px;
					text-decoration: none;
					color: #f4efe8;
					background: rgba(255, 255, 255, 0.04);
					border: 1px solid rgba(201, 160, 99, 0.22);
					box-shadow: 0 16px 40px rgba(0, 0, 0, 0.22);
					transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease, background 0.2s ease;
				}
				.event-experience-tile:hover {
					transform: translateY(-4px);
					border-color: rgba(255, 220, 180, 0.45);
					background: rgba(255, 255, 255, 0.07);
					box-shadow: 0 22px 52px rgba(0, 0, 0, 0.28);
				}
				.event-experience-tile:focus-visible {
					outline: 2px solid #e7cfaa;
					outline-offset: 3px;
				}
				.event-experience-tile__icon {
					width: 44px;
					height: 44px;
					display: flex;
					align-items: center;
					justify-content: center;
					border-radius: 12px;
					margin-bottom: 12px;
					background: linear-gradient(135deg, rgba(255, 216, 170, 0.35) 0%, rgba(120, 80, 140, 0.35) 100%);
					color: #fdf8ff;
					font-size: 1.05rem;
				}
				.event-experience-tile__title {
					margin: 0 0 6px;
					font-family: var(--grotesk), sans-serif;
					font-size: 1.05rem;
					font-weight: 700;
					letter-spacing: -0.01em;
					color: #fff;
				}
				.event-experience-tile__body {
					margin: 0 0 12px;
					font-family: var(--figtree), system-ui, sans-serif;
					font-size: 0.88rem;
					line-height: 1.45;
					color: rgba(251, 247, 241, 0.76);
					flex: 1 1 auto;
				}
				.event-experience-tile__cta {
					display: inline-flex;
					align-items: center;
					gap: 8px;
					font-family: var(--grotesk), sans-serif;
					font-size: 0.72rem;
					font-weight: 700;
					letter-spacing: 0.08em;
					text-transform: uppercase;
					color: #e7cfaa;
				}
				@media (max-width: 575px) {
					.event-experience-strip {
						padding: 48px 0 56px;
					}
					.event-experience-tile {
						padding: 14px 12px 12px;
					}
					.event-experience-tile__icon {
						width: 40px;
						height: 40px;
						font-size: 0.95rem;
					}
				}
			`}</style>
		</section>
	)
}
