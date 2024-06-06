import { IOrganisation } from '@/features/home/types';
import { fetchGraphQL } from '@/helpers/request';
import { FETCH_ORGANISATIONS } from '@/queries/organizations';

export const fetchOrganization = async () => {
	const data = await fetchGraphQL<{
		organisations: IOrganisation[];
	}>(FETCH_ORGANISATIONS);

	return data?.organisations || [];
};
