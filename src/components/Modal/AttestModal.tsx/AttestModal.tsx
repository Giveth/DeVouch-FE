import { type FC } from 'react';
import Modal, { IModal } from '../Modal';

interface AttestModalProps extends IModal {}

export const AttestModal: FC<AttestModalProps> = ({ ...props }) => {
	return (
		<Modal {...props}>
			<div className='p-4'></div>
		</Modal>
	);
};
