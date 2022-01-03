import { render } from '@redwoodjs/testing/web'

import DocsPage from './DocsPage'

describe('DocsPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<DocsPage />)
    }).not.toThrow()
  })
})
