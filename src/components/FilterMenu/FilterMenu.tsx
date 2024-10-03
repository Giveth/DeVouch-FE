import React, { FC, useState, useEffect, HTMLAttributes } from 'react';
import Image from 'next/image';
import Dropdown from '../Dropdown/Dropdown';
import Checkbox from '../CheckBox/CheckBox';
import OptionsIcon from '../../../public/images/icons/options.svg';
import TrashIcon from '../../../public/images/icons/trash.svg';

interface IOptions {
	[key: string]: { key: string; value: string }[];
}

interface FilterMenuProps {
	options: IOptions;
	value: { [key: string]: string[] };
	onApplyFilters: (selectedFilters: { [key: string]: string[] }) => void;
	className?: HTMLAttributes<HTMLDivElement>['className'];
	label?: string;
	stickToRight?: boolean;
}

const FilterMenu: FC<FilterMenuProps> = ({
	options,
	value,
	onApplyFilters,
	className = '',
	label = 'Filter',
	stickToRight = false,
}) => {
	const [localValue, setLocalValue] = useState<{ [key: string]: string[] }>(
		value,
	);

	// Sync local state with prop value when it changes
	useEffect(() => {
		setLocalValue(value);
	}, [value]);

	const handleSelectOption = (key: string, option: string) => {
		setLocalValue(prevState => {
			const prevOptions = prevState[key] || [];
			let newOptions;
			if (prevOptions.includes(option)) {
				newOptions = prevOptions.filter(opt => opt !== option);
			} else {
				newOptions = [...prevOptions, option];
			}
			return { ...prevState, [key]: newOptions };
		});
	};

	const handleClearOptions = () => {
		setLocalValue({});
	};

	const handleApplyFilters = () => {
		onApplyFilters(localValue);
	};

	const count = Object.values(localValue).reduce(
		(acc, curr) => acc + curr.length,
		0,
	);
	const showCount = count > 0;

	return (
		<Dropdown
			className={`relative w-full ${showCount ? 'min-w-44' : 'min-w-40'} ${
				className || ''
			}`}
			options={[
				...Object.entries(options).map(([key, optionList]) => (
					<div key={key}>
						<div className='text-gray-400 font-bold py-3 px-3'>
							{key}
						</div>
						{optionList.map(option => (
							<div key={option.value}>
								<Checkbox
									id={`${key}-${option.value}`}
									label={option.key}
									checked={(localValue[key] || []).includes(
										option.value,
									)}
									onChange={() =>
										handleSelectOption(key, option.value)
									}
									className='flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100'
								/>
							</div>
						))}
					</div>
				)),
				<div
					key='clear-filters'
					className='flex items-center justify-between gap-2 cursor-pointer px-6 py-4 text-gray-600 font-bold hover:bg-gray-100'
					onClick={handleClearOptions}
				>
					<p>Clear Filters</p>
					<Image src={TrashIcon} alt='' />
				</div>,
			]}
			label={
				<div className='flex flex-row items-center gap-6 justify-between'>
					<div>{label}</div>
					<div className='flex gap-2 items-center'>
						{showCount && (
							<div className='bg-black block rounded-full text-white !min-w-[20px] text-sm text-center px-2'>
								{count}
							</div>
						)}
						<Image
							src={OptionsIcon}
							alt=''
							width={24}
							height={24}
						/>
					</div>
				</div>
			}
			showChevron={false}
			stickToRight={stickToRight}
			onClose={handleApplyFilters}
		/>
	);
};

export default FilterMenu;
