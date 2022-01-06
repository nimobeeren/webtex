export const schema = gql`
  type Doc {
    slug: String!
    content: String!
    frontmatter: JSON!
  }

  type Query {
    docBySlug(slug: String!): Doc @skipAuth
    docSlugs: [String!]! @skipAuth @deprecated
    docs: [Doc!]! @skipAuth
  }
`
