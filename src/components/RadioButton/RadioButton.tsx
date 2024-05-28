import { FC } from 'react';

interface RadioButtonProps {
	id: string;
	label: string;
	checked: boolean;
	onChange: () => void;
	className?: string;
	name: string; // Adding name property to group radio buttons
}

const RadioButton: FC<RadioButtonProps> = ({
	id,
	label,
	checked,
	onChange,
	className = '',
	name,
}) => {
	return (
		<>
			<input
				id={id}
				type='radio'
				name={name}
				checked={checked}
				onChange={onChange}
				className='hidden'
			/>
			<label
				htmlFor={id}
				className={`flex items-center cursor-pointer ${className}`}
			>
				<span
					className={`w-5 h-5 inline-block mr-2 border-2 border-black rounded-full ${
						checked ? 'bg-black border-transparent' : 'bg-white'
					} transition-colors duration-200 ease-in-out`}
				>
					{checked && (
						<svg
							className='w-4 h-4 text-white'
							viewBox='0 0 26 26'
							fill='none'
							stroke='currentColor'
							strokeWidth='4'
							strokeLinecap='round'
							strokeLinejoin='round'
						>
							<circle cx='13' cy='13' r='11' />
						</svg>
					)}
				</span>
				{label}
			</label>
		</>
	);
};

export default RadioButton;
