export const FETCH_USER_ORGANISATIONS = `
	query MyQuery($id_eq: String) {
		organisations(where: {attestors_some: {attestor: {id_eq: $id_eq}}}) {
		id
		name
		}
  	}
  `;
