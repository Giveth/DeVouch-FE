import React, { type FC } from 'react';
import Image from 'next/image';
import { AttestInfo } from './AttestInfo';
import { OutlineButtonType, OutlineButton } from '../Button/OutlineButton';

interface IProjectCardProps {
	project: IProject;
}

export const ProjectCard: FC<IProjectCardProps> = ({ project }) => {
	return (
		<div className='relative group'>
			<div className='absolute w-full h-full top-0 left-0 group-hover:top-2 group-hover:-left-2 bg-black transition-all '></div>
			<div className='p-8 border h-full border-gray-100 bg-white hover:border-black flex flex-col gap-6 relative'>
				<div className='h-56 bg-blue-100 relative'>
					{project.image && (
						<Image
							src={project.image}
							layout='fill'
							objectFit='cover'
							alt='Project Image'
						/>
					)}
				</div>
				<div className='flex-1'>
					<h3 className='text-2xl font-bold mb-2'>{project.title}</h3>
					<p className='text-gray-400'>{project.description}</p>
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
				<div className='flex gap-6'>
					<OutlineButton
						buttonType={OutlineButtonType.BLUE}
						className='flex-1'
					>
						Vouch For Project
					</OutlineButton>
					<OutlineButton buttonType={OutlineButtonType.RED}>
						Flag Project
					</OutlineButton>
				</div>
			</div>
		</div>
	);
};
