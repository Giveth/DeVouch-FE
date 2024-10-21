import { IProject } from '@/features/home/types';

export const getSourceLink = (project?: IProject) => {
	if (!project) return '/';
	switch (project.source) {
		case 'giveth':
			return 'https://www.giveth.io';
		case 'rf':
			//TODO: IDs are not matching with current projects of retrolist
			// if (project.rfRounds && project.rfRounds.length > 0) {
			// 	const latestRound =
			// 		project.rfRounds[project.rfRounds.length - 1];
			// 	return `https://round${latestRound}.retrolist.app`;
			// }
			return 'https://retrolist.app';
		case 'gitcoin':
			return 'https://explorer.gitcoin.co';
		default:
			return '/';
	}
};
