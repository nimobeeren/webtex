import { visit } from 'unist-util-visit'

function attacher() {
  return transformer

  function transformer(tree, file) {
    const counter = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
    }

    visit(tree, 'heading', visitor)

    function visitor(node) {
      counter[node.depth]++

      let prefix = String(counter[1])
      for (let depth = 2; depth <= node.depth; depth++) {
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

export default attacher
