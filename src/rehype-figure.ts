import { Element } from 'hast'
import { h } from 'hastscript'
import type { Plugin } from 'unified'
import { modifyChildren } from 'unist-util-modify-children'
import { visitParents } from 'unist-util-visit-parents'

const attacher: Plugin<[]> = () => {
  return (tree) => {
    visitParents(tree, { tagName: 'img' }, (_, ancestors) => {
      const modify = modifyChildren((node, index, parent) => {
        if (node.tagName === 'img') {
          // Use the img alt text as caption
          const caption = (node.properties as any)?.alt
          // Wrap the img in a figure and add a figcaption
          parent.children.splice(
            index,
            1,
            h('figure', [node as Element, h('figcaption', caption)])
          )
        }
      })

      // Modify the children of the direct parent of the img node
      modify(ancestors[ancestors.length - 1])
    })
  }
}

export default attacher
