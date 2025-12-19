'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Countdown from '@/components/elements/Countdown'

export default function Popup() {
	const [showPopup, setShowPopup] = useState(false)

	useEffect(() => {
		// Display the popup after a short delay on every page load
		const showPopupTimer = setTimeout(() => {
			setShowPopup(true)
		}, 1000) // 1 second delay

		// Cleanup function
		return () => {
			clearTimeout(showPopupTimer)
		}
	}, [])

	useEffect(() => {
		if (!showPopup) return

		const popup = document.getElementById('popup') as HTMLElement | null
		const closeBtn = document.getElementById('close-popup') as HTMLElement | null
		const noThanksBtn = document.querySelector('.no-thanks') as HTMLElement | null

		// Event handler functions
		const handleClose = () => {
			setShowPopup(false)
		}

		const handleNoThanks = () => {
			setShowPopup(false)
		}

		// Close the popup when the close button is clicked
		if (closeBtn) {
			closeBtn.addEventListener('click', handleClose)
		}

		// Close the popup when the "No thanks" button is clicked
		if (noThanksBtn) {
			noThanksBtn.addEventListener('click', handleNoThanks)
		}

		// Cleanup function
		return () => {
			if (closeBtn) {
				closeBtn.removeEventListener('click', handleClose)
			}
			if (noThanksBtn) {
				noThanksBtn.removeEventListener('click', handleNoThanks)
			}
		}
	}, [showPopup])

	return (
		<>
			<div className="elegant-cta-section" style={{ padding: 0, overflow: 'visible', position: 'static' }}>
				<div 
					id="popup" 
					className={`popup-overlay ${showPopup ? 'popup-show' : ''}`}
					style={{
						position: 'fixed',
						top: 0,
						left: 0,
						width: '100%',
						height: '100%',
						background: 'rgba(0, 0, 0, 0.7)',
						justifyContent: 'center',
						alignItems: 'center',
						zIndex: 9999999,
						display: showPopup ? 'flex' : 'none'
					}}
				>
				<div className="popup-content popup-cta-content">
					<span className="close-btn" id="close-popup">×</span>
					
					{/* Header */}
					<div className="popup-header">
						<h2 className="popup-title">Join Us in Celebrating Excellence</h2>
						<p className="popup-subtitle">Be part of Africa&apos;s premier trade recognition event</p>
					</div>
					
					<div className="space16" />
					
					{/* Countdown Timer */}
					<div className="popup-countdown">
						<div className="premium-countdown-timer">
							<Countdown />
						</div>
					</div>
					
					<div className="space16" />
					
					{/* Event Info */}
					<div className="popup-event-info">
						<div className="info-item">
							<div className="info-icon">
								<i className="fa-solid fa-calendar-days"></i>
							</div>
							<span className="info-text">28th and 29th January 2026 - 6:30pm to 11:00pm</span>
						</div>
						<div className="info-item">
							<div className="info-icon">
								<i className="fa-solid fa-location-dot"></i>
							</div>
							<span className="info-text">Kempinski Gold Coast City Hotel, Accra</span>
						</div>
						<div className="info-item">
							<div className="info-icon">
								<i className="fa-solid fa-shirt"></i>
							</div>
							<span className="info-text">Black Tie / African Elegant</span>
						</div>
					</div>
					
					<div className="space12" />
					
					{/* Footer Text */}
					<p className="popup-footer-text">
						An official initiative of the African Trade Chamber in partnership with Agile Media Solutions. Independently audited by Forvis Mazars Ghana.
					</p>
					
					<p className="no-thanks">No thanks</p>
				</div>
				</div>
			</div>
		</>
	)
}
