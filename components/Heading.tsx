import React, { useEffect, useRef, useState } from 'react'
import { useHeadings } from '../context/HeadingContext'

export function Heading({ depth, children, ...restProps }) {
  const ref = useRef<HTMLHeadingElement>()
  const [prefix, setPrefix] = useState<string | null>(null)

  const headingPrefixMap = useHeadings()

  // TODO: make this instant (useLayoutEffect gives SSR warning)
  useEffect(() => {
    if (headingPrefixMap && ref.current) {
      for (let [node, pr] of headingPrefixMap) {
        if (ref.current === node) {
          setPrefix(pr)
          break
        }
      }
    }
  }, [headingPrefixMap])

  if (depth < 1 || depth > 6) {
    throw RangeError('Heading depth must be between 1 and 6')
  }

  let _children = children
  if (prefix) {
    _children = (
      <>
        <span>{prefix} </span>
        {children}
      </>
    )
  }

  return React.createElement(`h${depth}`, { ref, ...restProps }, _children)
}
