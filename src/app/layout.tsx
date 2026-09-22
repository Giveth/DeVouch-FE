import './globals.css';
import { Space_Grotesk } from 'next/font/google';
import { headers } from 'next/headers';
import { type ReactNode } from 'react';
import { cookieToInitialState } from 'wagmi';
import AppKitProvider from '@/context';
import { wagmiConfig } from '@/config/wagmi';
import { Header } from '@/components/Header/Header';
import { Footer } from '@/components/Footer/Footer';
import type { Metadata } from 'next';
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'DeVouch',
	description: 'Vouch decentralized',
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	// Derive the wagmi state on the server: only this state crosses the
	// server/client boundary, never the raw (possibly httpOnly) cookie header.
	const initialState = cookieToInitialState(
		wagmiConfig,
		(await headers()).get('cookie'),
	);
	return (
		<html lang='en' data-scroll-behavior='smooth'>
			<head>
				<link
					rel='icon'
					type='image/svg+xml'
					href='/images/favicon.svg'
				/>
				<link rel='icon' type='image/png' href='/images/favicon.png' />
			</head>
			<body className={spaceGrotesk.className}>
				<AppKitProvider initialState={initialState}>
					<div className='min-h-screen flex flex-col gap-24 relative overflow-x-hidden'>
						<Header />
						<div className='min-h-[80vh]'>{children}</div>
						<Footer />
					</div>
				</AppKitProvider>
			</body>
		</html>
	);
}
