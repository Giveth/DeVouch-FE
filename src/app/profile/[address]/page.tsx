import { Address } from 'viem';
import { UserAttestations } from '@/features/profile/UserAttestations';

export default function Page({
	params: { address },
}: {
	params: { address: string };
}) {
	return <UserAttestations address={address as Address} />;
}
