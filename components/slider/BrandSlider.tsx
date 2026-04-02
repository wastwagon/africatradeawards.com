'use client'
import Image from 'next/image'
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Navigation, Pagination } from "swiper/modules"

const swiperOptions = {
	modules: [Autoplay, Pagination, Navigation],
	slidesPerView: 4,
	spaceBetween: 30,
	autoplay: {
		delay: 2500,
		disableOnInteraction: false,
	},
	loop: true,

	// Navigation
	navigation: {
		nextEl: '.h1n',
		prevEl: '.h1p',
	},

	// Pagination
	pagination: {
		el: '.swiper-pagination',
		clickable: true,
	},

	breakpoints: {
		320: {
			slidesPerView: 1,
			spaceBetween: 30,
		},
		575: {
			slidesPerView: 2,
			spaceBetween: 30,
		},
		767: {
			slidesPerView: 2,
			spaceBetween: 30,
		},
		991: {
			slidesPerView: 3,
			spaceBetween: 30,
		},
		1199: {
			slidesPerView: 4,
			spaceBetween: 30,
		},
		1350: {
			slidesPerView: 4,
			spaceBetween: 30,
		},
	}
}
export default function BrandSlider() {
	return (
		<>
			<Swiper {...swiperOptions} className="brand-slider-area owl-carousel">
				<SwiperSlide className="brand-box">
					<Image src="/assets/img/elements/brand-img1.png" alt="Partner logo 1" width={220} height={80} />
				</SwiperSlide>
				<SwiperSlide className="brand-box">
					<Image src="/assets/img/elements/brand-img2.png" alt="Partner logo 2" width={220} height={80} />
				</SwiperSlide>
				<SwiperSlide className="brand-box">
					<Image src="/assets/img/elements/brand-img3.png" alt="Partner logo 3" width={220} height={80} />
				</SwiperSlide>
				<SwiperSlide className="brand-box">
					<Image src="/assets/img/elements/brand-img4.png" alt="Partner logo 4" width={220} height={80} />
				</SwiperSlide>
				<SwiperSlide className="brand-box">
					<Image src="/assets/img/elements/brand-img5.png" alt="Partner logo 5" width={220} height={80} />
				</SwiperSlide>
				<SwiperSlide className="brand-box">
					<Image src="/assets/img/elements/brand-img6.png" alt="Partner logo 6" width={220} height={80} />
				</SwiperSlide>
				<SwiperSlide className="brand-box">
					<Image src="/assets/img/elements/brand-img7.png" alt="Partner logo 7" width={220} height={80} />
				</SwiperSlide>
				<SwiperSlide className="brand-box">
					<Image src="/assets/img/elements/brand-img8.png" alt="Partner logo 8" width={220} height={80} />
				</SwiperSlide>
			</Swiper>
		</>
	)
}
