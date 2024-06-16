import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';

interface TooltipProps {
	children: React.ReactNode;
	content: React.ReactNode;
	direction?: 'top' | 'bottom' | 'left' | 'right';
	maxWidth?: string;
}

const Tooltip: React.FC<TooltipProps> = ({
	children,
	content,
	direction = 'top',
	maxWidth = '200px',
}) => {
	const [visible, setVisible] = useState(false);
	const [position, setPosition] = useState({ top: 0, left: 0 });
	const [adjustedDirection, setAdjustedDirection] = useState(direction);
	const [initialRender, setInitialRender] = useState(true);
	const ref = useRef<HTMLDivElement | null>(null);
	const tooltipRef = useRef<HTMLDivElement | null>(null);

	const adjustPosition = useCallback(() => {
		if (ref.current && tooltipRef.current) {
			const rect = ref.current.getBoundingClientRect();
			const tooltipRect = tooltipRef.current.getBoundingClientRect();
			let top, left;

			switch (direction) {
				case 'top':
					top = rect.top - tooltipRect.height - 10;
					left = rect.left + rect.width / 2 - tooltipRect.width / 2;
					break;
				case 'bottom':
					top = rect.bottom + 10;
					left = rect.left + rect.width / 2 - tooltipRect.width / 2;
					break;
				case 'left':
					top = rect.top + rect.height / 2 - tooltipRect.height / 2;
					left = rect.left - tooltipRect.width - 10;
					break;
				case 'right':
					top = rect.top + rect.height / 2 - tooltipRect.height / 2;
					left = rect.right + 10;
					break;
				default:
					top = rect.top - tooltipRect.height - 10;
					left = rect.left + rect.width / 2 - tooltipRect.width / 2;
			}

			// Adjust if tooltip goes out of window bounds
			if (top < 0) {
				top = rect.bottom + 10;
				setAdjustedDirection('bottom');
			} else if (left < 0) {
				left = rect.right + 10;
				setAdjustedDirection('right');
			} else if (left + tooltipRect.width > window.innerWidth) {
				left = rect.left - tooltipRect.width - 10;
				setAdjustedDirection('left');
			} else if (top + tooltipRect.height > window.innerHeight) {
				top = rect.top - tooltipRect.height - 10;
				setAdjustedDirection('top');
			} else {
				setAdjustedDirection(direction);
			}

			setPosition({ top, left });
			setInitialRender(false); // Position calculated, set initialRender to false
		}
	}, [direction]);

	useEffect(() => {
		if (visible) adjustPosition();
		const handleScroll = () => setVisible(false);
		window.addEventListener('resize', adjustPosition);
		window.addEventListener('scroll', handleScroll, true);
		return () => {
			window.removeEventListener('resize', adjustPosition);
			window.removeEventListener('scroll', handleScroll, true);
		};
	}, [visible, adjustPosition]);

	return (
		<div
			className='relative inline-block'
			onMouseEnter={() => {
				setInitialRender(true); // Reset initialRender when showing the tooltip
				setVisible(true);
			}}
			onMouseLeave={() => setVisible(false)}
			onFocus={() => {
				setInitialRender(true); // Reset initialRender when showing the tooltip
				setVisible(true);
			}}
			onBlur={() => setVisible(false)}
			ref={ref}
		>
			{children}
			{visible &&
				ReactDOM.createPortal(
					<div
						ref={tooltipRef}
						className={`fixed z-50 py-2 px-3 text-xs text-black bg-white rounded transition-opacity duration-300 ${
							initialRender ? 'opacity-0' : 'opacity-100'
						}`}
						style={{
							top: position.top,
							left: position.left,
							maxWidth,
							width: 'auto',
						}}
					>
						{content}
						<div
							className={`absolute w-0 h-0 border-solid border-transparent ${triangleClasses[adjustedDirection]}`}
						/>
					</div>,
					document.body,
				)}
		</div>
	);
};

const triangleClasses = {
	top: 'border-t-black border-b-0 border-r-transparent border-l-transparent border-t-8 border-l-4 border-r-4 -bottom-2 left-1/2 transform -translate-x-1/2',
	bottom: 'border-b-black border-t-0 border-r-transparent border-l-transparent border-b-8 border-l-4 border-r-4 -top-2 left-1/2 transform -translate-x-1/2',
	left: 'border-l-black border-r-0 border-t-transparent border-b-transparent border-l-8 border-t-4 border-b-4 -right-2 top-1/2 transform -translate-y-1/2',
	right: 'border-r-black border-l-0 border-t-transparent border-b-transparent border-r-8 border-t-4 border-b-4 -left-2 top-1/2 transform -translate-y-1/2',
};

export default Tooltip;
