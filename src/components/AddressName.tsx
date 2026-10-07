import { useEffect, useState, useCallback, type FC } from 'react';
import { type Address, createClient, fallback, http } from 'viem';
import { createConfig, cookieStorage, createStorage } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { getEnsName } from 'wagmi/actions';
import { summarizeAddress } from '@/helpers/wallet';

interface AddressNameProps {
	address?: Address;
}

const PUBLIC_RPC_ENDPOINT = 'https://eth.llamarpc.com';

// Prefer the configured RPC, but fall back to a public one if it is missing
// or rejects requests, so ENS lookups degrade to showing the plain address.
const getTransport = () => {
	const drpcEndpoint = process.env.NEXT_PUBLIC_DRPC_ENDPOINT;
	if (drpcEndpoint) {
		return fallback([http(drpcEndpoint), http(PUBLIC_RPC_ENDPOINT)]);
	}
	return http(PUBLIC_RPC_ENDPOINT);
};

// Create wagmi config outside component to prevent recreation
const wagmiConfig = createConfig({
	chains: [mainnet],
	ssr: true,
	storage: createStorage({
		storage: cookieStorage,
	}),
	client({ chain }) {
		return createClient({
			chain,
			transport: getTransport(),
		});
	},
});

export const AddressName: FC<AddressNameProps> = ({ address }) => {
	const [ensName, setEnsName] = useState<string>('');
	const [isLoading, setIsLoading] = useState(false);

	const resolveEnsName = useCallback(async (walletAddress: Address) => {
		if (!walletAddress) return;

		setIsLoading(true);
		setEnsName(''); // Reset previous name

		try {
			const resolvedName = await getEnsName(wagmiConfig, {
				address: walletAddress,
			});

			if (resolvedName) {
				setEnsName(resolvedName);
			} else {
			}
		} catch (error) {
			console.error('ENS: Resolution failed:', error);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		if (address) {
			resolveEnsName(address);
		} else {
			setEnsName('');
			setIsLoading(false);
		}
	}, [address, resolveEnsName]);

	if (isLoading) {
		return <span>{summarizeAddress(address)}</span>; // Show address while loading
	}

	return <span>{ensName || summarizeAddress(address)}</span>;
};
