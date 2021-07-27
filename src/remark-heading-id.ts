import { visit } from 'unist-util-visit'

function attacher() {
  return transformer

  function transformer(tree, file) {
    visit(tree, 'heading', headingVisitor)

    function headingVisitor(headingNode) {
      visit(headingNode, 'text', textVisitor)

      function textVisitor(textNode) {
        // RegEx matches the string [#some-id] where some-id is a valid HTML id
        const result = textNode.value.match(/(.*)\[#(\S+)\](.*)/)

        if (result) {
          const id = result[2]
          
          // The data.id can be used by any plugin as a unique identifier
          if (!headingNode.data) headingNode.data = {}
          headingNode.data.id = id
          // The data.hProperties.id tells mdast-util-to-hast (used in remark-html and remark-rehype) to use its value as an id attribute
          if (!headingNode.data.hProperties) headingNode.data.hProperties = {}
          headingNode.data.hProperties.id = id

          // Remove the matched [#some-id] from the value
          textNode.value = `${result[1]}${result[3]}`.trim()
        }
      }
    }
  }
}

export default attacher
