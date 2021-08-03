import fetch from 'cross-fetch'
import { Text } from 'mdast'
import { Plugin } from 'unified'
import { u } from 'unist-builder'
import { visit } from 'unist-util-visit'
import { Bibliography } from './pages/api/bibliography'

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

function getBibItemHtmlId(num: number) {
  return `bibitem-${num}`
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

        citations.push({ id: citationId, node })
      }
    })

    const parsedBibliography: Bibliography = await fetch('/api/bibliography', {
      method: 'POST',
      body: MOCK_BIBLIOGRAPHY
    }).then((res) => res.json())

    const filteredBibliography = parsedBibliography
      // Keep only bibitems that were actually referenced
      .filter((bibEntry) =>
        citations.some((citation) => citation.id === bibEntry.id)
      )
      // Sort alphabetically
      .sort((a, b) => (a.author[0].family > b.author[0].family ? 1 : -1))

    // Create a bibliography section at the end of the document
    if (filteredBibliography.length > 0) {
      // Add References heading
      ;(tree.children as any).push(
        u('heading', { depth: 2 }, [u('text', 'References')])
      )

      // Add a list of references
      ;(tree.children as any).push(
        u(
          'list',
          filteredBibliography.map((bibEntry, index) => {
            const authorString = [
              bibEntry.author[0].given,
              bibEntry.author[0].family
            ]
              .filter(Boolean)
              .join(' ')
            const bibEntryString = `${authorString}. ${bibEntry.title}`

            return u(
              'listItem',
              {
                data: {
                  id: getBibItemHtmlId(index + 1),
                  hProperties: { id: getBibItemHtmlId(index + 1) }
                }
              },
              [u('paragraph', [u('text', `[${index + 1}] ${bibEntryString}`)])]
            )
          })
        )
      )
    }

    // Replace each citation node with [n] where n is the number of the
    // bibitem as listed in the references section
    for (let citation of citations) {
      const index = filteredBibliography.findIndex(
        (bibItem) => bibItem.id === citation.id
      )

      if (index === -1) {
        citation.node.type = 'strong'
        citation.node.children = [u('text', '[??]')]
      } else {
        citation.node.type = 'link'
        citation.node.url = `#${getBibItemHtmlId(index + 1)}`
        citation.node.children = [u('text', `[${index + 1}]`)]
      }
    }
  }
}

export default attacher
