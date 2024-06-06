export const FETCH_PROJECT_BY_ID = `
query fetchProjectById($id: String!, $limit: Int, $offset: Int, $orgs: [String!]) {
  projects(where: {id_eq: $id}) {
    id
    slug
    image
    lastUpdatedTimestamp
    projectId
    description
    totalVouches
    totalFlags
    totalAttests
    title
    source
    attests(
      where: {attestorOrganisation: {organisation: {id_in: $orgs}}},
      limit: $limit, 
      offset: $offset, 
      orderBy: attestTimestamp_DESC
    ) {
      vouch
      txHash
      recipient
      id
      comment
      attestTimestamp
      attestorOrganisation {
        attestor {
          id
        }
        organisation {
          id
          name
          attestors {
            id
          }
        }
      }
    }
    attestedOrganisations {
      vouch
      id
      project {
        totalVouches
        totalFlags
        totalAttests
        title
        source
        slug
        projectId
        lastUpdatedTimestamp
        image
        id
        description
      }
      organisation {
        color
        id
        issuer
        name
      }
    }
  }
}
`;

export const FETCH_USER_ATTESTATIONS = `
query fetchUserAttestations($address: String, $vouch: Boolean, $organisation: [String!], $limit: Int, $offset: Int, $orderBy: [ProjectAttestationOrderByInput!] = null) {
  projectAttestations(where: {attestorOrganisation: {attestor: {id_containsInsensitive: $address}, organisation: {id_in: $organisation}}, vouch_eq: $vouch}, orderBy: $orderBy, limit: $limit, offset: $offset) {
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
  vouches: projectAttestationsConnection(first: 0, orderBy: id_ASC, where: {attestorOrganisation: {attestor: {id_containsInsensitive: $address}}, AND: {vouch_eq: true}}) {
    totalCount
  }
  flags: projectAttestationsConnection(first: 5, orderBy: id_ASC, where: {attestorOrganisation: {attestor: {id_containsInsensitive: $address}}, AND: {vouch_eq: false}}) {
    totalCount
  }
  attests: projectAttestationsConnection(first: 5, orderBy: id_ASC, where: {attestorOrganisation: {attestor: {id_containsInsensitive: $address}}}) {
    totalCount
  }
}
`;
