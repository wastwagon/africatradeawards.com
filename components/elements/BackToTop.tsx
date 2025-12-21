'use client'
import { useEffect, useState } from "react"

export default function BackToTop({ target }: any) {
	const [hasScrolled, setHasScrolled] = useState(false)
	const [scrollProgress, setScrollProgress] = useState(0)

	useEffect(() => {
		const onScroll = () => {
			const scrollY = window.scrollY
			const windowHeight = window.innerHeight
			const documentHeight = document.documentElement.scrollHeight
			const scrollableHeight = documentHeight - windowHeight
			
			setHasScrolled(scrollY > 100)
			
			// Calculate scroll progress percentage
			const progress = scrollableHeight > 0 ? (scrollY / scrollableHeight) * 100 : 0
			setScrollProgress(Math.min(progress, 100))
		}

		window.addEventListener("scroll", onScroll)
		return () => window.removeEventListener("scroll", onScroll)
	}, [])

	const handleClick = () => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth'
		})
	}

	return (
		<>
			{hasScrolled && (
				<button 
					className="back-to-top-btn show" 
					onClick={handleClick}
					aria-label="Back to top"
				>
					<div className="back-to-top-icon-wrapper">
						<i className="fa-solid fa-arrow-up"></i>
					</div>
					<div className="back-to-top-progress-ring">
						<svg className="progress-ring" width="60" height="60">
							<circle
								className="progress-ring-circle"
								stroke="rgba(255, 255, 255, 0.4)"
								strokeWidth="2.5"
								fill="transparent"
								r="26"
								cx="30"
								cy="30"
								style={{
									strokeDasharray: `${2 * Math.PI * 26}`,
									strokeDashoffset: `${2 * Math.PI * 26 * (1 - scrollProgress / 100)}`,
									transition: 'stroke-dashoffset 0.1s ease-out'
								}}
							/>
						</svg>
					</div>
				</button>
			)}
		</>
	)
}
