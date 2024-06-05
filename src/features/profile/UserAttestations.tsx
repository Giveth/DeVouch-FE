'use client';

import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { fetchGraphQL } from '@/helpers/request';
import { FETCH_USER_ATTESTATIONS } from '@/features/project/queries';
import FilterMenu from '@/components/FilterMenu/FilterMenu';
import config from '@/config/configuration';
import AttestationsTable from '@/components/Table/AttestationsTable';
import { Spinner } from '@/components/Loading/Spinner';
import { type ProjectAttestation } from '../home/types';
import { AddressName } from '@/components/AddressName';
import { Address } from 'viem';
import { useQuery } from '@tanstack/react-query';
import { Tabs } from '@/components/Tabs';

const ITEMS_PER_PAGE = 10;

const filterOptions = {
	'Attested By': config.ATTESTOR_GROUPS,
};

enum OrderByOptions {
	'ATTEST_TIMESTAMP_DESC' = 'attestTimestamp_DESC',
	'ATTEST_TIMESTAMP_ASC' = 'attestTimestamp_ASC',
	'PROJECT_TITLE_ASC' = 'project_title_ASC_NULLS_LAST',
	'PROJECT_TITLE_DESC' = 'project_title_DESC_NULLS_LAST',
}

enum Tab {
	ALL_ATTESTATIONS,
	VOUCHED,
	FLAGGED,
}

export const UserAttestations = ({
	address: externalAddress,
}: {
	address?: Address;
}) => {
	const { address: connectedAddress } = useAccount();
	const isExternal = !!externalAddress;
	const address = externalAddress || connectedAddress;
	const [orderBy, setOrderBy] = useState(
		OrderByOptions.ATTEST_TIMESTAMP_DESC,
	);
	const [currentPage, setCurrentPage] = useState(0);
	const [activeTab, setActiveTab] = useState(Tab.ALL_ATTESTATIONS);
	const [sourceFilterValues, setSourceFilterValues] = useState<{
		[key: string]: string[];
	}>({});
	const isOwner = address?.toLowerCase() === connectedAddress?.toLowerCase();

	const tabs = [
		{
			key: Tab.ALL_ATTESTATIONS,
			label: 'All Attestations',
			count: 0,
		},
		{ key: Tab.VOUCHED, label: 'Vouched', count: 0 },
		{ key: Tab.FLAGGED, label: 'Flagged', count: 0 },
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
				{/* {isLoading ? (
					<div className='flex items-center justify-center'>
						<Spinner
							size={32}
							color='blue'
							secondaryColor='lightgray'
						/>
					</div>
				) : (
					<AttestationsTable
						filteredAttests={filteredAttestations}
						totalAttests={totalAttests}
						itemsPerPage={ITEMS_PER_PAGE}
						currentPage={currentPage}
						onPageChange={handlePageChange}
						onOrderByProjectChange={handleOrderByProjectChange}
						onOrderByDateChange={handleOrderByDateChange}
						isOwner={!!isOwner}
					/>
				)} */}
			</div>
		</div>
	);
};
