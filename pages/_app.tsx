import { MDXProvider } from '@mdx-js/react'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { HeadingProvider } from '../context/HeadingContext'
// import '../styles/globals.css'
import '../styles/interface.css'


function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.13.11/dist/katex.min.css"
          integrity="sha384-Um5gpz1odJg5Z4HAmzPtgZKdTBHZdw8S29IecapCSB31ligYPhHQZMIlWLYQGVoc"
          crossOrigin="anonymous"
        />
      </Head>
      <HeadingProvider>
        <MDXProvider>
          <Component {...pageProps} />
        </MDXProvider>
      </HeadingProvider>
    </>
  )
}

export default App
