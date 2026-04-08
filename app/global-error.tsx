'use client'

import { useEffect } from 'react'

export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string }
	reset: () => void
}) {
	useEffect(() => {
		console.error(error)
	}, [error])

	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<title>Africa Trade Awards — Error</title>
			</head>
			<body
				style={{
					margin: 0,
					minHeight: '100vh',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					padding: 24,
					fontFamily: 'ui-sans-serif, system-ui, sans-serif',
					background: 'linear-gradient(180deg, #fffaf6 0%, #f9f5fc 40%, #ffffff 100%)',
					color: '#1a1719',
				}}
			>
				<div
					style={{
						maxWidth: 420,
						width: '100%',
						padding: 28,
						borderRadius: 14,
						border: '1px solid rgba(120, 80, 140, 0.22)',
						background: 'rgba(255,255,255,0.96)',
						boxShadow: '0 12px 32px rgba(45, 25, 58, 0.1)',
					}}
				>
					<p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#78508c' }}>
						Africa Trade Awards
					</p>
					<h1 style={{ margin: '0 0 10px', fontSize: 22, lineHeight: 1.2 }}>Something went wrong</h1>
					<p style={{ margin: '0 0 20px', fontSize: 15, lineHeight: 1.55, color: '#5e5568' }}>
						The application hit a critical error. You can try reloading the page or return home.
					</p>
					<div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
						<button
							type="button"
							onClick={() => reset()}
							style={{
								cursor: 'pointer',
								border: 'none',
								borderRadius: 10,
								padding: '10px 18px',
								fontWeight: 600,
								fontSize: 14,
								color: '#fff',
								background: 'linear-gradient(135deg, #4e2b5a 0%, #6b3f86 100%)',
							}}
						>
							Try again
						</button>
						<a
							href="/"
							style={{
								display: 'inline-flex',
								alignItems: 'center',
								borderRadius: 10,
								padding: '10px 18px',
								fontWeight: 600,
								fontSize: 14,
								textDecoration: 'none',
								color: '#5c3a72',
								border: '1px solid rgba(78, 43, 90, 0.28)',
							}}
						>
							Back to home
						</a>
					</div>
				</div>
			</body>
		</html>
	)
}
