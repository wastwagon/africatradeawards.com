import Link from "next/link";

export default function NotFound() {
	return (
		<div className="app-status-page">
			<div className="app-status-card">
				<p className="app-status-eyebrow">Page not found</p>
				<h1 className="app-status-title">We can’t find that page</h1>
				<p className="app-status-lead">
					The link may be broken or the page may have moved. Head home or reach out if you need help.
				</p>
				<div className="app-status-actions">
					<Link href="/" className="app-status-btn">
						Back to home
					</Link>
					<Link href="/contact" className="app-status-btn app-status-btn--ghost">
						Contact
					</Link>
				</div>
			</div>
		</div>
	)
}
