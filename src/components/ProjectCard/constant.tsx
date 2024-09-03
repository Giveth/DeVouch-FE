import { ZERO_BYTES32 } from '@ethereum-attestation-service/eas-sdk';

export const PROJECT_DESC_LIMIT = 300;

export const NO_AFFILIATED_ORG = {
	id: ZERO_BYTES32,
	organisation: {
		id: ZERO_BYTES32,
		name: 'No Affiliation',
	},
};
