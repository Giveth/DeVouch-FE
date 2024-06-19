import { Suspense } from 'react';
import { type Metadata, type ResolvingMetadata } from 'next';
import {
	ProjectDetails,
	ProjectDetailsProps,
} from '@/features/project/ProjectDetails';
import { Spinner } from '@/components/Loading/Spinner';
import { fetchProjectMetaData } from '@/features/project/services';

type Props = {
	params: { source: string; projectId: string };
};

export async function generateMetadata(
	{ params }: Props,
	parent: ResolvingMetadata,
): Promise<Metadata> {
	const { source, projectId } = params;
	const project = await fetchProjectMetaData(source, projectId);
	const previousImages = (await parent).openGraph?.images || [];

	return {
		title: `DeVouch | ${project.title} Details`,
		description: project.descriptionSummary,
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
		<Suspense
			fallback={
				<div className='relative container flex flex-col gap-8 p-4'>
					<Spinner size={16} />
				</div>
			}
		>
			<ProjectDetails source={source} projectId={projectId} />
		</Suspense>
	);
}
