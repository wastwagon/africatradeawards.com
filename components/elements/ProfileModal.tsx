'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { CommitteeMember } from '@/data/committeeMembers'

interface ProfileModalProps {
	member: CommitteeMember | null
	isOpen: boolean
	onClose: () => void
}

export default function ProfileModal({ member, isOpen, onClose }: ProfileModalProps) {
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden'
		} else {
			document.body.style.overflow = 'unset'
		}
		return () => {
			document.body.style.overflow = 'unset'
		}
	}, [isOpen])

	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				onClose()
			}
		}
		if (isOpen) {
			window.addEventListener('keydown', handleEscape)
		}
		return () => {
			window.removeEventListener('keydown', handleEscape)
		}
	}, [isOpen, onClose])

	if (!isOpen || !member) return null

	return (
		<>
			{/* Backdrop */}
			<div 
				className={`profile-modal-backdrop ${isOpen ? 'active' : ''}`}
				onClick={onClose}
			/>
			
			{/* Modal Container */}
			<div className={`profile-modal-container ${isOpen ? 'active' : ''}`}>
				<div className="profile-modal-content" onClick={(e) => e.stopPropagation()}>
					{/* Modal Header */}
					<div className="profile-modal-header">
						{/* Close Button */}
						<button 
							className="profile-modal-close"
							onClick={onClose}
							aria-label="Close modal"
						>
							<i className="fa-solid fa-times"></i>
						</button>
						<div className={`profile-modal-image-wrapper ${member.id === 'beenzu-muleya' ? 'modal-image-adjust-top' : ''} ${member.id === 'nana-ama-kusi-appouh' ? 'modal-image-adjust-center' : ''}`}>
							<Image
								src={member.image}
								alt={member.name}
								width={200}
								height={200}
								className={`profile-modal-image ${member.id === 'beenzu-muleya' ? 'modal-adjust-top' : ''} ${member.id === 'nana-ama-kusi-appouh' ? 'modal-adjust-center' : ''}`}
								priority
							/>
							<div className="profile-modal-image-glow"></div>
						</div>
						<div className="profile-modal-header-content">
							<h2 className="profile-modal-name">{member.name}</h2>
							<p className="profile-modal-country">{member.country}</p>
							<div className="profile-modal-title">{member.title}</div>
							<div className="profile-modal-role">{member.role}</div>
						</div>
					</div>

					{/* Modal Body */}
					<div className="profile-modal-body">
						{/* Expertise Section */}
						{member.expertise && member.expertise.length > 0 && (
							<div className="profile-modal-expertise">
								<h3 className="profile-modal-expertise-title">Areas of Expertise</h3>
								<div className="profile-modal-expertise-tags">
									{member.expertise.map((expertise, index) => (
										<span key={index} className="profile-modal-expertise-tag">
											{expertise}
										</span>
									))}
								</div>
							</div>
						)}
						
						{/* Bio Section */}
						<div className="profile-modal-bio">
							{member.bio.map((paragraph, index) => (
								<p key={index} className="profile-modal-bio-text">
									{paragraph}
								</p>
							))}
						</div>
					</div>

					{/* Modal Footer */}
					<div className="profile-modal-footer">
						<button className="profile-modal-close-btn" onClick={onClose}>
							<span>Close</span>
							<i className="fa-solid fa-times"></i>
						</button>
					</div>
				</div>
			</div>
		</>
	)
}

