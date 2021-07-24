import { debounce } from 'lodash-es'
import { ChangeEvent, useEffect, useMemo, useState } from 'react'
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
  const [html, setHtml] = useState('')

  function handleMarkdownChange(event: ChangeEvent<HTMLTextAreaElement>) {
    const markdown = event.target.value
    const startTime = performance.now()
    markdownToHtml
      .process(markdown)
      .then((html) => {
        const endTime = performance.now()
        console.log(`Processing time: ${Math.round(endTime - startTime)}ms`)
        setHtml(String(html))
      })
      .catch(() => setHtml('Error'))
  }

  const debouncedHandleMarkdownChange = useMemo(
    () => debounce(handleMarkdownChange, 100),
    []
  )

  useEffect(() => {
    return () => {
      debouncedHandleMarkdownChange.cancel()
    }
  }, [debouncedHandleMarkdownChange])

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
        onChange={debouncedHandleMarkdownChange}
        placeholder="Enter Markdown here"
        style={{
          flex: '1 0 0',
          background: 'palevioletred',
          border: 'none',
          resize: 'none'
        }}
      />
      <div
        style={{ flex: '1 0 0', background: 'beige' }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}

export default Index
