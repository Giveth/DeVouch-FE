import { cookieStorage, createConfig, createStorage } from 'wagmi';
import { walletConnect } from 'wagmi/connectors';
import { createClient, http } from 'viem';
import config from './configuration';

// Get projectId at https://cloud.walletconnect.com
export const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_ID;

if (!projectId) throw new Error('Project ID is not defined');

const metadata = {
	name: 'DeVouch',
	description: 'On-Chain Vouching via Attestations',
	url: 'https://devouch.xyz', // origin must match your domain & subdomain
	icons: ['https://devouch.xyz/images/favicon.svg'],
};

// Create wagmiConfig
export const wagmiConfig = createConfig({
	chains: config.SUPPORTED_CHAINS,
	connectors: [
		walletConnect({
			projectId,
			metadata,
		}),
	],
	ssr: true,
	storage: createStorage({
		storage: cookieStorage,
	}),
	client({ chain }) {
		return createClient({ chain, transport: http() });
	},
});
