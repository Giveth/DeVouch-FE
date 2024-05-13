import Image from 'next/image';
import { type FC } from 'react';

interface AttestInfoProps {
	count: number;
	organization: string;
}

export const AttestInfo: FC<AttestInfoProps> = ({ count, organization }) => {
	return (
		<div className='py-1 px-2 bg-gray-100 flex gap-1 items-center'>
			<span className='font-bold'>{count}</span>
			<Image
				src='/images/icons/right-arrow.svg'
				width={13}
				height={11}
				alt='right arrow'
			/>
			<span className='font-light'>{organization}</span>
		</div>
	);
};
