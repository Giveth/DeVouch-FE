'use client';
import {
	useState,
	useRef,
	useEffect,
	type CSSProperties,
	type ReactNode,
	Fragment,
	type HTMLAttributes,
} from 'react';
import { createPortal } from 'react-dom';

export interface DropdownProps {
	label: ReactNode;
	stickToRight?: boolean;
	sameWidth?: boolean;
	options: ReactNode[];
	className?: HTMLAttributes<HTMLDivElement>['className'];
}

const Dropdown: React.FC<DropdownProps> = ({
	label,
	options,
	stickToRight,
	sameWidth,
	className = '',
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const toggleDropdown = () => setIsOpen(!isOpen);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	const dropdownStyle: CSSProperties =
		isOpen && containerRef.current
			? {
					top:
						containerRef.current.getBoundingClientRect().bottom +
						window.scrollY +
						'px',
					right:
						stickToRight || sameWidth
							? document.documentElement.clientWidth -
								containerRef.current.getBoundingClientRect()
									.right +
								window.scrollX +
								'px'
							: 'unset',
					left: stickToRight
						? 'unset'
						: containerRef.current.getBoundingClientRect().left +
							window.scrollX +
							'px',
				}
			: {};

	return (
		<div
			className={`relative select-none cursor-pointer ${className}`}
			ref={containerRef}
			onClick={toggleDropdown}
		>
			<div className='flex justify-between w-full border py-2 px-6 border-black bg-white mb-2'>
				<div>{label}</div>
			</div>
			{isOpen &&
				createPortal(
					<div
						style={dropdownStyle}
						ref={dropdownRef}
						className='absolute border py-2 px-2 border-black bg-white'
					>
						{options.map((option, idx) => (
							<Fragment key={idx}>{option}</Fragment>
						))}
					</div>,
					document.body,
				)}
		</div>
	);
};

export default Dropdown;
