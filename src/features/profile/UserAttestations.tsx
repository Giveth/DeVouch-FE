'use client';

import React, { useCallback, useRef, useState } from 'react';
import { useAccount } from 'wagmi';
import { Address } from 'viem';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import FilterMenu from '@/components/FilterMenu/FilterMenu';
import { Spinner } from '@/components/Loading/Spinner';
import { AddressName } from '@/components/AddressName';
import { Tabs } from '@/components/Tabs';
import { VouchFilter } from './types';
import { UserAttestationsInfo, fetchUserAttestations } from './service';
import Tooltip from '@/components/Table/Tooltip';
import { DeleteAttestModal } from '@/components/Modal/DeleteAttestModal';
import { type ProjectAttestation } from '../home/types';
import { EditAttestModal } from '@/components/Modal/EditAttestModal';
import { ROUTES } from '@/config/routes';
import { fetchOrganization } from '@/services/organization';
import { IOption } from '@/components/Select/Select';
import { FilterKey } from '../home/Projects';

const filterOptions = {
	[FilterKey.ORGANIZATION]: [] as IOption[],
};

enum OrderByOptions {
	NEWEST = 'attestTimestamp_DESC',
	OLDEST = 'attestTimestamp_ASC',
	PROJECT_TITLE_ASC = 'project_title_ASC_NULLS_LAST',
	PROJECT_TITLE_DESC = 'project_title_DESC_NULLS_LAST',
}

enum ColumnType {
	PRIVATE,
	PUBLIC,
}

const headers = [
	{ key: 'project.title', label: 'Projects', type: ColumnType.PUBLIC },
	{ key: 'name', label: 'Date Attested', type: ColumnType.PUBLIC },
	{ key: 'age', label: 'Attested As', type: ColumnType.PUBLIC },
	{ key: 'email', label: 'Comments', type: ColumnType.PUBLIC },
	{ key: 'email', label: 'Signal', type: ColumnType.PUBLIC },
	{ key: 'email', label: 'Actions', type: ColumnType.PRIVATE },
];

const defaultSort = OrderByOptions.NEWEST;

