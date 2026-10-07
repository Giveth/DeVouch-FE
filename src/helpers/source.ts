import { IProject } from '@/features/home/types';
import { isProduction } from '@/config/configuration';

export const getSourceLink = (project?: IProject) => {
	if (!project) return '/';
	switch (project.source) {
		case 'giveth':
			// Staging points at the Giveth staging site so project links resolve
			return isProduction
				? 'https://www.giveth.io'
				: 'https://v6-staging.giveth.io';
		case 'rf':
			//TODO: IDs are not matching with current projects of retrolist
			if (project.rfRounds && project.rfRounds.length > 0) {
				const latestRound =
					project.rfRounds[project.rfRounds.length - 1];
				return `https://round${latestRound}.retrolist.app`;
			}
			return 'https://retrolist.app';
		case 'gitcoin':
			return 'https://explorer.gitcoin.co';
		case 'gardens':
			return 'https://app.gardens.fund/gardens';
		default:
			return '/';
	}
};
