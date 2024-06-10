export const FETCH_USER_ATTESTATIONS = `
query fetchUserAttestations($address: String, $vouch: Boolean, $organisation: [String!], $limit: Int, $offset: Int, $orderBy: [ProjectAttestationOrderByInput!] = null) {
  projectAttestations(where: {attestorOrganisation: {attestor: {id_eq: $address}, organisation: {id_in: $organisation}}, vouch_eq: $vouch}, orderBy: $orderBy, limit: $limit, offset: $offset) {
    id
    vouch
    txHash
    comment
    attestTimestamp
    attestorOrganisation {
      id
      organisation {
        id
        name
      }
    }
    project {
      projectId
      title
      source
    }
  }
}
`;

export const FETCH_USER_ATTESTATIONS_TOTAL_COUNT = `
query fetchUserAttestations($address: String, $organisation: [String!]) {
  vouches: projectAttestationsConnection(first: 0, orderBy: id_ASC, where: {attestorOrganisation: {attestor: {id_eq: $address}, organisation: {id_in: $organisation}}, AND: {vouch_eq: true}}) {
    totalCount
  }
  flags: projectAttestationsConnection(first: 5, orderBy: id_ASC, where: {attestorOrganisation: {attestor: {id_eq: $address}, organisation: {id_in: $organisation}}, AND: {vouch_eq: false}}) {
    totalCount
  }
  attests: projectAttestationsConnection(first: 5, orderBy: id_ASC, where: {attestorOrganisation: {attestor: {id_eq: $address}, organisation: {id_in: $organisation}}}) {
    totalCount
  }
}
`;
