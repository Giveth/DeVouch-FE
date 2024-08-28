import { IProject } from '@/features/home/types';

export const getSourceLink = (project?: IProject) => {
	if (!project) return '/';
	switch (project.source) {
		case 'giveth':
			return 'https://www.giveth.io';
		case 'rf':
			return 'https://retrolist.app';
		case 'gitcoin':
			return 'https://explorer.gitcoin.co';
		default:
			return '/';
	}
};
