import React, { useState, type FC } from 'react';
import Image from 'next/image';
import { AttestInfo } from './AttestInfo';
import { OutlineButtonType, OutlineButton } from '../Button/OutlineButton';
import { AttestModal } from '../Modal/AttestModal.tsx/AttestModal';

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

const NO_DATA = 'No data available to show here!';

export const ProjectCard: FC<IProjectCardProps> = ({ project }) => {
	const [showAttestModal, setShowAttestModal] = useState(false);
	const { vouches, flags } = categorizeAttestedOrganisations(
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
							fill
							alt='Project Image'
							className='object-cover'
						/>
					)}
					<div className='absolute flex gap-1 bg-white py-1 px-2 top-2 left-2 z-auto'>
						<span className='text-gray-300'>From</span>
						<span className='text-black'>{project.source}</span>
					</div>
				</div>
				<div className='flex-1'>
					<h3 className='text-2xl font-bold mb-2'>
						{project.title || NO_DATA}
					</h3>
					<p className='text-gray-400'>
						{project.description || NO_DATA}
					</p>
				</div>
				<div>
					<h4 className='text-lg font-bold mb-4'>Vouched By</h4>
					<div className='flex gap-2'>
						{vouches.length > 0 ? (
							vouches.map(data => (
								<AttestInfo
									key={data.organization.id}
									count={data.count}
									organization={data.organization.name}
								/>
							))
						) : (
							<div className='bg-gray-100 py-1 px-2 w-full text-center'>
								No Vouches Received Yet
							</div>
						)}
					</div>
				</div>
				<div>
					<h4 className='text-lg font-bold mb-4'>Flagged By</h4>
					<div className='flex gap-2'>
						{flags?.length > 0 ? (
							flags.map(data => (
								<AttestInfo
									key={data.organization.id}
									count={data.count}
									organization={data.organization.name}
								/>
							))
						) : (
							<div className='bg-gray-100 py-1 px-2 w-full text-center'>
								No Flags Received Yet
							</div>
						)}
					</div>
				</div>
				<div className='flex gap-6'>
					<OutlineButton
						buttonType={OutlineButtonType.BLUE}
						className='flex-1'
						onClick={() => setShowAttestModal(true)}
					>
						Vouch For Project
					</OutlineButton>
					<OutlineButton buttonType={OutlineButtonType.RED}>
						Flag Project
					</OutlineButton>
				</div>
			</div>
			{showAttestModal && (
				<AttestModal
					setShowModal={setShowAttestModal}
					showModal={showAttestModal}
				/>
			)}
		</div>
	);
};
