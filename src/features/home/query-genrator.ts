export const generateFetchProjectsQuery = (
	projectSource?: string[],
	organisationId?: string[],
) => {
	const conditions = [];
	const props = [];
	if (projectSource && projectSource.length > 0) {
		conditions.push('source_in: $project_source');
		props.push('$project_source: [String!]');
	}

	if (organisationId && organisationId.length > 0) {
		conditions.push(
			'attestedOrganisations_some: { organisation: { id_in: $organisation_id } }',
		);
		props.push('$organisation_id: [String!]');
	}

	const whereClause =
		conditions.length > 0 ? `,where: { ${conditions.join(', ')} }` : '';

	const addedProps = props.length > 0 ? `,${props.join(', ')}` : '';

	return `
	query fetchProjects(
		$offset: Int!,
		$limit: Int,
		$orderBy: [ProjectOrderByInput!] = totalVouches_DESC
		${addedProps}
	  ) {
		projects(
		  offset: $offset,
		  limit: $limit,
		  orderBy: $orderBy
		  ${whereClause}
		) {
		  id
		  title
		  description
		  image
		  source
		  slug
		  totalVouches
		  totalFlags
		  attestedOrganisations {
			id
			vouch
			organisation {
			  id
			  name
			}
		  }
		}
	  }
`;
};
