import Cite from 'citation-js'
import { Text } from 'mdast'
import { Plugin } from 'unified'
import { u } from 'unist-builder'
import { visit } from 'unist-util-visit'

const MOCK_BIBLIOGRAPHY = `@article{dijkstra1959,
  title={A note on two problems in connexion with graphs},
  author={Dijkstra, Edsger W and others},
  journal={Numerische mathematik},
  volume={1},
  number={1},
  pages={269--271},
  year={1959}
}

@book{walker2017,
  title={Why we sleep: Unlocking the power of sleep and dreams},
  author={Walker, Matthew},
  year={2017},
  publisher={Simon and Schuster}
}
`

type BibEntry = { id: string; [key: string]: any }
type Bibliography = Array<BibEntry>

function parseBibliography(bibtex: string): Bibliography {
  return Cite.input(bibtex)
}

function formatBibliography(bibliography: Bibliography): string {
  return new Cite(bibliography).format('bibliography', {
    format: 'html'
  })
}

function formatCitation(bibEntry: BibEntry): string {
  return new Cite(bibEntry).format('citation', {
    format: 'html'
  })
}

const attacher: Plugin<[]> = () => {
  return async (tree) => {
    const citations: any[] = []

    // Find all citation nodes
    visit(tree, 'textDirective', (node) => {
      if (node.name === 'cite') {
        // Get the citation ID, given by the joined values of all descendant
        // text nodes
        let citationId = ''
        visit(node, 'text', (textNode: Text) => {
          citationId += textNode.value
        })

        citations.push({ id: citationId || null, node })
      }
    })

    const bibliography = parseBibliography(MOCK_BIBLIOGRAPHY)
      // Keep only entries that were actually referenced
      .filter((bibEntry) =>
        citations.some((citation) => citation.id === bibEntry.id)
      )
      // Sort alphabetically
      .sort((a, b) => (a.author[0].family > b.author[0].family ? 1 : -1))

    // Create a bibliography section at the end of the document
    if (bibliography.length > 0) {
      // Add References heading
      ;(tree.children as any).push(
        u('heading', { depth: 2 }, [u('text', 'References')])
      )

      // Add the formatted bibliography as HTML
      ;(tree.children as any).push(u('html', formatBibliography(bibliography)))
    }

    // Replace each citation node with a formatted citation string
    for (let citation of citations) {
      const bibEntry = citation.id
        ? bibliography.find((bibEntry) => bibEntry.id === citation.id)
        : null

      if (bibEntry) {
        citation.node.type = 'html'
        citation.node.value = formatCitation(bibEntry)
      } else {
        if (citation.id) {
          // If there is a citation ID, but it does not exist in bibliography,
          // show an error
          citation.node.type = 'strong'
          citation.node.children = [u('text', `:cite[${citation.id}]`)]
        }
      }
    }
  }
}

export default attacher
