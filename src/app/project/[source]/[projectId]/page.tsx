import { Suspense } from 'react';
import { Metadata, ResolvingMetadata } from 'next';
import {
	ProjectDetails,
	ProjectDetailsProps,
} from '@/features/project/ProjectDetails';
import { Spinner } from '@/components/Loading/Spinner';
import { fetchProjectData } from '@/features/project/services';

type Props = {
	params: { source: string; projectId: string };
};

export async function generateMetadata(
	{ params }: Props,
	parent: ResolvingMetadata,
): Promise<Metadata> {
	const { source, projectId } = params;
	const project = await fetchProjectData(source, projectId);
	const previousImages = (await parent).openGraph?.images || [];

	return {
		title: `DeVouch | ${project.title} Details`,
		openGraph: {
			images: [project.image, ...previousImages],
		},
	};
}

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
