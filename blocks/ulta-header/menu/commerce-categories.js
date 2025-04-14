export const GET_CATEGORIES = `
  query {
    categories {
      items {
        uid
        level
        name
        path
        url_path
        url_key
        children {
          uid
          level
          name
          path
          url_path
          url_key
          children {
            uid
            level
            name
            path
            url_path
            url_key
            children {
              uid
              level
              name
              path
              url_path
              url_key
              children {
                uid
                level
                name
                path
                url_path
                url_key
              }
            }
          }
        }
      }
    }
  }
`;

export default GET_CATEGORIES;
