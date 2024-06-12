import { type FC } from 'react';
import { IconRightArrow } from '../../Icons/IconRightArrow';

export interface AttestInfo {
	name: string;
	count: number;
	color: string;
}

interface AttestInfoProps {
	info: AttestInfo;
	isHovered?: boolean;
}

export const AttestInfo: FC<AttestInfoProps> = ({ info, isHovered }) => {
	return (
		<div
			className={`py-1 px-2 bg-gray-100 flex gap-1 items-center transition-colors duration-75`}
			style={{ color: `${isHovered ? info?.color : ''}` }}
		>
			<span className='font-bold'>{info?.count}</span>
			<IconRightArrow />
			<span className='font-light'>{info?.name}</span>
		</div>
	);
};
