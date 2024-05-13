import type { Config } from 'tailwindcss';

const config: Config = {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/features/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic':
					'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
			},
			colors: {
				'c-blue': { 100: '#1B9CFC', 200: '#3742FA' },
			},
			animation: {
				'move-bounce-enter': 'move-bounce-enter 0.3s forwards',
				'move-bounce-leave': 'move-bounce-leave 0.2s forwards',
				'color-bounce-enter': 'color-bounce-enter 0.3s forwards',
			},
			keyframes: {
				'move-bounce-enter': {
					'0%': {
						transform: 'translate(0, 0)',
					},
					'40%': {
						transform: 'translate(-10px, 10px)',
					},
					'70%': {
						transform: 'translate(-6px, 6px)',
					},
					'100%': {
						transform: 'translate(-8px, 8px)',
					},
				},
				'move-bounce-leave': {
					'0%': {
						transform: 'translate(-8px, 8px)',
					},
					'70%': {
						transform: 'translate(2px, -2px)',
					},
					'100%': {
						transform: 'translate(0px, 0px)',
					},
				},
				'color-bounce-enter': {
					'0%': {
						backgroundColor: 'var(--bounce-color-start, #3742FA)',
						border: `1px solid var(--bounce-border-start, #3742FA)`,
					},
					'40%': {
						backgroundColor: 'var(--bounce-color-middle, #FFFFFF)',
						border: '1px solid var(--bounce-border-middle, #000000)',
						color: 'var(--bounce-text-color, #3742FA)',
					},
					'70%': {
						backgroundColor: 'var(--bounce-color-end, #EEEEEE)',
						border: `1px solid var(--bounce-border-end, #3742FA)`,
						color: 'var(--bounce-text-color, #3742FA)',
					},
					'100%': {
						backgroundColor: 'var(--bounce-color-middle, #FFFFFF)',
						border: '1px solid var(--bounce-border-middle, #000000)',
						color: 'var(--bounce-text-color, #3742FA)',
					},
				},
			},
		},
	},
	plugins: [],
};
export default config;
