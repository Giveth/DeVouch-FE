import { useEffect, useState, type FC } from 'react';
import { useAccount } from 'wagmi';
import { EAS, SchemaEncoder } from '@ethereum-attestation-service/eas-sdk';
import Modal, { IModal } from '../Modal';
import { Button } from '@/components/Button/Button';
import RadioButton from '@/components/RadioButton/RadioButton';
import { FETCH_USER_ORGANISATIONS } from '@/queries/user';
import { fetchGraphQL } from '@/helpers/request';
import { OutlineButton } from '@/components/Button/OutlineButton';
import { useEthersSigner } from '@/helpers/wallet';
import config from '@/config/configuration';

interface IOrganisation {
	id: string;
	name: string;
}

interface AttestModalProps extends IModal {}

interface IAttestorOrganisation {
	id: string;
	organisation: IOrganisation;
}

export const AttestModal: FC<AttestModalProps> = ({ ...props }) => {
	const [attestorOrganisations, setAttestorOrganisations] = useState<
		IAttestorOrganisation[]
	>([]);
	const [selectedValue, setSelectedValue] = useState<string>('');

	const { address } = useAccount();
	const signer = useEthersSigner();

	const handleRadioChange = (value: string) => {
		setSelectedValue(value);
	};

	useEffect(() => {
		// Fetch organisations
		const fetchOrganisations = async () => {
			const data = await fetchGraphQL<{
				attestorOrganisations: IAttestorOrganisation[];
			}>(FETCH_USER_ORGANISATIONS, { address: address?.toLowerCase() });
			setAttestorOrganisations(data?.attestorOrganisations || []);
		};
		fetchOrganisations();
	}, [address]);

	const handleConfirm = async () => {
		if (!signer) return;
		// Confirm the Attestation
		const eas = new EAS(config.EAS_CONTRACT_ADDRESS);
		eas.connect(signer);

		// Initialize SchemaEncoder with the schema string
		const schemaEncoder = new SchemaEncoder(
			'string projectSource,string projectId,bool vouch,string comment',
		);
		const encodedData = schemaEncoder.encodeData([
			{ name: 'projectSource', value: 'giveth', type: 'string' },
			{ name: 'projectId', value: '3251', type: 'string' },
			{ name: 'vouch', value: true, type: 'bool' },
			{ name: 'comment', value: 'Test Cherik', type: 'string' },
		]);

		const schemaUID = config.PROJECT_VERIFY_SCHEMA;

		const tx = await eas.attest({
			schema: schemaUID,
			data: {
				recipient: '',
				expirationTime: 0n,
				revocable: true, // Be aware that if your schema is not revocable, this MUST be false
				data: encodedData,
				refUID: selectedValue,
			},
		});

		console.log('tx', tx);

		const newAttestationUID = await tx.wait();

		console.log('newAttestationUID', newAttestationUID);
	};

	return (
		<Modal {...props} title='Vouch for Project'>
			<div className='flex flex-col gap-6'>
				<div>
					<div className='mb-2 text-gray-600'>
						Select the Attester Group you wish to vouch as:
					</div>
					<div className='border p-4'>
						{attestorOrganisations.map(ao => (
							<RadioButton
								key={ao.id}
								id={ao.id}
								name='organisation'
								label={ao.organisation.name}
								checked={selectedValue === ao.id}
								onChange={() => handleRadioChange(ao.id)}
								className='my-2'
							/>
						))}
					</div>
				</div>
				<div>
					<div className='mb-2 text-gray-600'>
						Any comments you want to add with your Attestation?
					</div>
					<textarea
						rows={3}
						placeholder='Write here'
						className='border w-full resize-none p-4'
					></textarea>
				</div>
				<div className='flex gap-8'>
					<OutlineButton
						className='flex-1'
						onClick={() => props.setShowModal(false)}
					>
						Cancel
					</OutlineButton>
					<Button className='flex-1' onClick={handleConfirm}>
						Confirm
					</Button>
				</div>
			</div>
		</Modal>
	);
};
