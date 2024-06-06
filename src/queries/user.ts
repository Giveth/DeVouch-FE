export const FETCH_USER_ORGANISATIONS = `
	query attestorOrganisations($address: String) {
		attestorOrganisations(where: {attestor: {id_eq: $address}}, orderBy: attestTimestamp_ASC) {
			id
			organisation {
				name
				id
			}
		}
  	}
  `;
