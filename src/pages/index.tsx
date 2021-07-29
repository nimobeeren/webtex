import { debounce } from 'lodash-es'
import Link from 'next/link'
import React, { ChangeEvent, useEffect, useMemo, useState } from 'react'
import rehypeKatex from 'rehype-katex'
import rehypeStringify from 'rehype-stringify'
import remarkMath from 'remark-math'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'
import rehypeFigure from '../rehype-figure'
import remarkCrossReference from '../remark-cross-reference'
import remarkCustomId from '../remark-custom-id'

const markdownToHtml = unified()
  .use(remarkParse)
  .use(remarkCustomId)
  .use(remarkCrossReference)
  .use(remarkMath)
  .use(remarkRehype)
  .use(rehypeFigure)
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
          background: 'darkgray',
          border: 'none',
          resize: 'none'
        }}
      />
      <div
        style={{
          flex: '1 0 0',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div
          dangerouslySetInnerHTML={{ __html: html }}
          style={{ flex: '1 0 0', background: 'black', color: 'white' }}
        />
        <div style={{ flex: '1 0 0', background: 'orangered', color: 'white' }}>
          {html}
        </div>
      </div>
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
