/** @type {import('next').NextConfig} */
const emptyModule = './src/lib/empty-module.cjs';

const nextConfig = {
	turbopack: {
		// `@coinbase/cdp-sdk` (pulled in via wagmi's Base Account connector)
		// lazily imports these optional x402 payment packages. They are not
		// installed and never used here, so resolve them to an empty module
		// instead of failing the build.
		resolveAlias: {
			'@x402/core/client': emptyModule,
			'@x402/evm': emptyModule,
			'@x402/evm/exact/client': emptyModule,
			'@x402/evm/upto/client': emptyModule,
			'@x402/svm/exact/client': emptyModule,
		},
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
			{
				protocol: 'https',
				hostname: 'storage.googleapis.com',
			},
			{
				protocol: 'https',
				hostname: 'cdn.charmverse.io',
			},
			{
				protocol: 'https',
				hostname: 'i.imgur.com',
			},
			{
				protocol: 'https',
				hostname: 'v6-staging.giveth.io',
			},
			{
				protocol: 'https',
				hostname: 'qf.giveth.io',
			},
		],
	},
};

export default nextConfig;
