import { Metadata } from 'next';
import { UserAttestations } from '@/features/profile/UserAttestations';

export const metadata: Metadata = {
	title: 'DeVouch | My Attestations',
	description: 'View your flagged or vouched projects using DeVouch.',
	openGraph: {
		title: 'DeVouch | My Attestations',
		description: 'View your flagged or vouched projects using DeVouch.',
		type: 'website',
		images: ['https://devouch.xyz/images/banner.png'],
	},
};

export default function UserAttestationsPage() {
	return <UserAttestations />;
}
