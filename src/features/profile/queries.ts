export const FETCH_USER_ATTESTATIONS = `
query fetchUserAttestations($address: String, $vouch: Boolean, $organisation: [String!], $limit: Int, $offset: Int, $orderBy: [ProjectAttestationOrderByInput!] = null, $source_in: [String!], $rf_rounds: [Int!]) {
  projectAttestations(
    where: {
      attestorOrganisation: {attestor: {id_eq: $address}, organisation: {id_in: $organisation}},
      vouch_eq: $vouch,
      project: {
        OR: [
          {source_in: $source_in},
          {rfRounds_containsAny: $rf_rounds}
        ]
      }
    },
    orderBy: $orderBy,
    limit: $limit,
    offset: $offset
  ) {
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
      rfRounds
    }
  }
}
`;

export const FETCH_USER_ATTESTATIONS_TOTAL_COUNT = `
query fetchUserAttestations($address: String, $organisation: [String!], $source_in: [String!], $rf_rounds: [Int!]) {
  vouches: projectAttestationsConnection(
    first: 0,
    orderBy: id_ASC,
    where: {
      attestorOrganisation: {attestor: {id_eq: $address}, organisation: {id_in: $organisation}},
      vouch_eq: true,
      project: {
        OR: [
          {source_in: $source_in},
          {rfRounds_containsAny: $rf_rounds}
        ]
      }
    }
  ) {
    totalCount
  }
  flags: projectAttestationsConnection(
    first: 5,
    orderBy: id_ASC,
    where: {
      attestorOrganisation: {attestor: {id_eq: $address}, organisation: {id_in: $organisation}},
      vouch_eq: false,
      project: {
        OR: [
          {source_in: $source_in},
          {rfRounds_containsAny: $rf_rounds}
        ]
      }
    }
  ) {
    totalCount
  }
  attests: projectAttestationsConnection(
    first: 5,
    orderBy: id_ASC,
    where: {
      attestorOrganisation: {attestor: {id_eq: $address}, organisation: {id_in: $organisation}},
      project: {
        OR: [
          {source_in: $source_in},
          {rfRounds_containsAny: $rf_rounds}
        ]
      }
    }
  ) {
    totalCount
  }
}
`;
