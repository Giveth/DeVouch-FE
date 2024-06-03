import { type FC, useState } from 'react';

interface SearchInputProps {
	setTerm: (term: string) => void;
}

export const SearchInput: FC<SearchInputProps> = ({ setTerm }) => {
	const [value, setValue] = useState<string>();
	return (
		<input
			placeholder='Search for projects'
			className={`relative inline-block py-2 px-2 border border-gray-300 hover:border-black ${value ? 'flex-1 !border-black' : ''}  mb-2 outline-none focus:border-black focus:flex-1 transition-all`}
			value={value}
			onChange={e => setValue(e.target.value)}
			onKeyDown={e => {
				if (e.key === 'Enter') {
					value && setTerm(value);
				}
			}}
		></input>
	);
};
