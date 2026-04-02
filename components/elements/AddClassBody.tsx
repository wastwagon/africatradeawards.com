'use client'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

/** Scroll to top on client navigations; body class comes from root layout. */
export default function AddClassBody() {
	const pathname = usePathname()

	useEffect(() => {
		window.scrollTo({
			top: 0,
			left: 0,
			behavior: 'smooth',
		})
	}, [pathname])

	return null
}
