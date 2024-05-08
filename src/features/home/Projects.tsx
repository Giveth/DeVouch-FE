'use client';
import { useState } from 'react';

export const Projects = () => {
	const [sort, setSort] = useState();
	return (
		<div className='container mx-auto'>
			<div className='flex'>
				<div className='flex'>
					<p className='text-gray-400'>Sort By</p>
				</div>
			</div>
		</div>
	);
};
