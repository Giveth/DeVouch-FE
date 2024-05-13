export enum ButtonType {
	FILLED_BLUE,
	OUTLINE_BLUE,
	FILLED_RED,
	OUTLINE_RED,
}

export const buttonTypeToClassName = {
	[ButtonType.FILLED_BLUE]: 'bg-c-blue-200',
	[ButtonType.OUTLINE_BLUE]: 'bg-c-blue-200',
	[ButtonType.FILLED_RED]: 'bg-c-red-200',
	[ButtonType.OUTLINE_RED]: 'bg-c-red-200',
};

export const buttonTypeToStyle = {
	[ButtonType.FILLED_BLUE]: {
		'--bounce-color-start': '#1B9CFC',
		'--bounce-border-start': '#1B9CFC',
		'--bounce-color-middle': '#FFFFFF',
		'--bounce-border-middle': '#000000',
		'--bounce-text-color': '#1B9CFC',
		'--bounce-color-end': '#F0E68C',
		'--bounce-border-end': '#1B9CFC',
	},
	[ButtonType.OUTLINE_BLUE]: {
		'--bounce-color-start': '#1B9CFC',
		'--bounce-border-start': '#1B9CFC',
		'--bounce-color-middle': '#FFFFFF',
		'--bounce-border-middle': '#000000',
		'--bounce-text-color': '#1B9CFC',
		'--bounce-color-end': '#F0E68C',
		'--bounce-border-end': '#1B9CFC',
	},
	[ButtonType.FILLED_RED]: {
		'--bounce-color-start': '#FF6347',
		'--bounce-border-start': '#FF6347',
		'--bounce-color-middle': '#FFFFFF',
		'--bounce-border-middle': '#000000',
		'--bounce-text-color': '#FF6347',
		'--bounce-color-end': '#F0E68C',
		'--bounce-border-end': '#FF6347',
	},
	[ButtonType.OUTLINE_RED]: {
		'--bounce-color-start': '#FF6347',
		'--bounce-border-start': '#FF6347',
		'--bounce-color-middle': '#FFFFFF',
		'--bounce-border-middle': '#000000',
		'--bounce-text-color': '#FF6347',
		'--bounce-color-end': '#F0E68C',
		'--bounce-border-end': '#FF6347',
	},
};
