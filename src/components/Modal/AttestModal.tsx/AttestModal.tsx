import { type FC } from 'react';
import Modal, { IModal } from '../Modal';
import { Button } from '@/components/Button/Button';

interface AttestModalProps extends IModal {}

export const AttestModal: FC<AttestModalProps> = ({ ...props }) => {
	return (
		<Modal {...props} title='Vouch for Project'>
			<div className='flex flex-col gap-6'>
				<div>
					<div className='mb-2'>
						Select the Attester Group you wish to vouch as:
					</div>
					<div className='border p-4'></div>
				</div>
				<div>
					<div className='mb-2'>
						Any comments you want to add with your Attestation?
					</div>
					<textarea
						rows={3}
						placeholder='Write here'
						className='border w-full resize-none p-4'
					></textarea>
				</div>
				<div className='flex justify-end'>
					<Button className='btn btn-primary'>Vouch</Button>
				</div>
			</div>
		</Modal>
	);
};
