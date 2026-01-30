'use client'

import { useState, useCallback, useEffect } from 'react'
import Image from 'next/image'

interface GalleryGridProps {
	images: string[]
	alt?: string
	className?: string
}

export default function GalleryGrid({ images, alt = 'Gallery', className = '' }: GalleryGridProps) {
	const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

	const openLightbox = useCallback((index: number) => setLightboxIndex(index), [])
	const closeLightbox = useCallback(() => setLightboxIndex(null), [])

	const goPrev = useCallback(() => {
		if (lightboxIndex === null) return
		setLightboxIndex((lightboxIndex - 1 + images.length) % images.length)
	}, [lightboxIndex, images.length])

	const goNext = useCallback(() => {
		if (lightboxIndex === null) return
		setLightboxIndex((lightboxIndex + 1) % images.length)
	}, [lightboxIndex, images.length])

	useEffect(() => {
		if (lightboxIndex === null) return
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') closeLightbox()
			if (e.key === 'ArrowLeft') goPrev()
			if (e.key === 'ArrowRight') goNext()
		}
		window.addEventListener('keydown', onKey)
		return () => window.removeEventListener('keydown', onKey)
	}, [lightboxIndex, closeLightbox, goPrev, goNext])

	if (!images.length) return null

	return (
		<>
			<div className={`gallery-grid ${className}`}>
				{images.map((src, index) => (
					<button
						key={`${src}-${index}`}
						type="button"
						className="gallery-grid-item"
						onClick={() => openLightbox(index)}
						aria-label={`View image ${index + 1}`}
					>
						<Image
							src={src}
							alt={`${alt} ${index + 1}`}
							width={400}
							height={300}
							sizes="(max-width: 575px) 50vw, (max-width: 991px) 33vw, 25vw"
							className="gallery-grid-img"
						/>
					</button>
				))}
			</div>

			{/* Lightbox */}
			{lightboxIndex !== null && (
				<div className="gallery-grid-lightbox" onClick={closeLightbox} role="dialog" aria-modal="true" aria-label="Image lightbox">
					<button type="button" className="gallery-grid-lightbox-close" onClick={closeLightbox} aria-label="Close">
						<i className="fa-solid fa-times" />
					</button>
					<button type="button" className="gallery-grid-lightbox-prev" onClick={(e) => { e.stopPropagation(); goPrev(); }} aria-label="Previous">
						<i className="fa-solid fa-chevron-left" />
					</button>
					<div className="gallery-grid-lightbox-content" onClick={(e) => e.stopPropagation()}>
						<Image
							src={images[lightboxIndex]}
							alt={`${alt} ${lightboxIndex + 1}`}
							width={1200}
							height={800}
							sizes="100vw"
							className="gallery-grid-lightbox-img"
						/>
					</div>
					<button type="button" className="gallery-grid-lightbox-next" onClick={(e) => { e.stopPropagation(); goNext(); }} aria-label="Next">
						<i className="fa-solid fa-chevron-right" />
					</button>
				</div>
			)}

			<style jsx>{`
				.gallery-grid {
					display: grid;
					grid-template-columns: repeat(4, 1fr);
					gap: 16px;
				}
				.gallery-grid-item {
					position: relative;
					aspect-ratio: 4 / 3;
					border-radius: 12px;
					overflow: hidden;
					padding: 0;
					border: none;
					background: #1a1518;
					cursor: pointer;
					transition: transform 0.25s ease, box-shadow 0.25s ease;
				}
				.gallery-grid-item:hover {
					transform: translateY(-4px);
					box-shadow: 0 12px 32px rgba(78, 43, 90, 0.25);
				}
				:global(.gallery-grid-img) {
					width: 100% !important;
					height: 100% !important;
					object-fit: cover;
				}
				@media (max-width: 1199px) {
					.gallery-grid {
						grid-template-columns: repeat(3, 1fr);
						gap: 14px;
					}
				}
				@media (max-width: 767px) {
					.gallery-grid {
						grid-template-columns: repeat(2, 1fr);
						gap: 12px;
					}
					.gallery-grid-item {
						aspect-ratio: 4 / 3;
					}
				}
				/* Lightbox */
				.gallery-grid-lightbox {
					position: fixed;
					inset: 0;
					background: rgba(0, 0, 0, 0.92);
					z-index: 9999;
					display: flex;
					align-items: center;
					justify-content: center;
					padding: 60px 80px;
				}
				.gallery-grid-lightbox-close {
					position: absolute;
					top: 24px;
					right: 24px;
					width: 48px;
					height: 48px;
					border-radius: 50%;
					background: rgba(255, 255, 255, 0.15);
					border: 1px solid rgba(255, 255, 255, 0.3);
					color: #fff;
					display: flex;
					align-items: center;
					justify-content: center;
					cursor: pointer;
					z-index: 10;
					transition: background 0.2s ease;
				}
				.gallery-grid-lightbox-close:hover {
					background: rgba(255, 255, 255, 0.25);
				}
				.gallery-grid-lightbox-prev,
				.gallery-grid-lightbox-next {
					position: absolute;
					top: 50%;
					transform: translateY(-50%);
					width: 56px;
					height: 56px;
					border-radius: 50%;
					background: rgba(255, 255, 255, 0.15);
					border: 1px solid rgba(255, 255, 255, 0.3);
					color: #fff;
					display: flex;
					align-items: center;
					justify-content: center;
					cursor: pointer;
					z-index: 10;
					transition: background 0.2s ease;
				}
				.gallery-grid-lightbox-prev { left: 24px; }
				.gallery-grid-lightbox-next { right: 24px; }
				.gallery-grid-lightbox-prev:hover,
				.gallery-grid-lightbox-next:hover {
					background: rgba(255, 255, 255, 0.25);
				}
				.gallery-grid-lightbox-content {
					max-width: 90vw;
					max-height: 85vh;
					position: relative;
				}
				:global(.gallery-grid-lightbox-img) {
					width: 100% !important;
					height: auto !important;
					max-height: 85vh;
					object-fit: contain;
					border-radius: 8px;
				}
				@media (max-width: 767px) {
					.gallery-grid-lightbox {
						padding: 50px 16px;
					}
					.gallery-grid-lightbox-prev { left: 12px; width: 44px; height: 44px; }
					.gallery-grid-lightbox-next { right: 12px; width: 44px; height: 44px; }
					.gallery-grid-lightbox-close { top: 12px; right: 12px; width: 40px; height: 40px; }
				}
			`}</style>
		</>
	)
}
