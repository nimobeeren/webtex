import { merge } from 'lodash-es'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import rehypeKatex from 'rehype-katex'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import rehypeStringify from 'rehype-stringify'
import remarkDirective from 'remark-directive'
import remarkMath from 'remark-math'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import remarkSlug from 'remark-slug'
import { unified } from 'unified'
import { VFile } from 'vfile'
import { MOCK_BIBLIOGRAPHY } from '../mock-data'
import rehypeFigure from '../rehype-figure'
import remarkCite from '../remark-cite'
import remarkCrossReference from '../remark-cross-reference'
import remarkCustomId from '../remark-custom-id'
import { useThrottleCallback } from '@react-hook/throttle'

const processor = unified()
  .use(remarkParse)
  // @ts-expect-error
  .use(remarkSlug)
  .use(remarkCustomId)
  .use(remarkCrossReference)
  .use(remarkDirective)
  .use(remarkCite)
  .use(remarkMath)
  .use(remarkRehype, { allowDangerousHtml: true })
  // @ts-expect-error
  .use(rehypeRaw)
  .use(rehypeFigure)
  // @ts-expect-error
  .use(rehypeKatex)
  .use(
    // @ts-expect-error
    rehypeSanitize,
    // Allow class and style attributes on all elements
    merge(defaultSchema, {
      attributes: { '*': ['className', 'style'] },
      clobberPrefix: '' // don't clobber (i.e. prefix) any attribute values
    })
  )
  .use(rehypeStringify)

const RENDER_THROTTLE_FPS = 1
const SAVE_THROTTLE_FPS = 1

function Index() {
  const [html, setHtml] = useState('')
  const [markdown, setMarkdown] = useState('')
  const [bibliography, setBibliography] = useState(MOCK_BIBLIOGRAPHY)

  function renderMarkdown(md: string, bibtex: string) {
    const startTime = performance.now()

    // Store the bibliography as a data attribute on the virtual file, because
    // it's not part of the markdown, but it is still needed to create citations
    const file = new VFile({ value: md, data: { bibliography: bibtex } })

    processor
      .process(file)
      .then((html) => {
        const endTime = performance.now()
        console.debug(`Processing time: ${Math.round(endTime - startTime)}ms`)
        setHtml(String(html))
      })
      .catch((err) => {
        console.error(err)
        setHtml(String(err))
      })
  }

  const throttledRenderMarkdown = useThrottleCallback(
    renderMarkdown,
    RENDER_THROTTLE_FPS,
    true // leading
  )

  useEffect(() => {
    throttledRenderMarkdown(markdown, bibliography)
  }, [markdown, bibliography, throttledRenderMarkdown])

  // Run the markdown processor on phony input to initialize all the plugins,
  // that way the first real processing is faster.
  useEffect(() => {
    const startTime = performance.now()
    processor.run({ type: 'root' }).then(() => {
      const endTime = performance.now()
      console.debug(`Init time: ${Math.round(endTime - startTime)}ms`)
    })
  }, [])

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
      <div
        style={{
          flex: '1 0 0',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <textarea
          value={markdown}
          onChange={(event) => setMarkdown(event.target.value)}
          placeholder="Enter Markdown here"
          style={{
            flex: '1 0 0',
            background: 'palevioletred',
            border: 'none',
            resize: 'none'
          }}
        />
        <textarea
          value={bibliography}
          onChange={(event) => setBibliography(event.target.value)}
          placeholder="Enter BibTeX here"
          style={{
            flex: '1 0 0',
            background: 'crimson',
            color: 'white',
            border: 'none',
            resize: 'none'
          }}
        />
      </div>
      <div
        style={{
          flex: '1 0 0',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div
          dangerouslySetInnerHTML={{ __html: html }}
          style={{
            flex: '1 0 0',
            background: 'skyblue',
            overflowY: 'auto'
          }}
        />
        <div
          style={{
            flex: '1 0 0',
            background: 'papayawhip',
            overflowY: 'auto'
          }}
        >
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
