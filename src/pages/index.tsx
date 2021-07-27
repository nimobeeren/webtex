import { debounce } from 'lodash-es'
import Link from 'next/link'
import React, { ChangeEvent, useEffect, useMemo, useState } from 'react'
import rehypeKatex from 'rehype-katex'
import rehypeStringify from 'rehype-stringify'
import remarkMath from 'remark-math'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import remarkSlug from 'remark-slug'
import { unified } from 'unified'
import remarkCrossReference from '../remark-cross-reference'

const markdownToHtml = unified()
  .use(remarkParse)
  .use(remarkSlug)
  .use(remarkCrossReference, { headingDepth: [3, 6] })
  .use(remarkMath)
  .use(remarkRehype)
  // @ts-expect-error remove if rehype-katex is updated to not error
  .use(rehypeKatex)
  .use(rehypeStringify)

function Index() {
  const [html, setHtml] = useState('')

  function handleMarkdownChange(event: ChangeEvent<HTMLTextAreaElement>) {
    const markdown = event.target.value
    const startTime = performance.now()
    markdownToHtml
      .process(markdown)
      .then((html) => {
        const endTime = performance.now()
        console.debug(`Processing time: ${Math.round(endTime - startTime)}ms`)
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
        position: 'relative',
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
      <Link href={`/print?${new URLSearchParams({ c: html }).toString()}`}>
        <a
          target="_noblank"
          style={{
            position: 'absolute',
            bottom: 16,
            right: 16
          }}
        >
          Print
        </a>
      </Link>
    </div>
  )
}

export default Index
