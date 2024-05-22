import { type FC, type HTMLAttributes } from 'react';
import Dropdown from '../Dropdown/Dropdown';

interface FilterMenuProps {
	options: IOptions;
	setValue: (value: { key: string; values: string[] }) => void;
	value: { [key: string]: string[] };
	className?: HTMLAttributes<HTMLDivElement>['className'];
	showChevron?: boolean;
	stickToRight?: boolean;
}

interface IOptions {
	[key: string]: string[];
}

const FilterMenu: FC<FilterMenuProps> = ({
	options,
	setValue,
	value,
	className,
	showChevron = true,
	stickToRight = false,
}) => {
	const handleCheckboxChange = (key: string, option: string) => {
		const currentValues = value[key] || [];
		const newValues = currentValues.includes(option)
			? currentValues.filter(val => val !== option)
			: [...currentValues, option];
		setValue({ key, values: newValues });
	};

	const selectedCount = Object.values(value).reduce(
		(acc, selectedOptions) => acc + selectedOptions.length,
		0,
	);

	return (
		<Dropdown
			className={className}
			options={Object.entries(options).map(([key, optionList]) => (
				<div key={key}>
					<div>{key}</div>
					{optionList.map(option => (
						<div
							key={option}
							className='flex items-center gap-2'
							onClick={() => handleCheckboxChange(key, option)}
						>
							<input
								type='checkbox'
								checked={(value[key] || []).includes(option)}
								readOnly
							/>
							<p>{option}</p>
						</div>
					))}
				</div>
			))}
			label={`Filter (${selectedCount})`}
			showChevron={showChevron}
			stickToRight={stickToRight}
		/>
	);
};

export default FilterMenu;
