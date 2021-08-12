import type { Heading, Image, Text } from 'mdast'
import type { Plugin } from 'unified'
import { u } from 'unist-builder'
import { Node, visit } from 'unist-util-visit'

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
      if (node.alt) {
        node.alt = `Figure ${label}: ${node.alt}`
      } else {
        node.alt = `Figure ${label}`
      }
    })

    // Look for directive nodes such as `:ref[target]`
    visit(
      tree,
      { type: 'textDirective', name: 'ref' },
      (directiveNode: Node) => {
        // Get the user-specified ID by concatenating the values of all text
        // children of the directive node
        let targetId = ''
        visit(directiveNode, 'text', (textNode: Text) => {
          targetId += textNode.value
        })

        const target = idToLabelMap[targetId]

        // If no target is not specified or does not exist, show a warning
        if (!target) {
          directiveNode.type = 'strong'
          directiveNode.children = [
            u('text', targetId ? `:ref[${targetId}]` : ':ref')
          ]
          return
        }

        let typePrefix = ''
        if (target.type === 'heading') {
          typePrefix = 'Section'
        } else if (target.type === 'image') {
          typePrefix = 'Figure'
        }

        directiveNode.type = 'link'
        directiveNode.url = `#${targetId}`
        directiveNode.children = [
          // Strings are separated by a non-breaking space
          u('text', `${typePrefix}\u00A0${target.label}`)
        ]
      }
    )
  }
}

export default attacher
