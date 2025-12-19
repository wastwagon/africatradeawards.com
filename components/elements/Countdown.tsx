'use client'
import { useEffect, useState } from "react"

const msInSecond = 1000
const msInMinute = 60 * msInSecond
const msInHour = 60 * msInMinute
const msInDay = 24 * msInHour

const getPartsOfTimeDuration = (duration: number) => {
	const days = Math.floor(duration / msInDay)
	const hours = Math.floor((duration % msInDay) / msInHour)
	const minutes = Math.floor((duration % msInHour) / msInMinute)
	const seconds = Math.floor((duration % msInMinute) / msInSecond)

	return { days, hours, minutes, seconds }
}

export default function Countdown({ style }: any) {
	const [mounted, setMounted] = useState(false)
	const [timeDif, setTimeDif] = useState(0)

	useEffect(() => {
		setMounted(true)
		const now = Date.now()
		// Event date: January 30, 2026 at 6:30 PM GMT
		const endDateTime = new Date('2026-01-30T18:30:00+00:00') // 6:30 PM GMT on January 30, 2026
		setTimeDif(Math.max(0, endDateTime.getTime() - now))
	}, [])

	useEffect(() => {
		const interval = setInterval(() => {
			setTimeDif((prev) => {
				const updatedTime = prev - 1000
				if (updatedTime <= 0) {
					clearInterval(interval)
					return 0
				}
				return updatedTime
			})
		}, 1000)

		return () => clearInterval(interval)
	}, [])

	const timeParts = getPartsOfTimeDuration(timeDif)

	// Prevent hydration mismatch by only rendering after mount
	if (!mounted) {
		return (
			<>
				{!style && <>
					<div className="timer">
						<div className="time-box">
							<span id="days1" className="time-value">0</span>
						</div>
						<div className="time-box">
							<span id="hours1" className="time-value">0</span>
						</div>
						<div className="time-box">
							<span id="minutes1" className="time-value">0</span>
						</div>
						<div className="time-box">
							<span id="seconds1" className="time-value">0</span>
						</div>
					</div>
				</>}
			</>
		)
	}

	return (
		<>


			{!style && <>
				<div className="timer">
					<div className="time-box">
						<span id="days1" className="time-value">{timeParts.days}</span>
					</div>
					<div className="time-box">
						<span id="hours1" className="time-value">{timeParts.hours}</span>
					</div>
					<div className="time-box">
						<span id="minutes1" className="time-value">{timeParts.minutes}</span>
					</div>
					<div className="time-box">
						<span id="seconds1" className="time-value">{timeParts.seconds}</span>
					</div>
				</div>
			</>}


			{style === 1 && <>
				<div className="timer">
					<div className="time-box">
						<span id="days" className="time-value">{timeParts.days} <span>DAYS</span></span>
					</div>
					<div className="time-box">
						<span id="hours" className="time-value">{timeParts.hours} <span>Hours</span></span>
					</div>
					<div className="time-box">
						<span id="minutes" className="time-value">{timeParts.minutes} <span>Minutes</span></span>
					</div>
					<div className="time-box">
						<span id="seconds" className="time-value">{timeParts.seconds} <span>Seconds</span></span>
					</div>
				</div>

			</>}
			{style === 2 && <>
				<div className="row">
					<div className="col-lg-3 col-md-6">
						<div className="cta-counter-box">
							<img src="/assets/img/elements/elements23.png" alt="" className="elements23 keyframe5" />
							<h2><span id="days1" className="time-value">{timeParts.days} <span>DAYS</span></span></h2>
						</div>
						<div className="space50 d-lg-none d-block" />
					</div>
					<div className="col-lg-3 col-md-6">
						<div className="cta-counter-box">
							<img src="/assets/img/elements/elements23.png" alt="" className="elements23 keyframe5" />
							<h2><span id="hours1" className="time-value">{timeParts.hours} <span>Hours</span> </span></h2>
						</div>
						<div className="space50 d-lg-none d-block" />
					</div>
					<div className="col-lg-3 col-md-6">
						<div className="cta-counter-box">
							<img src="/assets/img/elements/elements23.png" alt="" className="elements23 keyframe5" />
							<h2><span id="minutes1" className="time-value">{timeParts.minutes}<span>Minutes</span></span></h2>
						</div>
					</div>
					<div className="col-lg-3 col-md-6">
						<div className="cta-counter-box">
							<img src="/assets/img/elements/elements23.png" alt="" className="elements23 keyframe5" />
							<h2><span id="seconds1" className="time-value">{timeParts.seconds}<span>Seconds</span></span></h2>
						</div>
					</div>
				</div>
			</>}
			{style === 3 && <>
				<div className="timer2">
					<div className="time-box">
						<span id="days" className="time-value">{timeParts.days} <span>DAYS</span></span>
						<br />
					</div>
					<div className="space14" />
					<div className="time-box">
						<span id="hours" className="time-value">{timeParts.hours} <span>Hours</span></span>
						<br />
					</div>
					<div className="space14" />
					<div className="time-box">
						<span id="minutes" className="time-value">{timeParts.minutes} <span>Minutes</span></span>
						<br />
					</div>
					<div className="space14" />
					<div className="time-box" style={{ margin: '0 26px 0 0' }}>
						<span id="seconds" className="time-value">{timeParts.seconds} <span>Seconds</span></span>
						<br />
					</div>
				</div>

			</>}
			{(style === "small" || style === 'small') && <>
				<div className="timer-small">
					<div className="time-box-small">
						<span className="time-value-small">{timeParts.days}</span>
						<span className="time-label-small">D</span>
					</div>
					<span className="time-separator">:</span>
					<div className="time-box-small">
						<span className="time-value-small">{timeParts.hours}</span>
						<span className="time-label-small">H</span>
					</div>
					<span className="time-separator">:</span>
					<div className="time-box-small">
						<span className="time-value-small">{timeParts.minutes}</span>
						<span className="time-label-small">M</span>
					</div>
					<span className="time-separator">:</span>
					<div className="time-box-small">
						<span className="time-value-small">{timeParts.seconds}</span>
						<span className="time-label-small">S</span>
					</div>
				</div>
			</>}
		</>
	)
}
