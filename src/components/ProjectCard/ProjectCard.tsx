import { useRef, useState, useMemo, useCallback, type FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { Address } from 'viem';
import { useQueryClient } from '@tanstack/react-query';
import { AttestInfo } from './AttestInfo';
import { OutlineButtonType, OutlineButton } from '../Button/OutlineButton';
import { AttestModal } from '../Modal/AttestModal.tsx/AttestModal';
import { type IProject, type ProjectAttestation } from '@/features/home/types';
import { SourceBadge } from '../SourceBadge';
import { ROUTES } from '@/config/routes';
import { PROJECT_DESC_LIMIT } from './constant';

interface IProjectCardProps {
	project: IProject;
	queryKey?: (
		| string
		| {
				[key: string]: string[];
		  }
	)[];
}

interface IPage {
	projects: IProject[];
	nextPage: number | undefined;
}

interface IData {
	pages: IPage[];
	pageParams: number[];
}

const updateProjectInData = (data: IData, newProject: IProject) => {
	return {
		...data,
		pages: data.pages.map(page => ({
			...page,
			projects: page.projects.map(project =>
				project.id === newProject.id ? newProject : project,
			),
		})),
	};
};

const analyzeAttests = (
	attests?: ProjectAttestation[],
	address?: Address,
): {
	vouches: { id: string; info: AttestInfo }[];
	flags: { id: string; info: AttestInfo }[];
	attestedByMe: ProjectAttestation | undefined;
} => {
	const res: {
		vouches: {
			[key: string]: AttestInfo;
		};
		flags: {
			[key: string]: AttestInfo;
		};
	} = {
		vouches: {},
		flags: {},
	};
	if (!attests) return { vouches: [], flags: [], attestedByMe: undefined };
	let attestedByMe: ProjectAttestation | undefined = undefined;
	attests.forEach(attest => {
		const label = attest.vouch ? 'vouches' : 'flags';
		const organisation = attest.attestorOrganisation.organisation;
		if (res[label][attest.attestorOrganisation.organisation.id]) {
			res[label][attest.attestorOrganisation.organisation.id].count++;
		} else {
			res[label][attest.attestorOrganisation.organisation.id] = {
				count: 1,
				color: organisation.color,
				name: organisation.name,
			};
		}
		if (attestedByMe || !address) return;
		attestedByMe =
			attest.attestorOrganisation.attestor.id.toLowerCase() ===
			address?.toLowerCase()
				? attest
				: undefined;
	});
	return {
		vouches: Object.entries(res.vouches).map(([id, info]) => ({
			id,
			info,
		})),
		flags: Object.entries(res.flags).map(([id, info]) => ({ id, info })),
		attestedByMe,
	};
};

const NO_DATA = 'No data available to show here!';

export const ProjectCard: FC<IProjectCardProps> = ({ project, queryKey }) => {
	const [showAttestModal, setShowAttestModal] = useState(false);
	const { address } = useAccount();
	const { open: openWeb3Modal } = useWeb3Modal();
	const queryClient = useQueryClient();

	const { vouches, flags, attestedByMe } = useMemo(
		() => analyzeAttests(project.attests, address),
		[address, project.attests],
	);
	const isVouching = useRef(true);

	const onAttestClick = (_vouch: boolean) => {
		if (address) {
			isVouching.current = _vouch;
			setShowAttestModal(true);
		} else {
			openWeb3Modal();
		}
	};

	const onAttestSuccess = useCallback(
		(updatedProject: IProject) => {
			if (!queryKey) return;
			queryClient.setQueryData(queryKey, (oldData: any) => {
				if (!oldData) return oldData; // In case oldData is undefined or null

				return updateProjectInData(oldData, updatedProject);
			});
		},
		[queryClient],
	);

	return (
		<div className='relative group/card'>
			<div className='absolute w-full h-full top-0 left-0 group-hover/card:top-2 group-hover/card:-left-2 bg-black transition-all '></div>
			<Link
				href={`${ROUTES.PROJECT}/${project.source}/${project.projectId}`}
			>
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
						<SourceBadge
							source={project.source}
							className='absolute top-2 left-2'
						/>
						{attestedByMe && (
							<div className='absolute flex gap-1 bg-white py-1 px-2 bottom-2 right-2 z-auto'>
								<span className='text-gray-800 font-light'>
									You’ve already attested
								</span>
								{attestedByMe.vouch ? (
									<Image
										src={'/images/icons/vouched.svg'}
										alt={'vouched'}
										width={16}
										height={16}
									/>
								) : (
									<Image
										src={'/images/icons/red-flag.svg'}
										alt={'red-flag'}
										width={10}
										height={16}
									/>
								)}
							</div>
						)}
					</div>
					<div className='flex-1'>
						<h3 className='text-2xl font-bold mb-2'>
							{project.title || NO_DATA}
						</h3>
						<p className='text-gray-400'>
							{project.description
								? project.description.length >
									PROJECT_DESC_LIMIT
									? project.description.substring(
											0,
											PROJECT_DESC_LIMIT,
										) + '...'
									: project.description
								: NO_DATA}
						</p>
					</div>
					<div>
						<h4 className='text-lg font-bold mb-4'>Vouched By</h4>
						<div className='flex gap-2'>
							{vouches.length > 0 ? (
								vouches.map(vouch => (
									<AttestInfo
										key={vouch.id}
										info={vouch.info}
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
								flags.map(flag => (
									<AttestInfo
										key={flag.id}
										info={flag.info}
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
							onClick={e => {
								e.stopPropagation();
								e.preventDefault();
								onAttestClick(true);
							}}
						>
							Vouch For Project
						</OutlineButton>
						<OutlineButton
							buttonType={OutlineButtonType.RED}
							onClick={e => {
								e.stopPropagation();
								e.preventDefault();
								onAttestClick(false);
							}}
						>
							Flag Project
						</OutlineButton>
					</div>
				</div>
			</Link>
			{showAttestModal && (
				<AttestModal
					setShowModal={setShowAttestModal}
					showModal={showAttestModal}
					project={project}
					vouch={isVouching.current}
					onSuccess={onAttestSuccess}
				/>
			)}
		</div>
	);
};
