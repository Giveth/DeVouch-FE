export const FETCH_USER_ORGANISATIONS = `
	query attestorOrganisations($address: String) {
		attestorOrganisations(where: {attestor: {id_eq: $address}}) {
			id
			organisation {
				name
				id
			}
		}
  	}
  `;
