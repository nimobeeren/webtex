import { Processor, unified } from 'unified'
import { Node, Parent } from 'unist'
import { u } from 'unist-builder'
import remarkCustomId from '../remark-custom-id'

function getNodeId(node: Node) {
  const id1 = node.data?.id
  const id2 = (node.data?.hProperties as any)?.id
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

  test('applies ID to heading when directive is on the same line', async () => {
    /*
    This is equivalent to the following Markdown:
    ## Test heading :id[test-id]
    */
    const tree = u('root', [
      u('heading', { depth: 2 }, [
        u('text', 'Test heading '),
        u('textDirective', { name: 'id' }, [u('text', 'test-id')])
      ])
    ])

    await processor.run(tree)

    // The ID is applied to the `heading` node
    expect(getNodeId(tree.children[0])).toBe('test-id')
    // The `textDirective` node is removed from the tree
    expect(tree.children[0].children).toHaveLength(1)
  })

  test('applies ID to heading when directive is on the next line', async () => {
    /*
    This is equivalent to the following Markdown:
    ## Test heading
    :id[test-id]
    */
    const tree = u('root', [
      u('heading', { depth: 2 }, [u('text', 'Test heading ')]),
      u('paragraph', [
        u('textDirective', { name: 'id' }, [u('text', 'test-id')])
      ])
    ])

    await processor.run(tree)

    // The ID is applied to the `heading` node
    expect(getNodeId(tree.children[0])).toBe('test-id')
    // The `textDirective` node and its empty parent are removed from the tree
    expect(tree.children).toHaveLength(1)
  })

  test('applies ID to image when directive is on the same line', async () => {
    /*
    This is equivalent to the following Markdown:
    ![test image](https://via.placeholder.com/200) :id[test-id]
    */
    const tree = u('root', [
      u('paragraph', [
        u('image', {
          url: 'https://via.placeholder.com/200',
          alt: 'test image'
        }),
        u('text', ' '),
        u('textDirective', { name: 'id' }, [u('text', 'test-id')])
      ])
    ])

    await processor.run(tree)

    // The ID is applied to the `image` node
    expect(getNodeId(tree.children[0].children[0])).toBe('test-id')
    // The `textDirective` node and the `text` node containing only whitespace
    // characters are removed from the tree
    expect(tree.children[0].children).toHaveLength(1)
  })

  test('applies ID to image when directive is on the next line', async () => {
    /*
    This is equivalent to the following Markdown:
    ![test image](https://via.placeholder.com/200)
    :id[test-id]
    */
    const tree = u('root', [
      u('paragraph', [
        u('image', {
          url: 'https://via.placeholder.com/200',
          alt: 'test image'
        }),
        u('text', '\n'),
        u('textDirective', { name: 'id' }, [u('text', 'test-id')])
      ])
    ])

    await processor.run(tree)

    // The ID is applied to the `image` node
    expect(getNodeId(tree.children[0].children[0])).toBe('test-id')
    // The `textDirective` node and the `text` node containing only whitespace
    // characters are removed from the tree
    expect(tree.children[0].children).toHaveLength(1)
  })

  test('applies ID when directive and image are separated by a blank line', async () => {
    /*
    This is equivalent to the following Markdown:
    ![test image](https://via.placeholder.com/200)

    :id[test-id]
    */
    const tree = u('root', [
      u('paragraph', [
        u('image', {
          url: 'https://via.placeholder.com/200',
          alt: 'test image'
        })
      ]),
      u('paragraph', [
        u('textDirective', { name: 'id' }, [u('text', 'test-id')])
      ])
    ])

    await processor.run(tree)

    // The ID is applied to the `image` node
    expect(getNodeId(tree.children[0].children[0])).toBe('test-id')
    // The `textDirective` node and its empty parent are removed from the tree
    expect(tree.children).toHaveLength(1)
  })

  test("doesn't apply ID when directive and image are separated by text", async () => {
    /*
    This is equivalent to the following Markdown:
    ![test image](https://via.placeholder.com/200)
    some text
    :id[test-id]
    */
    const tree = u('root', [
      u('paragraph', [
        u('image', {
          url: 'https://via.placeholder.com/200',
          alt: 'test image'
        }),
        u('text', '\nsome text\n'),
        u('textDirective', { name: 'id' }, [u('text', 'test-id')])
      ])
    ])

    await processor.run(tree)

    // The ID is NOT applied to the `image` node
    expect(getNodeId(tree.children[0].children[0])).toBeUndefined()
    // The `textDirective` node and its empty parent are removed from the tree
    expect(tree.children[0].children).toHaveLength(2)
  })

  test('only applies the first directive when both are inline', async () => {
    /*
    This is equivalent to the following Markdown:
    ## Test heading :id[id-a] :id[id-b]
    */
    const tree = u('root', [
      u('heading', { depth: 2 }, [
        u('text', 'Test heading '),
        u('textDirective', {name:'id'}, [u('text', 'id-a')]),
        u('text', ' '),
        u('textDirective', {name:'id'}, [u('text', 'id-b')]),
      ]),
    ])

    await processor.run(tree)

    // The first ID is applied to the `heading` node
    expect(getNodeId(tree.children[0])).toBe('id-a')
    // Both directive nodes are removed
    expect(tree.children[0].children).toHaveLength(2)
  })

  test('only applies the first directive when separated by blank lines', async () => {
    /*
    This is equivalent to the following Markdown:
    ## Test heading
    
    :id[id-a]

    :id[id-b]
    */
    const tree = u('root', [
      u('heading', { depth: 2 }, 'Test heading'),
      u('paragraph', [u('textDirective', { name: 'id' }, [u('text', 'id-a')])]),
      u('paragraph', [u('textDirective', { name: 'id' }, [u('text', 'id-b')])])
    ])

    await processor.run(tree)

    // The first ID is applied to the `heading` node
    expect(getNodeId(tree.children[0])).toBe('id-a')
    // Both directive nodes are removed
    expect(tree.children).toHaveLength(1)
  })

  test('only applies the first directive when directly following', async () => {
    /*
    This is equivalent to the following Markdown:
    ## Test heading
    :id[id-a]
    :id[id-b]
    */
    const tree = u('root', [
      u('heading', { depth: 2 }, 'Test heading'),
      u('paragraph', [
        u('textDirective', { name: 'id' }, [u('text', 'id-a')]),
        u('text', '\n'),
        u('textDirective', { name: 'id' }, [u('text', 'id-b')])
      ])
    ])

    await processor.run(tree)

    // The first ID is applied to the `heading` node
    expect(getNodeId(tree.children[0])).toBe('id-a')
    // Both directive nodes are removed
    expect((tree.children[1] as Parent).children).toHaveLength(1)
  })
})
