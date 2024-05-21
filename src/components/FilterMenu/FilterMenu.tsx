import {
	type Dispatch,
	type FC,
	type HTMLAttributes,
	type SetStateAction,
} from 'react';
import Dropdown from '../Dropdown/Dropdown';
import { IOption } from '../Select/Select';

interface FilterMenuProps {
	options: IOption[];
	setValue: Dispatch<SetStateAction<IOption>>;
	value: IOption;
	className?: HTMLAttributes<HTMLDivElement>['className'];
}

export const FilterMenu: FC<FilterMenuProps> = ({
	options,
	setValue,
	value,
	className,
}) => {
	return (
		<Dropdown
			className={className}
			options={options.map(option => (
				<div
					key={option.key}
					// option={option}
					// selected={option.key === value.key}
					// setValue={setValue}
				/>
			))}
			label={value.value}
			sameWidth
			showChevron
		/>
	);
};
