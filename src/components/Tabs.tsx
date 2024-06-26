import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { FC } from 'react';

interface TabProps {
	tabs: { key: string; label: string; count?: number }[];
	activeTab: string;
}

export const Tabs: FC<TabProps> = ({ tabs, activeTab }) => {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const router = useRouter();
	return (
		<div className='flex flex-col lg:flex-row gap-4 w-full'>
			{tabs.map(tab => (
				<button
					key={tab.key}
					className={`relative w-full sm:w-auto px-4 py-2 flex items-center ${
						activeTab === tab.key
							? 'bg-[#d7ddea] font-bold'
							: 'bg-gray-100 hover:bg-gray-200'
					}`}
					onClick={() => {
						const params = new URLSearchParams(
							searchParams.toString(),
						);
						params.set('tab', tab.key);
						router.push(pathname + '?' + params.toString(), {
							scroll: false,
						});
					}}
				>
					{activeTab === tab.key && (
						<span className='absolute left-[-10px] top-0 h-full w-1 bg-black'></span>
					)}
					{tab.label}{' '}
					<span
						className={`ml-2 text-white rounded-full px-2 ${activeTab === tab.key ? 'bg-black' : 'bg-[#82899a]'}`}
					>
						{tab.count || 0}
					</span>
				</button>
			))}
		</div>
	);
};
