'use client';
import { useCallback, useEffect, useRef, useState, type FC } from 'react';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useAccount } from 'wagmi';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import {
	FETCH_PROJECT_ATTESTATIONS,
	FETCH_PROJECT_BY_ID,
} from '@/features/project/queries';
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
import { VouchFilter } from '../profile/types';
import { ITEMS_PER_PAGE } from '../profile/constants';

export enum Tab {
	YourAttestations,
	AllAttestations,
	Vouched,
	Flagged,
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

const fetchProjectData = async (source: string, projectId: string) => {
	const id = `${source}-${projectId}`;
	const data = await fetchGraphQL<{ projects: any[] }>(FETCH_PROJECT_BY_ID, {
		id,
	});
	return data.projects[0] as IProject;
};

const fetchProjectAttestationsData = async (
	source: string,
	projectId: string,
	limit: number,
	page: number,
	organisation?: string[],
	address?: string,
	attestorAddressFilter?: string,
	vouch?: VouchFilter | undefined,
) => {
	const id = `${source}-${projectId}`;
	const data = await fetchGraphQL<{ projects: any[] }>(
		FETCH_PROJECT_ATTESTATIONS,
		{
			projectId: id,
			limit,
			offset: page * ITEMS_PER_PAGE,
			organisation,
			address: address?.toLowerCase(),
			attestorAddressFilter: attestorAddressFilter?.toLowerCase(),
			vouch:
				vouch === VouchFilter.VOUCHED
					? true
					: vouch === VouchFilter.FLAGGED
						? false
						: undefined,
		},
	);
	return data;
};

export const ProjectDetails: FC<ProjectDetailsProps> = ({
	source,
	projectId,
}) => {
	const [currentPage, setCurrentPage] = useState(0);
	const [activeTab, setActiveTab] = useState<Tab>(Tab.AllAttestations);
	const [showAttestModal, setShowAttestModal] = useState(false);

	const [totalAttests, setTotalAttests] = useState(0);
	const [totalVouches, setTotalVouches] = useState(0);
	const [totalFlags, setTotalFlags] = useState(0);
	const [userTotalAttests, setUserTotalAttests] = useState(0);
	const [totalPages, setTotalPages] = useState(0);
	const [filteredAttests, setFilteredAttests] = useState<any[]>([]);

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
		queryFn: () => fetchProjectData(source, projectId),
	});

	const attestation_data = useQuery({
		queryKey: [
			'projectAttests',
			source,
			projectId,
			currentPage,
			organisationParams,
			address,
			activeTab,
		],
		queryFn: () =>
			fetchProjectAttestationsData(
				source,
				projectId,
				ITEMS_PER_PAGE,
				currentPage,
				organisationParams?.length ? organisationParams : undefined,
				address,
				activeTab === Tab.YourAttestations ? address : undefined,
				activeTab === Tab.Vouched
					? VouchFilter.VOUCHED
					: activeTab === Tab.Flagged
						? VouchFilter.FLAGGED
						: undefined,
			),
	});

	useEffect(() => {
		if (!attestation_data?.data) return;
		const {
			attests,
			vouches,
			flags,
			userAttestations,
			projectAttestations,
		} = attestation_data.data as any;

		const _totalAttests = attests.totalCount || 0;
		const _totalVouches = vouches?.totalCount || 0;
		const _totalFlags = flags?.totalCount || 0;
		const _totalUserAttests = userAttestations?.totalCount || 0;

		setTotalAttests(_totalAttests);
		setTotalVouches(_totalVouches);
		setTotalFlags(_totalFlags);
		setUserTotalAttests(_totalUserAttests);
		setFilteredAttests(projectAttestations || []);

		let totalItems = 0;

		switch (activeTab) {
			case Tab.AllAttestations:
				totalItems = _totalAttests;
				break;
			case Tab.Vouched:
				totalItems = _totalVouches;
				break;
			case Tab.Flagged:
				totalItems = _totalFlags;
				break;
			case Tab.YourAttestations:
				totalItems = _totalUserAttests;
				break;
		}
		setTotalPages(Math.ceil(totalItems / ITEMS_PER_PAGE));
	}, [attestation_data]);

	useEffect(() => {
		if (currentPage > 0 && currentPage >= totalPages) {
			setCurrentPage(totalPages - 1);
		}
	}, [totalPages]);

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

	const tabs = [
		{
			key: Tab.YourAttestations,
			label: 'Your Attestations',
			count: userTotalAttests,
		},
		{
			key: Tab.AllAttestations,
			label: 'All Attestations',
			count: totalAttests,
		},
		{ key: Tab.Vouched, label: 'Vouched', count: totalVouches },
		{ key: Tab.Flagged, label: 'Flagged', count: totalFlags },
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
						filteredAttests={filteredAttests}
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
