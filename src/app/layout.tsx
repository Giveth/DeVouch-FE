import './globals.css';
import { Space_Grotesk } from 'next/font/google';
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
			<head>
				<link
					rel='icon'
					type='image/svg+xml'
					href='/images/favicon.svg'
				/>
				<link rel='icon' type='image/png' href='/images/favicon.png' />
			</head>
			<body className={spaceGrotesk.className}>
				<Web3ModalProvider initialState={initialState}>
					<div className='min-h-screen flex flex-col gap-24 relative'>
						<Header />
						<div className='min-h-[80vh]'>{children}</div>
						<Footer />
					</div>
				</Web3ModalProvider>
			</body>
		</html>
	);
}
