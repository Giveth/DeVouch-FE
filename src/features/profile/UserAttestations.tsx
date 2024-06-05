'use client';

import React, { useState, useEffect } from 'react';
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

const ITEMS_PER_PAGE = 10;

const filterOptions = {
	'Attested By': config.ATTESTOR_GROUPS,
};

enum orderByOptions {
	'ATTEST_TIMESTAMP_DESC' = 'attestTimestamp_DESC',
	'ATTEST_TIMESTAMP_ASC' = 'attestTimestamp_ASC',
	'PROJECT_TITLE_ASC' = 'project_title_ASC_NULLS_LAST',
	'PROJECT_TITLE_DESC' = 'project_title_DESC_NULLS_LAST',
}

export const UserAttestations = ({
	address: externalAddress,
}: {
	address?: Address;
}) => {
	const { address: connectedAddress } = useAccount();
	const isExternal = !!externalAddress;
	const address = externalAddress || connectedAddress;
	const [attestations, setAttestations] = useState<any[]>([]);
	const [totalAttests, setTotalAttests] = useState(0);
	const [orderBy, setOrderBy] = useState(
		orderByOptions.ATTEST_TIMESTAMP_DESC,
	);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [currentPage, setCurrentPage] = useState(0);
	const [filter, setFilter] = useState<'all' | 'vouched' | 'flagged'>('all');
	const [sourceFilterValues, setSourceFilterValues] = useState<{
		[key: string]: string[];
	}>({});
	const isOwner = address?.toLowerCase() === connectedAddress?.toLowerCase();
	const fetchUserAttestations = async (
		address: string,
		limit: number,
		offset: number,
		orgs?: string[],
	) => {
		try {
			setLoading(true);
			const data = await fetchGraphQL<{
				projectAttestations: ProjectAttestation[];
				projectAttestationsConnection: {
					totalCount: number;
				};
			}>(FETCH_USER_ATTESTATIONS, {
				address: !!address ? address : null,
				limit,
				offset,
				orderBy: [orderBy],
				orgs,
			});

			const attests = data?.projectAttestations;
			const totalAttests =
				data?.projectAttestationsConnection?.totalCount;
			setTotalAttests(totalAttests);
			setAttestations(attests);
		} catch (e) {
			console.log({ e });
			setError('Failed to fetch user attestations.');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		const orgs = sourceFilterValues['Attested By'];
		fetchUserAttestations(
			address || '',
			ITEMS_PER_PAGE,
			currentPage * ITEMS_PER_PAGE,
			orgs?.length > 0 ? orgs : undefined,
		);
	}, [currentPage, address, orderBy, sourceFilterValues]);

	const handlePageChange = (newPage: number) => {
		setCurrentPage(newPage);
	};

	const handleOrderByProjectChange = () => {
		setOrderBy(prevOrderBy =>
			prevOrderBy === orderByOptions.PROJECT_TITLE_ASC
				? orderByOptions.PROJECT_TITLE_DESC
				: orderByOptions.PROJECT_TITLE_ASC,
		);
	};

	const handleOrderByDateChange = () => {
		setOrderBy(prevOrderBy =>
			prevOrderBy === orderByOptions.ATTEST_TIMESTAMP_DESC
				? orderByOptions.ATTEST_TIMESTAMP_ASC
				: orderByOptions.ATTEST_TIMESTAMP_DESC,
		);
	};

	const filteredAttestations = attestations?.filter((attestation: any) => {
		let match = true;

		if (filter === 'vouched') match = match && attestation.vouch;
		if (filter === 'flagged') match = match && !attestation.vouch;

		return match;
	});

	if (error) return <p>Error: {error}</p>;

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
					<div className='flex flex-col lg:flex-row gap-4 w-full mb-4 md:mb-0'>
						<button
							className={`relative w-full sm:w-auto px-4 py-2 flex items-center ${
								filter === 'all'
									? 'bg-[#d7ddea] font-bold'
									: 'bg-gray-100 hover:bg-gray-200'
							}`}
							onClick={() => setFilter('all')}
						>
							{filter === 'all' && (
								<span className='absolute left-[-10px] top-0 h-full w-1 bg-black'></span>
							)}
							All Attestations{' '}
							{totalAttests > 0 && (
								<span
									className={`ml-2 text-white rounded-full px-2 ${
										filter === 'all'
											? 'bg-black'
											: 'bg-[#82899a]'
									}`}
								>
									{totalAttests}
								</span>
							)}
						</button>
						<button
							className={`relative w-full sm:w-auto px-4 py-2 flex items-center ${
								filter === 'vouched'
									? 'bg-[#d7ddea] font-bold'
									: 'bg-gray-100 hover:bg-gray-200'
							}`}
							onClick={() => setFilter('vouched')}
						>
							{filter === 'vouched' && (
								<span className='absolute left-[-10px] top-0 h-full w-1 bg-black'></span>
							)}
							Vouched{' '}
							<span
								className={`ml-2 text-white rounded-full px-2 ${
									filter === 'vouched'
										? 'bg-black'
										: 'bg-[#82899a]'
								}`}
							>
								{
									attestations.filter((a: any) => a.vouch)
										.length
								}
							</span>
						</button>
						<button
							className={`relative w-full sm:w-auto px-4 py-2 flex items-center ${
								filter === 'flagged'
									? 'bg-[#d7ddea] font-bold'
									: 'bg-gray-100 hover:bg-gray-200'
							}`}
							onClick={() => setFilter('flagged')}
						>
							{filter === 'flagged' && (
								<span className='absolute left-[-10px] top-0 h-full w-1 bg-black'></span>
							)}
							Flagged{' '}
							<span
								className={`ml-2 text-white rounded-full px-2 ${
									filter === 'flagged'
										? 'bg-black'
										: 'bg-[#82899a]'
								}`}
							>
								{
									attestations.filter((a: any) => !a.vouch)
										.length
								}
							</span>
						</button>
					</div>
					<FilterMenu
						options={filterOptions}
						value={sourceFilterValues}
						setValues={setSourceFilterValues}
						className='w-full md:w-[150px]'
						label='Filters'
						stickToRight={true}
					/>
				</div>
				{loading ? (
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
				)}
			</div>
		</div>
	);
};
