'use client';
import { useCallback, useEffect, useState } from 'react';
import { Select, type IOption } from '@/components/Select/Select';
import { ProjectCard } from '@/components/ProjectCard/ProjectCard';
import FilterMenu from '@/components/FilterMenu/FilterMenu';
import { fetchGraphQL } from '@/helpers/request';
import { Button, ButtonType } from '@/components/Button/Button';
import { generateFetchProjectsQuery } from './query-genrator';
import config from '@/config/configuration';

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
	'Attested By': config.ATTESTOR_GROUPS,
};

const limit = 10;

export const Projects = () => {
	const [sort, setSort] = useState(sortOptions[0]);
	const [filterValues, setFilterValues] = useState<{
		[key: string]: string[];
	}>({});
	const [loading, setLoading] = useState(false);
	const [projects, setProjects] = useState<IProject[]>([]);
	const [hasMore, setHasMore] = useState(true);

	console.log('filterValues', filterValues);

	const fetchProjects = useCallback(
		async (append: boolean = false, offset: number) => {
			setLoading(true);
			try {
				const projectSource = filterValues['Source Platform'];
				const organisationId = filterValues['Attested By'];

				const data = await fetchGraphQL<{ projects: IProject[] }>(
					generateFetchProjectsQuery(projectSource, organisationId),
					{
						orderBy: sort.key,
						limit,
						offset,
						project_source: projectSource,
						organisation_id: organisationId,
					},
				);

				if (data.projects.length < limit) {
					setHasMore(false);
				}
				setProjects(prevProjects =>
					append
						? [...prevProjects, ...data.projects]
						: data.projects,
				);
			} catch (err: any) {
				console.log('err', err.message);
			} finally {
				setLoading(false);
			}
		},
		[filterValues, sort.key],
	);

	useEffect(() => {
		fetchProjects(false, 0);
	}, [fetchProjects]);

	const handleLoadMore = () => {
		fetchProjects(true, projects.length);
	};

	if (loading && projects.length === 0)
		return (
			<div className='container flex flex-col gap-10'>Loading ...</div>
		);

	return (
		<div className='container flex flex-col gap-10'>
			<div className='flex justify-between'>
				<div className='flex gap-4 items-center'>
					<p className='text-gray-400'>Sort By</p>
					<Select
						options={sortOptions}
						value={sort}
						setValue={setSort}
						className='w-60'
					/>
				</div>
				<div className='flex gap-4 items-center'>
					<FilterMenu
						options={options}
						value={filterValues}
						setValues={setFilterValues}
						className='custom-class'
						label='Custom Filter'
						stickToRight={true}
					/>
				</div>
			</div>
			<h2 className='text-2xl font-bold'>Explore Projects </h2>
			<div className='grid grid-col-1 lg:grid-cols-2 gap-8 mb-8'>
				{projects.map(project => (
					<ProjectCard key={project.id} project={project} />
				))}
			</div>
			{!loading && hasMore && (
				<div className='text-center'>
					<Button
						buttonType={ButtonType.BLUE}
						onClick={handleLoadMore}
					>
						Load More Projects
					</Button>
				</div>
			)}
		</div>
	);
};
