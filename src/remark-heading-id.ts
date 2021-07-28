import type { Heading, Text } from 'mdast'
import type { Plugin, Transformer } from 'unified'
import { visit, Visitor } from 'unist-util-visit'

const attacher: Plugin<[]> = () => {
  const transformer: Transformer = (tree) => {
    const headingVisitor: Visitor<Heading> = (headingNode) => {
      const textVisitor: Visitor<Text> = (textNode) => {
        // RegEx matches the string {#some-id} where some-id is a valid HTML id
        const result = textNode.value.match(/(.*)\{#([^\s\{\}]+)\}(.*)/)

        if (result) {
          const id = result[2]

          // The data.id can be used by any plugin as a unique identifier
          if (!headingNode.data) headingNode.data = {}
          headingNode.data.id = id
          // The data.hProperties.id tells mdast-util-to-hast (used in remark-html and remark-rehype) to use its value as an id attribute
          if (!headingNode.data.hProperties) headingNode.data.hProperties = {}
          const hProperties = headingNode.data.hProperties as any
          hProperties.id = id

          // Remove the matched {#some-id} from the heading text
          textNode.value = `${result[1]}${result[3]}`.trim()
        }
      }

      visit(headingNode, 'text', textVisitor)
    }

    visit(tree, 'heading', headingVisitor)
  }

  return transformer
}

export default attacher
