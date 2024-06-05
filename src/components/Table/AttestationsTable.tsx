'use client';

import { type FC } from 'react';
import Image from 'next/image';
import Tooltip from './Tooltip';
import { AddressName } from '../AddressName';
import { type ProjectAttestation } from '@/features/home/types';
import { ITEMS_PER_PAGE } from '@/features/project/ProjectDetails';

interface AttestationsTableProps {
	filteredAttests: ProjectAttestation[];
	currentPage: number;
	onPageChange: (page: number) => void;
	onOrderByProjectChange?: () => void;
	onOrderByDateChange?: () => void;
	totalAttests: number;
	isOwner?: boolean;
}

const AttestationsTable: FC<AttestationsTableProps> = ({
	filteredAttests,
	currentPage,
	onPageChange,
	onOrderByProjectChange,
	onOrderByDateChange,
	totalAttests,
	isOwner,
}) => {
	const totalPages = Math.ceil(totalAttests / ITEMS_PER_PAGE);

	return (
		<div className='overflow-x-auto relative'>
			{filteredAttests.length === 0 ? (
				<div className='text-center py-10 text-gray-500 font-bold my-12'>
					No Attestations
				</div>
			) : (
				<table className='min-w-full table-auto text-left relative'>
					<thead>
						<tr className='bg-transparent'>
							{isOwner && (
								<th
									onClick={() => onOrderByProjectChange?.()}
									className='flex flex-arrow gap-2 px-4 py-2 font-semibold text-left text-gray-600 cursor-pointer'
								>
									<Image
										src={'/images/icons/two-arrows.svg'}
										alt={'arrow'}
										width={24}
										height={24}
									/>{' '}
									Projects
								</th>
							)}
							{!isOwner && (
								<th className='px-4 py-2 font-semibold text-left text-gray-600'>
									Attesters
								</th>
							)}
							{isOwner && (
								<th
									onClick={() => onOrderByDateChange?.()}
									className=' px-4 py-2 font-semibold text-gray-600 cursor-pointer'
								>
									Date Attested
								</th>
							)}
							<th className='px-4 py-2 font-semibold text-left text-gray-600'>
								Attested As
							</th>

							<th className='px-4 py-2 font-semibold text-left text-gray-600'>
								Comments
							</th>
							<th className='px-4 py-2 font-semibold text-left text-gray-600'>
								Signal
							</th>
							{isOwner && (
								<th className='px-4 py-2 font-semibold text-left text-gray-600'>
									Actions
								</th>
							)}
						</tr>
					</thead>
					<tbody>
						{filteredAttests.map(
							(
								attestation: ProjectAttestation,
								index: number,
							) => (
								<tr key={index} className='border-t relative'>
									{isOwner && (
										<td className='max-w-[220px] px-4 py-6 align-top text-gray-800'>
											{attestation.project.title}
										</td>
									)}
									{!isOwner && (
										<td className='px-4 py-6 align-top text-gray-800'>
											<AddressName
												address={
													attestation
														.attestorOrganisation
														.attestor?.id
												}
											/>
											<br />
											<span className='text-gray-500 text-sm'>
												{new Date(
													attestation.attestTimestamp,
												).toLocaleDateString('en-US', {
													day: 'numeric',
													month: 'long',
													year: 'numeric',
												})}
											</span>
										</td>
									)}
									{isOwner && (
										<td className='px-4 py-6 align-top text-gray-800'>
											{new Date(
												attestation.attestTimestamp,
											).toLocaleDateString('en-US', {
												day: 'numeric',
												month: 'short',
												year: 'numeric',
											})}
										</td>
									)}
									<td className='flex px-4 py-6 align-top text-gray-800 items-center'>
										<span className='bg-[#f7f7f9] px-2 py-1'>
											{
												attestation.attestorOrganisation
													.organisation.name
											}
										</span>
									</td>
									<td className='relative text-center w-[106px] px-4 py-6 align-top text-gray-800 z-50'>
										{attestation.comment ? (
											<Tooltip
												message={attestation.comment}
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
									{isOwner && (
										<td className='flex flex-row px-4 py-6 align-top text-gray-800'>
											<button className='flex flex-row mr-2 border border-gray text-black font-bold px-4 py-2 gap-2 items-center'>
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
										</td>
									)}
								</tr>
							),
						)}
					</tbody>
				</table>
			)}

			<div className='flex justify-center mt-4'>
				<button
					className={`px-3 py-1 border rounded ${
						currentPage === 0
							? 'bg-gray-100 text-gray-400 cursor-not-allowed'
							: 'bg-white text-black'
					}`}
					onClick={() => onPageChange(currentPage - 1)}
					disabled={currentPage === 0}
				>
					&lt;
				</button>
				{Array.from({ length: totalPages }).map((_, index) => (
					<button
						key={index}
						className={`px-3 py-1 border rounded mx-1 ${
							currentPage === index
								? 'bg-gray-200 font-bold'
								: 'bg-white'
						}`}
						onClick={() => onPageChange(index)}
					>
						{index + 1}
					</button>
				))}
				<button
					className={`px-3 py-1 border rounded ${
						currentPage === totalPages - 1
							? 'bg-gray-100 text-gray-400 cursor-not-allowed'
							: 'bg-white text-black'
					}`}
					onClick={() => onPageChange(currentPage + 1)}
					disabled={currentPage === totalPages - 1}
				>
					&gt;
				</button>
			</div>
		</div>
	);
};

export default AttestationsTable;
