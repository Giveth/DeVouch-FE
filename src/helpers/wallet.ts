import {
	FallbackProvider,
	JsonRpcProvider,
	BrowserProvider,
	JsonRpcSigner,
} from 'ethers';
import { useMemo } from 'react';
import { getEnsName as _getEnsName } from 'wagmi/actions';
import { type Config, useClient, useConnectorClient } from 'wagmi';
import { wagmiConfig } from '@/config/wagmi';
import type { Chain, Client, Transport, Account, Address } from 'viem';

export const getEnsName = async (
	address: Address,
	chainId?: number,
): Promise<string | null> => {
	try {
		const ensName = await _getEnsName(wagmiConfig, {
			address,
			chainId: chainId || 1, // defaults to mainnet
		});
		return ensName;
	} catch (e) {
		console.log({ e });
		return null;
	}
};

export const summarizeAddress = (address: string) => {
	if (!address) return '';
	return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export function clientToProvider(client: Client<Transport, Chain>) {
	const { chain, transport } = client;
	const network = {
		chainId: chain.id,
		name: chain.name,
		ensAddress: chain.contracts?.ensRegistry?.address,
	};
	if (transport.type === 'fallback') {
		const providers = (transport.transports as ReturnType<Transport>[]).map(
			({ value }) => new JsonRpcProvider(value?.url, network),
		);
		if (providers.length === 1) return providers[0];
		return new FallbackProvider(providers);
	}
	return new JsonRpcProvider(transport.url, network);
}

/** Action to convert a viem Client to an ethers.js Provider. */
export function useEthersProvider({ chainId }: { chainId?: number } = {}) {
	const client = useClient<Config>({ chainId });
	return useMemo(
		() => (client ? clientToProvider(client) : undefined),
		[client],
	);
}

export function clientToSigner(client: Client<Transport, Chain, Account>) {
	const { account, chain, transport } = client;
	const network = {
		chainId: chain.id,
		name: chain.name,
		ensAddress: chain.contracts?.ensRegistry?.address,
	};
	const provider = new BrowserProvider(transport, network);
	const signer = new JsonRpcSigner(provider, account.address);
	return signer;
}

/** Hook to convert a viem Wallet Client to an ethers.js Signer. */
export function useEthersSigner({ chainId }: { chainId?: number } = {}) {
	const { data: client } = useConnectorClient<Config>({ chainId });
	return useMemo(
		() => (client ? clientToSigner(client) : undefined),
		[client],
	);
}
