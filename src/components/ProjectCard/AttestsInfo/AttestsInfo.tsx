import { useState, type FC } from 'react';
import { AttestInfo } from './AttestInfo';
import { AllAttestsModal } from './AllAttestsModal';

interface AttestInfoWithKey {
	id: string;
	info: AttestInfo;
}

export interface AttestsInfoProps {
	attests: AttestInfoWithKey[];
	vouch?: boolean;
}

export const AttestsInfo: FC<AttestsInfoProps> = ({ attests, vouch }) => {
	const [showModal, setShowModal] = useState(false);
	const notEmpty = attests.length > 0;
	const exceeded = attests.length - 4;
	return notEmpty ? (
		<>
			{attests.slice(0, 4).map((info, index) => (
				<AttestInfo key={index} info={info.info} />
			))}
			{exceeded > 0 && (
				<div
					className='bg-gray-100 flex items-center justify-center w-8 h-8'
					onClick={e => setShowModal(true)}
				>
					<span className='text-black font-bold'>+{exceeded}</span>
				</div>
			)}
			{showModal && (
				<AllAttestsModal
					setShowModal={setShowModal}
					showModal={showModal}
					attests={attests}
					vouch={vouch}
				/>
			)}
		</>
	) : (
		<div className='bg-gray-100 py-1 px-2 w-full text-center'>
			No {vouch ? 'Vouches' : 'Flags'} Received Yet
		</div>
	);
};
