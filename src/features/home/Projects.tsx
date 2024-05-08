'use client';
import { useState } from 'react';

export const Projects = () => {
	const [sort, setSort] = useState();
	return (
		<div className='flex'>
			<div className='flex'>
				<p className='text-gray-50'>Sort By</p>
			</div>
		</div>
	);
};
