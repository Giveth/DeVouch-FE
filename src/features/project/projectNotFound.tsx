import Link from 'next/link';
import { Button } from '@/components/Button/Button';
import { ROUTES } from '@/config/routes';

export const ProjectNotFound = () => {
	return (
		<div className='container mx-auto my-12 flex flex-col items-center justify-center gap-6 p-6 text-center'>
			<h1 className='text-3xl font-bold'>
				Oops! Looks like we can&apos;t find the page you&apos;re looking
				for.
			</h1>
			<p className='max-w-2xl text-gray-600'>
				When a project or community is new it can take some time for
				DeVouch to discover it. Come back in a few hours and check again
				to see if their page on DeVouch has been created.
			</p>
			<p className='max-w-2xl text-gray-500'>
				If it has been more than 24 hours or you suspect something is
				broken, reach out to our support by{' '}
				<a
					href='https://discord.giveth.io'
					target='_blank'
					rel='noopener noreferrer'
					className='text-blue-500 hover:underline'
				>
					joining the Giveth Discord server
				</a>{' '}
				or sending an email to{' '}
				<a
					href='mailto:info@giveth.io'
					className='text-blue-500 hover:underline'
				>
					info@giveth.io
				</a>
				.
			</p>
			<Link href={ROUTES.HOME}>
				<Button>Go to Homepage</Button>
			</Link>
		</div>
	);
};
