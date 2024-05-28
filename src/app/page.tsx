import Link from 'next/link';
import { Projects } from '@/features/home/Projects';

export default function Home() {
	return (
		<>
			<div className='container'>
				<div className='px-20 py-10 flex flex-col gap-6'>
					<h1 className='text-8xl	font-bold leading-normal'>
						On-Chain Vouching via Attestations
					</h1>
					<p className='text-xl leading-relaxed'>
						Vouch for the projects that you believe in and build an
						on-chain record of reliability. DeVouch refines funding
						decisions by letting communities lend their credibility
						using the power of Ethereum Attestations.
					</p>
					<div>
						<Link
							href={'/'}
							className='inline-block font-bold bg-gradient-to-t from-c-blue-200 to-c-blue-100 text-transparent bg-clip-text leading-tight'
						>
							Learn More
						</Link>
					</div>
				</div>
			</div>
			<Projects />
		</>
	);
}
