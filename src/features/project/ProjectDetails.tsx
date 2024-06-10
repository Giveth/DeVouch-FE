'use client';
import { useCallback, useEffect, useRef, useState, type FC } from 'react';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useAccount } from 'wagmi';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import Link from 'next/link';
import { getSourceLink } from '@/helpers/source';
import {
	OutlineButton,
	OutlineButtonType,
} from '@/components/Button/OutlineButton';
import FilterMenu from '@/components/FilterMenu/FilterMenu';
import AttestationsTable from '@/components/Table/AttestationsTable';
import { Spinner } from '@/components/Loading/Spinner';
import { AttestModal } from '@/components/Modal/AttestModal.tsx/AttestModal';
import { Tabs } from '@/components/Tabs';
import { IProject } from '../home/types';
import { SourceBadge } from '@/components/SourceBadge';
import { fetchOrganization } from '@/services/organization';
import { IOption } from '@/components/Select/Select';
import { FilterKey } from '../home/Projects';
import { VouchFilter } from '../profile/types';
import { ITEMS_PER_PAGE } from '../profile/constants';
import Tooltip from '@/components/Table/Tooltip';
import config from '@/config/configuration';
import {
	fetchProjectAttestations,
	fetchProjectAttestationsTotalCount,
	fetchProjectData,
} from './services';
import { NO_DATA } from '@/components/ProjectCard/ProjectCard';
import { ROUTES } from '@/config/routes';

export enum Tab {
	YourAttestations = 'your',
	AllAttestations = 'all',
	Vouched = 'vouched',
	Flagged = 'flagged',
}

const filterOptions = {
	[FilterKey.ORGANIZATION]: [] as IOption[],
};

export interface ProjectDetailsProps {
	source: string;
	projectId: string;
}

const LoadingComponent = () => (
	<div className='flex items-center justify-center my-24 h-full'>
		<Spinner size={32} color='blue' secondaryColor='lightgray' />
	</div>
);

const defaultTab = Tab.AllAttestations;

