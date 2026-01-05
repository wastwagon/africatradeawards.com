'use client'

import { useState } from 'react'
import Image from 'next/image'
import ProfileModal from '@/components/elements/ProfileModal'
import { committeeMembers, CommitteeMember } from '@/data/committeeMembers'

export default function CommitteeProfiles() {
	const [selectedMember, setSelectedMember] = useState<CommitteeMember | null>(null)
	const [isModalOpen, setIsModalOpen] = useState(false)

	const handleReadProfile = (member: CommitteeMember) => {
		setSelectedMember(member)
		setIsModalOpen(true)
	}

	const handleCloseModal = () => {
		setIsModalOpen(false)
		setTimeout(() => {
			setSelectedMember(null)
		}, 300)
	}

	return (
		<>
			<div className="committee-profiles-section" data-aos="fade-up" data-aos-duration={800} data-aos-delay={200}>
				<div className="committee-profiles-grid">
					{committeeMembers.map((member, index) => (
						<div key={member.id} className="committee-profile-card">
							<div className={`profile-image-wrapper ${member.id === 'beenzu-muleya' ? 'profile-image-adjust-top' : ''} ${member.id === 'nana-ama-kusi-appouh' ? 'profile-image-adjust-center' : ''}`}>
								<Image
									src={member.image}
									alt={member.name}
									width={160}
									height={160}
									className={`profile-image ${member.id === 'beenzu-muleya' ? 'adjust-top' : ''} ${member.id === 'nana-ama-kusi-appouh' ? 'adjust-center' : ''}`}
									priority
								/>
							</div>
							<div className="profile-info">
								<h3 className="profile-name">{member.name.toUpperCase()}</h3>
								<p className="profile-title">{member.title}</p>
								<p className="profile-short-bio">{member.shortBio}</p>
								<button 
									className="profile-read-btn"
									onClick={() => handleReadProfile(member)}
								>
									<span>Read Bio</span>
									<i className="fa-solid fa-arrow-right"></i>
								</button>
							</div>
						</div>
					))}
				</div>
			</div>

			<ProfileModal 
				member={selectedMember}
				isOpen={isModalOpen}
				onClose={handleCloseModal}
			/>
		</>
	)
}

