import { useRef, useState, useMemo, useCallback, type FC } from 'react';
import Image from 'next/image';
import { useAccount } from 'wagmi';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { Address } from 'viem';
import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { AttestInfo } from './AttestsInfo/AttestInfo';
import { OutlineButtonType, OutlineButton } from '../Button/OutlineButton';
import { AttestModal } from '../Modal/AttestModal.tsx/AttestModal';
import { type IProject, type ProjectAttestation } from '@/features/home/types';
import { SourceBadge } from '../SourceBadge';
import { PROJECT_DESC_LIMIT } from './constant';
import { AttestsInfo } from './AttestsInfo/AttestsInfo';
import { ROUTES } from '@/config/routes';

interface IProjectCardProps {
	project: IProject;
	queryKey: (string | string[])[];
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

export const NO_DATA = 'No data available to show here!';

export const ProjectCard: FC<IProjectCardProps> = ({ project, queryKey }) => {
	const [showAttestModal, setShowAttestModal] = useState(false);
	const [isHovered, setIsHovered] = useState(false);
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
		<div className='relative group/card max-w-full'>
			<div className='absolute w-full h-full top-0 left-0 group-hover/card:top-2 group-hover/card:-left-2 bg-black transition-all duration-100'></div>
			<div
				className='p-8 border h-full border-gray-100 bg-white hover:border-black flex flex-col gap-6 relative'
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
			>
				<Link
					href={`${ROUTES.PROJECT}/${project.source}/${project.projectId}`}
				>
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
							rfRound={project.rfRounds}
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
				</Link>
				<Link
					href={`${ROUTES.PROJECT}/${project.source}/${project.projectId}`}
					className='flex-1'
				>
					<div>
						<h3 className='text-2xl font-bold mb-1  max-w-full break-word'>
							{project.title || NO_DATA}
						</h3>
						{project?.sourceCreatedAt && (
							<p className='mb-1'>
								<span className='text-neutral-400'>
									Created
								</span>{' '}
								{new Date(
									project.sourceCreatedAt,
								).toLocaleDateString('en-US', {
									year: 'numeric',
									month: 'long',
									day: '2-digit',
								})}
							</p>
						)}
						<p className='text-gray-400 max-w-full break-all mt-1'>
							{project.descriptionSummary
								? project.descriptionSummary.length >
									PROJECT_DESC_LIMIT
									? project.descriptionSummary.substring(
											0,
											PROJECT_DESC_LIMIT,
										) + '...'
									: project.descriptionSummary
								: NO_DATA}
						</p>
					</div>
				</Link>
				<div>
					<h4 className='text-lg font-bold mb-4'>Vouched By</h4>
					<div className='flex gap-2 flex-wrap'>
						<AttestsInfo
							attests={vouches}
							vouch
							isHovered={isHovered}
						/>
					</div>
				</div>
				<div>
					<h4 className='text-lg font-bold mb-4'>Flagged By</h4>
					<div className='flex gap-2 flex-wrap'>
						<AttestsInfo attests={flags} isHovered={isHovered} />
					</div>
				</div>
				<div className='flex flex-col md:flex-row gap-6'>
					<OutlineButton
						buttonType={OutlineButtonType.BLUE}
						className='flex-1'
						onClick={e => onAttestClick(true)}
					>
						Vouch For Project
					</OutlineButton>
					<OutlineButton
						buttonType={OutlineButtonType.RED}
						onClick={e => onAttestClick(false)}
					>
						Flag Project
					</OutlineButton>
				</div>
			</div>

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
