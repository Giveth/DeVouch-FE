import { Suspense } from 'react';
import { ProjectDetails } from '@/features/project/ProjectDetails';
import { Spinner } from '@/components/Loading/Spinner';

export default function Page({
	params: { slug },
}: {
	params: { slug: string };
}) {
	return (
		<Suspense fallback={<Spinner size={16} />}>
			<ProjectDetails slug={slug} />
		</Suspense>
	);
}
