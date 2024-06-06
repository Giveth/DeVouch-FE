import { optimism } from 'wagmi/chains';

const config = {
	SUPPORTED_CHAINS: [optimism] as const,
	EAS_CONTRACT_ADDRESS:
		process.env.NEXT_PUBLIC_EAS_CONTRACT_ADDRESS ||
		'0x4200000000000000000000000000000000000021',
	SOURCE_PLATFORMS: [
		{ key: 'Giveth', value: 'giveth' },
		{ key: 'Gitcoin', value: 'gitcoin' },
		{ key: 'Retro Funding 4', value: 'rf4' },
	],
};

export default config;
