import { Space_Grotesk } from 'next/font/google';
import './globals.css';
import { cookieToInitialState } from 'wagmi';
import { headers } from 'next/headers';
import { wagmiConfig } from '@/config/wagmi';
import Web3ModalProvider from '@/context';
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
					{children}
				</Web3ModalProvider>
			</body>
		</html>
	);
}
