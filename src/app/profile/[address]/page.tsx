import { UserAttestations } from '@/features/profile/UserAttestations';

export default function Page({
	params: { address },
}: {
	params: { address: string };
}) {
	return <UserAttestations address={address} />;
}
