import React, { useContext, useState } from 'react'

function getAllHeadingPrefixes() {
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

  const headingPrefixMap = new Map<Element, string>()

  for (let heading of allHeadings) {
    const level = Number(heading.nodeName[1])
    countPerLevel[`h${level}`]++
    for (let l = level + 1; l <= 6; l++) {
      countPerLevel[`h${l}`] = 0
    }
    headingPrefixMap.set(
      heading,
      Object.values(countPerLevel).slice(0, level).join('.')
    )
  }

  return headingPrefixMap
}

const HeadingContext = React.createContext<Map<Element, string> | null>(null)

export const HeadingProvider = ({ children }) => {
  const [headingPrefixMap, setHeadingPrefixMap] = useState(() =>
    getAllHeadingPrefixes()
  )

  // TODO: useEffect to add document onChange handler which updates heading prefix map

  return (
    <HeadingContext.Provider value={headingPrefixMap}>
      {children}
    </HeadingContext.Provider>
  )
}

export const HeadingConsumer = HeadingContext.Consumer

export function useHeadings() {
  return useContext(HeadingContext)
}
