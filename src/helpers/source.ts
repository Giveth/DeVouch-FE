export const getSourceLink = (source: string) => {
	switch (source) {
		case 'giveth':
			return 'https://www.giveth.io';
		default:
			return '/';
	}
};
