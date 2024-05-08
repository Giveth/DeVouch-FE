'use client';

import Image from 'next/image';
import { type HTMLAttributes } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import Link from 'next/link';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { Button } from '../Button';
import Dropdown from '../Dropdown/Dropdown';
import { ConnectedWalletInfo } from './ConnectedWalletInfo';
import { ROUTES } from '@/cofig/routes';

const optionClasses: HTMLAttributes<HTMLDivElement>['className'] =
	'text-gray-600 py-2 px-2 cursor-pointer transition-colors hover:bg-gray-100';

export const Header = () => {
	const { open } = useWeb3Modal();
	const { disconnect } = useDisconnect();
	const { address } = useAccount();
	return (
		<div className='container mx-auto py-10 flex justify-between items-center'>
			<Image src='/images/logo.svg' alt='logo' width={165} height={30} />
			{address ? (
				<Dropdown
					label={<ConnectedWalletInfo />}
					options={[
						<Link href={ROUTES.MY_ATTESTATIONS} key={1}>
							<div className={optionClasses}>My Attestations</div>
						</Link>,
						<Link href={ROUTES.SUPPORT} key={2}>
							<div className={optionClasses}>Support</div>
						</Link>,
						<hr className='my-2' key={3} />,
						<div
							key={4}
							className={`${optionClasses} flex gap-4 justify-between min-w-52`}
							onClick={() => disconnect()}
						>
							<div>Disconnect</div>
							<Image
								src='/images/icons/power-sharp.svg'
								alt='disconnect'
								width={20}
								height={20}
							/>
						</div>,
					]}
					stickToRight
				/>
			) : (
				<Button onClick={() => open()}>Connect Wallet</Button>
			)}
		</div>
	);
};
