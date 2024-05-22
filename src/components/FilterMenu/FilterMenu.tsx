import { type FC, type HTMLAttributes } from 'react';
import Dropdown from '../Dropdown/Dropdown';

interface FilterMenuProps {
	options: IOptions;
	value: { [key: string]: string[] };
	setValues: React.Dispatch<
		React.SetStateAction<{ [key: string]: string[] }>
	>;
	className?: HTMLAttributes<HTMLDivElement>['className'];
	label?: string;
	showChevron?: boolean;
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
	showChevron = true,
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
			label={`Filter (${selectedCount})`}
			showChevron={showChevron}
			stickToRight={stickToRight}
		/>
	);
};

export default FilterMenu;
