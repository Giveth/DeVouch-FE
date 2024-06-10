import { type FC } from 'react';
import Modal, { IModal } from '../../Modal/Modal';

interface AllAttestsModalProps extends IModal {
	vouch?: boolean;
}

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
			<div></div>
		</Modal>
	);
};
