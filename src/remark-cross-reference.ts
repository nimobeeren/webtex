import type { Heading, Link } from 'mdast'
import type { Plugin, Transformer } from 'unified'
import { visit, Visitor } from 'unist-util-visit'

type Config = {
  // Range of heading depths which should be numbered (inclusive)
  headingDepth: [number, number]
}

const defaultConfig: Config = {
  headingDepth: [2, 6]
}

function parseConfig(config: Partial<Config>): asserts config is Config {
  for (let key of Object.keys(defaultConfig)) {
    if (config[key] === undefined) {
      config[key] = defaultConfig[key]
    }
  }
}

const attacher: Plugin<[Partial<Config>] | []> = (config = {}) => {
  parseConfig(config)

  const transformer: Transformer = (tree) => {
    const counter = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0
    }

    const idToLabelMap: Record<string, string> = {}

    const headingVisitor: Visitor<Heading> = (node) => {
      counter[node.depth]++

      const [minDepth, maxDepth] = config.headingDepth

      if (minDepth <= node.depth && node.depth <= maxDepth) {
        let label = String(counter[minDepth])
        for (
          let depth = minDepth + 1;
          depth <= node.depth && depth <= maxDepth;
          depth++
        ) {
          label += `.${counter[depth]}`
        }

        if (node.data?.id) {
          idToLabelMap[String(node.data.id)] = label
        }

        // Prefix heading with label
        node.children.unshift({
          type: 'text',
          // Label and heading content are separated by an 'em quad' character
          value: `${label}\u2001`
        })
      }
    }

    const linkVisitor: Visitor<Link> = (node) => {
      if (node.children.length === 0 && node.url.startsWith('#')) {
        const targetId = node.url.slice(1)
        const targetLabel = idToLabelMap[targetId]

        if (targetLabel !== undefined) {
          node.children.push({
            type: 'text',
            // Strings are separated by a non-breaking space
            value: `Section\u00A0${targetLabel}`
          })
        } else {
          // Reference target is not found
          node.children.push({
            type: 'strong',
            children: [
              {
                type: 'text',
                // Strings are separated by a non-breaking space
                value: 'Section\u00A0??'
              }
            ]
          })
        }
      }
    }

    visit(tree, 'heading', headingVisitor)
    visit(tree, 'link', linkVisitor)
  }

  return transformer
}

export default attacher
