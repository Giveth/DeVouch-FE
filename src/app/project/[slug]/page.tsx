import { Suspense } from 'react';
import { ProjectDetails } from '@/features/project/ProjectDetails';

export default function Page({
	params: { slug },
}: {
	params: { slug: string };
}) {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<ProjectDetails slug={slug} />
		</Suspense>
	);
}
