interface IProject {
	id: string;
	title: string;
	description: string;
	image: string;
	source: string;
	totalVouches: number;
	totalFlags: number;
	attestedOrganisations: IAttestedOrganisation[];
}

interface IAttestedOrganisation {
	id: string;
	vouch: boolean;
	organisation: IOrganisation;
}

interface IOrganisation {
	id: string;
	name: string;
}
