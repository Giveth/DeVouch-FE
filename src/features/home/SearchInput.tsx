import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { type FC, useEffect, useState } from 'react';

interface SearchInputProps {
	setTerm: (term: string) => void;
}

export const SearchInput: FC<SearchInputProps> = ({ setTerm }) => {
	const [value, setValue] = useState<string>();
	const searchParams = useSearchParams();

	useEffect(() => {
		const term = searchParams.get('term');
		setValue(term || '');
	}, [searchParams]);

	return (
		<>
			<input
				placeholder='Search for projects'
				className={`w-full lg:w-fit max-h-fit relative inline-block py-2 px-2 border border-gray-300 hover:border-black ${value ? 'flex-1 !border-black pr-16' : ''} outline-none focus:border-black focus:flex-1 focus:pr-16 transition-all`}
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
					<div className='absolute -top-12 right-4 lg:top-3 lg:-left-20 cursor-pointer flex z-auto gap-3'>
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
					<div className='absolute -top-12 right-4  lg:-top-2 lg:-left-12 cursor-pointer flex z-auto'>
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
