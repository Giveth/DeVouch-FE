export const generateFetchProjectsQuery = (
	projectSource?: string[],
	organisationId?: string[],
	term?: string,
	rfRounds?: number[],
) => {
	const conditions = ['imported_eq: true'];
	const props = [];

	if (projectSource && projectSource.length > 0) {
		const nonRfSources = projectSource.filter(
			source => !source.startsWith('rf'),
		);
		const hasRfSource = projectSource.some(source =>
			source.startsWith('rf'),
		);

		if (nonRfSources.length > 0) {
			conditions.push('source_in: $non_rf_sources');
			props.push('$non_rf_sources: [String!]');
		}

		if (hasRfSource && rfRounds && rfRounds.length > 0) {
			conditions.push('source_eq: "rf"');
			conditions.push('rfRounds_containsAny: $rf_rounds');
			props.push('$rf_rounds: [Int!]');
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

	const addedProps = props.length > 0 ? `,${props.join(', ')}` : '';

	const query = `
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
	return query;
};
