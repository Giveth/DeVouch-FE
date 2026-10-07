import { cookieStorage, createStorage } from 'wagmi';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import config from './configuration';

// Get projectId at https://dashboard.reown.com
export const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_ID;

if (!projectId) throw new Error('Project ID is not defined');

export const metadata = {
	name: 'DeVouch',
	description: 'On-Chain Vouching via Attestations',
	url: 'https://devouch.xyz', // origin must match your domain & subdomain
	icons: ['https://devouch.xyz/images/favicon.svg'],
};

// Create the wagmi adapter (owns the wagmi config used by WagmiProvider)
export const wagmiAdapter = new WagmiAdapter({
	networks: [...config.SUPPORTED_CHAINS],
	projectId,
	ssr: true,
	storage: createStorage({
		storage: cookieStorage,
	}),
});

export const wagmiConfig = wagmiAdapter.wagmiConfig;
