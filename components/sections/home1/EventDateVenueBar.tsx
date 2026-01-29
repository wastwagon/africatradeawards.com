'use client'

export default function EventDateVenueBar() {
	return (
		<section className="event-date-venue-bar" data-aos="fade-in" data-aos-duration={600}>
			<div className="container">
				<div className="event-date-venue-inner">
					<div className="event-date-venue-item">
						<div className="event-date-venue-icon">
							<i className="fa-solid fa-calendar-days" aria-hidden="true" />
						</div>
						<span className="event-date-venue-text">29th January 2026</span>
					</div>
					<div className="event-date-venue-divider" aria-hidden="true" />
					<div className="event-date-venue-item event-date-venue-item-venue">
						<div className="event-date-venue-icon">
							<i className="fa-solid fa-location-dot" aria-hidden="true" />
						</div>
						<span className="event-date-venue-text">Kempinski Gold Coast City Hotel, Accra-Ghana</span>
					</div>
				</div>
			</div>
			<style jsx>{`
				.event-date-venue-bar {
					background: linear-gradient(
						90deg,
						#e8e8ec 0%,
						#e0e0e6 20%,
						#d8d8e0 40%,
						#d2d2dc 60%,
						#d6d6e0 80%,
						#dcdce4 100%
					);
					box-shadow:
						inset 0 1px 0 rgba(255, 255, 255, 0.6),
						inset 0 -1px 0 rgba(0, 0, 0, 0.06),
						0 2px 8px rgba(0, 0, 0, 0.06);
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
				@media (min-width: 576px) {
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
				}
				@media (min-width: 992px) {
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
				}
			`}</style>
		</section>
	)
}
