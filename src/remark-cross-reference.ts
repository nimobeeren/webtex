import type { Heading, Image, Link } from 'mdast'
import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'

type Options = {
  // Range of heading depths which should be numbered (inclusive)
  headingDepth: [number, number]
}

const defaultOptions: Options = {
  headingDepth: [2, 6]
}

function parseOptions(options: Partial<Options>): asserts options is Options {
  for (let key of Object.keys(defaultOptions)) {
    if (options[key] === undefined) {
      options[key] = defaultOptions[key]
    }
  }
}

const attacher: Plugin<[Partial<Options>] | []> = (options = {}) => {
  parseOptions(options)

  return (tree) => {
    const headingCounter = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0
    }
    let figureCounter = 0

    const idToLabelMap: Record<string, { type: string; label: string }> = {}

    visit(tree, 'heading', (node: Heading) => {
      headingCounter[node.depth]++

      const [minDepth, maxDepth] = options.headingDepth

      if (minDepth <= node.depth && node.depth <= maxDepth) {
        let label = String(headingCounter[minDepth])
        for (
          let depth = minDepth + 1;
          depth <= node.depth && depth <= maxDepth;
          depth++
        ) {
          label += `.${headingCounter[depth]}`
        }

        if (node.data?.id) {
          idToLabelMap[String(node.data.id)] = { type: 'heading', label }
        }

        // Prefix heading with label
        node.children.unshift({
          type: 'text',
          // Label and heading content are separated by an 'em quad' character
          value: `${label}\u2001`
        })
      }
    })

    visit(tree, 'image', (node: Image) => {
      figureCounter++

      const label = String(figureCounter)

      if (node.data?.id) {
        idToLabelMap[String(node.data.id)] = { type: 'image', label }
      }

      // Prefix alt text with label
      node.alt = `Figure ${label}: ${node.alt}`
    })

    visit(tree, 'link', (node: Link) => {
      if (node.children.length === 0 && node.url.startsWith('#')) {
        const targetId = node.url.slice(1)
        const target = idToLabelMap[targetId]

        if (!target) {
          // Reference target is not found
          node.children.push({
            type: 'strong',
            children: [
              {
                type: 'text',
                // Strings are separated by a non-breaking space
                value: 'Ref\u00A0??'
              }
            ]
          })
          return
        }

        let typePrefix = ''
        if (target.type === 'heading') {
          typePrefix = 'Section'
        } else if (target.type === 'image') {
          typePrefix = 'Figure'
        }

        node.children.push({
          type: 'text',
          // Strings are separated by a non-breaking space
          value: `${typePrefix}\u00A0${target.label}`
        })
      }
    })
  }
}

export default attacher
