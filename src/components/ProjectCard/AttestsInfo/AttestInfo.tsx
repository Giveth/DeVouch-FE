import { type FC } from 'react';
import { IconRightArrow } from '../../Icons/IconRightArrow';

export interface AttestInfo {
	name: string;
	count: number;
	color: string;
}

interface AttestInfoProps {
	info: AttestInfo;
}

export const AttestInfo: FC<AttestInfoProps> = ({ info }) => {
	return (
		<div
			className={`py-1 px-2 bg-gray-100 flex gap-1 items-center group-hover/card:text-[${info?.color}]`}
		>
			<span className='font-bold'>{info?.count}</span>
			<IconRightArrow />
			<span className='font-light'>{info?.name}</span>
		</div>
	);
};
