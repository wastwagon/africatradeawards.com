'use client'

import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'ata-theme'

function resolvedMode(): 'light' | 'dark' {
	if (typeof window === 'undefined') return 'light'
	const v = localStorage.getItem(STORAGE_KEY)
	if (v === 'light' || v === 'dark') return v
	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyToDocument(mode: 'light' | 'dark') {
	document.documentElement.classList.toggle('ata-dark-mode', mode === 'dark')
}

export default function ColorModeToggle() {
	const [mode, setMode] = useState<'light' | 'dark'>('light')
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMode(resolvedMode())
		setMounted(true)
	}, [])

	useEffect(() => {
		if (!mounted) return
		applyToDocument(mode)
		localStorage.setItem(STORAGE_KEY, mode)
	}, [mode, mounted])

	const toggle = useCallback(() => {
		setMode((m) => (m === 'dark' ? 'light' : 'dark'))
	}, [])

	return (
		<button
			type="button"
			className="ata-nav2__theme"
			onClick={toggle}
			aria-label={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
			aria-pressed={mode === 'dark'}
		>
			<i className={mode === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon'} aria-hidden />
		</button>
	)
}
