export const getSourceLink = (source: string) => {
	switch (source) {
		case 'giveth':
			return 'https://www.giveth.io';
		case 'retro_funding':
			return 'https://retrofunding.optimism.io/';
		case 'gitcoin':
			return 'https://www.gitcoin.co/';
		default:
			return '/';
	}
};
