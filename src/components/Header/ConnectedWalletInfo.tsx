import { useWalletInfo } from '@web3modal/wagmi/react';
import Image from 'next/image';
import React from 'react';
import { useAccount } from 'wagmi';
import { ChainIcon } from '../ChainIcon';
import { AddressName } from '../AddressName';

export const ConnectedWalletInfo = () => {
	const { walletInfo } = useWalletInfo();
	console.log(walletInfo?.name, walletInfo?.icon);
	const { address, chainId } = useAccount();

	return address ? (
		<div className='flex gap-3'>
			{walletInfo?.icon && (
				<div className='relative'>
					<Image
						src={walletInfo?.icon}
						width={24}
						height={24}
						alt='Wallet Icon'
					/>
					{chainId && (
						<div className='absolute   bottom-0 right-0'>
							<ChainIcon chainId={chainId} size={8} />
						</div>
					)}
				</div>
			)}
			<div>
				<AddressName address={address} />
			</div>
		</div>
	) : (
		<div>Not Connected</div>
	);
};
