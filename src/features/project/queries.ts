export const FETCH_PROJECT_BY_SLUG = `
query fetchProjectBySlug($slug: String!, $limit: Int, $offset: Int) {
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
    attests(limit: $limit, offset: $offset, orderBy: attestTimestamp_ASC) {
      vouch
      txHash
      revoked
      recipient
      id
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
