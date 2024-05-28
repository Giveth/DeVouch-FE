import './globals.css';
import { Space_Grotesk } from 'next/font/google';
import Image from 'next/image';
import { cookieToInitialState } from 'wagmi';
import { headers } from 'next/headers';
import Web3ModalProvider from '@/context';
import { wagmiConfig } from '@/config/wagmi';
import { Header } from '@/components/Header/Header';
import { Footer } from '@/components/Footer/Footer';
import type { Metadata } from 'next';
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'DeVouch',
	description: 'Vouch decentralized',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const initialState = cookieToInitialState(
		wagmiConfig,
		headers().get('cookie'),
	);
	return (
		<html lang='en'>
			<body className={spaceGrotesk.className}>
				<Web3ModalProvider initialState={initialState}>
					<div className='min-h-screen flex flex-col gap-24 relative'>
						<Image
							className='absolute top-28 -z-10'
							src='/images/arcs/1.svg'
							width={116}
							height={369}
							alt='arc-1'
						/>
						<Image
							className='absolute top-0 left-2/3 -z-10'
							src='/images/arcs/2.svg'
							width={256}
							height={109}
							alt='arc-2'
						/>
						<Image
							className='absolute top-96 right-0 -z-10'
							src='/images/arcs/3.svg'
							width={116}
							height={369}
							alt='arc-3'
						/>
						<Header />
						<div className='min-h-[80vh]'>{children}</div>
						<Footer />
					</div>
				</Web3ModalProvider>
			</body>
		</html>
	);
}
