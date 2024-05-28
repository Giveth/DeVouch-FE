import { useEffect, useState, type FC } from 'react';
import { useAccount } from 'wagmi';
import Modal, { IModal } from '../Modal';
import { Button } from '@/components/Button/Button';
import RadioButton from '@/components/RadioButton/RadioButton';
import { FETCH_USER_ORGANISATIONS } from '@/queries/user';
import { fetchGraphQL } from '@/helpers/request';

interface IOrganisation {
	id: string;
	name: string;
}

interface AttestModalProps extends IModal {}

export const AttestModal: FC<AttestModalProps> = ({ ...props }) => {
	const [organisations, setOrganisations] = useState<IOrganisation[]>([]);
	const [selectedValue, setSelectedValue] = useState<string>('');

	const { address } = useAccount();

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
				<div className='flex justify-end'>
					<Button className='btn btn-primary'>Vouch</Button>
				</div>
			</div>
		</Modal>
	);
};
