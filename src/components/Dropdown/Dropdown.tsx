import React, {
	useState,
	useRef,
	useEffect,
	type CSSProperties,
	type ReactNode,
	Fragment,
	type HTMLAttributes,
	type FC,
	useCallback,
} from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';

export interface DropdownProps {
	label: ReactNode;
	stickToRight?: boolean;
	sameWidth?: boolean;
	options: ReactNode[];
	className?: HTMLAttributes<HTMLDivElement>['className'];
	showChevron?: boolean;
	onClose?: () => void;
}

const Dropdown: FC<DropdownProps> = ({
	label,
	options,
	stickToRight,
	sameWidth,
	className = '',
	showChevron = true,
	onClose,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const handleClickOutside = useCallback(
		(event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node) &&
				containerRef.current &&
				!containerRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
				if (onClose) {
					onClose();
				}
			}
		},
		[onClose],
	);

	useEffect(() => {
		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		} else {
			document.removeEventListener('mousedown', handleClickOutside);
		}
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isOpen, handleClickOutside]);

	const toggleDropdown = () => {
		setIsOpen(prevOpen => {
			const newOpen = !prevOpen;
			if (!newOpen && onClose) {
				onClose();
			}
			return newOpen;
		});
	};

	const dropdownStyle: CSSProperties =
		isOpen && containerRef.current
			? {
					top:
						containerRef.current.getBoundingClientRect().bottom +
						window.scrollY +
						4 +
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
		<div className={`relative select-none ${className}`} ref={containerRef}>
			<div
				className={`flex justify-between w-full border py-2 px-6 border-gray-300 bg-white hover:border-black ${
					isOpen ? '!border-black' : ''
				} cursor-pointer`}
				onClick={toggleDropdown}
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
						className='absolute border py-2 px-2 border-black bg-white z-50'
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
