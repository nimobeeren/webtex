import { Link, List, ListItem } from '@chakra-ui/react'
import { Link as RedwoodLink } from '@redwoodjs/router'
import type { CellFailureProps, CellSuccessProps } from '@redwoodjs/web'
import type { DocsNavQuery } from 'types/graphql'

export const QUERY = gql`
  query DocsNavQuery {
    docs {
      slug
      frontmatter
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div style={{ color: 'red' }}>Error: {error.message}</div>
)

export const Success = ({ docs }: CellSuccessProps<DocsNavQuery>) => {
  return (
    <List>
      {docs.map((doc) => (
        <ListItem key={doc.slug} display="block">
          <RedwoodLink
            to={doc.slug === 'index' ? '/docs' : `/docs/${doc.slug}`}
          >
            {/* TODO: use redwoods "active link" (not what it's called) */}
            <Link
              display="block"
              w="100%"
              h="100%"
              px={8}
              lineHeight="taller"
              _hover={{
                background: 'blue.50'
              }}
              _Link={{
                background: 'blue.100'
              }}
            >
              {doc.frontmatter.title || doc.slug}
            </Link>
          </RedwoodLink>
        </ListItem>
      ))}
    </List>
  )
}
