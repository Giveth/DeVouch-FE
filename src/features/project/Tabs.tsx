import { FC } from 'react';

enum Tab {
	YourAttestations = 'yours',
	AllAttestations = 'all',
	Vouched = 'vouched',
	Flagged = 'flagged',
}

interface TabProps {
	tabs: { key: Tab; label: string; count: number }[];
	activeTab: Tab;
	onTabChange: (tab: Tab) => void;
}

export const Tabs: FC<TabProps> = ({ tabs, activeTab, onTabChange }) => {
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
					onClick={() => onTabChange(tab.key)}
				>
					{activeTab === tab.key && (
						<span className='absolute left-[-10px] top-0 h-full w-1 bg-black'></span>
					)}
					{tab.label}{' '}
					<span
						className={`ml-2 text-white rounded-full px-2 ${activeTab === tab.key ? 'bg-black' : 'bg-[#82899a]'}`}
					>
						{tab.count}
					</span>
				</button>
			))}
		</div>
	);
};
