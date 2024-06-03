export const FETCH_PROJECT_BY_SLUG = `
query fetchProjectBySlug($slug: String!, $limit: Int, $offset: Int, $orgs: [String!]) {
  projects(where: {slug_eq: $slug}) {
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
      orderBy: attestTimestamp_ASC
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
query fetchUserAttestations($address: String, $orgs: [String!], $limit: Int, $offset: Int) {
  projectAttestations(
    where: {attestorOrganisation: {attestor: {id_eq: $address}, organisation: {id_in: $orgs}}},
    orderBy: attestTimestamp_ASC,
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
}
`;
