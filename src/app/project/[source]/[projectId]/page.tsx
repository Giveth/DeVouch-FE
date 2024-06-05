import { Suspense } from 'react';
import {
	ProjectDetails,
	ProjectDetailsProps,
} from '@/features/project/ProjectDetails';
import { Spinner } from '@/components/Loading/Spinner';

export default function Page({
	params: { source, projectId },
}: {
	params: ProjectDetailsProps;
}) {
	return (
		<Suspense fallback={<Spinner size={16} />}>
			<ProjectDetails source={source} projectId={projectId} />
		</Suspense>
	);
}
