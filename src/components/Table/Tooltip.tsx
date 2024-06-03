import React, { ReactElement, useState } from 'react';

const Tooltip = ({
	message,
	children,
	direction = 'left',
}: {
	message: string;
	children: ReactElement;
	direction?: 'top' | 'right' | 'bottom' | 'left';
}) => {
	const [isHovered, setIsHovered] = useState(false);

	let tooltipPosition = '';
	let arrowPosition = '';

	switch (direction) {
		case 'top':
			tooltipPosition =
				'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
			arrowPosition = 'left-1/2 transform -translate-x-1/2 bottom-[-1/2]';
			break;
		case 'right':
			tooltipPosition =
				'left-full top-1/4 transform -translate-y-1/4 ml-4';
			arrowPosition = 'top-1/4 transform -translate-y-1/4 left-[2]';
			break;
		case 'bottom':
			tooltipPosition =
				'top-full left-1/2 transform -translate-x-1/2 mt-2';
			arrowPosition = 'left-1/2 transform -translate-x-1/2 top-0';
			break;
		case 'left':
			tooltipPosition =
				'right-full top-1/4 transform -translate-y-1/4 mr-0';
			arrowPosition = 'top-1/4 transform -translate-y-1/4 right-[-1/4]';
			break;
		default:
			break;
	}

	return (
		<div
			className='relative'
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			{children}
			{isHovered && (
				<>
					<div
						className={`absolute ${tooltipPosition} w-64 p-2 bg-white text-black border border-black shadow-xs transition-opacity duration-300`}
					>
						<p className='whitespace-normal break-words'>
							{message}
						</p>
					</div>
					<div
						className={`absolute ${arrowPosition} h-0 w-0 border-8 border-transparent ${
							direction === 'top' ? 'border-t-transparent' : ''
						} ${direction === 'right' ? 'border-r-transparent' : ''} ${
							direction === 'bottom' ? 'border-b-transparent' : ''
						} ${direction === 'left' ? 'border-l-black' : ''}`}
					/>
				</>
			)}
		</div>
	);
};

export default Tooltip;
