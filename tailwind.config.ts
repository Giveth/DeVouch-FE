import type { Config } from 'tailwindcss';

const config: Config = {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/features/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		container: {
			center: true,
			padding: '2rem',
		},
		extend: {
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic':
					'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
			},
			colors: {
				'c-blue': { 100: '#1B9CFC', 200: '#3742FA' },
				'c-red': { 100: '#FF416C', 200: '#FF4B2B' },
			},
			animation: {
				'move-bounce-enter': 'move-bounce-enter 0.3s forwards',
				'move-bounce-leave': 'move-bounce-leave 0.2s forwards',
				'color-bounce-enter': 'color-bounce-enter 0.3s forwards',
			},
			keyframes: {
				'move-bounce-enter': {
					'0%': { transform: 'translate(0, 0)' },
					'40%': { transform: 'translate(-10px, 10px)' },
					'70%': { transform: 'translate(-6px, 6px)' },
					'100%': { transform: 'translate(-8px, 8px)' },
				},
				'move-bounce-leave': {
					'0%': { transform: 'translate(-8px, 8px)' },
					'70%': { transform: 'translate(2px, -2px)' },
					'100%': { transform: 'translate(0px, 0px)' },
				},
				'color-bounce-enter': {
					'0%': {
						backgroundColor: 'var(--bounce-bg-start)',
						borderColor: 'var(--bounce-border-start)',
						color: 'var(--bounce-color-start)',
					},
					'40%': {
						backgroundColor: 'var(--bounce-bg-middle)',
						borderColor: 'var(--bounce-border-middle)',
						color: 'white', // Immediate change to white
					},
					'70%': {
						backgroundColor: 'var(--bounce-bg-middle)',
						borderColor: 'var(--bounce-border-middle)',
						color: 'white',
					},
					'100%': {
						backgroundColor: 'var(--bounce-bg-end)',
						borderColor: 'var(--bounce-border-end)',
						color: 'white', // Ensure it stays white
					},
				},
			},
		},
	},
	safelist: [
		'bg-c-blue-200',
		'border-c-blue-200',
		'bg-c-red-200',
		'border-c-red-200',
		'text-c-blue-200',
		'text-c-red-200',
	],
	plugins: [],
};

export default config;
