import Image from 'next/image';
import React, { useState } from 'react';

export const ShareProject = () => {
	const [isCopied, setIsCopied] = useState(false);
	const copyToClipboard = () => {
		setIsCopied(true);
		const address = window.location.href;
		navigator.clipboard.writeText(address);
		setTimeout(() => {
			setIsCopied(false);
		}, 2000);
	};
	return (
		<div className='flex flex-col md:flex-row py-6 justify-between items-center text-center gap-2 mt-[-20px]'>
			<span className='block text-gray-500 capitalize'>
				share this project with your community and invite them to
				attest!
			</span>
			<div className='flex items-center'>
				<button
					onClick={copyToClipboard}
					className='bg-white min-w-fit w-full min-h-11 md:w-auto border border-gray-300 text-black gap-2 px-4 py-2 transition-all duration-1000 ease-in-out'
				>
					{isCopied ? (
						<span className='text-sm'>Copied!</span>
					) : (
						<Image
							src={'/images/icons/share.svg'}
							alt={'share'}
							width={16}
							height={16}
							className='py-0'
						/>
					)}
				</button>
			</div>
		</div>
	);
};
