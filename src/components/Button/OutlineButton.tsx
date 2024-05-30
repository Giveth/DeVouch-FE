import { type ButtonHTMLAttributes, type FC } from 'react';
import { Spinner } from '../Loading/Spinner';

export enum OutlineButtonType {
	BLUE,
	RED,
}

interface OutlineButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	children: React.ReactNode;
	buttonType?: OutlineButtonType;
	loading?: boolean;
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
		'--bounce-color-middle': '#3742FA',
		'--bounce-bg-middle': '#3742FA',
		'--bounce-border-middle': '#3742FA',
		'--bounce-color-end': '#3742FA',
		'--bounce-bg-end': '#3742FA',
		'--bounce-border-end': '#3742FA',
		'--bounce-text-end': '#FFFFFF',
	},
	[OutlineButtonType.RED]: {
		'--bounce-color-start': '#FF4B2B',
		'--bounce-bg-start': '#FF4B2B',
		'--bounce-border-start': '#FF4B2B',
		'--bounce-color-middle': '#FF4B2B',
		'--bounce-bg-middle': '#FF4B2B',
		'--bounce-border-middle': '#FF4B2B',
		'--bounce-color-end': '#FF4B2B',
		'--bounce-bg-end': '#FF4B2B',
		'--bounce-border-end': '#FF4B2B',
		'--bounce-text-end': '#FFFFFF',
	},
};

export const OutlineButton: FC<OutlineButtonProps> = ({
	children,
	buttonType = OutlineButtonType.BLUE,
	className,
	loading = false,
	disabled = false,
	...props
}) => {
	const isInteractive = !loading && !disabled;

	return (
		<div
			className={`group/OutlineButton inline-block relative ${className}`}
			style={buttonTypeToStyle[buttonType] as any}
		>
			<div
				id='shadow'
				className={`absolute w-full h-full bg-black z-0 bottom-0 ${isInteractive ? 'animate-move-bounce-leave transform group-hover/OutlineButton:animate-move-bounce-enter' : ''}`}
			/>
			<button
				className={`font-bold w-full h-full bg-white border-${buttonTypeToColorName[buttonType]} text-${buttonTypeToColorName[buttonType]} border z-10 relative py-4 px-6 ${isInteractive ? 'group-hover/OutlineButton:animate-color-bounce-enter' : ''}`}
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
