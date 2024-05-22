import { FC } from 'react';

interface CheckboxProps {
	id: string;
	label: string;
	checked: boolean;
	onChange: () => void;
	className?: string;
}

const Checkbox: FC<CheckboxProps> = ({
	id,
	label,
	checked,
	onChange,
	className = '',
}) => {
	return (
		<>
			<input
				id={id}
				type='checkbox'
				checked={checked}
				onChange={onChange}
				className='hidden'
			/>
			<label
				htmlFor={id}
				className={`flex items-center cursor-pointer ${className}`}
			>
				<span
					className={`w-4 h-4 inline-block mr-2 border border-gray-300 rounded-sm ${
						checked ? 'bg-blue-500 border-transparent' : 'bg-white'
					} transition-colors duration-200 ease-in-out`}
				>
					{checked && (
						<svg
							className='w-4 h-4 text-white'
							viewBox='0 0 24 24'
							fill='none'
							stroke='currentColor'
							strokeWidth='2'
							strokeLinecap='round'
							strokeLinejoin='round'
						>
							<polyline points='20 6 9 17 4 12' />
						</svg>
					)}
				</span>
				{label}
			</label>
		</>
	);
};

export default Checkbox;
