export const FETCH_PROJECT_BY_ID = `
query fetchProjectById($id: String!) {
  projects(where: {id_eq: $id}) {
    id
    url
    image
    lastUpdatedTimestamp
    projectId
    description
    totalVouches
    totalFlags
    totalAttests
    title
    source
  }
}
`;

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

export const FETCH_PROJECT_ATTESTATIONS = `
query fetchProjectAttestations($projectId: String, $address: String, $attestorAddressFilter: String,$vouch: Boolean, $organisation: [String!], $limit: Int, $offset: Int, $orderBy: [ProjectAttestationOrderByInput!] = [attestTimestamp_DESC]) {
  projectAttestations(where: {project: {id_eq: $projectId}, attestorOrganisation: {attestor: {id_eq: $attestorAddressFilter}, organisation: {id_in: $organisation}}, vouch_eq: $vouch}, orderBy: $orderBy, limit: $limit, offset: $offset) {
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
      attestor {
        id
      }
    }
  }
  userAttestations: projectAttestationsConnection(where: {project: {id_eq: $projectId}, attestorOrganisation: {attestor: {id_eq: $address}, organisation: {id_in: $organisation}}, vouch_eq: $vouch}, orderBy: $orderBy, first: 0) {
    totalCount
  }
  vouches: projectAttestationsConnection(first: 0, orderBy: id_ASC, where: {project: {id_eq: $projectId}, attestorOrganisation: {organisation: {id_in: $organisation}}, AND: {vouch_eq: true}}) {
    totalCount
  }
  flags: projectAttestationsConnection(first: 0, orderBy: id_ASC, where: {project: {id_eq: $projectId}, attestorOrganisation: {organisation: {id_in: $organisation}}, AND: {vouch_eq: false}}) {
    totalCount
  }
  attests: projectAttestationsConnection(first: 0, orderBy: id_ASC, where: {project: {id_eq: $projectId}, attestorOrganisation: {organisation: {id_in: $organisation}}}) {
    totalCount
  }
}
`;
