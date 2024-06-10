import { Address } from 'viem';
import { fetchGraphQL } from '@/helpers/request';
import { ProjectAttestation } from '../home/types';

import { ITEMS_PER_PAGE } from './constants';
import { VouchFilter } from './types';
import {
	FETCH_USER_ATTESTATIONS,
	FETCH_USER_ATTESTATIONS_TOTAL_COUNT,
} from './queries';

export interface UserAttestationsInfo {
	attestations: ProjectAttestation[];
	totalVouches: number;
	totalFlags: number;
	totalAttests: number;
}

export const fetchUserAttestations = async ({
	queryKey,
}: {
	queryKey: (string | number | object | string[] | undefined)[];
}) => {
	const [, address, page, orderBy, organisation, vouch] = queryKey;
	const _organisation =
		(organisation as string[]).length === 0 ? undefined : organisation;
	const data = await fetchGraphQL<{
		projectAttestations: ProjectAttestation[];
		vouches: { totalCount: number };
		flags: { totalCount: number };
		attests: { totalCount: number };
	}>(FETCH_USER_ATTESTATIONS, {
		address: (address as Address).toLowerCase(),
		limit: ITEMS_PER_PAGE,
		offset: (page as number) * ITEMS_PER_PAGE,
		orderBy: [orderBy],
		organisation: _organisation as string[] | undefined,
		vouch:
			vouch === VouchFilter.VOUCHED
				? true
				: vouch === VouchFilter.FLAGGED
					? false
					: undefined,
	});

	return {
		attestations: data?.projectAttestations,
	};
};

export const fetchUserAttestationsTotalCount = async ({
	queryKey,
}: {
	queryKey: (string | number | object | string[] | undefined)[];
}) => {
	const [, address, organisation] = queryKey;
	const _organisation =
		(organisation as string[]).length === 0 ? undefined : organisation;
	const data = await fetchGraphQL<{
		vouches: { totalCount: number };
		flags: { totalCount: number };
		attests: { totalCount: number };
	}>(FETCH_USER_ATTESTATIONS_TOTAL_COUNT, {
		address: (address as Address).toLowerCase(),
		organisation: _organisation as string[] | undefined,
	});

	return {
		totalVouches: data?.vouches.totalCount,
		totalFlags: data?.flags.totalCount,
		totalAttests: data?.attests.totalCount,
	};
};
