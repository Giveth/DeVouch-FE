import Image from 'next/image';
import React from 'react';

export const Footer = () => {
	return (
		<div className='container py-8 flex flex-col sm:flex-row justify-between items-center sm:items-start'>
			<div className='flex flex-col sm:flex-row gap-2 mb-4 sm:mb-0'>
				<a className='px-4 py-2 text-center sm:text-left'>
					Documentations
				</a>
				<a className='px-4 py-2 text-center sm:text-left'>Contact Us</a>
			</div>
			<div className='flex gap-3 items-center text-lg text-center sm:text-left'>
				<span className='text-gray-400 font-semibold'>Built by</span>
				<span className='font-bold'>Giveth</span>
				<Image
					src='/images/icons/giveth.svg'
					alt='giveth'
					width={32}
					height={32}
				/>
			</div>
		</div>
	);
};
