export const generateFetchProjectsQuery = (
	projectSource?: string[],
	organisationId?: string[],
	term?: string,
	rfRounds?: number[],
) => {
	const conditions: string[] = ['imported_eq: true'];

	const props: string[] = [
		'$offset: Int!',
		'$limit: Int',
		'$orderBy: [ProjectOrderByInput!]',
	];

	if (projectSource && projectSource.length > 0) {
		const nonRfSources = projectSource.filter(
			source => !source.startsWith('rf'),
		);
		const hasRfSource = projectSource.some(source =>
			source.startsWith('rf'),
		);

		if (hasRfSource && rfRounds && rfRounds.length > 0) {
			conditions.push('rfRounds_containsAny: $rf_rounds');
			props.push('$rf_rounds: [Int!]');
		}

		if (nonRfSources.length > 0) {
			conditions.push('OR: { source_in: $non_rf_sources }');
			props.push('$non_rf_sources: [String!]');
		}
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

	const query = `
	query fetchProjects(${props.join(', ')}) {
	  projects(
		offset: $offset,
		limit: $limit,
		orderBy: $orderBy,
		${whereClause}
	  ) {
		id
		projectId
		title
		descriptionSummary
		image
		source
		rfRounds
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
	console.log({ query });
	return query;
};
