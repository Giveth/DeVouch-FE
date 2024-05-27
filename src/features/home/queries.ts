export const FETCH_PROJECTS = `
query fetchProjects($offset: Int!, $limit: Int, $orderBy: [ProjectOrderByInput!] = totalVouches_DESC) {
  projects(offset: $offset, limit: $limit, orderBy: $orderBy) {
    id
    title
    description
    image
    source
    totalVouches
    totalFlags
    attestedOrganisations {
      id
      vouch
      organisation {
        id
        name
      }
    }
  }
}
`;
