import { sepolia } from 'wagmi/chains';

const config = {
	SUPPORTED_CHAINS: [sepolia] as const,
	EAS_CONTRACT_ADDRESS:
		process.env.NEXT_PUBLIC_EAS_CONTRACT_ADDRESS ||
		'0xC2679fBD37d54388Ce493F1DB75320D236e1815e',
	PROJECT_VERIFY_SCHEMA:
		process.env.NEXT_PUBLIC_PROJECT_VERIFY_SCHEMA ||
		'0x97b0c9911936fad57e77857fac6eef6771f8d0bf025be9549214e32bf9e2415a',
	SOURCE_PLATFORMS: [
		{ key: 'Giveth', value: 'giveth' },
		{ key: 'Gitcoin', value: 'gitcoin' },
		// { key: 'RPGF 3', value: 'rpgf3' },
		{ key: 'Retro Funding 4', value: 'rf4' },
	],
};

export default config;
