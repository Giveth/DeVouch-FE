import { useState, type FC } from 'react';
import { useAccount, useSwitchChain } from 'wagmi';
import { EAS, SchemaEncoder } from '@ethereum-attestation-service/eas-sdk';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { Address } from 'viem';
import Modal, { IModal } from '../Modal';
import { Button } from '@/components/Button/Button';
import RadioButton from '@/components/RadioButton/RadioButton';
import { FETCH_USER_ORGANISATIONS } from '@/queries/user';
import { fetchGraphQL } from '@/helpers/request';
import { OutlineButton } from '@/components/Button/OutlineButton';
import { useEthersSigner } from '@/helpers/wallet';
import config from '@/config/configuration';
import { DEFAULT_ORGANISATION_COLOR } from '@/config/constants';
import { IProject } from '@/features/home/types';

interface IOrganisation {
	id: string;
	name: string;
}

interface AttestModalProps extends IModal {
	project: IProject;
	vouch: boolean;
	onSuccess: (project: IProject) => void;
}

interface IAttestorOrganisation {
	id: string;
	organisation: IOrganisation;
}

enum AttestSteps {
	ATTEST,
	ATTESTING,
	SUCCESS,
}

export const AttestModal: FC<AttestModalProps> = ({
	project,
	vouch = true,
	onSuccess,
	...props
}) => {
	const [step, setStep] = useState(AttestSteps.ATTEST);
	const [selectedOrg, setSelectedOrg] = useState<IAttestorOrganisation>();
	const [comment, setComment] = useState<string>('');
	const { switchChainAsync } = useSwitchChain();

	const { address } = useAccount();
	const signer = useEthersSigner();

	const handleRadioChange = (value: IAttestorOrganisation) => {
		setSelectedOrg(value);
	};

	const fetchOrganisations = async () => {
		if (!address) return [];
		const data = await fetchGraphQL<{
			attestorOrganisations: IAttestorOrganisation[];
		}>(FETCH_USER_ORGANISATIONS, { address: address?.toLowerCase() });

		const organisations = new Set<string>();

		const attestorOrganisations = data?.attestorOrganisations || [];
		const result = [];
		for (const ao of attestorOrganisations) {
			if (!organisations.has(ao.organisation.id)) {
				organisations.add(ao.organisation.id);
				result.push(ao);
			}
		}

		return result;
	};

	const { data, isLoading } = useQuery({
		queryKey: ['fetchUserOrganisations', address],
		queryFn: fetchOrganisations,
		staleTime: 300_000,
	});

	const handleConfirm = async () => {
		if (!address || !signer || !selectedOrg) return;

		try {
			setStep(AttestSteps.ATTESTING);

			// force user to switch to the chain
			await switchChainAsync({
				chainId: config.SUPPORTED_CHAINS[0].id,
			});

			const eas = new EAS(config.EAS_CONTRACT_ADDRESS);
			eas.connect(signer);

			const schemaEncoder = new SchemaEncoder(
				'string projectSource,string projectId,bool vouch,string comment',
			);

			const encodedData = schemaEncoder.encodeData([
				{
					name: 'projectSource',
					value: project.source,
					type: 'string',
				},
				{ name: 'projectId', value: project.projectId, type: 'string' },
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
					refUID: selectedOrg.id,
				},
			});

			console.log('tx', tx);

			const newAttestationUID = await tx.wait();
			console.log('newAttestationUID', newAttestationUID);

			// Update Project Data
			const _project = structuredClone(project);
			let attest = _project.attests?.find(
				_attest =>
					_attest.attestorOrganisation.organisation.id.toLowerCase() ===
						selectedOrg.organisation.id.toLowerCase() &&
					_attest.attestorOrganisation.attestor.id.toLowerCase() ===
						address?.toLowerCase(),
			);
			if (attest) {
				const oldVouch = attest.vouch;
				attest.vouch = vouch;
				attest.comment = comment;
				attest.id = newAttestationUID as Address;
				//old attest was attest and now user flagged
				if (oldVouch && !vouch) {
					_project.totalVouches--;
					_project.totalFlags++;
				}
				//old attest was flag and now user vouched
				if (!oldVouch && vouch) {
					_project.totalVouches++;
					_project.totalFlags--;
				}
			} else {
				const _attest = {
					id: newAttestationUID as Address,
					vouch,
					attestorOrganisation: {
						attestor: {
							id: address,
						},
						organisation: {
							id: selectedOrg.organisation.id,
							name: selectedOrg.organisation.name,
							color: DEFAULT_ORGANISATION_COLOR,
						},
						attestTimestamp: new Date(),
					},
					attestTimestamp: new Date(),
					comment: comment,
					project: _project,
				};
				_project.totalAttests++;
				vouch ? _project.totalVouches++ : _project.totalFlags++;
				_project.attests = [...(_project.attests || []), _attest];
			}
			onSuccess(_project);

			setStep(AttestSteps.SUCCESS);
		} catch (error: any) {
			console.log('error', error.message);
			setStep(AttestSteps.ATTEST);
		}
	};

	const isCommentExceed = comment.length > 256;

	return (
		<Modal
			{...props}
			title={`${vouch ? 'Vouch for' : 'Flag'} Project`}
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
						
					</div>
					<Button onClick={() => props.setShowModal(false)}>
						Done
					</Button>
				</div>
			) : (
				<div className='flex flex-col gap-6'>
					<div>
						<div className='mb-2 text-gray-500'>
							Select the Attester Group you wish to vouch as:
						</div>
						<div className='border p-4'>
							{isLoading ? (
								<div>Loading user&apos;s organizations</div>
							) : data && data?.length > 0 ? (
								data?.map(ao => (
									<RadioButton
										key={ao.id}
										id={ao.id}
										name='organisation'
										label={ao.organisation.name}
										checked={
											selectedOrg?.organisation.id ===
											ao.organisation.id
										}
										onChange={() => handleRadioChange(ao)}
										className='my-2'
									/>
								))
							) : (
								<div className='p-4 bg-gray-100 flex gap-4 items-start'>
									<Image
										src='/images/icons/warning.svg'
										width={24}
										height={24}
										alt='Empty'
									/>
									<div className='text-gray-500'>
										You do not belong to any attester group
										currently.
									</div>
								</div>
							)}
						</div>
					</div>
					<div>
						<div className='mb-2 text-gray-500'>
							Any comments you want to add with your Attestation?
						</div>
						<textarea
							rows={3}
							placeholder='Write here'
							className='border w-full resize-none p-4'
							value={comment}
							onChange={e => setComment(e.target.value)}
						></textarea>
						{isCommentExceed && (
							<div className='text-red-600 text-sm'>
								Comment must be less than 256 characters.
							</div>
						)}
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
							onClick={handleConfirm}
							loading={step === AttestSteps.ATTESTING}
							disabled={!selectedOrg || isCommentExceed}
						>
							Confirm
						</Button>
					</div>
				</div>
			)}
		</Modal>
	);
};
