'use client'

import { useLayoutEffect } from 'react'

const READY_CLASS = 'styles-loaded'

function loadLink(link: HTMLLinkElement): Promise<void> {
	return new Promise((resolve) => {
		try {
			if (link.sheet != null) {
				resolve()
				return
			}
		} catch {
			/* cross-origin sheet access */
		}
		link.addEventListener('load', () => resolve(), { once: true })
		link.addEventListener('error', () => resolve(), { once: true })
	})
}

/**
 * Wait until stylesheet `<link>`s have settled (including ones Next injects after first paint).
 */
function watchStylesheetsSettled(): { promise: Promise<void>; abort: () => void } {
	const handled = new WeakSet<HTMLLinkElement>()

	const collectNew = (): Promise<void>[] => {
		const out: Promise<void>[] = []
		for (const el of document.querySelectorAll('link[rel="stylesheet"]')) {
			const link = el as HTMLLinkElement
			if (handled.has(link)) continue
			handled.add(link)
			out.push(loadLink(link))
		}
		return out
	}

	let settleTimer: ReturnType<typeof setTimeout> | undefined
	let maxTimer: ReturnType<typeof setTimeout> | undefined
	let mo: MutationObserver | undefined
	let settled = false

	const cleanup = () => {
		if (settleTimer !== undefined) clearTimeout(settleTimer)
		if (maxTimer !== undefined) clearTimeout(maxTimer)
		mo?.disconnect()
		mo = undefined
	}

	let resolvePromise!: () => void
	const promise = new Promise<void>((resolve) => {
		resolvePromise = () => {
			if (settled) return
			settled = true
			cleanup()
			resolve()
		}

		const bump = async () => {
			if (settled) return
			await Promise.all(collectNew())
			if (settled) return
			if (settleTimer !== undefined) clearTimeout(settleTimer)
			settleTimer = setTimeout(() => resolvePromise(), 100)
		}

		void bump()
		mo = new MutationObserver(() => {
			void bump()
		})
		mo.observe(document.documentElement, { childList: true, subtree: true })

		maxTimer = setTimeout(() => resolvePromise(), 2500)
	})

	const abort = () => resolvePromise()

	return { promise, abort }
}

/**
 * Reduces FOUC when vendor `<link>` CSS and Next-bundled CSS (globals/Swiper) land at different times.
 */
export default function StylesLoadedGate() {
	useLayoutEffect(() => {
		let cancelled = false
		const { promise: sheetsSettled, abort } = watchStylesheetsSettled()

		const markReady = () => {
			if (cancelled) return
			document.documentElement.classList.add(READY_CLASS)
		}

		const waitPaint = () =>
			new Promise<void>((resolve) => {
				requestAnimationFrame(() => {
					requestAnimationFrame(() => resolve())
				})
			})

		void (async () => {
			await sheetsSettled
			if (cancelled) return
			await waitPaint()
			if (cancelled) return
			markReady()
		})()

		const fallback = setTimeout(markReady, 2000)
		return () => {
			cancelled = true
			abort()
			clearTimeout(fallback)
		}
	}, [])

	return null
}
