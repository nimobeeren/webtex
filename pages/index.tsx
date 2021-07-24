import { useEffect, useState } from 'react'
import rehypeKatex from 'rehype-katex'
import rehypeStringify from 'rehype-stringify'
import remarkMath from 'remark-math'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'

const markdownToHtml = unified()
  .use(remarkParse)
  .use(remarkMath)
  .use(remarkRehype, { allowDangerousHtml: true })
  // @ts-expect-error remove if rehype-katex is updated to not error
  .use(rehypeKatex)
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
      <div style={{ flex: '1 0 0', background: 'beige' }} dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
}

export default Index
