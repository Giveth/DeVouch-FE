import { useState, type FC } from 'react';
import Image from 'next/image';
import { useAccount } from 'wagmi';
import { EAS } from '@ethereum-attestation-service/eas-sdk';
import Modal, { IModal } from './Modal';
import { Button, ButtonType } from '@/components/Button/Button';
import { OutlineButton } from '@/components/Button/OutlineButton';
import { ProjectAttestation } from '@/features/home/types';
import { useEthersSigner } from '@/helpers/wallet';
import config from '@/config/configuration';

interface DeleteAttestModalProps extends IModal {
	attestation: ProjectAttestation;
	onSuccess: (attestation: ProjectAttestation) => void;
}

enum DeleteSteps {
	DELETE,
	DELETING,
	SUCCESS,
}

export const DeleteAttestModal: FC<DeleteAttestModalProps> = ({
	attestation,
	onSuccess,
	...props
}) => {
	const [step, setStep] = useState(DeleteSteps.DELETE);

	const { address } = useAccount();
	const signer = useEthersSigner();

	const onDelete = async () => {
		if (!address || !signer) return;

		try {
			setStep(DeleteSteps.DELETING);
			const eas = new EAS(config.EAS_CONTRACT_ADDRESS);
			eas.connect(signer);
			const transaction = await eas.revoke({
				schema: config.PROJECT_VERIFY_SCHEMA,
				data: {
					uid: attestation.id,
				},
			});
			console.log('transaction', transaction);

			const newAttestationUID = await transaction.wait();
			console.log('newAttestationUID', newAttestationUID);
			onSuccess(attestation);
			setStep(DeleteSteps.SUCCESS);
		} catch (error: any) {
			console.log('error on DeleteAttestModal', error.message);
			setStep(DeleteSteps.DELETE);
		}
	};

	return (
		<Modal
			{...props}
			title='delete your Attestation'
			showHeader={step !== DeleteSteps.SUCCESS}
			className='w-full md:w-[500px] p-6'
		>
			{step === DeleteSteps.SUCCESS ? (
				<div className='flex flex-col gap-6 items-center'>
					<Image
						src='/images/devouch-green.svg'
						width={100}
						height={100}
						alt='Success'
					/>
					<div className='text-2xl font-black'>
						Deletion Successful
					</div>
					<div className='text-gray-400 text-center'>
						You have successfully Deleted your Attestation to this
						project. Check out more projects to Attest to.
					</div>
					<Button onClick={() => props.setShowModal(false)}>
						View Projects
					</Button>
				</div>
			) : (
				<div className='flex flex-col gap-6'>
					<div className='mb-2 text-gray-500'>
						Are you sure you want to Delete your attestation for
						this project?
					</div>
					<div className='flex gap-8'>
						<OutlineButton
							className='flex-1'
							onClick={() => props.setShowModal(false)}
						>
							Cancel
						</OutlineButton>
						<Button
							className='flex-1'
							onClick={onDelete}
							loading={step === DeleteSteps.DELETING}
							buttonType={ButtonType.RED}
						>
							Confirm
						</Button>
					</div>
				</div>
			)}
		</Modal>
	);
};
