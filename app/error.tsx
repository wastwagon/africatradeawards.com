"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<div className="app-status-page">
			<div className="app-status-card">
				<p className="app-status-eyebrow">Something went wrong</p>
				<h1 className="app-status-title">We hit a snag</h1>
				<p className="app-status-lead">
					An unexpected error occurred. You can try again, or return to the homepage while we recover.
				</p>
				<div className="app-status-actions">
					<button type="button" className="app-status-btn" onClick={() => reset()}>
						Try again
					</button>
					<Link href="/" className="app-status-btn app-status-btn--ghost">
						Back to home
					</Link>
				</div>
				{process.env.NODE_ENV === "development" && error.message ? (
					<pre className="app-status-detail">{error.message}</pre>
				) : null}
			</div>
		</div>
	);
}
