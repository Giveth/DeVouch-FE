import { type FC, type HTMLAttributes } from 'react';
import Image from 'next/image';
import Dropdown from '../Dropdown/Dropdown';
import OptionsIcon from '../../../public/images/icons/options.svg';

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
						<div>{key}</div>
						{optionList.map(option => (
							<div
								key={option}
								className='flex items-center gap-2'
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
					className='flex items-center gap-2 cursor-pointer'
					onClick={handleClearFilters}
				>
					<p>Clear Filters</p>
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
