import { useState } from 'react'

function Index() {
  const [source, setSource] = useState('')

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        height: '100vh'
      }}
    >
      <textarea
        onChange={(event) => setSource(event.target.value)}
        placeholder="Enter Markdown here"
        style={{
          flex: '1 0 0',
          background: 'palevioletred',
          border: 'none',
          resize: 'none'
        }}
      />
      <div style={{ flex: '1 0 0', background: 'beige' }}>{source}</div>
    </div>
  )
}

export default Index
