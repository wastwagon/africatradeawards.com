'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import Image from 'next/image'

interface GallerySliderProps {
	images: string[]
	alt?: string
	autoplayMs?: number
	className?: string
	showCounter?: boolean
	transition?: 'instant' | 'fade'
}

export default function GallerySlider({ images, alt = 'Gallery', autoplayMs = 0, className = '', showCounter = true, transition = 'instant' }: GallerySliderProps) {
	const [activeIndex, setActiveIndex] = useState(0)
	const dotsRef = useRef<HTMLDivElement>(null)
	const thumbsRef = useRef<HTMLDivElement>(null)

	const goPrev = useCallback(() => {
		setActiveIndex((i) => (i - 1 + images.length) % images.length)
	}, [images.length])

	const goNext = useCallback(() => {
		setActiveIndex((i) => (i + 1) % images.length)
	}, [images.length])

	const goTo = useCallback((index: number) => {
		setActiveIndex(index)
	}, [])

	useEffect(() => {
		if (autoplayMs <= 0) return
		const t = setInterval(goNext, autoplayMs)
		return () => clearInterval(t)
	}, [autoplayMs, goNext])

	// Scroll active dot/thumb within their containers only (do not scroll the page)
	useEffect(() => {
		const scrollToActive = (container: HTMLDivElement | null, index: number, itemWidth: number, gap: number) => {
			if (!container) return
			const scrollLeft = index * (itemWidth + gap) - container.clientWidth / 2 + itemWidth / 2
			container.scrollTo({ left: Math.max(0, scrollLeft), behavior: 'smooth' })
		}
		scrollToActive(thumbsRef.current, activeIndex, 72 + 10, 10) // thumb width + gap from CSS
		scrollToActive(dotsRef.current, activeIndex, 8 + 5, 5) // dot width + gap from CSS
	}, [activeIndex])

	if (!images.length) return null

	const activeSrc = images[activeIndex]

	return (
		<div className={`gallery-slider ${className}`}>
			<div className="gallery-slider-main">
				<button
					type="button"
					className="gallery-slider-nav gallery-slider-prev"
					onClick={goPrev}
					aria-label="Previous image"
				>
					<i className="fa-solid fa-chevron-left" />
				</button>

				{/* Hero: image shown in full (contain), no crop */}
				<div className="gallery-slider-hero">
					<div className={`gallery-slider-hero-inner ${transition === 'fade' ? 'gallery-slider-fade' : ''}`} key={activeIndex}>
						<Image
							src={activeSrc}
							alt={`${alt} ${activeIndex + 1}`}
							width={1200}
							height={800}
							sizes="(max-width: 768px) 100vw, 80vw"
							className="gallery-slider-hero-img"
							priority={activeIndex === 0}
						/>
					</div>
				</div>

				<button
					type="button"
					className="gallery-slider-nav gallery-slider-next"
					onClick={goNext}
					aria-label="Next image"
				>
					<i className="fa-solid fa-chevron-right" />
				</button>
			</div>

			{/* All thumbnails: horizontal scrollable strip of every image */}
			<div className="gallery-slider-all-thumbs" ref={thumbsRef}>
				{images.map((src, idx) => (
					<button
						key={idx}
						type="button"
						data-index={idx}
						className={`gallery-slider-thumb ${idx === activeIndex ? 'active' : ''}`}
						onClick={() => goTo(idx)}
						aria-label={`View image ${idx + 1}`}
					>
						<Image
							src={src}
							alt=""
							width={120}
							height={80}
							className="gallery-slider-thumb-img"
						/>
					</button>
				))}
			</div>

			{/* All dots: one per image, scrollable */}
			<div className="gallery-slider-footer">
				<div className="gallery-slider-dots" ref={dotsRef}>
					{images.map((_, i) => (
						<button
							key={i}
							type="button"
							data-index={i}
							className={`gallery-slider-dot ${i === activeIndex ? 'active' : ''}`}
							onClick={() => goTo(i)}
							aria-label={`Go to image ${i + 1}`}
						/>
					))}
				</div>
				{showCounter && <span className="gallery-slider-counter">{activeIndex + 1} / {images.length}</span>}
			</div>

			<style jsx>{`
				.gallery-slider {
					--gallery-nav-size: 52px;
				}
				.gallery-slider-main {
					display: flex;
					align-items: stretch;
					gap: 0;
					position: relative;
					background: #1a1518;
					border-radius: 16px;
					overflow: hidden;
					box-shadow: 0 20px 60px rgba(0,0,0,0.4);
				}
				.gallery-slider-nav {
					position: absolute;
					top: 50%;
					transform: translateY(-50%);
					width: var(--gallery-nav-size);
					height: var(--gallery-nav-size);
					border-radius: 50%;
					background: rgba(255,255,255,0.15);
					backdrop-filter: blur(12px);
					border: 1px solid rgba(255,255,255,0.25);
					color: #fff;
					display: flex;
					align-items: center;
					justify-content: center;
					cursor: pointer;
					z-index: 5;
					transition: all 0.25s ease;
				}
				.gallery-slider-nav:hover {
					background: rgba(255,255,255,0.25);
					border-color: rgba(255,255,255,0.4);
					transform: translateY(-50%) scale(1.08);
				}
				.gallery-slider-nav i { font-size: 18px; }
				.gallery-slider-prev { left: 16px; }
				.gallery-slider-next { right: 16px; }
				.gallery-slider-hero {
					flex: 1 1 auto;
					min-width: 0;
					position: relative;
					aspect-ratio: 16 / 10;
					display: flex;
					align-items: center;
					justify-content: center;
					background: #1a1518;
				}
				.gallery-slider-hero-inner {
					position: absolute;
					inset: 0;
					display: flex;
					align-items: center;
					justify-content: center;
				}
				:global(.gallery-slider-hero-img) {
					width: 100% !important;
					height: 100% !important;
					object-fit: contain;
					object-position: center;
				}
				.gallery-slider-all-thumbs {
					display: flex;
					gap: 10px;
					padding: 16px 0 0;
					overflow-x: auto;
					overflow-y: hidden;
					scroll-behavior: smooth;
					-webkit-overflow-scrolling: touch;
				}
				.gallery-slider-all-thumbs::-webkit-scrollbar {
					height: 6px;
				}
				.gallery-slider-all-thumbs::-webkit-scrollbar-track {
					background: rgba(78,43,90,0.15);
					border-radius: 3px;
				}
				.gallery-slider-all-thumbs::-webkit-scrollbar-thumb {
					background: rgba(78,43,90,0.4);
					border-radius: 3px;
				}
				.gallery-slider-thumb {
					flex-shrink: 0;
					width: 72px;
					height: 54px;
					border-radius: 8px;
					overflow: hidden;
					border: 2px solid transparent;
					padding: 0;
					cursor: pointer;
					background: #222;
					transition: all 0.2s ease;
				}
				.gallery-slider-thumb:hover,
				.gallery-slider-thumb.active {
					border-color: rgba(78,43,90,0.8);
					box-shadow: 0 0 0 1px rgba(255,255,255,0.15);
				}
				.gallery-slider-thumb.active {
					border-color: #4e2b5a;
					box-shadow: 0 0 0 2px rgba(78,43,90,0.5);
				}
				:global(.gallery-slider-thumb-img) {
					width: 100% !important;
					height: 100% !important;
					object-fit: cover;
				}
				.gallery-slider-footer {
					display: flex;
					align-items: center;
					justify-content: center;
					gap: 16px;
					padding: 16px 0 0;
					flex-wrap: wrap;
				}
				.gallery-slider-dots {
					display: flex;
					align-items: center;
					gap: 5px;
					overflow-x: auto;
					overflow-y: hidden;
					scroll-behavior: smooth;
					max-width: 100%;
					padding: 4px 0;
					-webkit-overflow-scrolling: touch;
				}
				.gallery-slider-dots::-webkit-scrollbar {
					height: 4px;
				}
				.gallery-slider-dots::-webkit-scrollbar-track {
					background: rgba(78,43,90,0.1);
					border-radius: 2px;
				}
				.gallery-slider-dots::-webkit-scrollbar-thumb {
					background: rgba(78,43,90,0.35);
					border-radius: 2px;
				}
				.gallery-slider-dot {
					flex-shrink: 0;
					width: 8px;
					height: 8px;
					border-radius: 50%;
					background: rgba(78,43,90,0.4);
					border: none;
					padding: 0;
					cursor: pointer;
					transition: all 0.2s ease;
				}
				.gallery-slider-dot:hover { background: rgba(78,43,90,0.7); }
				.gallery-slider-dot.active {
					background: #4e2b5a;
					transform: scale(1.2);
				}
				.gallery-slider-hero-inner.gallery-slider-fade {
					animation: gallerySliderFadeIn 0.7s ease;
				}
				@keyframes gallerySliderFadeIn {
					from { opacity: 0; }
					to { opacity: 1; }
				}
				.gallery-slider-dots-more {
					font-size: 11px;
					color: rgba(78,43,90,0.8);
				}
				.gallery-slider-counter {
					font-size: 13px;
					font-weight: 600;
					color: #4e2b5a;
				}
				@media (max-width: 991px) {
					.gallery-slider-thumb { width: 64px; height: 48px; }
				}
				@media (max-width: 575px) {
					.gallery-slider-nav { width: 44px; height: 44px; }
					.gallery-slider-nav i { font-size: 14px; }
					.gallery-slider-prev { left: 10px; }
					.gallery-slider-next { right: 10px; }
					.gallery-slider-thumb { width: 56px; height: 42px; }
					.gallery-slider-dot { width: 6px; height: 6px; }
					.gallery-slider-dots { gap: 4px; }
				}
			`}</style>
		</div>
	)
}
