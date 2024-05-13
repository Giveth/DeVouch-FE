'use client';
import { useState } from 'react';
import { Select, type IOption } from '@/components/Select/Select';
import { ProjectCard } from '@/components/ProjectCard/ProjectCard';

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

export const Projects = () => {
	const [sort, setSort] = useState(sortOptions[0]);
	return (
		<div className='container mx-auto flex flex-col gap-10'>
			<div className='flex'>
				<div className='flex gap-4 items-center'>
					<p className='text-gray-400'>Sort By</p>
					<Select
						options={sortOptions}
						value={sort}
						setValue={setSort}
						className='w-60'
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
