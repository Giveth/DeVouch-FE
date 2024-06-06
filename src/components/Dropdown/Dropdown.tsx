'use client';
import Image from 'next/image';
import {
	useState,
	useRef,
	useEffect,
	type CSSProperties,
	type ReactNode,
	Fragment,
	type HTMLAttributes,
	type FC,
} from 'react';
import { createPortal } from 'react-dom';

export interface DropdownProps {
	label: ReactNode;
	stickToRight?: boolean;
	sameWidth?: boolean;
	options: ReactNode[];
	className?: HTMLAttributes<HTMLDivElement>['className'];
	showChevron?: boolean;
}

const Dropdown: FC<DropdownProps> = ({
	label,
	options,
	stickToRight,
	sameWidth,
	className = '',
	showChevron,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const toggleDropdown = () => setIsOpen(!isOpen);

	const handleClickOutside = (event: MouseEvent) => {
		if (
			dropdownRef.current &&
			!dropdownRef.current.contains(event.target as Node) &&
			containerRef.current &&
			!containerRef.current.contains(event.target as Node)
		) {
			setIsOpen(false);
		}
	};

	useEffect(() => {
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
			<div
				className={`flex justify-between w-full border py-2 px-6 border-gray-300 bg-white mb-2 hover:border-black ${isOpen ? '!border-black' : ''} `}
			>
				<div className='w-full'>{label}</div>
				{showChevron && (
					<Image
						src='/images/icons/chevron-down.svg'
						width={20}
						height={20}
						alt='chevron-down'
					/>
				)}
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
