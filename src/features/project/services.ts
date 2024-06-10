import { fetchGraphQL } from '@/helpers/request';
import { VouchFilter } from '../profile/types';
import { FETCH_PROJECT_ATTESTATIONS, FETCH_PROJECT_BY_ID } from './queries';
import { ITEMS_PER_PAGE } from './constants';
import { IProject } from '../home/types';

export const fetchProjectAttestationsData = async (
	source: string,
	projectId: string,
	limit: number,
	page: number,
	organisation?: string[],
	address?: string,
	attestorAddressFilter?: string,
	vouch?: VouchFilter | undefined,
) => {
	const id = `${source}-${projectId}`;
	const data = await fetchGraphQL<{ projects: any[] }>(
		FETCH_PROJECT_ATTESTATIONS,
		{
			projectId: id,
			limit,
			offset: page * ITEMS_PER_PAGE,
			organisation,
			address: address?.toLowerCase(),
			attestorAddressFilter: attestorAddressFilter?.toLowerCase(),
			vouch:
				vouch === VouchFilter.VOUCHED
					? true
					: vouch === VouchFilter.FLAGGED
						? false
						: undefined,
		},
	);
	return data;
};

export const fetchProjectData = async (source: string, projectId: string) => {
	const id = `${source}-${projectId}`;
	const data = await fetchGraphQL<{ projects: any[] }>(FETCH_PROJECT_BY_ID, {
		id,
	});
	return data.projects[0] as IProject;
};
