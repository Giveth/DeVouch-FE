import Image from 'next/image';
import { type FC } from 'react';

export interface AttestInfo {
	name: string;
	count: number;
	color: string;
}

interface AttestInfoProps {
	info: AttestInfo;
}

export const AttestInfo: FC<AttestInfoProps> = ({ info }) => {
	const { name, count, color } = info;
	console.log('color', color);
	return (
		<div
			className={`py-1 px-2 bg-gray-100 flex gap-1 items-center group-hover/card:text-[${color}]`}
		>
			<span className='font-bold'>{count}</span>
			<Image
				src='/images/icons/right-arrow.svg'
				width={13}
				height={11}
				alt='right arrow'
			/>
			<span className='font-light'>{name}</span>
		</div>
	);
};
