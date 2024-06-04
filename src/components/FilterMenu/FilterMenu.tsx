import {
	type Dispatch,
	type SetStateAction,
	type FC,
	type HTMLAttributes,
} from 'react';
import Image from 'next/image';
import Dropdown from '../Dropdown/Dropdown';
import Checkbox from '../CheckBox/CheckBox';
import OptionsIcon from '../../../public/images/icons/options.svg';
import TrashIcon from '../../../public/images/icons/trash.svg';

interface FilterMenuProps {
	options: IOptions;
	value: { [key: string]: string[] };
	setValues: Dispatch<SetStateAction<{ [key: string]: string[] }>>;
	className?: HTMLAttributes<HTMLDivElement>['className'];
	label?: string;
	stickToRight?: boolean;
}

interface IOptions {
	[key: string]: { key: string; value: string }[];
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

	const handleCheckboxChange = (key: string, optionValue: string) => {
		const currentValues = value[key] || [];
		const newValues = currentValues.includes(optionValue)
			? currentValues.filter(val => val !== optionValue)
			: [...currentValues, optionValue];
		handleSetValue({ key, values: newValues });
	};

	const handleClearFilters = () => {
		setValues({});
	};

	return (
		<Dropdown
			className={`relative ${className}`}
			options={[
				...Object.entries(options).map(([key, optionList]) => (
					<div key={key}>
						<div className='text-gray-400 font-bold py-3 px-3'>
							{key}
						</div>
						{optionList.map(option => (
							<div
								key={option.value}
								onClick={() =>
									handleCheckboxChange(key, option.value)
								}
							>
								<Checkbox
									id={`${key}-${option.value}`}
									label={option.key}
									checked={(value[key] || []).includes(
										option.value,
									)}
									onChange={() => {}}
									className='flex items-center gap-2 w-full  px-4 py-2 hover:bg-gray-100'
								/>
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
				<div className='flex flex-row items-center gap-6 justify-between'>
					<div>{label}</div>
					<Image src={OptionsIcon} alt='' width={24} height={24} />
				</div>
			}
			showChevron={false}
			stickToRight={stickToRight}
		/>
	);
};

export default FilterMenu;
