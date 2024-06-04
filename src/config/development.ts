const config = {
	EAS_CONTRACT_ADDRESS:
		process.env.NEXT_PUBLIC_EAS_CONTRACT_ADDRESS ||
		'0xC2679fBD37d54388Ce493F1DB75320D236e1815e',
	PROJECT_VERIFY_SCHEMA:
		process.env.NEXT_PUBLIC_PROJECT_VERIFY_SCHEMA ||
		'0x97b0c9911936fad57e77857fac6eef6771f8d0bf025be9549214e32bf9e2415a',
	SOURCE_PLATFORMS: [
		{ key: 'Giveth', value: 'giveth' },
		{ key: 'Gitcoin', value: 'gitcoin' },
		{ key: 'Retro Funding', value: 'rpgf3' },
	],
	ATTESTOR_GROUPS: [
		{
			key: 'Giveth Verification Team',
			value: '0xf63f2a7159ee674aa6fce42196a8bb0605eafcf20c19e91a7eafba8d39fa0404',
		},
		{
			key: 'Trace',
			value: '0x2e22df9a11e06c306ed8f64ca45ceae02efcf8a443371395a78371bc4fb6f722',
		},
	],
};

export default config;
