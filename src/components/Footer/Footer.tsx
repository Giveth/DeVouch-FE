import Image from 'next/image';
import React from 'react';

export const Footer = () => {
	return (
		<div className='container py-8 flex justify-between'>
			<div className='flex gap-2'>
				<a className='px-4 py-2'>Documentations</a>
				<a className='px-4 py-2'>Contact Us</a>
			</div>
			<div className='flex gap-3 items-center text-lg'>
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
