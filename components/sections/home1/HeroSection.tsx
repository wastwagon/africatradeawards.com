'use client'
import Link from 'next/link'
import { useEffect, useRef } from 'react'

export default function HeroSection() {
	const videoRef = useRef<HTMLVideoElement>(null)

	useEffect(() => {
		// Ensure video autoplays on mount
		const video = videoRef.current
		if (video) {
			video.play().catch((error) => {
				// Handle autoplay policy restrictions
				console.warn('Video autoplay failed:', error)
			})
		}
	}, [])

	return (
		<section className="hero1-section-area" 
			style={{ 
				minHeight: '85vh', 
				display: 'flex', 
				alignItems: 'center', 
				position: 'relative',
				overflow: 'hidden'
			}}>
			
			{/* Video Background */}
			<video
				ref={videoRef}
				autoPlay
				loop
				muted
				playsInline
				preload="auto"
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					width: '100%',
					height: '100%',
					objectFit: 'cover',
					zIndex: 0
				}}
			>
				<source src="/assets/video/hero-video.mp4" type="video/mp4" />
			</video>
			
			
		</section>
	)
}

