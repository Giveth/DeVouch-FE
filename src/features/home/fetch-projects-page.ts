import {
	generateFetchProjectsByIdsQuery,
	generateFetchProjectsQuery,
	generateGetProjectsSortedByVouchOrFlagQuery,
} from './query-genrator';
import type { IProject } from './types';

export const PROJECTS_PAGE_SIZE = 20;

export type GraphQLRequest = <T>(
	query: string,
	variables: Record<string, any>,
) => Promise<T>;

export interface IProjectsPageParams {
	sourceParams: string[];
	organisationParams: string[];
	sortParam: string;
	termParam: string;
}

export interface IProjectsPage {
	projects: IProject[];
	nextPage: number | undefined;
}

// One page of the explore listing. Hidden projects (`imported = false`, e.g.
// Giveth projects deactivated upstream - DeVouch-BE #190) are excluded by the
// backend in both branches, never client-side, so `offset`/`limit` always page
// over visible projects only:
// - `getProjectsSortedByVouchOrFlag` filters `project.imported = true` itself;
// - the generated `projects` query carries `imported_eq: true` in its `where`.
export const fetchProjectsPage = async (
	request: GraphQLRequest,
	{
		sourceParams,
		organisationParams,
		sortParam,
		termParam,
	}: IProjectsPageParams,
	pageParam = 0,
	limit = PROJECTS_PAGE_SIZE,
): Promise<IProjectsPage> => {
	const nonRfSources = sourceParams.filter(
		source => !source.startsWith('rf'),
	);
	const rfSources = sourceParams.filter(source => source.startsWith('rf'));
	const rfRounds = rfSources.map(source =>
		parseInt(source.replace('rf', ''), 10),
	);

	const queryVariables = {
		orderBy: [sortParam, 'lastUpdatedTimestamp_DESC'],
		limit,
		offset: pageParam,
		non_rf_sources: nonRfSources,
		rf_rounds: rfRounds,
		organisation_id: organisationParams,
		term: termParam,
	};

	if (organisationParams.length > 0) {
		// Fetch sorted project IDs
		const allSources = sourceParams.some(s => s.startsWith('rf'))
			? ['rf', ...sourceParams.filter(s => !s.startsWith('rf'))]
			: nonRfSources;
		const idsData = await request<{
			getProjectsSortedByVouchOrFlag: { id: string }[];
		}>(generateGetProjectsSortedByVouchOrFlagQuery(), {
			organizations: organisationParams,
			sortBy: sortParam,
			limit,
			offset: pageParam,
			sources: allSources,
			rfRounds: rfRounds.length > 0 ? rfRounds : [],
		});
		const projectIds = idsData.getProjectsSortedByVouchOrFlag.map(
			item => item.id,
		);

		if (projectIds.length === 0) {
			return {
				projects: [],
				nextPage: undefined,
			};
		}

		// Fetch full project data
		const data = await request<{ projects: IProject[] }>(
			generateFetchProjectsByIdsQuery(),
			{
				ids: projectIds,
			},
		);

		const projectsMap = new Map(
			data.projects.map(project => [project.id, project]),
		);
		const sortedProjects = projectIds
			.map(id => projectsMap.get(id))
			.filter((project): project is IProject => Boolean(project));

		return {
			projects: sortedProjects,
			nextPage:
				projectIds.length === limit ? pageParam + limit : undefined,
		};
	}

	const data = await request<{ projects: IProject[] }>(
		generateFetchProjectsQuery(
			sourceParams,
			organisationParams,
			termParam,
			rfRounds,
		),
		queryVariables,
	);

	return {
		projects: data.projects,
		nextPage:
			data.projects.length === limit ? pageParam + limit : undefined,
	};
};
