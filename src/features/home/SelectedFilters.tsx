import React from 'react';

interface SelectedFiltersProps {
	sources: string[];
	organizations: string[];
	attestorGroups?: Array<{ id: string; name: string }>;
	onRemoveFilter: (type: 'source' | 'organization', value: string) => void;
	onClearAll: () => void;
}

const SelectedFilters: React.FC<SelectedFiltersProps> = ({
	sources,
	organizations,
	attestorGroups,
	onRemoveFilter,
	onClearAll,
}) => {
	if (sources.length === 0 && organizations.length === 0) return null;

	const totalFilters = sources.length + organizations.length;

	return (
		<div className='flex flex-wrap 2xl:max-w-[500px] items-end justify-end gap-2'>
			{totalFilters > 1 && (
				<button
					onClick={onClearAll}
					className='inline-flex items-center gap-1.5 px-3 py-1 text-sm hover:font-semibold transition-colors whitespace-nowrap'
				>
					Clear All Filters
				</button>
			)}
			{sources.map(source => (
				<button
					key={source}
					onClick={() => onRemoveFilter('source', source)}
					className='inline-flex items-center gap-1.5 px-3 py-1 text-sm bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors whitespace-nowrap'
				>
					<span>
						From:{' '}
						<b>
							{source.startsWith('rf')
								? `RF Round ${source.slice(2)}`
								: `${source.charAt(0).toUpperCase()}${source.slice(1)}`}
						</b>
					</span>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						width='14'
						height='14'
						viewBox='0 0 24 24'
						fill='none'
						stroke='currentColor'
						strokeWidth='2'
						strokeLinecap='round'
						strokeLinejoin='round'
						className='text-gray-400'
					>
						<line x1='18' y1='6' x2='6' y2='18' />
						<line x1='6' y1='6' x2='18' y2='18' />
					</svg>
				</button>
			))}
			{organizations.map(orgId => {
				const orgName =
					attestorGroups?.find(group => group.id === orgId)?.name ||
					'';
				return (
					<button
						key={orgId}
						onClick={() => onRemoveFilter('organization', orgId)}
						className='inline-flex items-center gap-1.5 px-3 py-1 text-sm bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors whitespace-nowrap'
					>
						<span>
							Attested by: <b>{orgName}</b>
						</span>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							width='14'
							height='14'
							viewBox='0 0 24 24'
							fill='none'
							stroke='currentColor'
							strokeWidth='2'
							strokeLinecap='round'
							strokeLinejoin='round'
							className='text-gray-400'
						>
							<line x1='18' y1='6' x2='6' y2='18' />
							<line x1='6' y1='6' x2='18' y2='18' />
						</svg>
					</button>
				);
			})}
		</div>
	);
};

export default SelectedFilters;
