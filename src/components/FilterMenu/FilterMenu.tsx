import { type FC, type HTMLAttributes } from 'react';
import Image from 'next/image';
import Dropdown from '../Dropdown/Dropdown';
import OptionsIcon from '../../../public/images/icons/options.svg';
import TrashIcon from '../../../public/images/icons/trash.svg';

interface FilterMenuProps {
	options: IOptions;
	value: { [key: string]: string[] };
	setValues: React.Dispatch<
		React.SetStateAction<{ [key: string]: string[] }>
	>;
	className?: HTMLAttributes<HTMLDivElement>['className'];
	label?: string;
	stickToRight?: boolean;
}

interface IOptions {
	[key: string]: string[];
}

const FilterMenu: FC<FilterMenuProps> = ({
	options,
	value,
	setValues,
	className,
	label = 'Filter',
	stickToRight = false,
}) => {
	const handleSetValue = ({
		key,
		values,
	}: {
		key: string;
		values: string[];
	}) => {
		setValues(prevValues => ({
			...prevValues,
			[key]: values,
		}));
	};

	const handleCheckboxChange = (key: string, option: string) => {
		const currentValues = value[key] || [];
		const newValues = currentValues.includes(option)
			? currentValues.filter(val => val !== option)
			: [...currentValues, option];
		handleSetValue({ key, values: newValues });
	};

	const handleClearFilters = () => {
		setValues({});
	};

	const selectedCount = Object.values(value).reduce(
		(acc, selectedOptions) => acc + selectedOptions.length,
		0,
	);

	return (
		<Dropdown
			className={className}
			options={[
				...Object.entries(options).map(([key, optionList]) => (
					<div key={key}>
						<div className='text-gray-400 font-bold py-3 px-3'>
							{key}
						</div>
						{optionList.map(option => (
							<div
								key={option}
								className='flex items-center gap-2 cursor-pointer px-4 py-2 hover:bg-gray-100'
								onClick={() =>
									handleCheckboxChange(key, option)
								}
							>
								<input
									type='checkbox'
									checked={(value[key] || []).includes(
										option,
									)}
									readOnly
								/>
								<p>{option}</p>
							</div>
						))}
					</div>
				)),
				<div
					key='clear-filters'
					className='flex items-center justify-between gap-2 cursor-pointer px-6 py-4 text-gray-600 font-bold hover:bg-gray-100'
					onClick={handleClearFilters}
				>
					<p>Clear Filters</p>
					<Image src={TrashIcon} alt='' />
				</div>,
			]}
			label={
				<div className='flex gap-6'>
					<span>Filter</span>
					<Image src={OptionsIcon} alt='' />
				</div>
			}
			showChevron={false}
			stickToRight={stickToRight}
		/>
	);
};

export default FilterMenu;
