import React from 'react';
import Image from 'next/image';

const Footer = () => {
	return (
		<div className='w-full bg-transparent py-4 mt-8'>
			<div className='container mx-auto flex justify-between items-center'>
				<div className='flex gap-4'>
					<a
						href='/documentation'
						className='text-gray-700 hover:underline'
					>
						Documentations
					</a>
					<a
						href='/contact'
						className='text-gray-700 hover:underline'
					>
						Contact Us
					</a>
				</div>
				<div className='flex items-center'>
					<span className='text-gray-500 mr-[-10px]'>
						Built by <b>Giveth</b>
					</span>
					<a
						href='https://giveth.io'
						target='_blank'
						rel='noopener noreferrer'
					>
						<Image
							src='/images/icons/giveth.svg'
							alt='giveth'
							width={52}
							height={52}
						/>
					</a>
				</div>
			</div>
		</div>
	);
};

export default Footer;
