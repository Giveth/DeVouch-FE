'use client';
import { useEffect, useState } from 'react';
import { Select, type IOption } from '@/components/Select/Select';
import { ProjectCard } from '@/components/ProjectCard/ProjectCard';
import FilterMenu from '@/components/FilterMenu/FilterMenu';
import { FETCH_PROJECTS } from '@/features/home/queries';
import { fetchGraphQL } from '@/helpers/request';

enum EProjectSort {
	NEWEST = 'newest',
	OLDEST = 'oldest',
	HIGHEST_VOUCH_COUNT = 'highest_count',
	LOWEST_VOUCH_COUNT = 'lowest_count',
	HIGHEST_FLAG = 'highest_flag',
	LOWEST_FLAG = 'lowest_flag',
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

export const Projects = () => {
	const [sort, setSort] = useState(sortOptions[0]);
	const [filterValues, setFilterValues] = useState<{
		[key: string]: string[];
	}>({});

	const [projects, setProjects] = useState<IProject[]>([]);
	const [page, setPage] = useState(0);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isFetchingMore, setIsFetchingMore] = useState(false);
	const limit = 10;

	const loadProjects = async (page: number, append: boolean = false) => {
		setLoading(true);
		setError(null);
		try {
			const data = await fetchGraphQL<{ projects: IProject[] }>(
				FETCH_PROJECTS,
				{ limit, offset: page * limit },
			);
			setProjects(prevProjects =>
				append ? [...prevProjects, ...data.projects] : data.projects,
			);
		} catch (err: any) {
			setError(err.message);
		} finally {
			setLoading(false);
			setIsFetchingMore(false);
		}
	};

	useEffect(() => {
		loadProjects(page);
	}, [page]);

	const handleLoadMore = () => {
		setPage(prevPage => prevPage + 1);
		setIsFetchingMore(true);
	};

	if (loading && page === 0) return <p>Loading...</p>;

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
			<button onClick={handleLoadMore} disabled={isFetchingMore}>
				{isFetchingMore ? 'Loading...' : 'Load More'}
			</button>
		</div>
	);
};
