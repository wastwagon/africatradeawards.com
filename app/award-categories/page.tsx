'use client'
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import AwardCategoriesSection from '@/components/sections/home1/AwardCategoriesSection'

export default function AwardCategories() {
	return (
		<Layout headerStyle={1} footerStyle={1}>
			<div>
				<div className="inner-page-header" style={{ backgroundImage: 'url(assets/img/bg/header-bg5.png)' }}>
					<div className="container">
						<div className="row">
							<div className="col-lg-4 m-auto">
								<div className="heading1 text-center">
									<h1>Award Categories</h1>
									<div className="space20" />
									<Link href="/">Home <i className="fa-solid fa-angle-right" /> <span>Award Categories</span></Link>
								</div>
							</div>
						</div>
					</div>
				</div>
				{/* Homepage Award Categories Section */}
				<AwardCategoriesSection />
			</div>
		</Layout>
	)
}





