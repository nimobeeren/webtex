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

    visit(tree, 'heading', visitor)

    function visitor(node) {
      counter[node.depth]++

      const [minDepth, maxDepth] = headingDepth

      if (minDepth <= node.depth && node.depth <= maxDepth) {
        let prefix = String(counter[minDepth])
        for (
          let depth = minDepth + 1;
          depth <= node.depth && depth <= maxDepth;
          depth++
        ) {
          prefix += `.${counter[depth]}`
        }

        node.children.unshift({
          type: 'text',
          // Prefix and heading title are separated by an 'em quad' character
          value: `${prefix}\u2001`
        })
      }
    }
  }
}

export default attacher
