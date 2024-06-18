'use client';

import { useRef, useState, type FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Tooltip from './Tooltip';
import { AddressName } from '../AddressName';
import { type ProjectAttestation } from '@/features/home/types';
import { ROUTES } from '@/config/routes';
import { Pagination } from '../Pagination';
import { NoAttestation } from '../NoAttestation';
import { DeleteAttestModal } from '../Modal/DeleteAttestModal';
import { EditAttestModal } from '../Modal/EditAttestModal';

interface AttestationsTableProps {
	attestations: ProjectAttestation[];
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	onOrderByProjectChange?: () => void;
	onOrderByDateChange?: () => void;
	isOwner?: boolean;
	refetch: () => void;
}

const AttestationsTable: FC<AttestationsTableProps> = ({
	attestations,
	currentPage,
	totalPages,
	onPageChange,
	onOrderByProjectChange,
	onOrderByDateChange,
	isOwner,
	refetch,
}) => {
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const attestOnAction = useRef<ProjectAttestation>();

	return (
		<div className='overflow-x-auto relative'>
			{attestations.length === 0 ? (
				<NoAttestation />
			) : (
				<table className='min-w-full table-auto text-left relative'>
					<thead>
						<tr className='bg-transparent'>
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
						{attestations.map(
							(
								attestation: ProjectAttestation,
								index: number,
							) => (
								<tr key={index} className='border-t relative'>
									{!isOwner && (
										<td className='px-4 py-6 align-top text-gray-800'>
											<Link
												href={`${ROUTES.PROFILE}/${attestation.attestorOrganisation.attestor?.id}`}
											>
												<AddressName
													address={
														attestation
															.attestorOrganisation
															.attestor?.id
													}
												/>
											</Link>

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
												content={attestation.comment}
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
											<button
												className='flex flex-row mr-2 border border-gray text-black font-bold px-4 py-2 gap-2 items-center'
												onClick={() => {
													attestOnAction.current =
														attestation;
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
														attestation;
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
										</td>
									)}
								</tr>
							),
						)}
					</tbody>
				</table>
			)}
			<Pagination
				totalPages={totalPages}
				currentPage={currentPage}
				onPageChange={onPageChange}
			/>
			{showDeleteModal && attestOnAction.current && (
				<DeleteAttestModal
					attestation={attestOnAction.current}
					showModal={showDeleteModal}
					setShowModal={setShowDeleteModal}
					onSuccess={refetch}
				/>
			)}
			{showEditModal && attestOnAction.current && (
				<EditAttestModal
					attestation={attestOnAction.current}
					showModal={showEditModal}
					setShowModal={setShowEditModal}
					onSuccess={refetch}
				/>
			)}
		</div>
	);
};

export default AttestationsTable;
