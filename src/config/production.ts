import { optimism } from 'wagmi/chains';

const config = {
	SUPPORTED_CHAINS: [optimism] as const,
	GRAPHQL_ENDPOINT:
		process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT ||
		'https://optimism.backend.devouch.xyz/graphql',
	EAS_CONTRACT_ADDRESS:
		process.env.NEXT_PUBLIC_EAS_CONTRACT_ADDRESS ||
		'0x4200000000000000000000000000000000000021',
	SOURCE_PLATFORMS: [
		{ key: 'Giveth', value: 'giveth' },
		{ key: 'Gitcoin', value: 'gitcoin' },
		{ key: 'Retro Funding 4', value: 'rf4' },
		{ key: 'Retro Funding 5', value: 'rf5' },
	],
};

export default config;
