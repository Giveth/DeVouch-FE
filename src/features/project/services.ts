import { fetchGraphQL } from '@/helpers/request';
import { VouchFilter } from '../profile/types';
import {
	FETCH_PROJECT_ATTESTATIONS,
	FETCH_PROJECT_ATTESTATIONS_TOTAL_COUNT,
	FETCH_PROJECT_BY_ID,
	FETCH_PROJECT_METADATA_BY_ID,
} from './queries';
import { ITEMS_PER_PAGE } from './constants';
import { IProject, ProjectAttestation } from '../home/types';

export const fetchProjectAttestations = async (
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
	const data = await fetchGraphQL<{
		projectAttestations: ProjectAttestation[];
	}>(FETCH_PROJECT_ATTESTATIONS, {
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
	});
	return data.projectAttestations;
};

export const fetchProjectAttestationsTotalCount = async (
	source: string,
	projectId: string,
	organisation?: string[],
	address?: string,
) => {
	const id = `${source}-${projectId}`;
	const data = await fetchGraphQL<{
		userAttestations: { totalCount: number };
		vouches: { totalCount: number };
		flags: { totalCount: number };
		attests: { totalCount: number };
	}>(FETCH_PROJECT_ATTESTATIONS_TOTAL_COUNT, {
		projectId: id,
		organisation,
		address: address?.toLowerCase(),
	});
	return data;
};

export const fetchProjectData = async (source: string, projectId: string) => {
	const id = `${source}-${projectId}`;
	const data = await fetchGraphQL<{ projects: IProject[] }>(
		FETCH_PROJECT_BY_ID,
		{
			id,
		},
	);
	return data.projects[0];
};

export const fetchProjectMetaData = async (
	source: string,
	projectId: string,
) => {
	const id = `${source}-${projectId}`;
	const data = await fetchGraphQL<{ projects: IProject[] }>(
		FETCH_PROJECT_METADATA_BY_ID,
		{
			id,
		},
	);
	return data.projects[0];
};
