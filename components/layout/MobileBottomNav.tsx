'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
	{
		href: '/',
		label: 'Home',
		icon: 'fa-house',
		activeIcon: 'fa-house'
	},
	{
		href: '/award-categories',
		label: 'Awards',
		icon: 'fa-trophy',
		activeIcon: 'fa-trophy'
	},
	{
		href: '/partnerships',
		label: 'Partner',
		icon: 'fa-handshake',
		activeIcon: 'fa-handshake'
	},
	{
		href: '/contact',
		label: 'Contact',
		icon: 'fa-envelope',
		activeIcon: 'fa-envelope'
	}
]

export default function MobileBottomNav() {
	const pathname = usePathname()

	const isActive = (href: string) => {
		if (href === '/') {
			return pathname === '/'
		}
		return pathname?.startsWith(href)
	}

	return (
		<nav className="mobile-bottom-nav">
			<div className="mobile-bottom-nav-container">
				{navItems.map((item, index) => {
					const active = isActive(item.href)
					return (
						<Link
							key={index}
							href={item.href}
							className={`mobile-bottom-nav-item ${active ? 'active' : ''}`}
						>
							<div className="mobile-nav-icon-wrapper">
								<i className={`fa-solid ${active ? item.activeIcon : item.icon}`}></i>
								{active && <span className="mobile-nav-indicator"></span>}
							</div>
							<span className="mobile-nav-label">{item.label}</span>
						</Link>
					)
				})}
			</div>
		</nav>
	)
}
