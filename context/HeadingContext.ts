import React from 'react'

export function getCounter(node: HTMLHeadingElement) {
  if (typeof window == 'undefined') {
    return null
  }

  const countPerLevel = {
    h1: 0,
    h2: 0,
    h3: 0,
    h4: 0,
    h5: 0,
    h6: 0
  }

  const allHeadings = Array.from(
    window.document.querySelectorAll('h1,h2,h3,h4,h5,h6')
  )

  for (let heading of allHeadings) {
    const level = Number(heading.nodeName[1])
    countPerLevel[`h${level}`]++
    for (let l = level + 1; l <= 6; l++) {
      countPerLevel[`h${l}`] = 0
    }
    if (heading === node) {
      return Object.values(countPerLevel).slice(0, level)
    }
  }

  return null
}

export const HeadingContext = React.createContext({ getCounter })
export const HeadingProvider = HeadingContext.Provider
