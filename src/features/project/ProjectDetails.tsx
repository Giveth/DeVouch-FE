'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FETCH_PROJECT_BY_SLUG } from '@/features/project/queries';
import { fetchGraphQL } from '@/helpers/request';
import { getSourceLink } from '@/helpers/source';
import {
	OutlineButton,
	OutlineButtonType,
} from '@/components/Button/OutlineButton';

const ITEMS_PER_PAGE = 5;

export const ProjectDetails = ({ slug }: { slug: string }) => {
	const router = useRouter();
	const [project, setProject] = useState<any | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [currentPage, setCurrentPage] = useState(0);
	const [filter, setFilter] = useState<'all' | 'vouched' | 'flagged'>('all');

	const fetchProjectData = async (
		slug: string,
		limit: number,
		offset: number,
	) => {
		try {
			setLoading(true);
			const data = await fetchGraphQL<{ projects: any[] }>(
				FETCH_PROJECT_BY_SLUG,
				{ slug, limit, offset },
			);
			setProject(data.projects[0]);
		} catch (e) {
			setError('Failed to fetch project data.');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchProjectData(slug, ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
	}, [currentPage, slug]);

	const filteredAttests =
		project?.attests.filter((attestation: any) => {
			if (filter === 'vouched') return attestation.vouch;
			if (filter === 'flagged') return !attestation.vouch;
			return true;
		}) || [];

	const totalPages = Math.ceil(filteredAttests.length / ITEMS_PER_PAGE);

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error: {error}</p>;
	if (!project) return <p>Project not found.</p>;

	return (
		<div className='container mx-auto flex flex-col gap-8 p-4'>
			<div className='bg-white shadow rounded-lg p-6'>
				<h1 className='flex flex-row gap-6 text-2xl font-bold mb-4'>
					<Image
						onClick={() => router.back()}
						src={'/images/icons/left-arrow.svg'}
						style={{ cursor: 'pointer' }}
						alt={'arrow'}
						width={24}
						height={24}
					/>
					{project.title}
				</h1>

				<div className='relative h-48 rounded-lg overflow-hidden mb-4 bg-blue-100'>
					<div
						onClick={() =>
							router.push(getSourceLink(project.source))
						}
						className='flex justify-end z-50 absolute right-[2%] top-4 cursor-pointer'
					>
						<span className='bg-white text-black px-2 py-1 rounded'>
							From {project.source}
						</span>
					</div>
					{project.image && (
						<Image
							src={project.image}
							alt={project.title}
							layout='fill'
							objectFit='cover'
							className='rounded-lg'
						/>
					)}
				</div>
				<p className='text-gray-700 mb-4'>{project.description}</p>
				<div className='flex justify-between items-center border-t border-[rgba(219, 219, 219, 1)] pt-4'>
					<span className='text-gray-500'>
						Do You Trust This Project?
					</span>
					<div className='flex gap-6 z-50'>
						<OutlineButton
							buttonType={OutlineButtonType.BLUE}
							className='flex-1'
						>
							Vouch For Project
						</OutlineButton>
						<OutlineButton buttonType={OutlineButtonType.RED}>
							Flag Project
						</OutlineButton>
					</div>
				</div>
			</div>

			<div className='bg-white shadow rounded-lg p-6'>
				<div className='flex flex-col sm:flex-row justify-between items-center mb-4 gap-2'>
					<div className='flex flex-col sm:flex-row gap-2 w-full'>
						<button
							className={`w-full sm:w-auto px-4 py-2 rounded flex items-center ${filter === 'all' ? 'bg-gray-200 font-bold' : 'bg-gray-100 hover:bg-gray-200'}`}
							onClick={() => setFilter('all')}
						>
							All Attestations{' '}
							<span className='ml-2 bg-black text-white rounded-full px-2'>
								({project.totalAttests})
							</span>
						</button>
						<button
							className={`w-full sm:w-auto px-4 py-2 rounded flex items-center ${filter === 'vouched' ? 'bg-gray-200 font-bold' : 'bg-gray-100 hover:bg-gray-200'}`}
							onClick={() => setFilter('vouched')}
						>
							Vouched{' '}
							<span className='ml-2 text-gray-500'>
								(
								{
									project.attests.filter((a: any) => a.vouch)
										.length
								}
								)
							</span>
						</button>
						<button
							className={`w-full sm:w-auto px-4 py-2 rounded flex items-center ${filter === 'flagged' ? 'bg-gray-200 font-bold' : 'bg-gray-100 hover:bg-gray-200'}`}
							onClick={() => setFilter('flagged')}
						>
							Flagged{' '}
							<span className='ml-2 text-gray-500'>
								(
								{
									project.attests.filter((a: any) => !a.vouch)
										.length
								}
								)
							</span>
						</button>
					</div>
					<button className='w-full sm:w-auto px-4 py-2 rounded border flex items-center mt-2 sm:mt-0'>
						Filters{' '}
						<svg
							className='w-4 h-4 ml-2'
							fill='none'
							stroke='currentColor'
							strokeWidth='2'
							viewBox='0 0 24 24'
							xmlns='http://www.w3.org/2000/svg'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								d='M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-1 1h-3l-4 5v3l-4-5H4a1 1 0 01-1-1V4z'
							></path>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								d='M14 12h4l-5 5H9l-5-5h4'
							></path>
						</svg>
					</button>
				</div>

				<div className='overflow-x-auto'>
					{filteredAttests.length === 0 ? (
						<div className='text-center py-10 text-gray-500 font-bold my-12'>
							Do you know this project? Attest to it!
						</div>
					) : (
						<table className='min-w-full table-auto text-left'>
							<thead>
								<tr className='bg-transparent'>
									<th className='px-4 py-2'>Attesters</th>
									<th className='px-4 py-2'>Attested As</th>
									<th className='px-4 py-2'>Comments</th>
									<th className='px-4 py-2'>Signal</th>
								</tr>
							</thead>
							<tbody>
								{filteredAttests
									.slice(
										currentPage * ITEMS_PER_PAGE,
										(currentPage + 1) * ITEMS_PER_PAGE,
									)
									.map((attestation: any, index: number) => (
										<tr key={index} className='border-t'>
											<td className='px-4 py-2 align-top'>
												{attestation.id}
											</td>
											<td className='px-4 py-2 align-top'>
												{
													attestation
														.attestorOrganisation
														.organisation.name
												}
											</td>
											<td className='px-4 py-2 align-top'>
												{attestation.comment || '-'}
											</td>
											<td className='px-4 py-2 align-top'>
												{attestation.vouch ? (
													<span className='text-blue-500 flex items-center'>
														<svg
															className='w-4 h-4 mr-1'
															fill='none'
															stroke='currentColor'
															strokeWidth='2'
															viewBox='0 0 24 24'
															xmlns='http://www.w3.org/2000/svg'
														>
															<path
																strokeLinecap='round'
																strokeLinejoin='round'
																d='M5 13l4 4L19 7'
															></path>
														</svg>
														Vouched
													</span>
												) : (
													<span className='text-red-500 flex items-center'>
														<svg
															className='w-4 h-4 mr-1'
															fill='none'
															stroke='currentColor'
															strokeWidth='2'
															viewBox='0 0 24 24'
															xmlns='http://www.w3.org/2000/svg'
														>
															<path
																strokeLinecap='round'
																strokeLinejoin='round'
																d='M18 12H6'
															></path>
														</svg>
														Flagged
													</span>
												)}
											</td>
										</tr>
									))}
							</tbody>
						</table>
					)}
				</div>

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

			<div className='flex bg-transparent rounded-lg p-6 justify-end items-center text-center gap-2 mt-[-20px]'>
				<span className='block text-gray-500'>
					Feeling Proud Of Your Project? Share This Project And Its
					Attestations
				</span>
				<button className='bg-white border border-gray-300 text-gray-500 px-4 py-2 rounded flex items-center justify-center'>
					<b> Share Project</b>
					<svg
						className='w-4 h-4 ml-2'
						fill='none'
						stroke='currentColor'
						strokeWidth='2'
						viewBox='0 0 24 24'
						xmlns='http://www.w3.org/2000/svg'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							d='M4 12V8a4 4 0 014-4h8a4 4 0 014 4v4M16 16l-4-4-4 4M12 12v12'
						></path>
					</svg>
				</button>
			</div>
		</div>
	);
};
