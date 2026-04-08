export default function Loading() {
	return (
		<div className="app-route-loading" role="status" aria-live="polite" aria-busy="true">
			<div className="app-route-loading__inner">
				<div className="app-route-loading__spinner" aria-hidden />
				<p className="app-route-loading__label">Loading…</p>
			</div>
		</div>
	)
}
