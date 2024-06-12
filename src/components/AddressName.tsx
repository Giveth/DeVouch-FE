import { useEffect, useState, type FC } from 'react';
import { Address, createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';
import { summarizeAddress } from '@/helpers/wallet';

const publicClient = createPublicClient({
	chain: mainnet,
	transport: http(),
});
interface AddressNameProps {
	address?: Address;
}

export const AddressName: FC<AddressNameProps> = ({ address }) => {
	const [ensName, setEnsName] = useState('');
	useEffect(() => {
		if (!address) return;
		const _getEnsName = async (address: Address) => {
			try {
				const ensName = await publicClient.getEnsName({
					address,
				});
				if (!ensName) return;
				setEnsName(ensName);
			} catch (e) {
				console.log({ e });
				return null;
			}
		};
		_getEnsName(address);
	}, [address]);

	return <span>{ensName || summarizeAddress(address)}</span>;
};
