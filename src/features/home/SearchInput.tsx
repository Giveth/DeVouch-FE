import Image from 'next/image';
import { type FC, useState } from 'react';

interface SearchInputProps {
	setTerm: (term: string) => void;
}

export const SearchInput: FC<SearchInputProps> = ({ setTerm }) => {
	const [value, setValue] = useState<string>();
	return (
		<>
			<input
				placeholder='Search for projects'
				className={`relative inline-block py-2 px-2 border border-gray-300 hover:border-black ${value ? 'flex-1 !border-black pr-16' : ''}  mb-2 outline-none focus:border-black focus:flex-1 focus:pr-16 transition-all`}
				value={value}
				onChange={e => setValue(e.target.value)}
				onKeyDown={e => {
					if (e.key === 'Enter') {
						value && setTerm(value);
					}
				}}
			/>
			<div className='relative'>
				{value ? (
					<div className='absolute -top-14 right-4 md:top-3 md:-left-20 cursor-pointer flex z-auto gap-3'>
						<Image
							src='/images/icons/right-arrow.svg'
							width={20}
							height={20}
							alt='search'
							className=''
							onClick={() => {
								value && setTerm(value);
							}}
						/>
						<Image
							src='/images/icons/x.svg'
							width={20}
							height={20}
							alt='clear'
							className=''
							onClick={() => {
								setValue('');
								setTerm(''); // Clear the term as well
							}}
						/>
					</div>
				) : (
					<div className='absolute -top-14 right-4  md:top-3 md:-left-12 cursor-pointer flex z-auto'>
						<Image
							src='/images/icons/search.svg'
							width={20}
							height={20}
							alt='search'
						/>
					</div>
				)}
			</div>
		</>
	);
};
