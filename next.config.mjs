/** @type {import('next').NextConfig} */
const isStaticExport = process.env.STATIC_EXPORT === 'true';
const useStandalone =
	process.env.NEXT_STANDALONE === '1' || process.env.NEXT_STANDALONE === 'true';

// Static → `out/`. Slim Docker image → set NEXT_STANDALONE at build (see Dockerfile). Local / fullstack → default (works with `next start`).
const outputConfig = isStaticExport
	? { output: 'export' }
	: useStandalone
		? { output: 'standalone' }
		: {};

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
	...outputConfig,
	images: {
		// Static export cannot use the Image Optimization API; keep optimization for normal server mode.
		unoptimized: isStaticExport,
	},
	trailingSlash: true,
};

export default nextConfig;
