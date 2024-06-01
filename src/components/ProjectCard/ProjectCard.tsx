import { useRef, useState, useMemo, type FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { Address } from 'viem';
import { AttestInfo } from './AttestInfo';
import { OutlineButtonType, OutlineButton } from '../Button/OutlineButton';
import { AttestModal } from '../Modal/AttestModal.tsx/AttestModal';

interface IProjectCardProps {
	project: IProject;
}

const analyzeAttests = (
	attests?: ProjectAttestation[],
	address?: Address,
): {
	vouches: { id: string; count: number }[];
	flags: { id: string; count: number }[];
	attestedByMe: ProjectAttestation | undefined;
} => {
	const res: {
		vouches: { [key: string]: number };
		flags: { [key: string]: number };
	} = {
		vouches: {},
		flags: {},
	};
	if (!attests) return { vouches: [], flags: [], attestedByMe: undefined };
	let attestedByMe: ProjectAttestation | undefined = undefined;
	attests.forEach(attest => {
		const label = attest.vouch ? 'vouches' : 'flags';
		if (res[label][attest.attestorOrganisation.organisation.name]) {
			res[label][attest.attestorOrganisation.organisation.name]++;
		} else {
			res[label][attest.attestorOrganisation.organisation.name] = 1;
		}
		if (attestedByMe || !address) return;
		attestedByMe =
			attest.attestorOrganisation.attestor.id.toLowerCase() ===
			address.toLowerCase()
				? attest
				: undefined;
	});
	return {
		vouches: Object.entries(res.vouches).map(([id, count]) => ({
			id,
			count,
		})),
		flags: Object.entries(res.flags).map(([id, count]) => ({ id, count })),
		attestedByMe,
	};
};

const NO_DATA = 'No data available to show here!';

export const ProjectCard: FC<IProjectCardProps> = ({ project }) => {
	const [showAttestModal, setShowAttestModal] = useState(false);
	const { address } = useAccount();
	const { open } = useWeb3Modal();

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
			open();
		}
	};

	return (
		<div className='relative group'>
			<div className='absolute w-full h-full top-0 left-0 group-hover:top-2 group-hover:-left-2 bg-black transition-all '></div>
			<div className='p-8 border h-full border-gray-100 bg-white hover:border-black flex flex-col gap-6 relative'>
				<Link href={`/project/${project.slug}`}>
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
							<span className='text-gray-300 font-light'>
								From
							</span>
							<span className='text-black'>{project.source}</span>
						</div>
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
							vouches.map(vouch => (
								<AttestInfo
									key={vouch.id}
									count={vouch.count}
									organization={vouch.id}
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
									count={flag.count}
									organization={flag.id}
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
						onClick={() => onAttestClick(true)}
					>
						Vouch For Project
					</OutlineButton>
					<OutlineButton
						buttonType={OutlineButtonType.RED}
						onClick={() => onAttestClick(false)}
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
				/>
			)}
		</div>
	);
};
