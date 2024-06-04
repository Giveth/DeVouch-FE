import { type FC } from 'react';
import { Address } from 'viem';
import { useEnsName } from 'wagmi';
import { summarizeAddress } from '@/helpers/wallet';

interface AddressNameProps {
	address?: Address;
}

export const AddressName: FC<AddressNameProps> = ({ address }) => {
	const { data: ensName } = useEnsName({ address, chainId: 1 });

	return <span>{ensName || summarizeAddress(address)}</span>;
};
