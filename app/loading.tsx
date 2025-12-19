export default function Loading() {
	return (
		<div style={{ 
			display: 'flex', 
			justifyContent: 'center', 
			alignItems: 'center', 
			minHeight: '100vh',
			backgroundColor: '#fff',
			fontFamily: 'var(--figtree), sans-serif'
		}}>
			<div style={{ textAlign: 'center' }}>
				<div style={{
					width: '50px',
					height: '50px',
					border: '4px solid #f3f3f3',
					borderTop: '4px solid #4e2b5a',
					borderRadius: '50%',
					margin: '0 auto 20px',
					animation: 'spin 1s linear infinite'
				}}></div>
				<p style={{ color: '#666', fontSize: '16px', margin: 0 }}>Loading...</p>
			</div>
		</div>
	)
}
