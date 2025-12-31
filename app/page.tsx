import Layout from "@/components/layout/Layout"
import HeroSection from '@/components/sections/home1/HeroSection'
import AboutSection from '@/components/sections/home1/AboutSection'
import AwardCategoriesSection from '@/components/sections/home1/AwardCategoriesSection'

export default function Home() {
	return (
		<>
			<Layout headerStyle={1} footerStyle={1}>
				<HeroSection />
				<AboutSection />
				<AwardCategoriesSection />
			</Layout>
		</>
	)
}
