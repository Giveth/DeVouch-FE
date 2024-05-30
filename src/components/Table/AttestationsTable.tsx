'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { summarizeAddress } from '@/helpers/wallet';

interface AttestationsTableProps {
	attests: any[];
	filter: 'all' | 'vouched' | 'flagged' | 'yours';
	address?: string;
	itemsPerPage?: number;
}

const ITEMS_PER_PAGE_DEFAULT = 5;

const AttestationsTable: React.FC<AttestationsTableProps> = ({
	attests,
	filter,
	address,
	itemsPerPage = ITEMS_PER_PAGE_DEFAULT,
}) => {
	const [currentPage, setCurrentPage] = useState(0);

	const filteredAttests = attests.filter((attestation: any) => {
		let match = true;

		if (filter === 'vouched') match = match && attestation.vouch;
		if (filter === 'flagged') match = match && !attestation.vouch;
		if (filter === 'yours') {
			match =
				match &&
				attestation.attestorOrganisation.organisation.attestors.find(
					(i: any) => i.id?.toLowerCase() === address?.toLowerCase(),
				);
		}

		return match;
	});

	const totalPages = Math.ceil(filteredAttests.length / itemsPerPage);

	return (
		<div className='overflow-x-auto'>
			{filteredAttests.length === 0 ? (
				<div className='text-center py-10 text-gray-500 font-bold my-12'>
					No Attestations
				</div>
			) : (
				<table className='min-w-full table-auto text-left'>
					<thead>
						<tr className='bg-transparent'>
							<th className='px-4 py-2 font-semibold text-left text-gray-600'>
								Attesters
							</th>
							<th className='px-4 py-2 font-semibold text-left text-gray-600'>
								Attested As
							</th>
							<th className='px-4 py-2 font-semibold text-left text-gray-600'>
								Comments
							</th>
							<th className='px-4 py-2 font-semibold text-left text-gray-600'>
								Signal
							</th>
						</tr>
					</thead>
					<tbody>
						{filteredAttests
							.slice(
								currentPage * itemsPerPage,
								(currentPage + 1) * itemsPerPage,
							)
							.map((attestation: any, index: number) => (
								<tr key={index} className='border-t'>
									<td className='px-4 py-6 align-top text-gray-800'>
										{summarizeAddress(attestation.id)}
										<br />
										<span className='text-gray-500 text-sm'>
											{new Date(
												attestation.attestTimestamp,
											).toLocaleDateString()}
										</span>
									</td>
									<td className='flex px-4 py-6 align-top text-gray-800 items-center'>
										<span className='bg-[#f7f7f9] px-2 py-1'>
											{
												attestation.attestorOrganisation
													.organisation.name
											}
										</span>
									</td>
									<td className='px-4 py-6 align-top text-gray-800'>
										{attestation.comment || '-'}
									</td>
									<td className='px-4 py-6 align-top'>
										{attestation.vouch ? (
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
									</td>
								</tr>
							))}
					</tbody>
				</table>
			)}

			<div className='flex justify-center mt-4'>
				<button
					className={`px-3 py-1 border rounded ${currentPage === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-black'}`}
					onClick={() =>
						setCurrentPage(prev => Math.max(prev - 1, 0))
					}
					disabled={currentPage === 0}
				>
					&lt;
				</button>
				{Array.from({ length: totalPages }).map((_, index) => (
					<button
						key={index}
						className={`px-3 py-1 border rounded mx-1 ${currentPage === index ? 'bg-gray-200 font-bold' : 'bg-white'}`}
						onClick={() => setCurrentPage(index)}
					>
						{index + 1}
					</button>
				))}
				<button
					className={`px-3 py-1 border rounded ${currentPage === totalPages - 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-black'}`}
					onClick={() =>
						setCurrentPage(prev =>
							prev + 1 < totalPages ? prev + 1 : prev,
						)
					}
					disabled={currentPage === totalPages - 1}
				>
					&gt;
				</button>
			</div>
		</div>
	);
};

export default AttestationsTable;
