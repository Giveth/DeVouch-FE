export const FETCH_PROJECTS = `
  query fetchProjects($limit: Int, $offset: Int) {
    projects(limit: $limit, offset: $offset, orderBy: id_ASC) {
      id
      title
      description
      image
      source
      totalVouches
      totalFlags
    }
  }
`;
