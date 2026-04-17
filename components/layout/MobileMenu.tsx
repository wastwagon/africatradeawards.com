'use client'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import LogoutButton from '@/components/auth/LogoutButton'
import ColorModeToggle from '@/components/elements/ColorModeToggle'
import { useSiteConfig } from '@/components/site/SiteConfigProvider'
import { useAuthMe } from '@/hooks/useAuthMe'
import { defaultDashboardForRoleStr } from '@/lib/role-access'
import { isPlatformChromePath } from '@/lib/platform-paths'

export default function MobileMenu({ isMobileMenu, handleMobileMenu }: any) {
	const pathname = usePathname()
	const { mobileNavMetaLine, supportEmail, eventLiveStreamEnabled } = useSiteConfig()
	const { user: authUser, loading: authLoading } = useAuthMe()
	const supportMailHref = `mailto:${supportEmail}`
	const showThemeToggle = isPlatformChromePath(pathname)

	return (
		<>
			<div className="ata-mobile-bar">
				<div className="container-fluid">
					<div className="ata-mobile-bar__row">
						<div className="ata-mobile-bar__logo">
							<Link href="/">
								<Image src="/assets/img/logo/logo1.png?v=2" alt="Africa Trade Awards" width={160} height={48} />
							</Link>
						</div>
						<div className="ata-mobile-bar__actions">
							<Link
								href="/vote"
								className="ata-mobile-bar__cta"
								onClick={() => {
									if (isMobileMenu) handleMobileMenu?.()
								}}
							>
								Vote Now
							</Link>
							<button
								type="button"
								className="ata-mobile-bar__menu"
								onClick={handleMobileMenu}
								aria-expanded={isMobileMenu}
								aria-controls="ata-mobile-drawer"
								aria-label={isMobileMenu ? 'Close menu' : 'Open menu'}
							>
								<i className="fa-solid fa-bars-staggered" aria-hidden />
							</button>
						</div>
					</div>
				</div>
			</div>
			<div
				id="ata-mobile-drawer"
				className={`ata-mobile-drawer mobile-sidebar mobile-sidebar1 ${isMobileMenu ? 'mobile-menu-active' : ''}`}
				role="dialog"
				aria-modal="true"
				aria-label="Site navigation"
			>
				<div className="ata-mobile-drawer__head">
					<span className="ata-mobile-drawer__meta">{mobileNavMetaLine}</span>
					<button type="button" className="ata-mobile-drawer__close" onClick={handleMobileMenu} aria-label="Close menu">
						<i className="fa-solid fa-xmark" aria-hidden />
					</button>
				</div>
				<div className="ata-mobile-drawer__nav">
					<ul className="ata-mobile-drawer__list">
						<li>
							<Link href="/" className="ata-mobile-drawer__link" onClick={handleMobileMenu}>
								Home
							</Link>
						</li>
						<li>
							<Link href="/about" className="ata-mobile-drawer__link" onClick={handleMobileMenu}>
								About
							</Link>
						</li>
						<li className="ata-mobile-drawer__details-wrap">
							<details className="ata-mobile-drawer__details">
								<summary className="ata-mobile-drawer__summary">Explore</summary>
								<ul className="ata-mobile-drawer__sub">
									<li>
										<Link href="/awards-structure" onClick={handleMobileMenu}>
											Award categories
										</Link>
									</li>
									<li>
										<Link href="/awardees" onClick={handleMobileMenu}>
											Awardees
										</Link>
									</li>
									<li>
										<Link href="/sponsors-partners" onClick={handleMobileMenu}>
											Sponsors &amp; partners
										</Link>
									</li>
									<li>
										<Link href="/gallery" onClick={handleMobileMenu}>
											Gallery
										</Link>
									</li>
									<li>
										<Link href="/publications" onClick={handleMobileMenu}>
											Publications
										</Link>
									</li>
									<li>
										<Link href="/faq" onClick={handleMobileMenu}>
											FAQs
										</Link>
									</li>
									{eventLiveStreamEnabled ? (
										<li>
											<Link href="/live" onClick={handleMobileMenu}>
												Live stream
											</Link>
										</li>
									) : null}
								</ul>
							</details>
						</li>
						<li>
							<Link href="/contact" className="ata-mobile-drawer__link" onClick={handleMobileMenu}>
								Contact
							</Link>
						</li>
						<li className="ata-mobile-drawer__details-wrap">
							<details className="ata-mobile-drawer__details">
								<summary className="ata-mobile-drawer__summary">Account</summary>
								<ul className="ata-mobile-drawer__sub">
									<li>
										<Link href="/portal/entrant" onClick={handleMobileMenu}>
											Entrant portal
										</Link>
									</li>
									<li>
										<Link href="/portal/judge" onClick={handleMobileMenu}>
											Judge portal
										</Link>
									</li>
									<li>
										<Link href="/login/?next=/admin/" onClick={handleMobileMenu}>
											Staff admin
										</Link>
									</li>
								</ul>
							</details>
						</li>
					</ul>

					<div className="ata-mobile-drawer__footer">
						{showThemeToggle ? (
							<div className="ata-mobile-drawer__theme-row" aria-label="Appearance">
								<span className="ata-mobile-drawer__theme-label">Display</span>
								<ColorModeToggle />
							</div>
						) : null}
						<div
							className={`ata-mobile-drawer__ctas${authUser ? " ata-mobile-drawer__ctas--with-account" : ""}`}
						>
							{authLoading && !authUser ? (
								<span
									className="ata-mobile-drawer__btn-secondary ata-mobile-drawer__btn-account"
									aria-label="Loading account"
									aria-busy="true"
								>
									<i className="fa-solid fa-spinner fa-spin" aria-hidden />
									<span className="ata-mobile-drawer__btn-account-label">Loading…</span>
								</span>
							) : authUser ? (
								<div className="ata-mobile-drawer__account-row">
									<Link
										href={defaultDashboardForRoleStr(authUser.role)}
										className="ata-mobile-drawer__btn-secondary ata-mobile-drawer__btn-account"
										onClick={handleMobileMenu}
										aria-label={`Account — ${authUser.fullName}`}
										title={authUser.fullName}
									>
										<i className="fa-solid fa-circle-user" aria-hidden />
										<span className="ata-mobile-drawer__btn-account-label">Account</span>
									</Link>
									<LogoutButton
										className="ata-mobile-drawer__btn-secondary ata-mobile-drawer__btn-logout"
										onLoggedOut={handleMobileMenu}
									/>
								</div>
							) : (
								<Link href="/login/" className="ata-mobile-drawer__btn-secondary" onClick={handleMobileMenu}>
									Sign In
								</Link>
							)}
							<Link href="/vote" className="ata-mobile-drawer__btn-primary" onClick={handleMobileMenu}>
								Vote Now
							</Link>
						</div>
						<div className="ata-mobile-drawer__contact">
							<h3>Contact</h3>
							<p>
								<Link href={supportMailHref}>{supportEmail}</Link>
							</p>
							<p>
								<Link href="https://www.africatradeawards.com" target="_blank" rel="noopener noreferrer">
									www.africatradeawards.com
								</Link>
							</p>
						</div>
					</div>
				</div>
			</div>
			<style jsx global>{`
				/* Same breakpoint as .ata-nav2 — not Bootstrap utilities (see Header1). */
				.ata-mobile-bar {
					display: none !important;
				}
				@media (max-width: 991.98px) {
					.ata-mobile-bar {
						display: block !important;
						position: fixed;
						top: 0;
						left: 0;
						width: 100%;
						z-index: 10000;
						background: linear-gradient(
							135deg,
							rgba(21, 21, 47, 0.98) 0%,
							rgba(22, 21, 50, 0.96) 10%,
							rgba(22, 21, 50, 0.94) 20%,
							rgba(78, 43, 90, 0.92) 30%,
							rgba(78, 43, 90, 0.9) 40%,
							rgba(120, 80, 140, 0.88) 50%,
							rgba(120, 80, 140, 0.86) 60%,
							rgba(78, 43, 90, 0.88) 70%,
							rgba(22, 21, 50, 0.9) 80%,
							rgba(22, 21, 50, 0.92) 90%,
							rgba(21, 21, 47, 0.94) 100%
						) !important;
						-webkit-backdrop-filter: blur(20px);
						backdrop-filter: blur(20px);
						border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
						box-shadow: 0 4px 20px rgba(21, 21, 47, 0.2);
						padding-top: env(safe-area-inset-top);
					}
				}

				.ata-mobile-drawer.mobile-sidebar {
					z-index: 10050;
					padding: 0;
				}
				.ata-mobile-bar__row {
					display: flex;
					align-items: center;
					justify-content: space-between;
					padding: 10px 4px 12px;
					gap: 12px;
				}
				.ata-mobile-bar__logo img {
					height: 40px;
					width: auto;
					max-width: 150px;
					object-fit: contain;
					filter: drop-shadow(0 2px 12px rgba(0, 0, 0, 0.35));
				}
				.ata-mobile-bar__actions {
					display: flex;
					align-items: center;
					gap: 10px;
				}
				.ata-mobile-bar__cta {
					font-family: var(--grotesk), system-ui, sans-serif;
					font-size: 0.72rem;
					font-weight: 700;
					letter-spacing: 0.06em;
					text-transform: uppercase;
					color: #1a1222 !important;
					background: linear-gradient(135deg, #f4e4c8 0%, #e8c89a 100%);
					padding: 9px 16px;
					border-radius: 999px;
					text-decoration: none;
					box-shadow: 0 2px 12px rgba(232, 200, 154, 0.3);
				}
				.ata-mobile-bar__menu {
					width: 44px;
					height: 44px;
					border-radius: 12px;
					border: 1px solid rgba(255, 255, 255, 0.22);
					background: rgba(255, 255, 255, 0.08);
					color: rgba(255, 255, 255, 0.92);
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 18px;
					cursor: pointer;
					transition:
						border-color 0.2s,
						background 0.2s,
						color 0.2s;
				}

				.ata-mobile-bar__menu:hover {
					background: rgba(255, 255, 255, 0.14);
					border-color: rgba(255, 255, 255, 0.32);
				}

				.ata-mobile-drawer .ata-mobile-drawer__head {
					display: flex;
					align-items: center;
					justify-content: space-between;
					padding: 16px 18px;
					border-bottom: 1px solid rgba(255, 255, 255, 0.08);
					background: rgba(0, 0, 0, 0.15);
				}
				.ata-mobile-drawer__meta {
					font-family: var(--grotesk), system-ui, sans-serif;
					font-size: 0.65rem;
					font-weight: 600;
					letter-spacing: 0.12em;
					text-transform: uppercase;
					color: #e8c89a;
				}
				.ata-mobile-drawer__close {
					width: 40px;
					height: 40px;
					border: none;
					border-radius: 10px;
					background: rgba(255, 255, 255, 0.08);
					color: #fff;
					font-size: 20px;
					cursor: pointer;
				}
				.ata-mobile-drawer__nav {
					padding: 8px 16px 24px;
					overflow-y: auto;
					max-height: calc(100vh - 72px);
				}
				.ata-mobile-drawer__list {
					list-style: none;
					margin: 0;
					padding: 0;
				}
				.ata-mobile-drawer__link {
					display: block;
					padding: 14px 4px;
					font-family: var(--grotesk), system-ui, sans-serif;
					font-size: 0.85rem;
					font-weight: 600;
					letter-spacing: 0.06em;
					text-transform: uppercase;
					color: rgba(255, 255, 255, 0.92) !important;
					text-decoration: none;
					border-bottom: 1px solid rgba(255, 255, 255, 0.06);
				}
				.ata-mobile-drawer__details-wrap {
					border-bottom: 1px solid rgba(255, 255, 255, 0.06);
				}
				.ata-mobile-drawer__details {
					padding: 0;
				}
				.ata-mobile-drawer__summary {
					list-style: none;
					cursor: pointer;
					padding: 14px 4px;
					font-family: var(--grotesk), system-ui, sans-serif;
					font-size: 0.85rem;
					font-weight: 600;
					letter-spacing: 0.06em;
					text-transform: uppercase;
					color: rgba(255, 255, 255, 0.92);
					display: flex;
					align-items: center;
					justify-content: space-between;
				}
				.ata-mobile-drawer__summary::-webkit-details-marker {
					display: none;
				}
				.ata-mobile-drawer__summary::after {
					content: '';
					width: 8px;
					height: 8px;
					border-right: 2px solid rgba(255, 255, 255, 0.5);
					border-bottom: 2px solid rgba(255, 255, 255, 0.5);
					transform: rotate(45deg);
					margin-right: 6px;
					transition: transform 0.2s;
				}
				.ata-mobile-drawer__details[open] .ata-mobile-drawer__summary::after {
					transform: rotate(225deg);
					margin-top: 4px;
				}
				.ata-mobile-drawer__sub {
					list-style: none;
					margin: 0 0 8px;
					padding: 0 0 0 8px;
				}
				.ata-mobile-drawer__sub li a {
					display: block;
					padding: 10px 8px;
					font-family: var(--figtree), system-ui, sans-serif;
					font-size: 0.95rem;
					font-weight: 500;
					color: rgba(255, 255, 255, 0.78) !important;
					text-decoration: none;
					border-radius: 8px;
				}
				.ata-mobile-drawer__sub li a:hover {
					background: rgba(255, 255, 255, 0.06);
					color: #fff !important;
				}
				.ata-mobile-drawer__theme-row {
					display: flex;
					align-items: center;
					justify-content: space-between;
					gap: 12px;
					margin-bottom: 16px;
					padding: 12px 14px;
					border-radius: 12px;
					background: rgba(255, 255, 255, 0.06);
					border: 1px solid rgba(255, 255, 255, 0.1);
				}
				.ata-mobile-drawer__theme-label {
					font-family: var(--grotesk), system-ui, sans-serif;
					font-size: 0.72rem;
					font-weight: 700;
					letter-spacing: 0.1em;
					text-transform: uppercase;
					color: rgba(255, 255, 255, 0.72);
				}

				.ata-mobile-drawer__footer {
					margin-top: 20px;
					padding-top: 20px;
					border-top: 1px solid rgba(255, 255, 255, 0.1);
				}
				.ata-mobile-drawer__ctas {
					display: flex;
					gap: 10px;
					margin-bottom: 22px;
				}
				.ata-mobile-drawer__ctas--with-account {
					flex-direction: column;
					align-items: stretch;
				}
				.ata-mobile-drawer__account-row {
					display: flex;
					gap: 10px;
					width: 100%;
				}
				.ata-mobile-drawer__account-row > .ata-mobile-drawer__btn-account {
					flex: 1;
					min-width: 0;
				}
				.ata-mobile-drawer__btn-logout {
					flex: 0 0 auto;
					min-width: 108px;
					background: transparent;
					cursor: pointer;
				}
				.ata-mobile-drawer__btn-logout:disabled {
					opacity: 0.75;
					cursor: wait;
				}
				.ata-mobile-drawer__btn-secondary {
					flex: 1;
					text-align: center;
					padding: 12px;
					border-radius: 999px;
					border: 1px solid rgba(255, 255, 255, 0.35);
					font-family: var(--grotesk), system-ui, sans-serif;
					font-size: 0.75rem;
					font-weight: 700;
					letter-spacing: 0.05em;
					text-transform: uppercase;
					color: #fff !important;
					text-decoration: none;
				}
				.ata-mobile-drawer__btn-account {
					display: inline-flex;
					align-items: center;
					justify-content: center;
					gap: 8px;
				}
				.ata-mobile-drawer__btn-account i {
					font-size: 1.15rem;
				}
				.ata-mobile-drawer__btn-account-label {
					text-transform: none;
					font-weight: 600;
					letter-spacing: 0.02em;
				}
				.ata-mobile-drawer__btn-primary {
					flex: 1;
					text-align: center;
					padding: 12px;
					border-radius: 999px;
					background: linear-gradient(135deg, #f4e4c8 0%, #e8c89a 100%);
					font-family: var(--grotesk), system-ui, sans-serif;
					font-size: 0.75rem;
					font-weight: 700;
					letter-spacing: 0.05em;
					text-transform: uppercase;
					color: #1a1222 !important;
					text-decoration: none;
					box-shadow: 0 4px 16px rgba(232, 200, 154, 0.25);
				}
				.ata-mobile-drawer__contact h3 {
					font-family: var(--grotesk), system-ui, sans-serif;
					font-size: 0.7rem;
					font-weight: 700;
					letter-spacing: 0.12em;
					text-transform: uppercase;
					margin-bottom: 10px;
					color: rgba(255, 255, 255, 0.5);
				}
				.ata-mobile-drawer__contact p {
					margin: 0 0 8px;
					font-size: 0.9rem;
				}
				.ata-mobile-drawer__contact a {
					color: rgba(255, 255, 255, 0.85) !important;
				}
			`}</style>
		</>
	)
}
