import Image from 'next/image';
import React from 'react';

export const ShareProject = () => {
	const copyToClipboard = () => {
		const address = window.location.href;
		navigator.clipboard.writeText(address);
	};
	return (
		<div className='flex flex-col md:flex-row py-6 justify-between items-center text-center gap-2 mt-[-20px]'>
			<span className='block text-gray-500 capitalize'>
				share this project with your community and invite them to
				attest!
			</span>
			<button
				onClick={copyToClipboard}
				className='bg-white w-full md:w-auto border border-gray-300 text-gray-500 gap-2 px-4 py-2 '
			>
				<Image
					src={'/images/icons/share.svg'}
					alt={'share'}
					width={18}
					height={18}
				/>
			</button>
		</div>
	);
};
