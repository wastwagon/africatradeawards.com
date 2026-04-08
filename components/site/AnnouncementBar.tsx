'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSiteConfig } from '@/components/site/SiteConfigProvider'

function hashSnippet(s: string): string {
	let h = 0
	for (let i = 0; i < s.length; i++) {
		h = (Math.imul(31, h) + s.charCodeAt(i)) | 0
	}
	return String(h)
}

export default function AnnouncementBar() {
	const pathname = usePathname()
	const {
		announcementEnabled,
		announcementText,
		announcementLinkUrl,
		announcementLinkLabel,
	} = useSiteConfig()

	const storageKey = useMemo(() => {
		const t = announcementText.trim().slice(0, 120)
		return t ? `ata-announce-${hashSnippet(t)}` : ''
	}, [announcementText])

	const [dismissed, setDismissed] = useState(false)

	const visible =
		announcementEnabled &&
		announcementText.trim().length > 0 &&
		!pathname?.startsWith('/admin') &&
		!dismissed

	const onDismiss = useCallback(() => {
		if (storageKey && typeof window !== 'undefined') {
			try {
				sessionStorage.setItem(storageKey, '1')
			} catch {
				/* ignore */
			}
		}
		setDismissed(true)
	}, [storageKey])

	useEffect(() => {
		if (!storageKey) return
		try {
			if (sessionStorage.getItem(storageKey) === '1') {
				setDismissed(true)
			}
		} catch {
			/* ignore */
		}
	}, [storageKey])

	if (!visible) return null

	const hasLink = Boolean(announcementLinkUrl.trim())

	return (
		<div className="ata-announcement" role="region" aria-label="Site notice">
			<div className="ata-announcement__inner">
				<p className="ata-announcement__text">{announcementText.trim()}</p>
				<div className="ata-announcement__actions">
					{hasLink ? (
						<Link
							href={announcementLinkUrl.trim()}
							className="ata-announcement__link"
						>
							{announcementLinkLabel.trim() || 'Learn more'}
						</Link>
					) : null}
					<button type="button" className="ata-announcement__dismiss" onClick={onDismiss} aria-label="Dismiss notice">
						<i className="fa-solid fa-xmark" aria-hidden />
					</button>
				</div>
			</div>
		</div>
	)
}
