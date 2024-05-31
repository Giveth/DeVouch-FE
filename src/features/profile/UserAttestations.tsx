'use client';

import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { fetchGraphQL } from '@/helpers/request';
import { FETCH_USER_ATTESTATIONS } from '@/features/project/queries';
import FilterMenu from '@/components/FilterMenu/FilterMenu';
import config from '@/config/configuration';
import AttestationsTable from '@/components/Table/AttestationsTable';

const ITEMS_PER_PAGE = 10;

const filterOptions = {
	'Attested By': config.ATTESTOR_GROUPS,
};

export const UserAttestations = ({
	address: externalAddress,
}: {
	address?: string;
}) => {
	const { address: connectedAddress } = useAccount();
	const isExternal = !!externalAddress;
	const address = externalAddress || connectedAddress;
	const [attestations, setAttestations] = useState<any[]>([]);
	const [totalAttests, setTotalAttests] = useState(0);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [currentPage, setCurrentPage] = useState(0);
	const [filter, setFilter] = useState<'all' | 'vouched' | 'flagged'>('all');
	const [sourceFilterValues, setSourceFilterValues] = useState<{
		[key: string]: string[];
	}>({});

	const fetchUserAttestations = async (
		address: string,
		// limit: number,
		// offset: number,
		orgs?: string[],
	) => {
		try {
			setLoading(true);
			const data = await fetchGraphQL<{ projects: IProject[] }>(
				FETCH_USER_ATTESTATIONS,
				{
					address,
					// limit,
					// offset,
					orgs,
				},
			);
			const attests = data.projects.flatMap(
				(project: IProject) => project.attests,
			);

			const totalAttests = data.projects.reduce(
				(total: number, project: IProject) =>
					total + project.totalAttests,
				0,
			);
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
			// ITEMS_PER_PAGE,
			// currentPage * ITEMS_PER_PAGE,
			orgs?.length > 0 ? orgs : undefined,
		);
	}, [currentPage, address, sourceFilterValues]);

	const handlePageChange = (newPage: number) => {
		setCurrentPage(newPage);
	};

	const filteredAttestations = attestations?.filter((attestation: any) => {
		let match = true;

		if (filter === 'vouched') match = match && attestation.vouch;
		if (filter === 'flagged') match = match && !attestation.vouch;

		return match;
	});

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error: {error}</p>;

	return (
		<div className='container mx-auto flex flex-col gap-8 p-4'>
			<div className='bg-white shadow rounded-lg p-6'>
				<div className='flex flex-col lg:flex-row justify-between items-center mb-4 gap-2'>
					<h1 className='text-2xl font-bold mb-6'>
						{isExternal ? 'All' : 'My'} Attestations
					</h1>
					<h1 className='text-md mb-6'>{address}</h1>
				</div>

				<div className='flex flex-col lg:flex-row justify-between items-center mb-4 gap-2'>
					<div className='flex flex-col lg:flex-row gap-4 w-full'>
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
							<span
								className={`ml-2 text-white rounded-full px-2 ${
									filter === 'all'
										? 'bg-black'
										: 'bg-[#82899a]'
								}`}
							>
								({totalAttests})
							</span>
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
								(
								{
									attestations.filter((a: any) => a.vouch)
										.length
								}
								)
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
								(
								{
									attestations.filter((a: any) => !a.vouch)
										.length
								}
								)
							</span>
						</button>
					</div>
					<FilterMenu
						options={filterOptions}
						value={sourceFilterValues}
						setValues={setSourceFilterValues}
						className='custom-class'
						label='Source Filter'
						stickToRight={true}
					/>
				</div>
				<AttestationsTable
					attests={filteredAttestations}
					filter={filter}
					totalAttests={totalAttests}
					itemsPerPage={ITEMS_PER_PAGE}
					currentPage={currentPage}
					onPageChange={handlePageChange}
				/>
			</div>
		</div>
	);
};
