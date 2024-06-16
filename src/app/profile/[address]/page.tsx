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
		description:
			'DeVouch is a system for members of reputable organizations in the Ethereum ecosystem to vouch for projects that are looking to raise funding.',
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
