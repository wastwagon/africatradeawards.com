import Layout from "@/components/layout/Layout"
import HeroSection from '@/components/sections/home1/HeroSection'
import EventDateVenueBar from '@/components/sections/home1/EventDateVenueBar'
import PremiumAttendanceSection from '@/components/sections/home1/PremiumAttendanceSection'
import PremiumTrustStrip from '@/components/sections/home1/PremiumTrustStrip'
import EventExperienceStrip from '@/components/sections/home1/EventExperienceStrip'
import AboutSection from '@/components/sections/home1/AboutSection'
import KudosStatsSection from '@/components/sections/home1/KudosStatsSection'
import EngagePlatformSection from '@/components/sections/home1/EngagePlatformSection'
import AwardCategoriesSection from '@/components/sections/home1/AwardCategoriesSection'
import KudosTestimonialsSection from '@/components/sections/home1/KudosTestimonialsSection'
import AwardeesCTASection from '@/components/sections/home1/AwardeesCTASection'
import GallerySection from '@/components/sections/home1/GallerySection'
import HeadlineTalentScheduleSection from '@/components/sections/home1/HeadlineTalentScheduleSection'
import SponsorsSection from '@/components/sections/SponsorsSection'
import VenuePressStrip from '@/components/sections/home1/VenuePressStrip'

/**
 * Homepage narrative (read top to bottom):
 * Occasion → Meaning → Framework → Experience preview (gallery → committee & schedule → navigate) → Scale →
 * Your paths (engage) → Voices (testimonials) → Show up & tell the story
 * (venue / press) → Coalition (sponsors) → Closing invitation (register / awardees).
 */

export default function Home() {
	return (
		<>
			<Layout>
				{/* Occasion: when, where, primary actions */}
				<HeroSection />
				<EventDateVenueBar />
				<PremiumTrustStrip />
				<PremiumAttendanceSection />

				{/* Meaning: why the awards exist (before the tier framework) */}
				<AboutSection />

				{/* Framework: what we recognise */}
				<AwardCategoriesSection />

				{/* Experience preview: feel → voices & rhythm → deeper pages */}
				<GallerySection />
				<HeadlineTalentScheduleSection />
				<EventExperienceStrip />

				{/* Scale of the movement */}
				<KudosStatsSection />

				{/* Participation: register, vote, nominate, entrant hub */}
				<EngagePlatformSection />

				{/* Social proof after paths are clear */}
				<KudosTestimonialsSection />

				{/* Venue, hashtag, press desk */}
				<VenuePressStrip />

				{/* Coalition */}
				<SponsorsSection />

				{/* Closing invitation */}
				<AwardeesCTASection />
			</Layout>
		</>
	)
}
