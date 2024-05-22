import { type HTMLAttributes, type FC } from 'react';

export enum OutlineButtonType {
	BLUE,
	RED,
}

interface OutlineButtonProps extends HTMLAttributes<HTMLButtonElement> {
	children: React.ReactNode;
	buttonType?: OutlineButtonType;
}

const buttonTypeToColorName = {
	[OutlineButtonType.BLUE]: 'c-blue-200',
	[OutlineButtonType.RED]: 'c-red-200',
};

const buttonTypeToStyle = {
	[OutlineButtonType.BLUE]: {
		'--bounce-color-start': '#3742FA',
		'--bounce-bg-start': '#3742FA',
		'--bounce-border-start': '#3742FA',
		'--bounce-color-middle': '#1B9CFC',
		'--bounce-bg-middle': '#EEEEEE',
		'--bounce-border-middle': '#3742FA',
		'--bounce-color-end': '#FFFFFF',
		'--bounce-bg-end': '#3742FA',
		'--bounce-border-end': '#000000',
	},
	[OutlineButtonType.RED]: {
		'--bounce-color-start': '#FF4B2B',
		'--bounce-bg-start': '#FF4B2B',
		'--bounce-border-start': '#FF4B2B',
		'--bounce-color-middle': '#f66b52',
		'--bounce-bg-middle': '#EEEEEE',
		'--bounce-border-middle': '#FF4B2B',
		'--bounce-color-end': '#FFFFFF',
		'--bounce-bg-end': '#FF4B2B',
		'--bounce-border-end': '#000000',
	},
};

export const OutlineButton: FC<OutlineButtonProps> = ({
	children,
	buttonType = OutlineButtonType.BLUE,
	className,
	...props
}) => {
	return (
		<div
			className={`group/OutlineButton relative ${className}`}
			style={buttonTypeToStyle[buttonType] as any}
		>
			<div
				id='shadow'
				className='absolute w-full h-full  bg-black z-0  bottom-0 animate-move-bounce-leave transform group-hover/OutlineButton:animate-move-bounce-enter'
			/>
			<button
				className={` w-full bg-white border-${buttonTypeToColorName[buttonType]} text-${buttonTypeToColorName[buttonType]} border z-1 relative py-4 px-6 group-hover/OutlineButton:animate-color-bounce-enter z-20`}
				{...props}
			>
				{children}
			</button>
		</div>
	);
};
