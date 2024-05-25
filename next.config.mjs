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
		],
	},
};

export default nextConfig;
