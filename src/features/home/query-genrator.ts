export const generateFetchProjectsQuery = (
	projectSource?: string[],
	organisationId?: string[],
	term?: string,
	rfRounds?: number[],
) => {
	const baseConditions: string[] = ['imported_eq: true'];
	const sourceConditions: string[] = [];

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
			sourceConditions.push('rfRounds_containsAny: $rf_rounds');
			props.push('$rf_rounds: [Int!]');
		}

		if (nonRfSources.length > 0) {
			sourceConditions.push('source_in: $non_rf_sources');
			props.push('$non_rf_sources: [String!]');
		}
	}

	if (organisationId && organisationId.length > 0) {
		baseConditions.push(
			'attestedOrganisations_some: { organisation: { id_in: $organisation_id } }',
		);
		props.push('$organisation_id: [String!]');
	}

	if (term) {
		baseConditions.push('title_containsInsensitive: $term');
		props.push('$term: String');
	}

	let whereClause: string;
	if (sourceConditions.length > 0) {
		whereClause = `where: { AND: [{ ${baseConditions.join(', ')} }, { OR: [{ ${sourceConditions.join(' }, { ')} }] }] }`;
	} else {
		whereClause = `where: { ${baseConditions.join(', ')} }`;
	}

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
		sourceCreatedAt
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

	return query;
};
