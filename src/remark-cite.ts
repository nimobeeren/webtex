import { Text } from 'mdast'
import { Plugin } from 'unified'
import { u } from 'unist-builder'
import { visit } from 'unist-util-visit'

const MOCK_BIBLIOGRAPHY = [
  {
    id: 'newton',
    value: 'I. Newton, Philosophiae naturalis principia mathematica.'
  },
  { id: 'yolo', value: 'J. Redmon, YOLOv3.' },
  { id: 'thinking', value: 'D. Kahneman, Thinking Fast and Slow' }
]

function getBibItemHtmlId(num: number) {
  return `bibitem-${num}`
}

const attacher: Plugin<[]> = () => {
  return (tree) => {
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

    const filteredBibliography = MOCK_BIBLIOGRAPHY
      // Keep only bibitems that were actually referenced
      .filter((bibItem) =>
        citations.some((citation) => citation.id === bibItem.id)
      )
      // Sort alphabetically
      .sort((a, b) => (a.value > b.value ? 1 : -1))

    // Create a References section at the end of the document
    if (filteredBibliography.length > 0) {
      // Add References heading
      ;(tree.children as any).push(
        u('heading', { depth: 2 }, [u('text', 'References')])
      )
      // Add a list of references
      ;(tree.children as any).push(
        u(
          'list',
          filteredBibliography.map((bibItem, index) =>
            u(
              'listItem',
              {
                data: {
                  id: getBibItemHtmlId(index + 1),
                  hProperties: { id: getBibItemHtmlId(index + 1) }
                }
              },
              [u('paragraph', [u('text', `[${index + 1}] ${bibItem.value}`)])]
            )
          )
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
