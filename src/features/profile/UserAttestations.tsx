'use client';

import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { Address } from 'viem';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import FilterMenu from '@/components/FilterMenu/FilterMenu';
import config from '@/config/configuration';
import { Spinner } from '@/components/Loading/Spinner';
import { AddressName } from '@/components/AddressName';
import { Tabs } from '@/components/Tabs';
import { VouchFilter } from './types';
import { fetchUserAttestations } from './service';
import Tooltip from '@/components/Table/Tooltip';

const filterOptions = {
	'Attested By': config.ATTESTOR_GROUPS,
};

enum OrderByOptions {
	NEWEST = 'attestTimestamp_DESC',
	OLDEST = 'attestTimestamp_ASC',
	PROJECT_TITLE_ASC = 'project_title_ASC_NULLS_LAST',
	PROJECT_TITLE_DESC = 'project_title_DESC_NULLS_LAST',
}

const headers = [
	{ key: 'project.title', label: 'Projects' },
	{ key: 'name', label: 'Date Attested' },
	{ key: 'age', label: 'Attested As' },
	{ key: 'email', label: 'Comments' },
	{ key: 'email', label: 'Signal' },
	{ key: 'email', label: 'Actions' },
];

export const UserAttestations = ({
	address: externalAddress,
}: {
	address?: Address;
}) => {
	const { address: connectedAddress } = useAccount();
	const isExternal = !!externalAddress;
	const address = externalAddress || connectedAddress || '0x000';
	const [orderBy, setOrderBy] = useState(OrderByOptions.NEWEST);
	const [currentPage, setCurrentPage] = useState(0);
	const [activeTab, setActiveTab] = useState(VouchFilter.ALL_ATTESTATIONS);
	const [sourceFilterValues, setSourceFilterValues] = useState<{
		[key: string]: string[];
	}>({});
	const isOwner = address?.toLowerCase() === connectedAddress?.toLowerCase();

	const { data, error, isLoading } = useQuery({
		queryKey: [
			'userAttestations',
			address,
			currentPage,
			orderBy,
			sourceFilterValues['Attested By'],
			activeTab,
		],
		queryFn: fetchUserAttestations,
		enabled: !!address,
	});

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
						value={sourceFilterValues}
						setValues={setSourceFilterValues}
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
						<div className='grid grid-cols-6 items-center min-w-[900px] text-left relative'>
							{headers.map((header, id) => (
								<div
									className='px-4 py-2 font-semibold text-left text-gray-600'
									key={id}
								>
									{header.label}
								</div>
							))}
							{data?.attestations.map((attest, id) => (
								<React.Fragment key={id}>
									<div className='col-span-6 border-b'></div>{' '}
									{/* Divider line */}
									<div className='max-w-[220px] px-4 py-6 align-top text-gray-800'>
										{attest.project.title}
									</div>
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
												message={attest.comment}
												direction='right'
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
									<div className='flex flex-row px-4 py-6 align-top text-gray-800'>
										<button className='flex flex-row mr-2 border border-gray text-black font-bold px-4 py-2 gap-2 items-center'>
											Edit{' '}
											<Image
												src={'/images/icons/edit.svg'}
												alt={'edit'}
												width={16}
												height={16}
											/>
										</button>
										<button className='mr-2 border border-gray text-black font-bold px-4 py-2'>
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
								</React.Fragment>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};
