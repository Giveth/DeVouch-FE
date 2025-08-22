import { useEffect, useState, useCallback, type FC } from 'react';
import { Address, createClient, http } from 'viem';
import { createConfig, cookieStorage, createStorage } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { getEnsName } from 'wagmi/actions';
import { summarizeAddress } from '@/helpers/wallet';

interface AddressNameProps {
	address?: Address;
}

// Get RPC endpoint with fallbacks
const getRpcEndpoint = () => {
	const drpcEndpoint = process.env.NEXT_PUBLIC_DRPC_ENDPOINT;
	if (drpcEndpoint) {
		console.log('ENS: Using DRPC endpoint:', drpcEndpoint);
		return drpcEndpoint;
	}
	console.log(
		'ENS: DRPC endpoint not found, using fallback: https://eth.llamarpc.com',
	);
	// Fallback to public RPC endpoints
	return 'https://eth.llamarpc.com';
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
			transport: http(getRpcEndpoint()),
		});
	},
});

export const AddressName: FC<AddressNameProps> = ({ address }) => {
	const [ensName, setEnsName] = useState<string>('');
	const [isLoading, setIsLoading] = useState(false);

	const resolveEnsName = useCallback(async (walletAddress: Address) => {
		if (!walletAddress) return;

		console.log('ENS: Starting resolution for address:', walletAddress);
		setIsLoading(true);
		setEnsName(''); // Reset previous name

		try {
			const resolvedName = await getEnsName(wagmiConfig, {
				address: walletAddress,
			});

			console.log('ENS: Resolved name:', resolvedName);

			if (resolvedName) {
				setEnsName(resolvedName);
				console.log('ENS: State updated with name:', resolvedName);
			} else {
				console.log('ENS: No name found for address:', walletAddress);
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

	// Debug current state
	console.log(
		'ENS: Current state - address:',
		address,
		'ensName:',
		ensName,
		'isLoading:',
		isLoading,
	);

	if (isLoading) {
		return <span>{summarizeAddress(address)}</span>; // Show address while loading
	}

	return <span>{ensName || summarizeAddress(address)}</span>;
};
