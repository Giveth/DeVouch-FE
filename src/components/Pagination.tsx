import { type FC } from 'react';

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}

export const Pagination: FC<PaginationProps> = ({
	currentPage,
	totalPages,
	onPageChange,
}) => {
	return totalPages > 1 ? (
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
	) : null;
};
