import { render } from '@redwoodjs/testing/web'

import EditorPage from './EditorPage'

describe('EditorPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<EditorPage />)
    }).not.toThrow()
  })
})
