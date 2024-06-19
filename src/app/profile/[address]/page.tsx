import { Address } from 'viem';
import { type Metadata, type ResolvingMetadata } from 'next';
import { UserAttestations } from '@/features/profile/UserAttestations';

type Props = {
	params: { address: string };
};

export async function generateMetadata(
	{ params }: Props,
	parent: ResolvingMetadata,
): Promise<Metadata> {
	const { address } = params;

	return {
		title: `DeVouch | ${address} Attestations`,
		description: `View projects flagged or vouched by ${address} using DeVouch.`,
		openGraph: {
			images: [
				{
					url: 'https://devouch.app/images/banner.png',
					width: 1024,
					height: 512,
					alt: 'DeVouch | Decentralized Vouching for the Projects you Trust',
				},
			],
		},
	};
}

export default function Page({
	params: { address },
}: {
	params: { address: string };
}) {
	return <UserAttestations address={address as Address} />;
}
