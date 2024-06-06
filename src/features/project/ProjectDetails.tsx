'use client';
import { useCallback, useRef, useState, type FC } from 'react';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useAccount } from 'wagmi';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { FETCH_PROJECT_BY_ID } from '@/features/project/queries';
import { fetchGraphQL } from '@/helpers/request';
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

export enum Tab {
	YourAttestations,
	AllAttestations,
	Vouched,
	Flagged,
}

export const ITEMS_PER_PAGE = 10;

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

const fetchProjectData = async (
	source: string,
	projectId: string,
	limit: number,
	offset: number,
	orgs?: string[],
) => {
	const id = `${source}-${projectId}`;
	const data = await fetchGraphQL<{ projects: any[] }>(FETCH_PROJECT_BY_ID, {
		id,
		limit,
		offset,
		orgs,
	});
	return data.projects[0] as IProject;
};

export const ProjectDetails: FC<ProjectDetailsProps> = ({
	source,
	projectId,
}) => {
	const [currentPage, setCurrentPage] = useState(0);
	const [activeTab, setActiveTab] = useState<Tab>(Tab.AllAttestations);
	const [showAttestModal, setShowAttestModal] = useState(false);

	const { address } = useAccount();
	const isVouching = useRef(true);
	const queryClient = useQueryClient();
	const { open: openWeb3Modal } = useWeb3Modal();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const router = useRouter();

	const organisationParams = searchParams.getAll(FilterKey.ORGANIZATION);

	const {
		data: project,
		error,
		isLoading,
	} = useQuery({
		queryKey: [
			'project',
			source,
			projectId,
			currentPage,
			organisationParams,
		],
		queryFn: () =>
			fetchProjectData(
				source,
				projectId,
				ITEMS_PER_PAGE,
				currentPage * ITEMS_PER_PAGE,
				organisationParams?.length ? organisationParams : undefined,
			),
	});

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
			const queryKey = [
				'attestations',
				source,
				projectId,
				currentPage,
				organisationParams,
			];
			queryClient.setQueryData(queryKey, (oldData: any) => {
				if (!oldData) return oldData; // In case oldData is undefined or null
				return updatedProject;
			});
		},
		[currentPage, projectId, queryClient, source, organisationParams],
	);

	if (error) return <p>Error: {error.message}</p>;
	if (isLoading && !project) return <LoadingComponent />;
	if (!isLoading && !project) return <p>Project not found.</p>;

	const allAttestsCount = project?.totalAttests;
	const allVouchesCount = project?.totalVouches;
	const allFlagsCount = project?.totalFlags;
	const userAttestsCount = project?.attests?.filter(
		(attestation: any) =>
			attestation?.attestorOrganisation?.attestor.id.toLowerCase() ===
			address?.toLowerCase(),
	).length;

	const tabs = [
		{
			key: Tab.YourAttestations,
			label: 'Your Attestations',
			count: userAttestsCount,
		},
		{
			key: Tab.AllAttestations,
			label: 'All Attestations',
			count: allAttestsCount,
		},
		{ key: Tab.Vouched, label: 'Vouched', count: allVouchesCount },
		{ key: Tab.Flagged, label: 'Flagged', count: allFlagsCount },
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

	return (
		<div className='relative container mx-auto flex flex-col gap-8 p-4'>
			<div className='bg-white shadow rounded-lg p-6'>
				<h1 className='flex flex-row gap-6 text-2xl font-bold mb-6 border-b-2 pb-4 border-[#dbdbdb]'>
					<Image
						onClick={() => router.back()}
						src={'/images/icons/left-arrow.svg'}
						style={{ cursor: 'pointer' }}
						alt={'arrow'}
						width={24}
						height={24}
					/>
					{project?.title}
				</h1>

				<div className='relative h-48 overflow-hidden mb-4 bg-blue-100'>
					<a
						href={`${getSourceLink(project)}${project?.url}`}
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
				<p className='text-black mb-4'>{project?.description}</p>
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
					<Tabs
						tabs={tabs}
						activeTab={activeTab}
						onTabChange={setActiveTab}
					/>
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
						filteredAttests={project?.attests || []}
						totalAttests={project?.totalAttests || 0}
						currentPage={currentPage}
						itemsPerPage={ITEMS_PER_PAGE}
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
