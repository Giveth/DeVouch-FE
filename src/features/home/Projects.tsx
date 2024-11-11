'use client';
import { useCallback, useMemo } from 'react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Select, type IOption } from '@/components/Select/Select';
import { ProjectCard } from '@/components/ProjectCard/ProjectCard';
import FilterMenu from '@/components/FilterMenu/FilterMenu';
import { fetchGraphQL } from '@/helpers/request';
import { Button, ButtonType } from '@/components/Button/Button';
import {
	generateFetchProjectsByIdsQuery,
	generateFetchProjectsQuery,
	generateGetProjectsSortedByVouchOrFlagQuery,
} from './query-genrator';
import config from '@/config/configuration';
import { Spinner } from '@/components/Loading/Spinner';
import { SearchInput } from './SearchInput';
import { IProject } from './types';
import { fetchOrganization } from '@/services/organization';
import SelectedFilters from './SelectedFilters';

enum EProjectSort {
	NEWEST = 'lastUpdatedTimestamp_DESC',
	OLDEST = 'lastUpdatedTimestamp_ASC',
	HIGHEST_VOUCH_COUNT = 'totalVouches_DESC',
	LOWEST_VOUCH_COUNT = 'totalVouches_ASC',
	HIGHEST_FLAG = 'totalFlags_DESC',
	LOWEST_FLAG = 'totalFlags_ASC',
}

const sortOptions: IOption[] = [
	{
		key: EProjectSort.HIGHEST_VOUCH_COUNT,
		value: 'Most Vouches',
	},
	{
		key: EProjectSort.LOWEST_VOUCH_COUNT,
		value: 'Least Vouches',
	},
	{
		key: EProjectSort.HIGHEST_FLAG,
		value: 'Most Flags',
	},
	{
		key: EProjectSort.LOWEST_FLAG,
		value: 'Least Flags',
	},
];

export enum FilterKey {
	SOURCE = 'source',
	ORGANIZATION = 'organization',
}

const options = {
	[FilterKey.SOURCE]: config.SOURCE_PLATFORMS,
	[FilterKey.ORGANIZATION]: [] as IOption[],
};

export const optionSectionLabel = {
	[FilterKey.SOURCE]: 'Source Platform',
	[FilterKey.ORGANIZATION]: 'Attested By',
};

const limit = 20;
const defaultSort = sortOptions[0];

