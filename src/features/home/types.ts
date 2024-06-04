import { Address } from 'viem';

interface IProject {
	id: string;
	projectId: string;
	title: string;
	slug: string;
	description: string;
	image: string;
	source: string;
	totalAttests: number;
	attestedOrganisations?: IAttestedOrganisation[];
	attests?: ProjectAttestation[];
}

interface IAttestedOrganisation {
	id: string;
	vouch: boolean;
	organisation: IOrganisation;
}

interface IAttestorOrganisation {
	id?: string;
	attestor: IAttestor;
	organisation: IOrganisation;
	attestTimestamp: Date;
	revoked?: boolean;
}

interface IOrganisation {
	id: string;
	name: string;
	color: string;
	attestors?: IAttestor[];
}

interface IAttestor {
	id: Address;
	organisations?: IAttestorOrganisation[];
}

export interface ProjectAttestation {
	id: string;
	recipient?: string;
	vouch: boolean;
	txHash?: string;
	revoked?: boolean;
	attestorOrganisation: IAttestorOrganisation;
	project: IProject;
	attestTimestamp: Date;
	comment: string;
}
