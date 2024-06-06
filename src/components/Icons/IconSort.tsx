import { FC } from 'react';

interface IconSortProps {
	active?: boolean;
	desc?: boolean;
}

const blue = '#3742FA';
const grey = '#82899A';

export const IconSort: FC<IconSortProps> = ({ active, desc }) => {
	return (
		<svg
			width='24'
			height='24'
			viewBox='0 0 24 24'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
		>
			<path
				d='M14 6.99V14H16V6.99H19L15 3L11 6.99H14Z'
				fill={desc && active ? blue : grey}
			/>
			<path
				d='M13 17.01H10V10H8V17.01H5L9 21L13 17.01Z'
				fill={active && !desc ? blue : grey}
			/>
		</svg>
	);
};
