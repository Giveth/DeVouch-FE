export const generateFetchProjectsQuery = (
	projectSource?: string[],
	organisationId?: string[],
	term?: string,
) => {
	const conditions = ['imported_eq: true'];
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

	if (term) {
		conditions.push('title_containsInsensitive: $term');
		props.push('$term: String');
	}

	const whereClause = `where: { ${conditions.join(', ')} }`;

	const addedProps = props.length > 0 ? `,${props.join(', ')}` : '';

	return `
	query fetchProjects(
		$offset: Int!,
		$limit: Int,
		$orderBy: [ProjectOrderByInput!] = lastUpdatedTimestamp_DESC
		${addedProps}
	  ) {
		projects(
		  offset: $offset,
		  limit: $limit,
		  orderBy: $orderBy,
		  ${whereClause}
		) {
		  id
		  projectId
		  title
		  description
		  image
		  source
		  url
		  attests {
			id
			vouch
			attestorOrganisation {
			  attestor {
				id
			  }
			  organisation {
				id
				name
				color
			  }
			}
		  }
		}
	  }
`;
};
