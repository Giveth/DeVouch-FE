import { type HTMLAttributes, type FC } from 'react';
import { ButtonType, buttonTypeToStyle } from './common';

interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
	children: React.ReactNode;
	buttonType?: ButtonType;
}

export const Button: FC<ButtonProps> = ({
	children,
	buttonType = ButtonType.FILLED_BLUE,
	...props
}) => {
	return (
		<div
			className='group/button relative m-4  text-white h-10'
			style={buttonTypeToStyle[buttonType] as any}
		>
			<div
				id='shadow'
				className='absolute w-full h-full bg-c-blue-200 z-0  bottom-0 animate-move-bounce-leave transform group-hover/button:animate-move-bounce-enter'
			/>
			<button
				type='button'
				className='bg-c-blue-200 z-1 relative py-2 px-4 group-hover/button:animate-color-bounce-enter'
				{...props}
			>
				{children}
			</button>
		</div>
	);
};
