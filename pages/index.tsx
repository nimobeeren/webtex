import Script from 'next/script'
import React from 'react'
// @ts-ignore
import Content from '../public/index.mdx'

function Index() {
  return (
    <>
      <Script src="https://unpkg.com/pagedjs/dist/paged.polyfill.js" />
      <Content />
    </>
  )
}

export default Index
