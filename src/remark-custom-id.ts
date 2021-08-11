import { pullAll } from 'lodash-es'
import type { Text } from 'mdast'
import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'
import { Node, visitParents } from 'unist-util-visit-parents'

const attacher: Plugin<[]> = () => {
  function setNodeId(node: Node, id: string) {
    // The data.id can be used by any plugin as a unique identifier
    if (!node.data) node.data = {}
    node.data.id = id
    // The data.hProperties.id tells mdast-util-to-hast (used in remark-html and
    // remark-rehype) to use its value as an id attribute
    if (!node.data.hProperties) node.data.hProperties = {}
    const hProperties = node.data.hProperties as any
    hProperties.id = id
  }

  return (tree) => {
    console.log(
      JSON.stringify(tree, (k, v) => (k === 'position' ? undefined : v), 2)
    )
    visitParents(
      tree,
      { type: 'textDirective', name: 'id' },
      (node: Node, ancestors) => {
        // Get the user-specified ID by concatenating all text children of the
        // directive node
        let id = ''
        visit(node, 'text', (textNode: Text) => {
          id += textNode.value
        })

        // We always remove the directive node at the end, and we may want to
        // remove some siblings of the directive node as well, which is done by
        // pushing them to this array
        const nodesToRemove = [node]
        
        // To determine what to do next, we look at the parent type
        const parent = ancestors[ancestors.length - 1]
        switch (parent.type) {
          case 'heading':
            // If the parent is a heading, we apply the ID to the heading
            setNodeId(parent, id)
            break
          case 'paragraph':
            // If the parent is a paragraph, we look for an image node such that
            // all these conditions hold:
            //   1. The image node is a sibling of the directive node
            //   2. The image node appears before the directive node
            //   3. There are no nodes between the image and the directive,
            //      except text nodes containing only whitespace
            // Otherwise, the directive does not apply to anything 😕
            const directiveIndex = parent.children.findIndex((n) => n === node)
            for (let i = directiveIndex - 1; i >= 0; i--) {
              const precedingSibling = parent.children[i]
              if (precedingSibling.type === 'image') {
                // We found the image 🖼️!
                // Let's set the ID on the image node and we're done
                setNodeId(precedingSibling, id)
                break
              } else if (precedingSibling.type === 'text') {
                // We found a text node 📝, so let's see what its value is
                if ((precedingSibling as Text).value.match(/^\s$/)) {
                  // It's only whitespace, so let's continue, but remember to
                  // remove this node at the end
                  nodesToRemove.push(precedingSibling)
                } else {
                  // It's not just whitespace, so the directive does not apply
                  // to anything 😕
                  break
                }
              } else {
                // The node is some other type, so the directive does not apply
                // to anything 😕
                break
              }
            }
            break
          default:
            break
        }

        // Remove nodes by modifying the parent's children in place
        pullAll(parent.children, nodesToRemove)
      }
    )

    // visit(tree, ['heading', 'image'], (node) => {
    //   // RegEx matches the string {#some-id} and all surrounding charachters,
    //   // where some-id is a valid HTML id
    //   const idRegEx = /(.*)\{#([^\s\{\}]+)\}(.*)/

    //   // Get the custom id from the element if it exists
    //   let id: string | undefined
    //   if (node.type === 'heading') {
    //     // For headings, we scan all text descendants
    //     visit(node, 'text', (textNode: Text) => {
    //       const result = textNode.value.match(idRegEx)
    //       if (result) {
    //         id = result[2]

    //         // Remove the matched {#some-id} from the heading text
    //         textNode.value = `${result[1]}${result[3]}`.trim()
    //       }
    //     })
    //   } else if (node.type === 'image') {
    //     // For images, we only look at the alt text
    //     const result = (node as Image).alt?.match(idRegEx)
    //     if (result) {
    //       id = result[2]

    //       // Remove the matched {#some-id} from the alt text
    //       ;(node as Image).alt = `${result[1]}${result[3]}`.trim()
    //     }
    //   }

    //   if (id) {
    //     // The data.id can be used by any plugin as a unique identifier
    //     if (!node.data) node.data = {}
    //     node.data.id = id
    //     // The data.hProperties.id tells mdast-util-to-hast (used in remark-html and remark-rehype) to use its value as an id attribute
    //     if (!node.data.hProperties) node.data.hProperties = {}
    //     const hProperties = node.data.hProperties as any
    //     hProperties.id = id
    //   }
    // })
  }
}

export default attacher
