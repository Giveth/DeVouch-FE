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
		<div className='relative w-full lg:w-fit'>
			<input
				placeholder='Search for projects'
				className={`w-full max-h-fit py-2 px-2 pr-16 border border-gray-300 hover:border-black outline-none focus:border-black transition-all`}
				value={value}
				onChange={e => setValue(e.target.value)}
				onKeyDown={e => {
					if (e.key === 'Enter') {
						value && setTerm(value);
					}
				}}
			/>
			<div className='absolute inset-y-0 right-3 flex items-center gap-2'>
				{value ? (
					<>
						<Image
							src='/images/icons/right-arrow.svg'
							width={20}
							height={20}
							alt='search'
							className='cursor-pointer'
							onClick={() => value && setTerm(value)}
						/>
						<Image
							src='/images/icons/x.svg'
							width={20}
							height={20}
							alt='clear'
							className='cursor-pointer'
							onClick={() => {
								setValue('');
								setTerm('');
							}}
						/>
					</>
				) : (
					<Image
						src='/images/icons/search.svg'
						width={20}
						height={20}
						alt='search'
					/>
				)}
			</div>
		</div>
	);
};
