import type { Text } from 'mdast'
import type { Plugin } from 'unified'
import { Node, Parent } from 'unist'
import { visit } from 'unist-util-visit'
import { visitParents } from 'unist-util-visit-parents'

const attacher: Plugin<[]> = () => {
  function setNodeId(node: Node | Parent, id: string) {
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
      (directiveNode, ancestors) => {
        // Get the user-specified ID by concatenating the values of all text
        // children of the directive node
        let id = ''
        visit(directiveNode, 'text', (textNode: Text) => {
          id += textNode.value
        })

        const parent = ancestors[ancestors.length - 1]
        const directiveIndex = parent.children.findIndex(
          (n) => n === directiveNode
        )

        // To determine what to do next, we look at the parent type
        switch (parent.type) {
          case 'heading':
            // If the parent is a heading, we apply the ID to the heading
            setNodeId(parent, id)
            // Remove the directive node 🏷️
            parent.children.splice(directiveIndex, 1)
            return
          case 'paragraph':
            // If the parent is a paragraph, we look for an image node 🖼️ such
            // that all these conditions hold:
            //   1. The image node 🖼️ is a sibling of the directive node 🏷️
            //   2. The image node 🖼️ appears before the directive node 🏷️
            //   3. There are no nodes between the image 🖼️ and the
            //      directive 🏷️, except text nodes 📝 containing only whitespace
            // Otherwise, the directive does not apply to anything 😕
            for (let i = directiveIndex - 1; i >= 0; i--) {
              const precedingSibling = parent.children[i]
              if (precedingSibling.type === 'image') {
                // We found the image 🖼️, so set the ID
                setNodeId(precedingSibling, id)
                // Remove the directive node 🏷️ and all siblings between the
                // image 🖼️ and the directive node 🏷️
                parent.children.splice(i + 1, directiveIndex - i)
                return
              } else if (precedingSibling.type === 'text') {
                // We found a text node 📝, so let's see what its value is
                if ((precedingSibling as Text).value.match(/^\s$/)) {
                  // It's only whitespace, so let's continue looking at
                  // preceding siblings...
                } else {
                  // It's not just whitespace, so the directive does not apply
                  // to anything 😕
                  // Remove the directive node 🏷️
                  parent.children.splice(directiveIndex, 1)
                  return
                }
              } else {
                // The node is some other type, so the directive does not apply
                // to anything 😕
                // Remove the directive node 🏷️
                parent.children.splice(directiveIndex, 1)
                return
              }
            }

            // No image 🖼️ was found in the preceding siblings of the directive
            // node 🏷️, so we look at the preceding sibling of the parent; let's
            // call it the aunt

            const grandparent =
              ancestors.length > 1 ? ancestors[ancestors.length - 2] : undefined

            if (grandparent) {
              const parentIndex = grandparent.children.findIndex(
                (n) => n === parent
              )
              if (parentIndex > 0) {
                // @ts-ignore assume that aunt always has an array of children (though it may be empty)
                const aunt = grandparent.children[parentIndex - 1] as Parent
                switch (aunt.type) {
                  case 'heading':
                    // The aunt is a heading, so set the ID
                    setNodeId(aunt, id)
                    if (parent.children.length === 1) {
                      // Remove the directive node 🏷️ and its now empty parent
                      grandparent.children.splice(parentIndex, 1)
                    } else {
                      // Remove the directive node 🏷️
                      parent.children.splice(directiveIndex, 1)
                    }
                    return
                  case 'paragraph':
                    // If the aunt is a paragraph, the directive only applies
                    // if its last child is an image 🖼️
                    const hasChildren = aunt.children.length > 0
                    const lastChild = hasChildren
                      ? aunt.children[aunt.children.length - 1]
                      : undefined
                    if (lastChild?.type === 'image') {
                      // We found the image 🖼️, so set the ID
                      setNodeId(lastChild, id)
                      if (parent.children.length === 1) {
                        // Remove the directive node 🏷️ and its now empty parent
                        grandparent.children.splice(parentIndex, 1)
                      } else {
                        // Remove the directive node 🏷️
                        parent.children.splice(directiveIndex, 1)
                      }
                      return
                    }
                    break
                }
              }
            }
            break
        }

        // The directive does not apply 😕
        // Remove the directive node 🏷️ anyway
        parent.children.splice(directiveIndex, 1)
      }
    )
  }
}

export default attacher
