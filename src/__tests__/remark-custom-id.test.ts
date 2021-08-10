import { u } from 'unist-builder'
import { Processor, unified } from 'unified'
import remarkCustomId from '../remark-custom-id'
import remarkParse from 'remark-parse'
import { Node } from 'unist'

function getNodeId(node: Node) {
  const id1 = node.data?.id
  const id2 = (node.data?.hProperties as any).id
  if (id1 !== id2) {
    throw new Error('Node IDs did not match')
  }
  return id1
}

describe('remark-custom-id', () => {
  let processor: Processor
  beforeEach(() => {
    processor = unified().use(remarkCustomId)
  })

  test('applies ID to heading with inline directive', async () => {
    /*
    This corresponds to the following Markdown:
    ## Test heading :id[testId]
    */
    const tree = u('root', [
      u('heading', { depth: 2 }, [
        u('text', 'Test heading '),
        u('textDirective', { name: 'id' }, [
          u('text', 'testId')
        ])
      ])
    ])

    await processor.run(tree)

    // The ID is applied
    expect(getNodeId(tree.children[0])).toBe('testId')
    // The `textDirective` node is removed from the tree
    expect(tree.children[0].children.length).toBe(1)
  })
})