export const ProjectDetails: FC<ProjectDetailsProps> = ({
	source,
	projectId,
}) => {
	const [currentPage, setCurrentPage] = useState(0);
	const [showAttestModal, setShowAttestModal] = useState(false);
	const [totalPages, setTotalPages] = useState(0);

	const { address } = useAccount();
	const isVouching = useRef(true);
	const queryClient = useQueryClient();
	const { open: openWeb3Modal } = useWeb3Modal();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const router = useRouter();

	const organisationParams = searchParams.getAll(FilterKey.ORGANIZATION);
	const tabParam = searchParams.get('tab') || defaultTab;

	const {
		data: project,
		error,
		isLoading,
	} = useQuery({
		queryKey: ['project', source, projectId],
		queryFn: () => fetchProjectData(source, projectId),
	});

	const { data: attestations, refetch: refetchAttestations } = useQuery({
		queryKey: [
			'projectAttests',
			source,
			projectId,
			currentPage,
			organisationParams,
			address,
			tabParam,
		],
		queryFn: () =>
			fetchProjectAttestations(
				source,
				projectId,
				ITEMS_PER_PAGE,
				currentPage,
				organisationParams?.length ? organisationParams : undefined,
				address,
				tabParam === Tab.YourAttestations ? address : undefined,
				tabParam === Tab.Vouched
					? VouchFilter.VOUCHED
					: tabParam === Tab.Flagged
						? VouchFilter.FLAGGED
						: undefined,
			),
	});

	const { data: totalCount, refetch: refetchTotalCounts } = useQuery({
		queryKey: [
			'projectAttestsTotalCount',
			source,
			projectId,
			organisationParams,
			address,
		],
		queryFn: () =>
			fetchProjectAttestationsTotalCount(
				source,
				projectId,
				organisationParams?.length ? organisationParams : undefined,
				address,
			),
	});

	useEffect(() => {
		let totalItems = 0;
		switch (tabParam) {
			case Tab.AllAttestations:
				totalItems = totalCount?.attests.totalCount || 0;
				break;
			case Tab.Vouched:
				totalItems = totalCount?.vouches.totalCount || 0;
				break;
			case Tab.Flagged:
				totalItems = totalCount?.flags.totalCount || 0;
				break;
			case Tab.YourAttestations:
				totalItems = totalCount?.userAttestations.totalCount || 0;
				break;
		}
		setTotalPages(Math.ceil(totalItems / ITEMS_PER_PAGE));
	}, [
		tabParam,
		totalCount?.attests.totalCount,
		totalCount?.flags.totalCount,
		totalCount?.userAttestations.totalCount,
		totalCount?.vouches.totalCount,
	]);

	const { data: attestorGroups } = useQuery({
		queryKey: ['fetchOrganisations'],
		queryFn: fetchOrganization,
		staleTime: 3000_000,
	});

	filterOptions[FilterKey.ORGANIZATION] =
		attestorGroups?.map(group => ({ key: group.name, value: group.id })) ||
		[];

	const handlePageChange = (newPage: number) => {
		setCurrentPage(newPage);
	};

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
			setTimeout(() => {
				refetchAttestations();
				refetchTotalCounts();
			}, 5000);
		},
		[refetchAttestations, refetchTotalCounts],
	);

	if (error) return <p>Error: {error.message}</p>;
	if (isLoading && !project) return <LoadingComponent />;
	if (!isLoading && !project) return <p>Project not found.</p>;

	const tabs = [
		{
			key: Tab.YourAttestations,
			label: 'Your Attestations',
			count: totalCount?.userAttestations.totalCount || 0,
		},
		{
			key: Tab.AllAttestations,
			label: 'All Attestations',
			count: totalCount?.attests.totalCount || 0,
		},
		{
			key: Tab.Vouched,
			label: 'Vouched',
			count: totalCount?.vouches.totalCount || 0,
		},
		{
			key: Tab.Flagged,
			label: 'Flagged',
			count: totalCount?.flags.totalCount || 0,
		},
	];

	const onSelectOption = (key: string, option: string) => {
		const params = new URLSearchParams(searchParams.toString());
		const value = params.getAll(key);
		if (value.includes(option)) {
			params.delete(key, option);
		} else {
			params.append(key, option);
		}
		router.push(pathname + '?' + params.toString());
	};

	const onClearOptions = () => {
		const params = new URLSearchParams(searchParams.toString());
		params.delete('organisation');
		router.push(pathname + '?' + params.toString());
	};

	const sourceName = config.SOURCE_PLATFORMS.find(
		i => i.value.toLowerCase() === source.toLowerCase(),
	)?.key;

	const desc = project?.descriptionHtml || project?.description;

	return (
		<div className='relative container mx-auto flex flex-col gap-8 p-4'>
			<div className='bg-white p-6 '>
				<div className='flex items-center gap-6 mb-6 border-b-2 py-2 justify-between'>
					<div className='flex items-center gap-6'>
						<Link href={ROUTES.HOME}>
							<Image
								src={'/images/icons/left-arrow.svg'}
								style={{ cursor: 'pointer' }}
								alt={'arrow'}
								width={24}
								height={24}
							/>
						</Link>
						<h1 className='text-2xl font-bold'>{project?.title}</h1>
					</div>
					<div className='flex items-center gap-6'>
						<a
							href={`${getSourceLink(project)}${project?.url}`}
							target='_blank'
							rel='noopener noreferrer'
						>
							<Tooltip
								content={`Go to project page on ${sourceName} website`}
								direction='bottom'
							>
								<Image
									src={'/images/icons/external.svg'}
									alt={'arrow'}
									width={24}
									height={24}
								/>
							</Tooltip>
						</a>
					</div>
				</div>

				<div className='relative h-48 overflow-hidden mb-4 bg-blue-100'>
					<a
						href={getSourceLink(project)}
						target='blank'
						className='flex justify-end z-50 absolute right-[2%] top-4 cursor-pointer'
					>
						<SourceBadge source={project?.source} />
					</a>
					{project?.image && (
						<Image
							src={project?.image}
							alt={project?.title}
							layout='fill'
							objectFit='cover'
							className='rounded-lg'
						/>
					)}
				</div>
				{desc ? (
					<p
						className='text-black mb-4'
						dangerouslySetInnerHTML={{
							__html: desc,
						}}
					/>
				) : (
					<p className='text-black mb-4'>{NO_DATA}</p>
				)}

				<div className='flex flex-col sm:flex-row gap-2 justify-between items-center border-t border-[rgba(219, 219, 219, 1)] pt-4'>
					<span className='text-gray-500'>
						Do You Trust This Project?
					</span>
					<div className='flex gap-6 z-50'>
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
			</div>

			<div className='relative bg-white shadow p-6'>
				<div className='flex flex-col lg:flex-row justify-between items-center mb-4 gap-2'>
					<Tabs tabs={tabs} activeTab={tabParam} />
					<FilterMenu
						options={filterOptions}
						value={{
							[FilterKey.ORGANIZATION]: organisationParams,
						}}
						onSelectOption={onSelectOption}
						onClearOptions={onClearOptions}
						className='custom-class'
						label='Filters'
						stickToRight={true}
					/>
				</div>
				{isLoading ? (
					<LoadingComponent />
				) : (
					<AttestationsTable
						filteredAttests={attestations || []}
						totalPages={totalPages}
						currentPage={currentPage}
						onPageChange={handlePageChange}
					/>
				)}
			</div>

			<div className='flex flex-col sm:flex-row bg-transparent rounded-lg p-6 justify-end items-center text-center gap-2 mt-[-20px]'>
				<span className='block text-gray-500'>
					Share this project with your community and invite them to
					attest!
				</span>
				<button className='bg-white border border-gray-300 text-gray-500 gap-2 px-4 py-2 rounded flex items-center justify-center'>
					<b> Share Project</b>
					<Image
						src={'/images/icons/share.svg'}
						alt={'share'}
						width={18}
						height={18}
					/>
				</button>
			</div>
			{showAttestModal && project && (
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
