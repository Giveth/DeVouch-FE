import Image from 'next/image';
import { type FC, type HTMLAttributes } from 'react';
import config from '@/config/configuration';

interface SourceBadgeProps {
	source?: string;
	className?: HTMLAttributes<HTMLDivElement>['className'];
}

export const SourceBadge: FC<SourceBadgeProps> = ({ source, className }) => {
	return source ? (
		<div className={` flex gap-1 bg-white py-1 px-2 z-auto ${className}`}>
			<span className='text-gray-300 font-light'>From</span>
			<span className='text-black'>
				{
					config.SOURCE_PLATFORMS.find(
						i => i.value.toLowerCase() === source.toLowerCase(),
					)?.key
				}
			</span>
			<Image
				src={`/images/sources/${source}.svg`}
				alt={source}
				width={18}
				height={18}
			/>
		</div>
	) : null;
};
