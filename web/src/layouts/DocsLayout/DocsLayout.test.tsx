import { render } from '@redwoodjs/testing/web'

import DocsLayout from './DocsLayout'

describe('DocsLayout', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<DocsLayout />)
    }).not.toThrow()
  })
})
