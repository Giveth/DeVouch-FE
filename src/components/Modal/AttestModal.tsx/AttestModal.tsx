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
	const [organisations, setOrganisations] = useState([]);
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
			console.log('data', data);
		};
		fetchOrganisations();
	}, []);

	return (
		<Modal {...props} title='Vouch for Project'>
			<div className='flex flex-col gap-6'>
				<div>
					<div className='mb-2'>
						Select the Attester Group you wish to vouch as:
					</div>
					<div className='border p-4'>
						<RadioButton
							id='radio1'
							name='example'
							label='Option 1'
							checked={selectedValue === 'option1'}
							onChange={() => handleRadioChange('option1')}
							className='my-2'
						/>
						<RadioButton
							id='radio2'
							name='example'
							label='Option 2'
							checked={selectedValue === 'option2'}
							onChange={() => handleRadioChange('option2')}
							className='my-2'
						/>
						<RadioButton
							id='radio3'
							name='example'
							label='Option 3'
							checked={selectedValue === 'option3'}
							onChange={() => handleRadioChange('option3')}
							className='my-2'
						/>
					</div>
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
