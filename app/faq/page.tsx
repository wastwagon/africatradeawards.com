import FaqClient from "./FaqClient"
import { getCmsFaqs } from "@/lib/cms-content"

export default async function FaqPage() {
	const faqs = await getCmsFaqs()
	const initialFaqs = faqs.map((item, index) => ({
		id: index + 1,
		question: item.question,
		answer: item.answer,
		category: item.category,
		icon: "fa-circle-question",
	}))
	return <FaqClient initialFaqs={initialFaqs} />
}
