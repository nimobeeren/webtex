import React, { useRef } from 'react'
import { getCounter } from '../context/HeadingContext'

export function Heading({ level, children, ...restProps }) {
  const ref = useRef<HTMLHeadingElement>()

  if (level < 1 || level > 6) {
    throw RangeError('Heading level must be between 1 and 6')
  }

  let counter: number[] | null = null
  if (ref.current) {
    counter = getCounter(ref.current)
  }

  let content = children
  if (counter) {
    content = <><span>{counter.join('.')} </span>{children}</>
  }

  return React.createElement(`h${level}`, { ref, ...restProps }, content)
}
