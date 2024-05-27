import React, { type FC } from 'react';
import Image from 'next/image';
import { AttestInfo } from './AttestInfo';
import { OutlineButtonType, OutlineButton } from '../Button/OutlineButton';

interface IProjectCardProps {
	project: IProject;
}

const categorizeAttestedOrganisations = (
	attestedOrganisations: IAttestedOrganisation[],
) => {
	const vouches = attestedOrganisations.filter(
		attestedOrganisation => attestedOrganisation.vouch,
	);
	const flags = attestedOrganisations.filter(
		attestedOrganisation => !attestedOrganisation.vouch,
	);

	return {
		vouches: vouches.map(attestedOrganisation => ({
			count: vouches.filter(
				vouch =>
					vouch.organisation.id ===
					attestedOrganisation.organisation.id,
			).length,
			organization: attestedOrganisation.organisation,
		})),
		flags: flags.map(attestedOrganisation => ({
			count: flags.filter(
				flag =>
					flag.organisation.id ===
					attestedOrganisation.organisation.id,
			).length,
			organization: attestedOrganisation.organisation,
		})),
	};
};

export const ProjectCard: FC<IProjectCardProps> = ({ project }) => {
	const categorizedData = categorizeAttestedOrganisations(
		project.attestedOrganisations,
	);

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
						{categorizedData.vouches.map(data => (
							<AttestInfo
								key={data.organization.id}
								count={data.count}
								organization={data.organization.name}
							/>
						))}
					</div>
				</div>
				<div>
					<h4 className='text-lg font-bold'>Flagged By</h4>
					<div className='flex'>
						{categorizedData.flags.map(data => (
							<AttestInfo
								key={data.organization.id}
								count={data.count}
								organization={data.organization.name}
							/>
						))}
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
