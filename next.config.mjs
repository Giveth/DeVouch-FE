/** @type {import('next').NextConfig} */
const nextConfig = {
	webpack: config => {
		config.externals.push('pino-pretty', 'lokijs', 'encoding');
		return config;
	},

	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'giveth.mypinata.cloud',
			},
			{
				protocol: 'https',
				hostname: 'static.tgbwidget.com',
			},
			{
				protocol: 'https',
				hostname: 'images.unsplash.com',
			},
			{
				protocol: 'https',
				hostname: 'ipfs.io',
			},
			{
				protocol: 'https',
				hostname: 'content.optimism.io',
			},
		],
	},
};

export default nextConfig;
