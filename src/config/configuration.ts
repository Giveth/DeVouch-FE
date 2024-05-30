import development from './development';
import production from './production';

export const isProduction = process.env.NEXT_PUBLIC_ENV === 'production';
export const easContractAddress = process.env.NEXT_PUBLIC_EAS_CONTRACT_ADDRESS;
export const projectVerifySchema =
	process.env.NEXT_PUBLIC_PROJECT_VERIFY_SCHEMA;
const envConfig = isProduction ? production : development;

const config = {
	...envConfig,
};

export default config;
