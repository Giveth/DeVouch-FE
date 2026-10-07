'use client';

import { type ReactNode } from 'react';
import { createAppKit } from '@reown/appkit/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type State, WagmiProvider } from 'wagmi';
import { metadata, projectId, wagmiAdapter, wagmiConfig } from '@/config/wagmi';
import config from '@/config/configuration';

// Setup queryClient
const queryClient = new QueryClient();

if (!projectId) throw new Error('Project ID is not defined');

// Create modal
createAppKit({
	adapters: [wagmiAdapter],
	projectId,
	networks: [...config.SUPPORTED_CHAINS],
	defaultNetwork: config.SUPPORTED_CHAINS[0],
	metadata,
	features: {
		analytics: true, // Optional - defaults to your Cloud configuration
		onramp: true, // Optional - false as default
		// Keep the wallet-only connect flow the app had with Web3Modal v4
		email: false,
		socials: false,
	},
});

export default function AppKitProvider({
	children,
	initialState,
}: {
	children: ReactNode;
	initialState?: State;
}) {
	return (
		<WagmiProvider config={wagmiConfig} initialState={initialState}>
			<QueryClientProvider client={queryClient}>
				{children}
			</QueryClientProvider>
		</WagmiProvider>
	);
}
