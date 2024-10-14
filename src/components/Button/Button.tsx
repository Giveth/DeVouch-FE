import { type ReactNode, type ButtonHTMLAttributes, type FC } from 'react';
import { Spinner } from '../Loading/Spinner';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	children: ReactNode;
	buttonType?: ButtonType;
	loading?: boolean;
}

export enum ButtonType {
	BLUE = 'blue',
	RED = 'red',
	OUTLINE = 'outline',
}

const buttonTypeToColorName = {
	[ButtonType.BLUE]: 'c-blue-200',
	[ButtonType.RED]: 'c-red-200',
	[ButtonType.OUTLINE]: 'white', // Default to black for OUTLINE button
};

const buttonTypeToStyle = {
	[ButtonType.BLUE]: {
		'--bounce-text-color': '#3742FA',
		'--bounce-bg-start': '#3742FA',
		'--bounce-border-start': '#3742FA',
		'--bounce-bg-middle': '#EEEEEE',
		'--bounce-border-middle': '#3742FA',
		'--bounce-bg-end': '#FFFFFF',
		'--bounce-border-end': '#000000',
		'--bounce-text-end': '#000000',
	},
	[ButtonType.RED]: {
		'--bounce-text-color': '#FF4B2B',
		'--bounce-bg-start': '#FF4B2B',
		'--bounce-border-start': '#FF4B2B',
		'--bounce-bg-middle': '#EEEEEE',
		'--bounce-border-middle': '#FF4B2B',
		'--bounce-bg-end': '#FFFFFF',
		'--bounce-border-end': '#000000',
		'--bounce-text-end': '#000000',
	},
	[ButtonType.OUTLINE]: {
		'--bounce-text-color': 'black',
		'--bounce-bg-start': 'black',
		'--bounce-border-start': 'black',
		'--bounce-bg-middle': 'black',
		'--bounce-border-middle': 'black',
		'--bounce-bg-end': 'black',
		'--bounce-border-end': 'black',
		'--bounce-text-end': 'white',
	},
};

export const Button: FC<ButtonProps> = ({
	children,
	buttonType = ButtonType.BLUE,
	className,
	loading = false,
	disabled = false,
	...props
}) => {
	const isInteractive = !loading && !disabled;

	return (
		<div
			className={`group/button inline-block relative ${buttonType === ButtonType.OUTLINE ? 'text-black' : 'text-white'} ${className}`}
			style={buttonTypeToStyle[buttonType] as any}
		>
			<div
				id='shadow'
				className={`absolute w-full h-full bg-${buttonTypeToColorName[buttonType]} z-0 bottom-0 ${isInteractive ? 'animate-move-bounce-leave transform group-hover/button:animate-move-bounce-enter' : 'hidden'}`}
			/>
			<button
				className={`font-bold w-full bg-${buttonTypeToColorName[buttonType]} border-${buttonType === ButtonType.OUTLINE ? 'black ' : buttonTypeToColorName[buttonType]} border z-1 relative py-4 px-6 ${
					isInteractive
						? 'group-hover/button:animate-color-bounce-enter'
						: 'bg-gray-300 border-gray-300'
				}`}
				disabled={disabled}
				{...props}
			>
				<div className='flex gap-2 justify-center items-center'>
					{loading && <Spinner size={16} />}
					<span>{children}</span>
				</div>
			</button>
		</div>
	);
};
