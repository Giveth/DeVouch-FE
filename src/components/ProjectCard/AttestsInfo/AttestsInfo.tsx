import { type FC } from 'react';
import { AttestInfo } from './AttestInfo';

interface AttestInfoWithKey {
	id: string;
	info: AttestInfo;
}

interface AttestsInfoProps {
	attests: AttestInfoWithKey[];
	vouch?: boolean;
}

export const AttestsInfo: FC<AttestsInfoProps> = ({ attests, vouch }) => {
	console.log('attests', attests);
	const notEmpty = attests.length > 0;
	const exceeded = attests.length - 4;
	console.log('exceeded', exceeded);
	return notEmpty ? (
		<>
			{attests.slice(0, 4).map((info, index) => (
				<AttestInfo key={index} info={info.info} />
			))}
			{exceeded > 0 && (
				<div
					className='bg-gray-100 flex items-center justify-center w-8 h-8'
					onClick={e => {
						e.preventDefault();
						e.stopPropagation();
					}}
				>
					<span className='text-black font-bold'>+{exceeded}</span>
				</div>
			)}
		</>
	) : (
		<div className='bg-gray-100 py-1 px-2 w-full text-center'>
			No {vouch ? 'Vouches' : 'Flags'} Received Yet
		</div>
	);
};
