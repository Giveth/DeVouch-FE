import { IProject } from '@/features/home/types';

export const getSourceLink = (project?: IProject) => {
	if (!project) return '/';
	switch (project.source) {
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
