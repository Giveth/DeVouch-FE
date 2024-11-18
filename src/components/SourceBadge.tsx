import Image from 'next/image';
import { type FC, type HTMLAttributes } from 'react';
import config from '@/config/configuration';
import { IProject } from '@/features/home/types';

interface SourceBadgeProps {
	source?: IProject['source'];
	rfRound?: IProject['rfRounds'];
	className?: HTMLAttributes<HTMLDivElement>['className'];
}

export const SourceBadge: FC<SourceBadgeProps> = ({
	source,
	rfRound,
	className = '',
}) => {
	const lastRoundSuffix = rfRound?.length ? `${rfRound.slice(-1)}` : '';
	const roundSuffix =
		Array.isArray(rfRound) && rfRound.length > 0
			? rfRound.length > 1
				? rfRound.join(', ')
				: rfRound[0]
			: '';

	const formattedSource =
		source === 'rf' ? `${source}${lastRoundSuffix}` : source;

	const platform = config.SOURCE_PLATFORMS.find(
		i => i.value.toLowerCase() === formattedSource?.toLowerCase(),
	);
	const formattedSourceLabel =
		source === 'rf' ? `Retro Funding ${roundSuffix}` : platform?.key;

	return source ? (
		<div className={`flex gap-1 bg-white py-1 px-2 z-auto ${className}`}>
			<span className='text-gray-300 font-light'>From </span>
			<span className='text-black'>{formattedSourceLabel}</span>
			{platform && (
				<Image
					src={`/images/sources/${formattedSource}.svg`}
					alt={formattedSource || 'source icon'}
					width={18}
					height={18}
				/>
			)}
		</div>
	) : null;
};
