import { useState, useEffect } from 'react';
import { Address } from 'viem';
import { getEnsName } from '@/helpers/wallet';

const useEnsName = (address: Address, chainId?: number) => {
	const [ensName, setEnsName] = useState<string | null>(null);

	useEffect(() => {
		const fetchEnsName = async () => {
			try {
				const name = await getEnsName(address, chainId);
				setEnsName(name);
			} catch (error) {
				console.error('Error fetching ENS name:', error);
			}
		};

		fetchEnsName();
	}, [address]);

	return ensName;
};

export default useEnsName;
