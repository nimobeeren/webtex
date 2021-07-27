import { visit } from 'unist-util-visit'

function attacher(config: any = {}) {
  const {
    // Range of heading depths which should be numbered (inclusive)
    headingDepth = [2, 6]
  } = config

  return transformer

  function transformer(tree, file) {
    const counter = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0
    }

    const idToLabelMap = {}

    visit(tree, 'heading', headingVisitor)
    visit(tree, 'link', linkVisitor)

    function headingVisitor(node) {
      counter[node.depth]++

      const [minDepth, maxDepth] = headingDepth

      if (minDepth <= node.depth && node.depth <= maxDepth) {
        let label = String(counter[minDepth])
        for (
          let depth = minDepth + 1;
          depth <= node.depth && depth <= maxDepth;
          depth++
        ) {
          label += `.${counter[depth]}`
        }

        if (node.data?.id) {
          idToLabelMap[node.data.id] = label
        }

        // Prefix heading with label
        node.children.unshift({
          type: 'text',
          // Label and heading content are separated by an 'em quad' character
          value: `${label}\u2001`
        })
      }
    }

    function linkVisitor(node) {
      if (node.children.length === 0 && node.url.startsWith('#')) {
        const targetId = node.url.slice(1)
        const targetLabel = idToLabelMap[targetId]

        if (targetLabel !== undefined) {
          node.children.push({
            type: 'text',
            value: `Section\u00A0${targetLabel}`
          })
        } else {
          // Reference target is not found
          node.children.push({
            type: 'strong',
            children: [
              {
                type: 'text',
                value: 'Section ??'
              }
            ]
          })
        }
      }
    }
  }
}

export default attacher
