import React from 'react';
import { AttestInfo } from './AttestInfo';
import { Button, ButtonType } from '../Button/Button';

export const ProjectCard = () => {
	return (
		<div className='relative group'>
			<div className='absolute w-full h-full top-0 left-0 group-hover:top-2 group-hover:-left-2 bg-black transition-all '></div>
			<div className='p-8 border border-gray-100 bg-white hover:border-black flex flex-col gap-6 relative'>
				<div className='h-56 bg-blue-100'></div>
				<div>
					<h3 className='text-2xl font-bold mb-2'>Project Name</h3>
					<p className='text-gray-400'>Project Description</p>
				</div>
				<div>
					<h4 className='text-lg font-bold'>Vouched By</h4>
					<div className='flex'>
						<AttestInfo count={17} organization='Optimism Group' />
					</div>
				</div>
				<div>
					<h4 className='text-lg font-bold'>Flagged By</h4>
					<div className='flex'>
						<AttestInfo count={3} organization='Optimism Group' />
					</div>
				</div>
				<div className='flex'>
					<Button buttonType={ButtonType.BLUE}>
						Vouch For Project
					</Button>
				</div>
			</div>
		</div>
	);
};
