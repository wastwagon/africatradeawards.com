'use client'

import { useSiteConfig } from '@/components/site/SiteConfigProvider'

export default function EventDateVenueBar() {
	const { heroBarDateLine, heroBarVenueLine } = useSiteConfig()

	return (
		<section className="event-date-venue-bar" data-aos="fade-in" data-aos-duration={600}>
			<div className="container">
				<div className="event-date-venue-inner">
					<div className="event-date-venue-item">
						<div className="event-date-venue-icon">
							<i className="fa-solid fa-calendar-days" aria-hidden="true" />
						</div>
						<span className="event-date-venue-text">{heroBarDateLine}</span>
					</div>
					<div className="event-date-venue-divider" aria-hidden="true" />
					<div className="event-date-venue-item event-date-venue-item-venue">
						<div className="event-date-venue-icon">
							<i className="fa-solid fa-location-dot" aria-hidden="true" />
						</div>
						<span className="event-date-venue-text">{heroBarVenueLine}</span>
					</div>
					<div className="event-date-venue-actions">
						<a href="/event/" className="event-date-venue-cta event-date-venue-cta-secondary">
							Programme
						</a>
						<a href="/event/register/" className="event-date-venue-cta event-date-venue-cta-primary">
							Register
						</a>
					</div>
				</div>
				<p className="event-date-venue-tagline">
					<span className="event-date-venue-tagline__part">Accra</span>
					<span className="event-date-venue-tagline__sep" aria-hidden="true">
						{' '}
						·{' '}
					</span>
					<span className="event-date-venue-tagline__part">Two days</span>
					<span className="event-date-venue-tagline__sep" aria-hidden="true">
						{' '}
						·{' '}
					</span>
					<span className="event-date-venue-tagline__part">Summit &amp; gala</span>
				</p>
			</div>
			<style jsx>{`
				.event-date-venue-bar {
					background: linear-gradient(
						90deg,
						#fff8f0 0%,
						#faf0e8 18%,
						#f5ebe4 38%,
						#efe6f2 58%,
						#f2eaf6 78%,
						#faf5fc 100%
					);
					box-shadow:
						inset 0 1px 0 rgba(255, 255, 255, 0.75),
						inset 0 -1px 0 rgba(78, 43, 90, 0.06),
						0 4px 20px rgba(78, 43, 90, 0.07);
					padding: 10px 12px;
					position: relative;
					z-index: 5;
					max-width: 640px;
					margin: 0 auto;
					border-radius: 8px;
				}
				.event-date-venue-bar .container {
					max-width: 100%;
					padding-left: 12px;
					padding-right: 12px;
				}
				.event-date-venue-inner {
					display: flex;
					flex-wrap: nowrap;
					align-items: flex-start;
					justify-content: center;
					gap: 8px 12px;
					padding: 0;
				}
				.event-date-venue-item {
					display: flex;
					align-items: center;
					gap: 6px;
					flex-shrink: 0;
				}
				.event-date-venue-item-venue {
					flex: 1 1 auto;
					min-width: 0;
					align-items: center;
				}
				.event-date-venue-item-venue .event-date-venue-icon {
					flex-shrink: 0;
					align-self: center;
				}
				.event-date-venue-item-venue .event-date-venue-text {
					white-space: normal;
					word-break: break-word;
				}
				.event-date-venue-icon {
					width: 28px;
					height: 28px;
					min-width: 28px;
					border-radius: 50%;
					background: rgba(94, 59, 138, 0.12);
					border: 1.5px solid rgba(94, 59, 138, 0.35);
					display: flex;
					align-items: center;
					justify-content: center;
					box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4);
				}
				.event-date-venue-icon i {
					font-size: 11px;
					color: #5e3b8a;
				}
				.event-date-venue-text {
					font-size: 11px;
					font-weight: 600;
					color: #5e3b8a;
					letter-spacing: 0.1px;
					line-height: 1.3;
				}
				.event-date-venue-item:not(.event-date-venue-item-venue) .event-date-venue-text {
					white-space: nowrap;
				}
				.event-date-venue-divider {
					width: 1px;
					height: 22px;
					min-height: 22px;
					background: linear-gradient(
						to bottom,
						transparent,
						rgba(94, 59, 138, 0.25),
						transparent
					);
					flex-shrink: 0;
					align-self: center;
				}
				.event-date-venue-actions {
					display: inline-flex;
					align-items: center;
					gap: 8px;
					flex-shrink: 0;
				}
				.event-date-venue-tagline {
					margin: 10px 0 0;
					padding-top: 10px;
					border-top: 1px solid rgba(94, 59, 138, 0.14);
					text-align: center;
					font-family: var(--grotesk), serif;
					font-size: 10px;
					font-weight: 700;
					letter-spacing: 0.14em;
					text-transform: uppercase;
					color: rgba(94, 59, 138, 0.72);
					line-height: 1.45;
				}
				.event-date-venue-tagline__sep {
					font-weight: 600;
					opacity: 0.65;
				}
				.event-date-venue-cta {
					display: inline-flex;
					align-items: center;
					justify-content: center;
					min-height: 34px;
					padding: 0 12px;
					border-radius: 999px;
					font-family: var(--grotesk), sans-serif;
					font-size: 11px;
					font-weight: 700;
					letter-spacing: 0.06em;
					text-transform: uppercase;
					text-decoration: none;
					transition: all 0.2s ease;
				}
				.event-date-venue-cta-primary {
					color: #fff;
					background: linear-gradient(135deg, #4e2b5a 0%, #6a3f84 100%);
					box-shadow: 0 6px 16px rgba(78, 43, 90, 0.25);
				}
				.event-date-venue-cta-primary:hover {
					color: #fff;
					transform: translateY(-1px);
				}
				.event-date-venue-cta-secondary {
					color: #5e3b8a;
					background: rgba(255, 255, 255, 0.65);
					border: 1px solid rgba(94, 59, 138, 0.28);
				}
				.event-date-venue-cta-secondary:hover {
					color: #4e2b5a;
					background: rgba(255, 255, 255, 0.85);
				}
				@media (min-width: 576px) {
					.event-date-venue-tagline {
						font-size: 10.5px;
						letter-spacing: 0.16em;
					}
					.event-date-venue-bar {
						padding: 12px 20px;
						max-width: 560px;
					}
					.event-date-venue-bar .container {
						padding-left: 0;
						padding-right: 0;
					}
					.event-date-venue-inner {
						gap: 12px 20px;
						align-items: center;
					}
					.event-date-venue-item-venue {
						flex: 0 1 auto;
						min-width: 0;
						align-items: center;
					}
					.event-date-venue-item-venue .event-date-venue-icon {
						margin-top: 0;
					}
					.event-date-venue-item {
						gap: 8px;
					}
					.event-date-venue-icon {
						width: 32px;
						height: 32px;
						min-width: 32px;
					}
					.event-date-venue-icon i {
						font-size: 13px;
					}
					.event-date-venue-text {
						font-size: 12px;
					}
					.event-date-venue-divider {
						height: 24px;
						min-height: 24px;
					}
					.event-date-venue-cta {
						min-height: 36px;
						font-size: 11px;
						padding: 0 14px;
					}
				}
				@media (min-width: 992px) {
					.event-date-venue-tagline {
						font-size: 11px;
						margin-top: 12px;
						padding-top: 12px;
					}
					.event-date-venue-bar {
						padding: 14px 0;
						max-width: none;
						width: 100%;
						border-radius: 0;
					}
					.event-date-venue-bar .container {
						max-width: 1140px;
						margin: 0 auto;
						padding-left: 16px;
						padding-right: 16px;
					}
					.event-date-venue-inner {
						gap: 24px 48px;
						align-items: center;
						justify-content: center;
					}
					.event-date-venue-item {
						align-items: center;
						gap: 10px;
					}
					.event-date-venue-item-venue {
						align-items: center;
					}
					.event-date-venue-item-venue .event-date-venue-icon {
						flex-shrink: 0;
					}
					.event-date-venue-icon {
						width: 36px;
						height: 36px;
						min-width: 36px;
					}
					.event-date-venue-icon i {
						font-size: 15px;
					}
					.event-date-venue-text {
						font-size: 13px;
						line-height: 1.4;
					}
					.event-date-venue-divider {
						height: 28px;
						min-height: 28px;
						align-self: center;
					}
					.event-date-venue-cta {
						min-height: 38px;
						font-size: 12px;
					}
				}
				@media (max-width: 767px) {
					.event-date-venue-inner {
						flex-wrap: wrap;
						justify-content: center;
					}
					.event-date-venue-divider {
						display: none;
					}
				}
			`}</style>
		</section>
	)
}
