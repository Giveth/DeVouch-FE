import development from './development';
import production from './production';

export const isProduction = process.env.NEXT_PUBLIC_ENV === 'production';

const envConfig = isProduction ? production : development;
const config = {
	...envConfig,
	ATTESTATION_FEE: process.env.NEXT_PUBLIC_ATTESTATION_FEE || '0.0001',
	PROJECT_VERIFY_SCHEMA:
		process.env.NEXT_PUBLIC_PROJECT_VERIFY_SCHEMA ||
		'0x87607c7f565dfc1473309a45e7f7d26f0915615258fffd6745fc6238822c108b',
	// '0x97b0c9911936fad57e77857fac6eef6771f8d0bf025be9549214e32bf9e2415a', // previous one
};

export default config;
