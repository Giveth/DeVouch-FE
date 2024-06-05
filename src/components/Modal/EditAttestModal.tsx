import { useState, type FC } from 'react';
import { useAccount } from 'wagmi';
import { EAS, SchemaEncoder } from '@ethereum-attestation-service/eas-sdk';
import Image from 'next/image';
import Modal, { IModal } from './Modal';
import { Button } from '@/components/Button/Button';
import {
	OutlineButton,
	OutlineButtonType,
} from '@/components/Button/OutlineButton';
import { useEthersSigner } from '@/helpers/wallet';
import config from '@/config/configuration';
import { ProjectAttestation } from '@/features/home/types';

interface AttestModalProps extends IModal {
	attestation: ProjectAttestation;
	onSuccess: (project: ProjectAttestation) => void;
}

enum AttestSteps {
	ATTEST,
	ATTESTING,
	SUCCESS,
}

export const EditAttestModal: FC<AttestModalProps> = ({
	attestation,
	onSuccess,
	...props
}) => {
	const [step, setStep] = useState(AttestSteps.ATTEST);
	const [comment, setComment] = useState<string>('');

	const { address } = useAccount();
	const signer = useEthersSigner();

	const handleConfirm = async (vouch: boolean) => {
		if (!address || !signer) return;

		try {
			setStep(AttestSteps.ATTESTING);
			const eas = new EAS(config.EAS_CONTRACT_ADDRESS);
			eas.connect(signer);

			const schemaEncoder = new SchemaEncoder(
				'string projectSource,string projectId,bool vouch,string comment',
			);

			const encodedData = schemaEncoder.encodeData([
				{
					name: 'projectSource',
					value: attestation.project.source,
					type: 'string',
				},
				{
					name: 'projectId',
					value: attestation.project.projectId,
					type: 'string',
				},
				{ name: 'vouch', value: vouch, type: 'bool' },
				{ name: 'comment', value: comment, type: 'string' },
			]);

			const schemaUID = config.PROJECT_VERIFY_SCHEMA;

			const tx = await eas.attest({
				schema: schemaUID,
				data: {
					recipient: '0x0000000000000000000000000000000000000000',
					expirationTime: 0n,
					revocable: true,
					data: encodedData,
					refUID: attestation.attestorOrganisation.id,
				},
			});

			console.log('tx', tx);

			const newAttestationUID = await tx.wait();
			console.log('newAttestationUID', newAttestationUID);

			// Update Project Data
			// onSuccess(_project);

			setStep(AttestSteps.SUCCESS);
		} catch (error: any) {
			console.log('error', error.message);
			setStep(AttestSteps.ATTEST);
		}
	};

	return (
		<Modal
			{...props}
			title='Edit your Attestation'
			showHeader={step !== AttestSteps.SUCCESS}
			className='w-full md:w-[500px] p-6'
		>
			{step === AttestSteps.SUCCESS ? (
				<div className='flex flex-col gap-6 items-center'>
					<Image
						src='/images/devouch-green.svg'
						width={100}
						height={100}
						alt='Success'
					/>
					<div className='text-2xl font-black'>
						Attestation Successful
					</div>
					<div className='text-gray-400 text-center'>
						Your attestation to this project has been successful!
						Check out more projects to Attest to.
					</div>
					<Button onClick={() => props.setShowModal(false)}>
						View Projects
					</Button>
				</div>
			) : (
				<div className='flex flex-col gap-6'>
					<div>
						<div className='mb-1 text-gray-700 font-bold'>
							Attesting As Optimism Badgeholder
						</div>
						<div className='mb-2 text-gray-500'>
							You already vouched for this project. You can update
							your sentiment on this project which will create a
							new attestation, replacing the previous one.
						</div>
					</div>
					<div>
						<div className='mb-2 text-gray-500'>
							Any comments you want to add with your new
							Attestation?
						</div>
						<textarea
							rows={3}
							placeholder='Write here'
							className='border w-full resize-none p-4'
							value={comment}
							onChange={e => setComment(e.target.value)}
						></textarea>
					</div>
					<div className='flex gap-8'>
						<OutlineButton
							className='flex-1'
							onClick={() => handleConfirm(true)}
							loading={step === AttestSteps.ATTESTING}
						>
							Vouch
						</OutlineButton>
						<OutlineButton
							className='flex-1'
							onClick={() => handleConfirm(false)}
							buttonType={OutlineButtonType.RED}
						>
							Flag
						</OutlineButton>
					</div>
				</div>
			)}
		</Modal>
	);
};
