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
      revoked
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
query fetchUserAttestations($address: String, $orgs: [String!], $limit: Int, $offset: Int, $orderBy: [ProjectAttestationOrderByInput!]!) {
  projectAttestations(
    where: {attestorOrganisation: {attestor: {id_containsInsensitive: $address}, organisation: {id_in: $orgs}}},
    orderBy: $orderBy,
    limit: $limit,
    offset: $offset
  ) {
    id
    vouch
    txHash
    revoked
    recipient
    comment
    attestTimestamp
    attestorOrganisation {
      organisation {
        id
        name
        attestors {
          id
        }
      }
      attestor {
        id
      }
    }
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
  }
  projectAttestationsConnection(first:5, orderBy: project_totalAttests_DESC, where: {attestorOrganisation: {attestor: {id_containsInsensitive: $address}}}) {
    totalCount
  }
}
`;
