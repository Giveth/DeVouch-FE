import {
	type Dispatch,
	type SetStateAction,
	type FC,
	type HTMLAttributes,
} from 'react';
import Image from 'next/image';
import Dropdown from '../Dropdown/Dropdown';

export interface IOption {
	key: string;
	value: string;
}

interface SelectProps {
	options: IOption[];
	setValue: Dispatch<SetStateAction<IOption>>;
	value: IOption;
	className?: HTMLAttributes<HTMLDivElement>['className'];
}

export const Select: FC<SelectProps> = ({
	options,
	setValue,
	value,
	className,
}) => {
	return (
		<Dropdown
			className={className}
			options={options.map(option => (
				<Option
					key={option.key}
					option={option}
					selected={option.key === value.key}
					setValue={setValue}
				/>
			))}
			label={value.value}
			sameWidth
		/>
	);
};

interface OptionProps {
	option: IOption;
	selected: boolean;
	setValue: Dispatch<SetStateAction<IOption>>;
}

const Option: FC<OptionProps> = ({ option, setValue, selected }) => {
	return (
		<div
			className={`my-2 py-2 px-4 hover:bg-gray-200 cursor-pointer flex justify-between gap-4 whitespace-nowrap overflow-hidden ${selected ? 'bg-gray-200' : ''}`}
			onClick={() => setValue(option)}
		>
			{option.value}
			{selected && (
				<Image
					src='/images/icons/checkmark.svg'
					alt='check'
					width={20}
					height={20}
					className=''
				/>
			)}
		</div>
	);
};
