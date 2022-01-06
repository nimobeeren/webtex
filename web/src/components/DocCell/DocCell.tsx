import type { CellFailureProps, CellSuccessProps } from '@redwoodjs/web'
import type { FindDocQuery } from 'types/graphql'

export const beforeQuery = ({ slug, ...restProps }) => {
  return {
    variables: {
      slug: slug ?? 'index',
      ...restProps
    }
  }
}

export const QUERY = gql`
  query FindDocQuery($slug: String!) {
    doc: docBySlug(slug: $slug) {
      slug
      content
      frontmatter
    }
  }
`

// LEFT HERE:
// Next step is to render the doc content with MDX

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div style={{ color: 'red' }}>Error: {error.message}</div>
)

export const Success = ({ doc }: CellSuccessProps<FindDocQuery>) => {
  return <div>{JSON.stringify(doc)}</div>
}
