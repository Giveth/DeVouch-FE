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
			<div className='bg-white shadow roundd-lg p-6 '>
				<h1 className='flex flex-row gap-6 text-2xl font-bold mb-6 border-b-2 pb-4 border-[#dbdbdb]'>
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

				<div className='relative h-48 overflow-hidden mb-4 bg-blue-100'>
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
				<p className='text-black mb-4'>{project.description}</p>
				<div className='flex flex-col sm:flex-row gap-2 justify-between items-center border-t border-[rgba(219, 219, 219, 1)] pt-4'>
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

			<div className='bg-white shadow p-6'>
				<div className='flex flex-col sm:flex-row justify-between items-center mb-4 gap-2'>
					<div className='flex flex-col sm:flex-row gap-4 w-full'>
						<button
							className={`relative w-full sm:w-auto px-4 py-2 flex items-center ${filter === 'all' ? 'bg-[#d7ddea] font-bold' : 'bg-gray-100 hover:bg-gray-200'}`}
							onClick={() => setFilter('all')}
						>
							{filter === 'all' && (
								<span className='absolute left-[-10px] top-0 h-full w-1 bg-black'></span>
							)}
							All Attestations{' '}
							<span
								className={`ml-2 text-white rounded-full px-2 ${filter === 'all' ? 'bg-black' : 'bg-[#82899a]'}`}
							>
								({project.totalAttests})
							</span>
						</button>
						<button
							className={`relative w-full sm:w-auto px-4 py-2 flex items-center ${filter === 'vouched' ? 'bg-[#d7ddea] font-bold' : 'bg-gray-100 hover:bg-gray-200'}`}
							onClick={() => setFilter('vouched')}
						>
							{filter === 'vouched' && (
								<span className='absolute left-[-10px] top-0 h-full w-1 bg-black'></span>
							)}
							Vouched{' '}
							<span
								className={`ml-2 text-white rounded-full px-2 ${filter === 'vouched' ? 'bg-black' : 'bg-[#82899a]'}`}
							>
								(
								{
									project.attests.filter((a: any) => a.vouch)
										.length
								}
								)
							</span>
						</button>
						<button
							className={`relative w-full sm:w-auto px-4 py-2 flex items-center ${filter === 'flagged' ? 'bg-[#d7ddea] font-bold' : 'bg-gray-100 hover:bg-gray-200'}`}
							onClick={() => setFilter('flagged')}
						>
							{filter === 'flagged' && (
								<span className='absolute left-[-10px] top-0 h-full w-1 bg-black'></span>
							)}
							Flagged{' '}
							<span
								className={`ml-2 text-white rounded-full px-2 ${filter === 'flagged' ? 'bg-black' : 'bg-[#82899a]'}`}
							>
								(
								{
									project.attests.filter((a: any) => !a.vouch)
										.length
								}
								)
							</span>
						</button>
					</div>
					<button className='w-full sm:w-auto gap-4 px-4 py-2 rounded border flex items-center mt-2 sm:mt-0 font-bold'>
						Filters
						<Image
							src={'/images/icons/filter.svg'}
							alt={'filter'}
							width={18}
							height={18}
						/>
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
										currentPage * ITEMS_PER_PAGE,
										(currentPage + 1) * ITEMS_PER_PAGE,
									)
									.map((attestation: any, index: number) => (
										<tr key={index} className='border-t'>
											<td className='px-4 py-6 align-top text-gray-800'>
												{attestation.id}
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
														attestation
															.attestorOrganisation
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
		</div>
	);
};
