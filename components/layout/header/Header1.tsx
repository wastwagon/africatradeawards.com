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

type Header1Props = {
	scroll?: boolean
	isMobileMenu?: boolean
	handleMobileMenu?: () => void
	isSearch?: boolean
	handleSearch?: () => void
}

/**
 * Sticky bar styled like theme `.header-area.homepage1.sticky`: purple gradient, blur, light nav.
 * Streamlined IA: Home, About, Explore ▼, Contact, Account ▼, Sign In + Vote Now.
 */
export default function Header1({ scroll }: Header1Props) {
	const pathname = usePathname()
	const scrolled = Boolean(scroll)
	const { headerDateLine, headerVenueLine, eventLiveStreamEnabled } = useSiteConfig()
	const { user: authUser, loading: authLoading } = useAuthMe()

	const isActive = (href: string) => {
		if (href === '/') return pathname === '/' || pathname === ''
		const base = href.replace(/\/$/, '')
		return pathname === base || pathname?.startsWith(`${base}/`)
	}

	const exploreActive =
		isActive('/awards-structure') ||
		isActive('/awardees') ||
		isActive('/sponsors-partners') ||
		isActive('/gallery') ||
		isActive('/publications') ||
		isActive('/faq') ||
		(eventLiveStreamEnabled && isActive('/live'))

	const accountActive =
		isActive('/login') || isActive('/portal') || isActive('/admin')

	const headerClass = ['ata-nav2', scrolled ? 'ata-nav2--elevated' : ''].filter(Boolean).join(' ')

	return (
		<>
			<header className={headerClass} id="header" role="banner">
				<div className="ata-nav2__meta">
					<span className="ata-nav2__meta-item">{headerDateLine}</span>
					<span className="ata-nav2__meta-dot" aria-hidden />
					<span className="ata-nav2__meta-item">{headerVenueLine}</span>
				</div>

				<div className="container ata-nav2__inner">
					<Link href="/" className="ata-nav2__logo" aria-label="Africa Trade Awards home">
						<Image src="/assets/img/logo/logo1.png?v=2" alt="Africa Trade Awards" width={180} height={54} />
					</Link>

					<nav className="ata-nav2__nav" aria-label="Primary navigation">
						<ul className="ata-nav2__list">
							<li className={isActive('/') ? 'is-active' : ''}>
								<Link href="/">Home</Link>
							</li>
							<li className={isActive('/about') ? 'is-active' : ''}>
								<Link href="/about">About</Link>
							</li>
							<li className={`ata-nav2__has-menu${exploreActive ? ' is-active' : ''}`}>
								<button type="button" className="ata-nav2__menu-btn">
									Explore
									<i className="fa-solid fa-chevron-down" aria-hidden />
								</button>
								<div className="ata-nav2__panel" role="menu">
									<ul className="ata-nav2__panel-list">
										<li>
											<Link href="/awards-structure">Award categories</Link>
										</li>
										<li>
											<Link href="/awardees">Awardees</Link>
										</li>
										<li>
											<Link href="/sponsors-partners">Sponsors &amp; partners</Link>
										</li>
										<li>
											<Link href="/gallery">Gallery</Link>
										</li>
										<li>
											<Link href="/publications">Publications</Link>
										</li>
										<li>
											<Link href="/faq">FAQs</Link>
										</li>
										{eventLiveStreamEnabled ? (
											<li>
												<Link href="/live">Live stream</Link>
											</li>
										) : null}
									</ul>
								</div>
							</li>
							<li className={isActive('/contact') ? 'is-active' : ''}>
								<Link href="/contact">Contact</Link>
							</li>
							<li className={`ata-nav2__has-menu${accountActive ? ' is-active' : ''}`}>
								<button type="button" className="ata-nav2__menu-btn">
									Account
									<i className="fa-solid fa-chevron-down" aria-hidden />
								</button>
								<div className="ata-nav2__panel ata-nav2__panel--end" role="menu">
									<ul className="ata-nav2__panel-list">
										<li>
											<Link href="/portal/entrant">Entrant portal</Link>
										</li>
										<li>
											<Link href="/portal/judge">Judge portal</Link>
										</li>
										<li>
											<Link href="/login/?next=/admin/">Staff admin</Link>
										</li>
									</ul>
								</div>
							</li>
						</ul>
					</nav>

					<div className="ata-nav2__actions">
						{isPlatformChromePath(pathname) ? <ColorModeToggle /> : null}
						<div className="ata-nav2__social" aria-label="Social links">
							<a
								href="https://www.facebook.com/AfricaTradeChamber"
								target="_blank"
								rel="noopener noreferrer"
								aria-label="Facebook"
							>
								<i className="fa-brands fa-facebook-f" />
							</a>
							<a
								href="https://www.instagram.com/AfricaTradeChamber"
								target="_blank"
								rel="noopener noreferrer"
								aria-label="Instagram"
							>
								<i className="fa-brands fa-instagram" />
							</a>
							<a
								href="https://www.linkedin.com/company/AfricaTradeChamber"
								target="_blank"
								rel="noopener noreferrer"
								aria-label="LinkedIn"
							>
								<i className="fa-brands fa-linkedin-in" />
							</a>
						</div>
						{authLoading && !authUser ? (
							<span
								className="ata-nav2__ghost ata-nav2__account-icon"
								aria-label="Loading account"
								aria-busy="true"
							>
								<i className="fa-solid fa-spinner fa-spin" aria-hidden />
							</span>
						) : authUser ? (
							<span className="ata-nav2__account-actions">
								<Link
									href={defaultDashboardForRoleStr(authUser.role)}
									className="ata-nav2__ghost ata-nav2__account-icon"
									aria-label={`Account — ${authUser.fullName}`}
									title={authUser.fullName}
								>
									<i className="fa-solid fa-circle-user" aria-hidden />
								</Link>
								<LogoutButton className="ata-nav2__ghost ata-nav2__logout-label">Log out</LogoutButton>
							</span>
						) : (
							<Link href="/login/" className="ata-nav2__ghost">
								Sign In
							</Link>
						)}
						{eventLiveStreamEnabled ? (
							<Link href="/live" className="ata-nav2__ghost">
								Live
							</Link>
						) : null}
						<Link href="/vote" className="ata-nav2__cta">
							Vote Now
						</Link>
					</div>
				</div>
			</header>

			<div className="ata-nav2__spacer ata-nav2__spacer--mobile" aria-hidden />

			<style jsx global>{`
				/* Matches _menu-1.scss .header-area.homepage1.sticky (sticky menu look). */
				.ata-nav2 {
					display: none !important;
					--nav2-fg: rgba(255, 255, 255, 0.92);
					--nav2-fg-soft: rgba(255, 255, 255, 0.78);
					--nav2-accent: #e8c89a;
					--nav2-meta-bg: rgba(0, 0, 0, 0.22);
					--nav2-pill-bg: rgba(255, 255, 255, 0.1);
					--nav2-pill-border: rgba(255, 255, 255, 0.22);

					position: sticky;
					top: 0;
					left: 0;
					width: 100%;
					z-index: 9999;
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
					);
					-webkit-backdrop-filter: blur(20px);
					backdrop-filter: blur(20px);
					border-bottom: 1px solid rgba(255, 255, 255, 0.08);
					box-shadow: 0 4px 20px rgba(21, 21, 47, 0.2);
					transition:
						box-shadow 0.35s ease,
						border-color 0.35s ease;
				}
				@media (min-width: 992px) {
					.ata-nav2 {
						display: block !important;
					}
				}

				.ata-nav2--elevated {
					box-shadow:
						0 12px 40px rgba(0, 0, 0, 0.35),
						0 4px 24px rgba(21, 21, 47, 0.35);
					border-bottom-color: rgba(255, 255, 255, 0.12);
				}

				.ata-nav2__meta {
					display: flex;
					align-items: center;
					justify-content: center;
					gap: 10px;
					flex-wrap: wrap;
					padding: 7px 16px;
					font-family: var(--grotesk), system-ui, sans-serif;
					font-size: 0.65rem;
					font-weight: 600;
					letter-spacing: 0.12em;
					text-transform: uppercase;
					color: var(--nav2-accent);
					background: var(--nav2-meta-bg);
					border-bottom: 1px solid rgba(255, 255, 255, 0.06);
				}

				.ata-nav2__meta-dot {
					width: 4px;
					height: 4px;
					border-radius: 50%;
					background: var(--nav2-accent);
					opacity: 0.75;
				}

				.ata-nav2__inner {
					display: flex;
					align-items: center;
					justify-content: space-between;
					gap: 16px;
					padding: 11px 12px 14px;
					max-width: 1320px;
				}

				.ata-nav2__logo img {
					display: block;
					height: 46px;
					width: auto;
					max-width: 176px;
					object-fit: contain;
					filter: drop-shadow(0 2px 14px rgba(0, 0, 0, 0.35));
				}

				.ata-nav2__nav {
					flex: 1;
					display: flex;
					justify-content: center;
					min-width: 0;
				}

				.ata-nav2__list {
					display: flex;
					align-items: center;
					gap: 2px;
					list-style: none;
					margin: 0;
					padding: 0;
				}

				.ata-nav2__list > li > a,
				.ata-nav2__menu-btn {
					font-family: var(--grotesk), system-ui, sans-serif;
					font-size: 0.78rem;
					font-weight: 600;
					letter-spacing: 0.05em;
					text-transform: uppercase;
					color: var(--nav2-fg);
					text-decoration: none;
					padding: 9px 12px;
					border-radius: 999px;
					border: none;
					background: transparent;
					cursor: pointer;
					display: inline-flex;
					align-items: center;
					gap: 5px;
					transition:
						color 0.18s,
						background 0.18s;
					white-space: nowrap;
				}

				.ata-nav2__menu-btn i {
					font-size: 8px;
					opacity: 0.8;
				}

				.ata-nav2__list > li > a:hover,
				.ata-nav2__menu-btn:hover {
					background: rgba(255, 255, 255, 0.1);
					color: #fff;
				}

				.ata-nav2__list > li.is-active > a,
				.ata-nav2__list > li.is-active .ata-nav2__menu-btn {
					background: rgba(255, 255, 255, 0.14);
					color: #fff;
				}

				.ata-nav2__has-menu {
					position: relative;
				}

				.ata-nav2__panel {
					position: absolute;
					top: calc(100% + 5px);
					left: 0;
					min-width: 240px;
					padding: 6px;
					margin: 0;
					background: #fff;
					border-radius: 12px;
					box-shadow:
						0 18px 44px rgba(30, 18, 40, 0.12),
						0 0 0 1px rgba(120, 80, 140, 0.1);
					opacity: 0;
					visibility: hidden;
					transform: translateY(6px);
					transition:
						opacity 0.18s ease,
						transform 0.18s ease,
						visibility 0.18s;
					z-index: 10020;
				}

				.ata-nav2__panel--end {
					left: auto;
					right: 0;
				}

				.ata-nav2__has-menu:hover .ata-nav2__panel,
				.ata-nav2__has-menu:focus-within .ata-nav2__panel {
					opacity: 1;
					visibility: visible;
					transform: translateY(0);
				}

				.ata-nav2__panel-list {
					list-style: none;
					margin: 0;
					padding: 0;
				}

				.ata-nav2__panel-list a {
					display: block;
					padding: 10px 12px;
					border-radius: 8px;
					font-family: var(--figtree), system-ui, sans-serif;
					font-size: 0.88rem;
					font-weight: 500;
					color: #2d2340;
					text-decoration: none;
					transition: background 0.14s;
				}

				.ata-nav2__panel-list a:hover {
					background: rgba(107, 64, 144, 0.1);
					color: #4e2b5a;
				}

				.ata-nav2__actions {
					display: flex;
					align-items: center;
					gap: 8px;
					flex-shrink: 0;
				}

				.ata-nav2__social {
					display: flex;
					align-items: center;
					gap: 5px;
					margin-right: 2px;
				}

				.ata-nav2__social a {
					width: 32px;
					height: 32px;
					display: flex;
					align-items: center;
					justify-content: center;
					border-radius: 50%;
					font-size: 12px;
					color: var(--nav2-fg-soft);
					background: rgba(255, 255, 255, 0.06);
					border: 1px solid rgba(255, 255, 255, 0.22);
					transition:
						background 0.18s,
						color 0.18s,
						border-color 0.18s;
				}

				.ata-nav2__social a:hover {
					color: #fff;
					background: rgba(255, 255, 255, 0.14);
					border-color: rgba(255, 255, 255, 0.28);
				}

				.ata-nav2__theme {
					flex-shrink: 0;
					width: 40px;
					height: 40px;
					display: flex;
					align-items: center;
					justify-content: center;
					border-radius: 10px;
					border: 1px solid rgba(255, 255, 255, 0.22);
					background: rgba(255, 255, 255, 0.08);
					color: var(--nav2-fg);
					cursor: pointer;
					transition:
						background 0.18s,
						border-color 0.18s,
						color 0.18s;
				}

				.ata-nav2__theme:hover {
					background: rgba(255, 255, 255, 0.14);
					border-color: rgba(255, 255, 255, 0.32);
				}

				.ata-nav2__theme:focus-visible {
					outline: 2px solid var(--nav2-accent);
					outline-offset: 2px;
				}

				.ata-nav2__account-actions {
					display: inline-flex;
					align-items: center;
					gap: 6px;
				}

				.ata-nav2__ghost {
					font-family: var(--grotesk), system-ui, sans-serif;
					font-size: 0.74rem;
					font-weight: 700;
					letter-spacing: 0.05em;
					text-transform: uppercase;
					color: rgba(255, 255, 255, 0.95) !important;
					text-decoration: none;
					padding: 9px 15px;
					border-radius: 999px;
					border: 1px solid rgba(255, 255, 255, 0.38);
					transition: background 0.2s;
				}

				button.ata-nav2__ghost {
					background: transparent;
					cursor: pointer;
				}

				button.ata-nav2__ghost:disabled {
					opacity: 0.7;
					cursor: wait;
				}

				.ata-nav2__ghost:hover {
					background: rgba(255, 255, 255, 0.1);
					border-color: rgba(255, 255, 255, 0.5);
				}

				.ata-nav2__logout-label {
					white-space: nowrap;
				}

				.ata-nav2__account-icon {
					display: inline-flex;
					align-items: center;
					justify-content: center;
					min-width: 42px;
					padding-left: 12px;
					padding-right: 12px;
					font-size: 1.25rem;
					line-height: 1;
				}

				.ata-nav2__cta {
					font-family: var(--grotesk), system-ui, sans-serif;
					font-size: 0.74rem;
					font-weight: 700;
					letter-spacing: 0.07em;
					text-transform: uppercase;
					color: #1a1222 !important;
					background: linear-gradient(135deg, #f4e4c8 0%, #e8c89a 45%, #dfb07a 100%);
					text-decoration: none;
					padding: 10px 19px;
					border-radius: 999px;
					box-shadow: 0 4px 18px rgba(232, 200, 154, 0.32);
					transition:
						transform 0.18s,
						box-shadow 0.18s;
				}

				.ata-nav2__cta:hover {
					transform: translateY(-1px);
					box-shadow: 0 7px 26px rgba(232, 200, 154, 0.42);
					color: #1a1222 !important;
				}

				.ata-nav2__spacer--mobile {
					display: none !important;
				}
				@media (max-width: 991.98px) {
					.ata-nav2__spacer--mobile {
						display: block !important;
						height: 58px;
						padding-top: env(safe-area-inset-top);
					}
				}

				@media (min-width: 992px) and (max-width: 1199px) {
					.ata-nav2__list > li > a,
					.ata-nav2__menu-btn {
						padding: 9px 8px;
						font-size: 0.72rem;
					}
					.ata-nav2__actions .ata-nav2__social {
						display: none;
					}
				}
			`}</style>
		</>
	)
}
