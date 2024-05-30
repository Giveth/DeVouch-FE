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

interface IOrganisation {
	id: string;
	name: string;
}

interface AttestModalProps extends IModal {}

export const AttestModal: FC<AttestModalProps> = ({ ...props }) => {
	const [organisations, setOrganisations] = useState<IOrganisation[]>([]);
	const [selectedValue, setSelectedValue] = useState<string>('');

	const { address } = useAccount();
	const signer = useEthersSigner();

	const handleRadioChange = (value: string) => {
		setSelectedValue(value);
	};

	useEffect(() => {
		// Fetch organisations
		const fetchOrganisations = async () => {
			const data = await fetchGraphQL<{ organisations: IOrganisation[] }>(
				FETCH_USER_ORGANISATIONS,
				{ id_eq: address?.toLowerCase() },
			);
			setOrganisations(data?.organisations || []);
		};
		fetchOrganisations();
	}, []);

	const handleConfirm = async () => {
		if (!signer) return;
		// Confirm the Attestation
		const eas = new EAS('0xC2679fBD37d54388Ce493F1DB75320D236e1815e');
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

		const schemaUID =
			'0x97b0c9911936fad57e77857fac6eef6771f8d0bf025be9549214e32bf9e2415a';

		const tx = await eas.attest({
			schema: schemaUID,
			data: {
				recipient: '0xFD50b031E778fAb33DfD2Fc3Ca66a1EeF0652165',
				expirationTime: 0n,
				revocable: true, // Be aware that if your schema is not revocable, this MUST be false
				data: encodedData,
				refUID: '0xe75f680320ecfa9334a408337e0225dcc7a1a5d24ea5841e72705e66234fd8c6',
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
						{organisations.map(organisation => (
							<RadioButton
								key={organisation.id}
								id={organisation.id}
								name='organisation'
								label={organisation.name}
								checked={selectedValue === organisation.id}
								onChange={() =>
									handleRadioChange(organisation.id)
								}
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
