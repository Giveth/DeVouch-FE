import development from './development';
import production from './production';

export const isProduction = process.env.NEXT_PUBLIC_ENV === 'production';

const envConfig = isProduction ? production : development;
const config = {
	...envConfig,
	PROJECT_VERIFY_SCHEMA:
		process.env.NEXT_PUBLIC_PROJECT_VERIFY_SCHEMA ||
		'0x97b0c9911936fad57e77857fac6eef6771f8d0bf025be9549214e32bf9e2415a',
};

export default config;
