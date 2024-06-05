import { Address } from 'viem';
import { fetchGraphQL } from '@/helpers/request';
import { ProjectAttestation } from '../home/types';
import { FETCH_USER_ATTESTATIONS } from '../project/queries';
import { ITEMS_PER_PAGE } from './constants';
import { VouchFilter } from './types';

export const fetchUserAttestations = async ({
	queryKey,
}: {
	queryKey: (string | number | object)[];
}) => {
	const [, address, page, orderBy, organisation, vouch] = queryKey;
	const data = await fetchGraphQL<{
		projectAttestations: ProjectAttestation[];
		Vouches: { totalCount: number };
		Flags: { totalCount: number };
		Attests: { totalCount: number };
	}>(FETCH_USER_ATTESTATIONS, {
		address: (address as Address).toLowerCase(),
		limit: ITEMS_PER_PAGE,
		offset: (page as number) * ITEMS_PER_PAGE,
		orderBy: [orderBy],
		organisation: organisation as string[] | undefined,
		vouch:
			vouch === VouchFilter.VOUCHED
				? true
				: vouch === VouchFilter.FLAGGED
					? false
					: undefined,
	});

	return {
		attestations: data?.projectAttestations,
		totalVouches: data?.Vouches.totalCount,
		totalFlags: data?.Flags.totalCount,
		totalAttests: data?.Attests.totalCount,
	};
};
