/** @type {import('next').NextConfig} */
const isStaticExport = process.env.STATIC_EXPORT === 'true';

const nextConfig = {
	async redirects() {
		return [
			{ source: '/index2', destination: '/', permanent: true },
			{ source: '/index2/', destination: '/', permanent: true },
			{ source: '/index3', destination: '/', permanent: true },
			{ source: '/index3/', destination: '/', permanent: true },
			{ source: '/index4', destination: '/', permanent: true },
			{ source: '/index4/', destination: '/', permanent: true },
			{ source: '/index5', destination: '/', permanent: true },
			{ source: '/index5/', destination: '/', permanent: true },
			{ source: '/index6', destination: '/', permanent: true },
			{ source: '/index6/', destination: '/', permanent: true },
			{ source: '/index7', destination: '/', permanent: true },
			{ source: '/index7/', destination: '/', permanent: true },
			{ source: '/index8', destination: '/', permanent: true },
			{ source: '/index8/', destination: '/', permanent: true },
			{ source: '/index9', destination: '/', permanent: true },
			{ source: '/index9/', destination: '/', permanent: true },
			{ source: '/index10', destination: '/', permanent: true },
			{ source: '/index10/', destination: '/', permanent: true },
		];
	},
	// Static hosting → `out/`. Docker / Node hosting → `.next/standalone` (see Dockerfile).
	...(isStaticExport ? { output: 'export' } : { output: 'standalone' }),
	images: {
		// Required for static export, but safe to keep enabled.
		unoptimized: true,
	},
	trailingSlash: true,
};

export default nextConfig;
