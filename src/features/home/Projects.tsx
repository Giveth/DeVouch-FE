'use client';
import { useEffect, useState } from 'react';
import { Select, type IOption } from '@/components/Select/Select';
import { ProjectCard } from '@/components/ProjectCard/ProjectCard';
import FilterMenu from '@/components/FilterMenu/FilterMenu';
import { FETCH_PROJECTS } from '@/features/home/queries';
import useFetchGraphQL from '@/lib/useFetchGraphQL';

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

	const [projects, setProjects] = useState<Project[]>([]);
	const [page, setPage] = useState(0);
	const limit = 10;
	const { data, loading, error, refetch } = useFetchGraphQL<{
		projects: Project[];
	}>(FETCH_PROJECTS, { limit, offset: page * limit });

	useEffect(() => {
		if (data?.projects) {
			setProjects(prevProjects => [...prevProjects, ...data.projects]);
		}
	}, []);

	const handleLoadMore = () => {
		setPage(prevPage => prevPage + 1);
		refetch({ limit, offset: (page + 1) * limit });
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
				<ProjectCard />
				<ProjectCard />
				<ProjectCard />
				<ProjectCard />
			</div>
		</div>
	);
};
