import { useEffect, useState, type FC } from 'react';
import { Address, createClient, http } from 'viem';
import { createConfig, cookieStorage, createStorage } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { getEnsName } from 'wagmi/actions';
import { summarizeAddress } from '@/helpers/wallet';
interface AddressNameProps {
	address?: Address;
}

const wagmiConfig = createConfig({
	chains: [mainnet],
	ssr: true,
	storage: createStorage({
		storage: cookieStorage,
	}),
	client({ chain }) {
		return createClient({ chain, transport: http() });
	},
});

export const AddressName: FC<AddressNameProps> = ({ address }) => {
	const [ensName, setEnsName] = useState('');
	useEffect(() => {
		if (!address) return;
		const _getEnsName = async (address: Address) => {
			try {
				const ensName = await getEnsName(wagmiConfig, {
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
