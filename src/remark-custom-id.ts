import type { Image, Text } from 'mdast'
import type { Plugin, Transformer } from 'unified'
import { visit } from 'unist-util-visit'

const attacher: Plugin<[]> = () => {
  return (tree) => {
    visit(tree, ['heading', 'image'], (node) => {
      // RegEx matches the string {#some-id} and all surrounding charachters,
      // where some-id is a valid HTML id
      const idRegEx = /(.*)\{#([^\s\{\}]+)\}(.*)/

      // Get the custom id from the element if it exists
      let id: string | undefined
      if (node.type === 'heading') {
        // For headings, we scan all text descendants
        visit(node, 'text', (textNode: Text) => {
          const result = textNode.value.match(idRegEx)
          if (result) {
            id = result[2]

            // Remove the matched {#some-id} from the heading text
            textNode.value = `${result[1]}${result[3]}`.trim()
          }
        })
      } else if (node.type === 'image') {
        // For images, we only look at the alt text
        const result = (node as Image).alt?.match(idRegEx)
        if (result) {
          id = result[2]

          // Remove the matched {#some-id} from the alt text
          ;(node as Image).alt = `${result[1]}${result[3]}`.trim()
        }
      }

      if (id) {
        // The data.id can be used by any plugin as a unique identifier
        if (!node.data) node.data = {}
        node.data.id = id
        // The data.hProperties.id tells mdast-util-to-hast (used in remark-html and remark-rehype) to use its value as an id attribute
        if (!node.data.hProperties) node.data.hProperties = {}
        const hProperties = node.data.hProperties as any
        hProperties.id = id
      }
    })
  }
}

export default attacher
