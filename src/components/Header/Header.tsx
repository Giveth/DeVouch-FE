'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { type HTMLAttributes } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import Link from 'next/link';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { Button } from '../Button/Button';
import Dropdown from '../Dropdown/Dropdown';
import { ConnectedWalletInfo } from './ConnectedWalletInfo';
import { ROUTES } from '@/config/routes';
import { links } from '@/config/constants';
import { useIsMobile } from '@/lib/useIsMobile';

const optionClasses: HTMLAttributes<HTMLDivElement>['className'] =
	'text-gray-600 py-2 px-2 cursor-pointer transition-colors hover:bg-gray-100';

export const Header = () => {
	const { open: openWeb3Modal } = useWeb3Modal();
	const { disconnect } = useDisconnect();
	const { address } = useAccount();
	const pathname = usePathname();
	const isMobile = useIsMobile();
	const isMyAttestations = pathname.includes(ROUTES.MY_ATTESTATIONS);

	return (
		<div className='container mx-auto py-10 flex justify-between items-center'>
			<Link href={ROUTES.HOME} className='flex gap-1'>
				<Image
					src='/images/logo.svg'
					alt='logo'
					width={30}
					height={30}
				/>
				<Image
					src='/images/logotype.svg'
					alt='logo'
					width={129}
					height={30}
					className='hidden sm:block'
				/>
			</Link>
			{address ? (
				<div className='flex flex-row gap-8 items-center'>
					{!isMyAttestations && (
						<div className='hidden md:flex gap-4'>
							<Link href={ROUTES.MY_ATTESTATIONS}>
								<div className='text-xl text-neutral-800 font-bold text-center hover-gradient-text'>
									My Attestations
								</div>
							</Link>
							<div className='w-px h-8 bg-neutral-400' />
						</div>
					)}
					<Dropdown
						label={<ConnectedWalletInfo />}
						options={[
							isMobile && (
								<Link href={ROUTES.MY_ATTESTATIONS} key={1}>
									<div className={optionClasses}>
										My Attestations
									</div>
								</Link>
							),
							<a
								href={links.DISCORD_LINK}
								key={2}
								target='_blank'
							>
								<div className={optionClasses}>Support</div>
							</a>,
							<hr className='my-2' key={3} />,
							<div
								key={4}
								className={`${optionClasses} flex gap-4 justify-between min-w-52`}
								onClick={() => disconnect()}
							>
								<div>Disconnect</div>
								<Image
									src='/images/icons/power.svg'
									alt='disconnect'
									width={20}
									height={20}
								/>
							</div>,
						]}
						stickToRight
					/>
				</div>
			) : (
				<Button onClick={() => openWeb3Modal()}>Connect Wallet</Button>
			)}
		</div>
	);
};
