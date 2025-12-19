/** @type {import('next').NextConfig} */
const nextConfig = {
	output: 'export',
	images: {
		unoptimized: true, // Required for static export
	},
	trailingSlash: true, // Optional: adds trailing slash to URLs
	// Suppress warnings about missing files in static export
	onDemandEntries: {
		maxInactiveAge: 25 * 1000,
		pagesBufferLength: 2,
	},
};

export default nextConfig;
