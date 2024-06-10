import { type FC } from 'react';
import Modal, { IModal } from '../../Modal/Modal';
import { AttestsInfoProps } from './AttestsInfo';
import { AttestInfo } from './AttestInfo';

interface AllAttestsModalProps extends IModal, AttestsInfoProps {}

export const AllAttestsModal: FC<AllAttestsModalProps> = ({
	vouch,
	...props
}) => {
	return (
		<Modal
			{...props}
			title={vouch ? 'Vouched By' : 'Flagged By'}
			className='w-full md:w-[500px] p-6'
		>
			<div className='flex flex-col max-h-screen overflow-y-auto gap-2 lg:max-h-80 items-start'>
				{props.attests.map((info, index) => (
					<AttestInfo key={index} info={info.info} />
				))}
			</div>
		</Modal>
	);
};
