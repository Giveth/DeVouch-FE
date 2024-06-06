'use client';
import { useCallback, useState } from 'react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Select, type IOption } from '@/components/Select/Select';
import { ProjectCard } from '@/components/ProjectCard/ProjectCard';
import FilterMenu from '@/components/FilterMenu/FilterMenu';
import { fetchGraphQL } from '@/helpers/request';
import { Button, ButtonType } from '@/components/Button/Button';
import { generateFetchProjectsQuery } from './query-genrator';
import config from '@/config/configuration';
import { Spinner } from '@/components/Loading/Spinner';
import { SearchInput } from './SearchInput';
import { IProject } from './types';
import { fetchOrganization } from '@/services/organization';

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
		value: 'Highest Vouch Count',
	},
	{
		key: EProjectSort.LOWEST_VOUCH_COUNT,
		value: 'Lowest Vouch Count',
	},
	{
		key: EProjectSort.HIGHEST_FLAG,
		value: 'Highest Flag',
	},
	{
		key: EProjectSort.LOWEST_FLAG,
		value: 'Lowest Flag',
	},
];

const options = {
	'Source Platform': config.SOURCE_PLATFORMS,
	'Attested By': [] as IOption[],
};

const limit = 10;

export const Projects = () => {
	// const [term, setTerm] = useState<string>('');
	const [sort, setSort] = useState(sortOptions[0]);
	const [filterValues, setFilterValues] = useState<{
		[key: string]: string[];
	}>({});
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const router = useRouter();

	const filterParams = searchParams.getAll('source');
	const organisationParams = searchParams.getAll('organisation');
	const sortParam = searchParams.get('sort');
	const termParam = searchParams.get('term') || '';

	const fetchProjects = async ({ pageParam = 0 }) => {
		const projectSource = filterValues['Source Platform'];
		const organisationId = filterValues['Attested By'];

		const data = await fetchGraphQL<{ projects: IProject[] }>(
			generateFetchProjectsQuery(
				projectSource,
				organisationId,
				termParam,
			),
			{
				orderBy: [sort.key, 'lastUpdatedTimestamp_DESC'],
				limit,
				offset: pageParam,
				project_source: projectSource,
				organisation_id: organisationId,
				term: termParam,
			},
		);

		return {
			projects: data.projects,
			nextPage:
				data.projects.length === limit ? pageParam + limit : undefined,
		};
	};

	const {
		data,
		error,
		isLoading,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useInfiniteQuery({
		queryKey: ['projects', filterValues, sort.key, termParam],
		initialPageParam: 0,
		queryFn: fetchProjects,
		getNextPageParam: lastPage => lastPage.nextPage,
	});

	const { data: attestorGroups } = useQuery({
		queryKey: ['fetchOrganisations'],
		queryFn: fetchOrganization,
		staleTime: 3_600_000,
	});

	options['Attested By'] =
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
			router.push(pathname + '?' + params.toString());
		}
		router.push(pathname + '?' + createQueryString('term', term));
	};

	return (
		<div className='container flex flex-col gap-10'>
			<div className='flex flex-col md:flex-row gap-4'>
				<div className='flex gap-4 items-center justify-between'>
					<p className='text-gray-400'>Sort By</p>
					<Select
						options={sortOptions}
						value={sort}
						setValue={setSort}
						className='w-60'
					/>
				</div>
				<div className='flex-1' />
				<SearchInput setTerm={handleSearchTerm} />
				<div className='flex gap-4 items-center'>
					<FilterMenu
						options={options}
						value={filterValues}
						setValues={setFilterValues}
						label='Filter'
						stickToRight={true}
						className='w-full'
					/>
				</div>
			</div>
			<h2 className='text-2xl font-bold'>Explore Projects </h2>
			<div className='grid grid-col-1 lg:grid-cols-2 gap-8 mb-8'>
				{projects.map(project => (
					<ProjectCard
						key={project.id}
						project={project}
						queryKey={[
							'projects',
							filterValues,
							sort.key,
							termParam,
						]}
					/>
				))}
			</div>
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
