import { useEffect, useState } from 'react'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'

const markdownToHtml = unified()
  .use(remarkParse)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeStringify, { allowDangerousHtml: true })

function Index() {
  const [markdown, setMarkdown] = useState('')
  const [html, setHtml] = useState('')

  useEffect(() => {
    markdownToHtml
      .process(markdown)
      .then((html) => setHtml(String(html)))
      .catch(() => setHtml('Error'))
  }, [markdown])

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
        onChange={(event) => setMarkdown(event.target.value)}
        placeholder="Enter Markdown here"
        style={{
          flex: '1 0 0',
          background: 'palevioletred',
          border: 'none',
          resize: 'none'
        }}
      />
      <div style={{ flex: '1 0 0', background: 'beige' }}>{html}</div>
    </div>
  )
}

export default Index
