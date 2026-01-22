'use client'
import { useEffect } from 'react'
import { Awardee } from '@/data/awardees'

interface CitationModalProps {
	awardee: Awardee | null
	isOpen: boolean
	onClose: () => void
}

export default function CitationModal({ awardee, isOpen, onClose }: CitationModalProps) {
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden'
		} else {
			document.body.style.overflow = ''
		}

		return () => {
			document.body.style.overflow = ''
		}
	}, [isOpen])

	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && isOpen) {
				onClose()
			}
		}

		document.addEventListener('keydown', handleEscape)
		return () => document.removeEventListener('keydown', handleEscape)
	}, [isOpen, onClose])

	if (!awardee || !isOpen) return null

	const getTierColor = (tier: string) => {
		switch(tier) {
			case 'Tier I': return '#4e2b5a'
			case 'Tier II': return '#6b3d7a'
			case 'Tier III': return '#8b5a9a'
			case 'Tier IV': return '#a877ba'
			case 'Tier V': return '#c095da'
			default: return '#4e2b5a'
		}
	}

	const tierColor = getTierColor(awardee.tier)

	return (
		<>
			{/* Backdrop */}
			<div 
				className={`citation-modal-backdrop ${isOpen ? 'active' : ''}`}
				onClick={onClose}
			/>

			{/* Modal */}
			<div className={`citation-modal-container ${isOpen ? 'active' : ''}`}>
				<div className="citation-modal-content" onClick={(e) => e.stopPropagation()}>
					{/* Header */}
					<div className="citation-modal-header" style={{ borderBottomColor: `${tierColor}20` }}>
						<div className="citation-modal-header-content">
							<div className="citation-modal-badge" style={{ 
								backgroundColor: `${tierColor}15`,
								borderColor: `${tierColor}30`,
								color: tierColor
							}}>
								{awardee.tier}
							</div>
							<h2 className="citation-modal-category">{awardee.category}</h2>
							<h3 className="citation-modal-name">{awardee.awardee}</h3>
						</div>
						<button 
							className="citation-modal-close"
							onClick={onClose}
							aria-label="Close modal"
						>
							<i className="fa-solid fa-times"></i>
						</button>
					</div>

					{/* Body */}
					<div className="citation-modal-body">
						<div className="citation-modal-citation">
							{awardee.citation.split('\n\n').map((paragraph, index) => (
								<p key={index} className="citation-modal-paragraph">
									{paragraph}
								</p>
							))}
						</div>
					</div>

					{/* Footer */}
					<div className="citation-modal-footer" style={{ borderTopColor: `${tierColor}20` }}>
						<button 
							className="citation-modal-close-btn"
							onClick={onClose}
							style={{
								backgroundColor: tierColor,
								borderColor: tierColor
							}}
						>
							Close
						</button>
					</div>
				</div>
			</div>

			<style jsx global>{`
				.citation-modal-backdrop {
					position: fixed;
					top: 0;
					left: 0;
					right: 0;
					bottom: 0;
					background: rgba(0, 0, 0, 0.6);
					backdrop-filter: blur(8px);
					z-index: 9998;
					opacity: 0;
					visibility: hidden;
					transition: all 0.3s ease;
				}

				.citation-modal-backdrop.active {
					opacity: 1;
					visibility: visible;
				}

				.citation-modal-container {
					position: fixed;
					top: 0;
					left: 0;
					right: 0;
					bottom: 0;
					z-index: 9999;
					display: flex;
					align-items: center;
					justify-content: center;
					padding: 20px;
					opacity: 0;
					visibility: hidden;
					transition: all 0.3s ease;
					pointer-events: none;
				}

				.citation-modal-container.active {
					opacity: 1;
					visibility: visible;
					pointer-events: all;
				}

				.citation-modal-content {
					background: #ffffff;
					border-radius: 24px;
					width: 100%;
					max-width: 900px;
					max-height: 90vh;
					display: flex;
					flex-direction: column;
					box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
					transform: scale(0.9) translateY(20px);
					transition: transform 0.3s ease;
					overflow: hidden;
				}

				.citation-modal-container.active .citation-modal-content {
					transform: scale(1) translateY(0);
				}

				.citation-modal-header {
					padding: 32px 40px 24px;
					border-bottom: 2px solid rgba(78, 43, 90, 0.1);
					display: flex;
					justify-content: space-between;
					align-items: flex-start;
					gap: 20px;
					position: relative;
				}

				.citation-modal-header-content {
					flex: 1;
				}

				.citation-modal-badge {
					display: inline-block;
					padding: 6px 16px;
					border-radius: 20px;
					margin-bottom: 12px;
					font-size: 11px;
					font-weight: 600;
					letter-spacing: 1px;
					text-transform: uppercase;
					font-family: var(--grotesk);
				}

				.citation-modal-category {
					font-size: 18px;
					font-weight: 600;
					color: #666;
					margin: 0 0 12px 0;
					font-family: var(--grotesk);
					line-height: 1.4;
				}

				.citation-modal-name {
					font-size: 28px;
					font-weight: 700;
					color: #1a1a1a;
					margin: 0;
					font-family: var(--grotesk);
					line-height: 1.3;
				}

				.citation-modal-close {
					width: 40px;
					height: 40px;
					border-radius: 50%;
					background: #f5f5f5;
					border: none;
					display: flex;
					align-items: center;
					justify-content: center;
					cursor: pointer;
					transition: all 0.3s ease;
					flex-shrink: 0;
					color: #666;
				}

				.citation-modal-close:hover {
					background: #e5e5e5;
					color: #1a1a1a;
					transform: rotate(90deg);
				}

				.citation-modal-close i {
					font-size: 18px;
				}

				.citation-modal-body {
					flex: 1;
					overflow-y: auto;
					padding: 32px 40px;
					-webkit-overflow-scrolling: touch;
				}

				.citation-modal-citation {
					text-align: left;
				}

				.citation-modal-paragraph {
					font-size: 16px;
					line-height: 1.9;
					color: #4a4a4a;
					margin: 0 0 20px 0;
					font-family: var(--figtree);
				}

				.citation-modal-paragraph:last-child {
					margin-bottom: 0;
				}

				.citation-modal-footer {
					padding: 24px 40px 32px;
					border-top: 2px solid rgba(78, 43, 90, 0.1);
					display: flex;
					justify-content: flex-end;
				}

				.citation-modal-close-btn {
					padding: 12px 32px;
					background: #4e2b5a;
					border: 2px solid #4e2b5a;
					border-radius: 50px;
					color: #ffffff;
					font-size: 15px;
					font-weight: 600;
					cursor: pointer;
					transition: all 0.3s ease;
					font-family: var(--grotesk);
				}

				.citation-modal-close-btn:hover {
					transform: translateY(-2px);
					box-shadow: 0 4px 12px rgba(78, 43, 90, 0.3);
				}

				.citation-modal-close-btn:active {
					transform: translateY(0);
				}

				/* Tablet */
				@media (max-width: 991px) {
					.citation-modal-content {
						max-width: 700px;
						max-height: 85vh;
					}

					.citation-modal-header {
						padding: 28px 32px 20px;
					}

					.citation-modal-name {
						font-size: 24px;
					}

					.citation-modal-body {
						padding: 28px 32px;
					}

					.citation-modal-footer {
						padding: 20px 32px 28px;
					}
				}

				/* Mobile */
				@media (max-width: 575px) {
					.citation-modal-container {
						padding: 10px;
						align-items: flex-end;
					}

					.citation-modal-content {
						max-width: 100%;
						max-height: 95vh;
						border-radius: 24px 24px 0 0;
						transform: translateY(100%);
					}

					.citation-modal-container.active .citation-modal-content {
						transform: translateY(0);
					}

					.citation-modal-header {
						padding: 24px 20px 20px;
						flex-direction: column;
						gap: 16px;
					}

					.citation-modal-close {
						position: absolute;
						top: 20px;
						right: 20px;
					}

					.citation-modal-badge {
						font-size: 10px;
						padding: 5px 12px;
					}

					.citation-modal-category {
						font-size: 16px;
						margin-bottom: 8px;
					}

					.citation-modal-name {
						font-size: 20px;
						padding-right: 40px;
					}

					.citation-modal-body {
						padding: 24px 20px;
					}

					.citation-modal-paragraph {
						font-size: 15px;
						line-height: 1.8;
						margin-bottom: 16px;
					}

					.citation-modal-footer {
						padding: 20px;
						justify-content: stretch;
					}

					.citation-modal-close-btn {
						width: 100%;
						padding: 14px 32px;
					}
				}

				/* Small Mobile */
				@media (max-width: 375px) {
					.citation-modal-container {
						padding: 0;
					}

					.citation-modal-content {
						border-radius: 0;
						max-height: 100vh;
					}

					.citation-modal-header {
						padding: 20px 16px 16px;
					}

					.citation-modal-body {
						padding: 20px 16px;
					}

					.citation-modal-footer {
						padding: 16px;
					}
				}

				/* Scrollbar Styling */
				.citation-modal-body::-webkit-scrollbar {
					width: 8px;
				}

				.citation-modal-body::-webkit-scrollbar-track {
					background: #f5f5f5;
				}

				.citation-modal-body::-webkit-scrollbar-thumb {
					background: #d0d0d0;
					border-radius: 4px;
				}

				.citation-modal-body::-webkit-scrollbar-thumb:hover {
					background: #b0b0b0;
				}
			`}</style>
		</>
	)
}
