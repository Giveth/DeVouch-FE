import { type HTMLAttributes, type FC } from 'react';

interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
	children: React.ReactNode;
	buttonType?: ButtonType;
}

export enum ButtonType {
	BLUE,
	RED,
}

const buttonTypeToColorName = {
	[ButtonType.BLUE]: 'c-blue-200',
	[ButtonType.RED]: 'c-red-200',
};

const buttonTypeToStyle = {
	[ButtonType.BLUE]: {
		'--bounce-text-color': '#3742FA',
		'--bounce-color-start': '#3742FA',
		'--bounce-border-start': '#3742FA',
		'--bounce-color-middle': '#EEEEEE',
		'--bounce-border-middle': '#3742FA',
		'--bounce-color-end': '#FFFFFF',
		'--bounce-border-end': '#000000',
	},
	[ButtonType.RED]: {
		'--bounce-text-color': '#FF4B2B',
		'--bounce-color-start': '#FF4B2B',
		'--bounce-border-start': '#FF4B2B',
		'--bounce-color-middle': '#EEEEEE',
		'--bounce-border-middle': '#FF4B2B',
		'--bounce-color-end': '#FFFFFF',
		'--bounce-border-end': '#000000',
	},
};

export const Button: FC<ButtonProps> = ({
	children,
	buttonType = ButtonType.BLUE,
	...props
}) => {
	return (
		<div
			className='group/button relative m-4  text-white '
			style={buttonTypeToStyle[buttonType] as any}
		>
			<div
				id='shadow'
				className={`absolute w-full h-full  bg-${buttonTypeToColorName[buttonType]} z-0  bottom-0 animate-move-bounce-leave transform group-hover/button:animate-move-bounce-enter`}
			/>
			<button
				className={`bg-${buttonTypeToColorName[buttonType]} border-${buttonTypeToColorName[buttonType]} border z-1 relative py-2 px-4 group-hover/button:animate-color-bounce-enter`}
				{...props}
			>
				{children}
			</button>
		</div>
	);
};
