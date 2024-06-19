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
	const previousImages = (await parent).openGraph?.images || [];

	return {
		title: `DeVouch | ${address} Attestations`,
		description: `View projects flagged or vouched by ${address} using DeVouch.`,
		openGraph: {
			images: [
				'https://devouch.xyz/images/banner.png',
				...previousImages,
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
