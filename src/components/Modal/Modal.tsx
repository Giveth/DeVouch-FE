import { type FC, type ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export interface IModal {
	showModal: boolean;
	setShowModal: (showModal: boolean) => void;
}

interface ModalProps extends IModal {
	children: ReactNode;
}

const Modal: FC<ModalProps> = ({ showModal, setShowModal, children }) => {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
		return () => setMounted(false);
	}, []);

	if (!mounted || !showModal) return null;

	return createPortal(
		<div className='fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50'>
			<div className='relative bg-white w-full h-full md:h-auto mx-auto rounded md:shadow-lg p-4 md:max-w-2xl lg:max-w-3xl'>
				<button
					onClick={() => setShowModal(false)}
					className='absolute top-2 right-2 text-gray-500 hover:text-gray-700'
				>
					&times;
				</button>
				{children}
			</div>
		</div>,
		document.body,
	);
};

export default Modal;
