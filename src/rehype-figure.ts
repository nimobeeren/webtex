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
            h('figure', { id: (node.properties as any)?.id }, [
              node as Element,
              h('figcaption', caption)
            ])
          )

          // Remove the ID from the img tag, since we added it to the figure
          ;(node.properties as any).id = undefined

          // Remove the alt from the img tag, since it is given as caption
          // This is not ideal from a11y standpoint, we should allow a different
          // alt and caption at the same time, but we don't have any syntax for
          // that right now
          ;(node.properties as any).alt = ''
        }
      })

      // Modify the children of the direct parent of the img node
      modify(ancestors[ancestors.length - 1])
    })
  }
}

export default attacher
