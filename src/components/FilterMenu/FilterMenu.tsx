import { type FC, type HTMLAttributes } from 'react';
import Image from 'next/image';
import Dropdown from '../Dropdown/Dropdown';
import Checkbox from '../CheckBox/CheckBox';
import OptionsIcon from '../../../public/images/icons/options.svg';
import TrashIcon from '../../../public/images/icons/trash.svg';

interface FilterMenuProps {
	options: IOptions;
	optionSectionLabel?: { [key: string]: string };
	value: { [key: string]: string[] };
	onSelectOption: (key: string, option: string) => void;
	onClearOptions: () => void;
	className?: HTMLAttributes<HTMLDivElement>['className'];
	label?: string;
	stickToRight?: boolean;
}

interface IOptions {
	[key: string]: { key: string; value: string }[];
}

const FilterMenu: FC<FilterMenuProps> = ({
	options,
	optionSectionLabel,
	value,
	onSelectOption,
	onClearOptions,
	className,
	label = 'Filter',
	stickToRight = false,
}) => {
	const count = Object.values(value).reduce(
		(acc, curr) => acc + curr.length,
		0,
	);
	return (
		<Dropdown
			className={`relative ${className}`}
			options={[
				...Object.entries(options).map(([key, optionList]) => (
					<div key={key}>
						<div className='text-gray-400 font-bold py-3 px-3'>
							{(optionSectionLabel && optionSectionLabel[key]) ||
								key}
						</div>
						{optionList.map(option => (
							<div
								key={option.value}
								onClick={() =>
									onSelectOption(key, option.value)
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
					onClick={onClearOptions}
				>
					<p>Clear Filters</p>
					<Image src={TrashIcon} alt='' />
				</div>,
			]}
			label={
				<div className='flex flex-row items-center gap-6 justify-between'>
					<div>{label}</div>
					<div className='flex gap-2 items-center'>
						{count > 0 && (
							<div className='bg-black block rounded-full text-white w-[20px] text-sm text-center'>
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
		/>
	);
};

export default FilterMenu;
