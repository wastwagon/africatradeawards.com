import Layout from "@/components/layout/Layout"
// import Popup from '@/components/layout/Popup' // Temporarily disabled
import HeroSection from '@/components/sections/home1/HeroSection'
import HeroContentSection from '@/components/sections/home1/HeroContentSection'
import AboutSection from '@/components/sections/home1/AboutSection'
import AwardCategoriesSection from '@/components/sections/home1/AwardCategoriesSection'
import HowToNominateSection from '@/components/sections/home1/HowToNominateSection'
import PartnersSection from '@/components/sections/home1/PartnersSection'
import OfficialPartnersSection from '@/components/sections/home1/OfficialPartnersSection'
import MediaSection from '@/components/sections/home1/MediaSection'

export default function Home() {
	return (
		<>
			<Layout headerStyle={1} footerStyle={1}>
				<HeroSection />
				<HeroContentSection />
				<AboutSection />
				<AwardCategoriesSection />
				<HowToNominateSection />
				<PartnersSection />
				<OfficialPartnersSection />
				<MediaSection />
			</Layout>
			
			{/* <Popup /> */} {/* Temporarily disabled */}
		</>
	)
}