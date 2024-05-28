export const FETCH_PROJECTS = `
query fetchProjects($offset: Int!, $limit: Int, $orderBy: [ProjectOrderByInput!] = totalVouches_DESC) {
  projects(offset: $offset, limit: $limit, orderBy: $orderBy) {
    id
    title
    slug
    description
    image
    source
    totalVouches
    totalFlags
    attestedOrganisations {
      vouch
      organisation {
        name
      }
    }
  }
}
`;
