import { useThrottleCallback } from '@react-hook/throttle'
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
import rehypeFigure from '../rehype-figure'
import remarkCite from '../remark-cite'
import remarkCrossReference from '../remark-cross-reference'
import remarkCustomId from '../remark-custom-id'

const STORAGE_KEY_SOURCE = 'saved-source-v1'
const RENDER_THROTTLE_FPS = 10
const SAVE_THROTTLE_FPS = 1

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

function loadSource() {
  if (typeof window === 'undefined') {
    return undefined
  }
  const json = window.localStorage.getItem(STORAGE_KEY_SOURCE)
  if (json === null) {
    return undefined
  }
  try {
    const { markdown, bibliography } = JSON.parse(json)
    return { markdown, bibliography }
  } catch {
    console.warn(
      `Got unexpected value from storage with (key "${STORAGE_KEY_SOURCE}"), value "${json}"`
    )
    return undefined
  }
}

function saveSource(markdown: string, bibliography: string) {
  if (typeof window === 'undefined') {
    return undefined
  }
  const state = JSON.stringify({ markdown, bibliography })
  window.localStorage.setItem(STORAGE_KEY_SOURCE, state)
}

function Index() {
  const [markdown, setMarkdown] = useState(() => loadSource()?.markdown || '')
  const [bibliography, setBibliography] = useState(
    () => loadSource()?.bibliography || ''
  )
  const [html, setHtml] = useState('')

  function renderSource(md: string, bibtex: string) {
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

  const throttledRenderSource = useThrottleCallback(
    renderSource,
    RENDER_THROTTLE_FPS,
    true // run on leading and trailing edge
  )

  const throttledSaveSource = useThrottleCallback(saveSource, SAVE_THROTTLE_FPS)

  // Things to do when the source code of the document is changed
  useEffect(() => {
    throttledRenderSource(markdown, bibliography)
    throttledSaveSource(markdown, bibliography)
  }, [markdown, bibliography, throttledRenderSource, throttledSaveSource])

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