export const Projects = () => {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const router = useRouter();

	const sourceParams = searchParams.getAll(FilterKey.SOURCE);
	const organisationParams = searchParams.getAll(FilterKey.ORGANIZATION);
	const sortParam = searchParams.get('sort') || defaultSort.key;
	const termParam = searchParams.get('term') || '';

	const rfRounds = useMemo(() => {
		return sourceParams
			.filter(source => source.startsWith('rf'))
			.map(source => parseInt(source.replace('rf', ''), 10));
	}, [sourceParams]);

	const fetchProjects = async ({ pageParam = 0 }) => {
		const nonRfSources = sourceParams.filter(
			source => !source.startsWith('rf'),
		);
		const rfSources = sourceParams.filter(source =>
			source.startsWith('rf'),
		);
		const rfRounds = rfSources.map(source =>
			parseInt(source.replace('rf', ''), 10),
		);

		const queryVariables = {
			orderBy: [sortParam, 'lastUpdatedTimestamp_DESC'],
			limit: limit as number,
			offset: pageParam as number,
			non_rf_sources: nonRfSources,
			rf_rounds: rfRounds,
			organisation_id: organisationParams,
			term: termParam,
		};

		if (organisationParams.length > 0) {
			// Fetch sorted project IDs
			const allSources = sourceParams.some(s => s.startsWith('rf'))
				? ['rf', ...sourceParams.filter(s => !s.startsWith('rf'))]
				: sourceParams;
			const idsData = await fetchGraphQL<{
				getProjectsSortedByVouchOrFlag: { id: string }[];
			}>(generateGetProjectsSortedByVouchOrFlagQuery(), {
				organizations: organisationParams,
				sortBy: sortParam,
				limit: limit as number,
				offset: pageParam as number,
				sources: allSources,
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
			const data = await fetchGraphQL<{ projects: IProject[] }>(
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
		} else {
			// Existing logic
			const data = await fetchGraphQL<{ projects: IProject[] }>(
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
					data.projects.length === limit
						? pageParam + limit
						: undefined,
			};
		}
	};

	const {
		data,
		error,
		isLoading,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useInfiniteQuery({
		queryKey: [
			'projects',
			sourceParams,
			organisationParams,
			sortParam,
			termParam,
			rfRounds,
		],
		initialPageParam: 0,
		queryFn: fetchProjects,
		getNextPageParam: lastPage => lastPage.nextPage,
	});

	const { data: attestorGroups } = useQuery({
		queryKey: ['fetchOrganisations'],
		queryFn: fetchOrganization,
		staleTime: 3_600_000,
	});

	options.organization =
		attestorGroups?.map(group => ({ key: group.name, value: group.id })) ||
		[];

	const projects = data?.pages.flatMap(page => page.projects) || [];

	const createQueryString = useCallback(
		(name: string, value: string) => {
			const params = new URLSearchParams(searchParams.toString());
			params.set(name, value);

			return params.toString();
		},
		[searchParams],
	);

	const handleSearchTerm = (term: string) => {
		if (term === '' && termParam) {
			const params = new URLSearchParams(searchParams.toString());
			params.delete(term);
			router.push(pathname + '?' + params.toString(), {
				scroll: false,
			});
		}
		router.push(pathname + '?' + createQueryString('term', term), {
			scroll: false,
		});
	};

	const handleSort = (sort: IOption) => {
		router.push(pathname + '?' + createQueryString('sort', sort.key), {
			scroll: false,
		});
	};

	const handleApplyFilters = (filters: { [key: string]: string[] }) => {
		const params = new URLSearchParams(searchParams.toString());
		Object.entries(filters).forEach(([key, value]) => {
			params.delete(key);
			value.forEach(v => params.append(key, v));
		});
		router.push(pathname + '?' + params.toString(), { scroll: false });
	};

	const handleRemoveFilter = (
		type: 'source' | 'organization',
		value: string,
	) => {
		const params = new URLSearchParams(searchParams.toString());
		const currentValues = params.getAll(
			type === 'source' ? FilterKey.SOURCE : FilterKey.ORGANIZATION,
		);
		params.delete(
			type === 'source' ? FilterKey.SOURCE : FilterKey.ORGANIZATION,
		);

		currentValues
			.filter(v => v !== value)
			.forEach(v =>
				params.append(
					type === 'source'
						? FilterKey.SOURCE
						: FilterKey.ORGANIZATION,
					v,
				),
			);

		router.push(pathname + '?' + params.toString(), { scroll: false });
	};

	const handleClearAllFilters = () => {
		const params = new URLSearchParams(searchParams.toString());
		params.delete(FilterKey.SOURCE);
		params.delete(FilterKey.ORGANIZATION);
		router.push(pathname + '?' + params.toString(), { scroll: false });
	};

	return (
		<div className='container flex flex-col gap-10'>
			<div className='flex flex-col items-center lg:flex-row gap-4'>
				<div className='flex w-full lg:w-fit gap-4 items-center justify-between'>
					<p className='text-gray-400'>Sort By</p>
					<Select
						options={sortOptions}
						value={
							sortOptions.find(so => so.key === sortParam) ||
							defaultSort
						}
						setValue={handleSort}
						className='w-60'
					/>
				</div>
				<div className='flex-1' />
				<div className='hidden 2xl:block'>
					<SelectedFilters
						sources={sourceParams}
						organizations={organisationParams}
						attestorGroups={attestorGroups}
						onRemoveFilter={handleRemoveFilter}
						onClearAll={handleClearAllFilters}
					/>
				</div>
				<SearchInput setTerm={handleSearchTerm} />
				<div className='flex w-full lg:w-fit gap-4 items-center'>
					<FilterMenu
						options={options}
						onApplyFilters={handleApplyFilters}
						value={{
							[FilterKey.SOURCE]: sourceParams,
							[FilterKey.ORGANIZATION]: organisationParams,
						}}
						label='Filter'
						stickToRight={true}
					/>
				</div>
			</div>
			<div className='block 2xl:hidden'>
				<SelectedFilters
					sources={sourceParams}
					organizations={organisationParams}
					attestorGroups={attestorGroups}
					onRemoveFilter={handleRemoveFilter}
					onClearAll={handleClearAllFilters}
				/>
			</div>
			<h2 className='text-2xl font-bold'>Explore Projects </h2>
			{projects && projects.length > 0 ? (
				<div className='grid grid-col-1 lg:grid-cols-2 gap-8 mb-8'>
					{projects.map(project => (
						<ProjectCard
							key={project.id}
							project={project}
							queryKey={[
								'projects',
								sourceParams,
								organisationParams,
								sortParam,
								termParam,
							]}
						/>
					))}
				</div>
			) : (
				!isLoading && (
					<div className='text-center max-w-lg mx-auto py-11'>
						There are no projects that match your searched criteria.
						Please try adjusting your filters or search terms to
						find the desired projects.
					</div>
				)
			)}

			{isLoading && (
				<div className='flex items-center justify-center'>
					<Spinner
						size={32}
						color='blue'
						secondaryColor='lightgray'
					/>
				</div>
			)}
			{error && <div>Error loading projects: {error.message}</div>}
			{!isLoading && hasNextPage && (
				<div className='text-center'>
					<Button
						buttonType={ButtonType.BLUE}
						onClick={() => fetchNextPage()}
						loading={isFetchingNextPage}
						disabled={isFetchingNextPage}
					>
						{isFetchingNextPage
							? 'Loading More...'
							: 'Load More Projects'}
					</Button>
				</div>
			)}
		</div>
	);
};
