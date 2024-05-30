import Image from 'next/image';
import { type FC, type ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export interface IModal {
	showModal: boolean;
	setShowModal: (showModal: boolean) => void;
}

interface ModalProps extends IModal {
	children: ReactNode;
	showCloseButton?: boolean;
	title?: string;
	showHeader?: boolean;
}

const Modal: FC<ModalProps> = ({
	title,
	showCloseButton = true,
	showHeader = true,
	showModal,
	setShowModal,
	children,
}) => {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
		return () => setMounted(false);
	}, []);

	if (!mounted || !showModal) return null;

	return createPortal(
		<div className='fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50'>
			<div className='relative bg-white w-full h-full md:h-auto mx-auto md:shadow-lg p-4 md:max-w-2xl lg:max-w-3xl'>
				{showHeader && (
					<div className='flex justify-between border-b p-2 mb-6'>
						<span className='text-lg font-bold'>{title}</span>
						{showCloseButton && (
							<Image
								src='/images/icons/x.svg'
								alt='Close'
								width={24}
								height={24}
								className='cursor-pointer'
								onClick={() => setShowModal(false)}
							/>
						)}
					</div>
				)}
				{children}
			</div>
		</div>,
		document.body,
	);
};

export default Modal;