export const UserAttestations = ({
	address: externalAddress,
}: {
	address?: Address;
}) => {
	const [currentPage, setCurrentPage] = useState(0);
	const [activeTab, setActiveTab] = useState(VouchFilter.ALL_ATTESTATIONS);

	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const queryClient = useQueryClient();
	const attestOnAction = useRef<ProjectAttestation>();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const router = useRouter();
	const { address: connectedAddress } = useAccount();

	const isExternal = !!externalAddress;
	const address = externalAddress || connectedAddress || '0x000';
	const organisationParams = searchParams.getAll(FilterKey.ORGANIZATION);
	const sortParam = searchParams.get('sort') || defaultSort;
	const isOwner = address?.toLowerCase() === connectedAddress?.toLowerCase();

	console.log('organisationParams', organisationParams);

	const { data, error, isLoading } = useQuery({
		queryKey: [
			'userAttestations',
			address,
			currentPage,
			sortParam,
			organisationParams,
			activeTab,
		],
		queryFn: fetchUserAttestations,
		enabled: !!address,
	});

	const { data: attestorGroups } = useQuery({
		queryKey: ['fetchOrganisations'],
		queryFn: fetchOrganization,
		staleTime: 3000_000,
	});

	filterOptions[FilterKey.ORGANIZATION] =
		attestorGroups?.map(group => ({ key: group.name, value: group.id })) ||
		[];

	const tabs = [
		{
			key: VouchFilter.ALL_ATTESTATIONS,
			label: 'All Attestations',
			count: data?.totalAttests,
		},
		{
			key: VouchFilter.VOUCHED,
			label: 'Vouched',
			count: data?.totalVouches,
		},
		{ key: VouchFilter.FLAGGED, label: 'Flagged', count: data?.totalFlags },
	];

	const onSuccessDelete = useCallback((attestation: ProjectAttestation) => {
		const vouch = attestation.vouch;
		queryClient.setQueryData(
			[
				'userAttestations',
				address,
				currentPage,
				sortParam,
				organisationParams,
				activeTab,
			],
			(oldData: UserAttestationsInfo) => {
				if (!oldData) return oldData; // In case oldData is undefined or null
				const newData = {
					attestations: oldData.attestations.filter(
						attest =>
							attest.id.toLowerCase() !==
							attestation.id.toLowerCase(),
					),
					totalVouches: oldData.totalVouches - (vouch ? 1 : 0),
					totalFlags: oldData.totalFlags - (!vouch ? 1 : 0),
					totalAttests: oldData.totalVouches - 1,
				};
				return newData;
			},
		);
	}, []);

	const onSuccessEdit = useCallback(
		(attestation: ProjectAttestation, oldAttestId: Address) => {
			const vouch = attestation.vouch;
			queryClient.setQueryData(
				[
					'userAttestations',
					address,
					currentPage,
					sortParam,
					organisationParams,
					activeTab,
				],
				(oldData: UserAttestationsInfo | undefined) => {
					if (!oldData) return oldData; // In case oldData is undefined or null

					let {
						attestations,
						totalVouches,
						totalFlags,
						totalAttests,
					} = oldData;

					// Find the existing attestation in the old data
					const existingAttestationIndex = attestations.findIndex(
						attest =>
							attest.id.toLowerCase() ===
							oldAttestId.toLowerCase(),
					);
					const existingAttestation =
						attestations[existingAttestationIndex];

					if (!existingAttestation) {
						// If the attestation doesn't exist in the current data, return old data
						return oldData;
					}

					// Update counts based on the change in vouch status
					if (existingAttestation.vouch !== vouch) {
						if (vouch) {
							totalVouches += 1;
							totalFlags -= 1;
						} else {
							totalVouches -= 1;
							totalFlags += 1;
						}
					}

					totalAttests = totalVouches + totalFlags;

					// Handle active tab filtering
					const shouldRemoveAttestation =
						(activeTab === VouchFilter.VOUCHED && !vouch) ||
						(activeTab === VouchFilter.FLAGGED && vouch);

					let newAttestations;

					if (shouldRemoveAttestation) {
						newAttestations = attestations.filter(
							attest =>
								attest.id.toLowerCase() !==
								oldAttestId.toLowerCase(),
						);
					} else {
						newAttestations = attestations.map(attest =>
							attest.id.toLowerCase() ===
							oldAttestId.toLowerCase()
								? attestation
								: attest,
						);
					}

					return {
						attestations: newAttestations,
						totalVouches,
						totalFlags,
						totalAttests,
					};
				},
			);
		},
		[
			address,
			currentPage,
			sortParam,
			organisationParams,
			activeTab,
			queryClient,
		],
	);

	const onSelectOption = useCallback(
		(key: string, option: string) => {
			const params = new URLSearchParams(searchParams.toString());
			const value = params.getAll(key);
			if (value.includes(option)) {
				params.delete(key, option);
			} else {
				params.append(key, option);
			}
			router.push(pathname + '?' + params.toString());
		},
		[searchParams, pathname, router],
	);

	const onClearOptions = () => {
		const params = new URLSearchParams(searchParams.toString());
		params.delete('organisation');
		router.push(pathname + '?' + params.toString());
	};

	return (
		<div className='container'>
			<div className='bg-white p-6 flex flex-col lg:flex-row justify-between items-center mb-6 gap-2'>
				<h1 className='text-2xl font-bold '>
					{isExternal ? 'All' : 'My'} Attestations
				</h1>
				<h1 className='text-xs md:text-lg'>
					<AddressName address={address} />{' '}
				</h1>
			</div>
			<div className='bg-white p-6 '>
				<div className='flex flex-col w-full lg:flex-row justify-between items-center mb-4 gap-2'>
					<Tabs
						tabs={tabs}
						activeTab={activeTab}
						onTabChange={setActiveTab}
					/>
					<FilterMenu
						options={filterOptions}
						value={{
							organization: organisationParams,
						}}
						onSelectOption={onSelectOption}
						onClearOptions={onClearOptions}
						className='w-full md:w-[150px]'
						label='Filters'
						stickToRight={true}
					/>
				</div>
				{isLoading ? (
					<div className='flex items-center justify-center'>
						<Spinner
							size={32}
							color='blue'
							secondaryColor='lightgray'
						/>
					</div>
				) : (
					<div className='overflow-x-auto'>
						<div
							className={`grid ${isOwner ? 'grid-cols-6' : 'grid-cols-5'} items-center min-w-[900px] text-left relative`}
						>
							{headers.map((header, id) =>
								header.type === ColumnType.PUBLIC || isOwner ? (
									<div
										className='px-4 py-2 font-semibold text-left text-gray-600'
										key={id}
									>
										{header.label}
									</div>
								) : null,
							)}
							{data?.attestations.map((attest, id) => (
								<React.Fragment key={id}>
									<div className='col-span-6 border-b'></div>
									<Link
										href={`${ROUTES.PROJECT}/${attest.project.source}/${attest.project.projectId}`}
									>
										<div className='max-w-[220px] px-4 py-6 align-top text-gray-800'>
											{attest.project.title}
										</div>
									</Link>
									<div>
										{new Date(
											attest.attestTimestamp,
										).toLocaleDateString('en-US', {
											day: 'numeric',
											month: 'long',
											year: 'numeric',
										})}
									</div>
									<div className='bg-[#f7f7f9] px-2 py-1'>
										{
											attest.attestorOrganisation
												.organisation.name
										}
									</div>
									<div className='relative text-center w-[106px] px-4 py-6 align-top text-gray-800 z-50'>
										{attest.comment ? (
											<Tooltip
												content={attest.comment}
												direction='bottom'
											>
												<Image
													src={
														'/images/icons/msg.svg'
													}
													alt={'comment'}
													width={18}
													height={18}
													className='cursor-pointer mx-auto'
												/>
											</Tooltip>
										) : (
											<b>-</b>
										)}
									</div>
									<div>
										{attest.vouch ? (
											<span className='flex gap-2 items-center'>
												<Image
													src={
														'/images/icons/vouched.svg'
													}
													alt={'vouched'}
													width={24}
													height={24}
												/>
												Vouched
											</span>
										) : (
											<span className='gap-4 flex items-center'>
												<Image
													src={
														'/images/icons/red-flag.svg'
													}
													alt={'red-flag'}
													width={18}
													height={18}
												/>
												Flagged
											</span>
										)}
									</div>
									{isOwner && (
										<div className='flex flex-row px-4 py-6 align-top text-gray-800'>
											<button
												className='flex flex-row mr-2 border border-gray text-black font-bold px-4 py-2 gap-2 items-center'
												onClick={() => {
													attestOnAction.current =
														attest;
													setShowEditModal(true);
												}}
											>
												Edit{' '}
												<Image
													src={
														'/images/icons/edit.svg'
													}
													alt={'edit'}
													width={16}
													height={16}
												/>
											</button>
											<button
												className='mr-2 border border-gray text-black font-bold px-4 py-2'
												onClick={() => {
													attestOnAction.current =
														attest;
													setShowDeleteModal(true);
												}}
											>
												<Image
													src={
														'/images/icons/trash-black.svg'
													}
													alt={'edit'}
													width={18}
													height={18}
												/>
											</button>
										</div>
									)}
								</React.Fragment>
							))}
						</div>
					</div>
				)}
			</div>
			{showDeleteModal && attestOnAction.current && (
				<DeleteAttestModal
					attestation={attestOnAction.current}
					showModal={showDeleteModal}
					setShowModal={setShowDeleteModal}
					onSuccess={onSuccessDelete}
				/>
			)}
			{showEditModal && attestOnAction.current && (
				<EditAttestModal
					attestation={attestOnAction.current}
					showModal={showEditModal}
					setShowModal={setShowEditModal}
					onSuccess={onSuccessEdit}
				/>
			)}
		</div>
	);
};
