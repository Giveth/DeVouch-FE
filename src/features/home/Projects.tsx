'use client';
import { useCallback, useEffect, useState } from 'react';
import { Select, type IOption } from '@/components/Select/Select';
import { ProjectCard } from '@/components/ProjectCard/ProjectCard';
import FilterMenu from '@/components/FilterMenu/FilterMenu';
import { fetchGraphQL } from '@/helpers/request';
import { FETCH_PROJECTS } from './queries';
import { Button } from '@/components/Button/Button';

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
	'Source Platform': ['Giveth', 'Gitcoin', 'Retro Funding'],
	'Attested By': ['Optimism Badge Holder', 'Giveth Verification'],
};

const limit = 10;

export const Projects = () => {
	const [sort, setSort] = useState(sortOptions[0]);
	const [filterValues, setFilterValues] = useState<{
		[key: string]: string[];
	}>({});
	const [loading, setLoading] = useState(false);
	const [projects, setProjects] = useState<IProject[]>([]);

	const fetchProjects = useCallback(
		async (append: boolean = false, offset: number) => {
			setLoading(true);
			try {
				const data = await fetchGraphQL<{ projects: IProject[] }>(
					FETCH_PROJECTS,
					{
						orderBy: sort.key,
						limit,
						offset,
					},
				);
				setProjects(prevProjects =>
					append
						? [...prevProjects, ...data.projects]
						: data.projects,
				);
			} catch (err: any) {
				// setError(err.message);
			} finally {
				setLoading(false);
				// setIsFetchingMore(false);
			}
		},
		[sort],
	);

	useEffect(() => {
		if (loading) return;
		fetchProjects(false, 0);
	}, [fetchProjects]);

	const handleLoadMore = () => {
		fetchProjects(true, projects.length);
	};

	if (loading && projects.length === 0)
		return (
			<div className='container mx-auto flex flex-col gap-10'>
				Loading ...
			</div>
		);

	return (
		<div className='container mx-auto flex flex-col gap-10'>
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
			<div className='grid grid-cols-2 gap-8 mb-8'>
				{projects.map(project => (
					<ProjectCard key={project.id} project={project} />
				))}
			</div>
			{!loading && (
				<div className='text-center'>
					<Button onClick={handleLoadMore}>Load More Projects</Button>
				</div>
			)}
		</div>
	);
};
