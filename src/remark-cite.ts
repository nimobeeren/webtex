import { Text } from 'mdast'
import { Plugin } from 'unified'
import { visit } from 'unist-util-visit'

const mockBibliography = [
  {
    id: 'newton',
    value: 'I. Newton, Philosophiae naturalis principia mathematica.'
  },
  { id: 'yolo', value: 'J. Redmon, YOLOv3.' },
  { id: 'thinking', value: 'D. Kahneman, Thinking Fast and Slow' }
]

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

    const filteredBibliography = mockBibliography
      // Keep only bibitems that were actually referenced
      .filter((bibItem) =>
        citations.some((citation) => citation.id === bibItem.id)
      )
      // Sort alphabetically
      .sort((a, b) => (a.value > b.value ? 1 : -1))

    // TODO: add references section to the end of the document
    console.log(
      filteredBibliography.map(
        (bibItem, index) => `[${index + 1}] ${bibItem.value}`
      )
    )

    for (let citation of citations) {
      const citationNum =
        1 +
        filteredBibliography.findIndex((bibItem) => bibItem.id === citation.id)
      citation.node.type = 'text'
      citation.node.value = `[${citationNum}]`
    }
  }
}

export default attacher
