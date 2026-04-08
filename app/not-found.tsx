import Link from "next/link";

export default function NotFound() {
	return (
		<div className="app-status-page">
			<div className="app-status-card">
				<p className="app-status-eyebrow">Africa Trade Awards</p>
				<h1 className="app-status-title">Page not found</h1>
				<p className="app-status-lead">
					The page you requested does not exist or may have moved. Check the URL or return to the homepage.
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
