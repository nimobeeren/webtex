import { MDXProvider } from '@mdx-js/react'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import '../../styles/globals.css'
import { Heading } from '../components/Heading'
import { HeadingProvider } from '../context/HeadingContext'

const components = {
  /* eslint-disable react/display-name */
  h1: (props) => <Heading depth={1} {...props} />,
  h2: (props) => <Heading depth={2} {...props} />,
  h3: (props) => <Heading depth={3} {...props} />,
  h4: (props) => <Heading depth={4} {...props} />,
  h5: (props) => <Heading depth={5} {...props} />,
  h6: (props) => <Heading depth={6} {...props} />
  /* eslint-enable react/display-name */
}

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
        <MDXProvider components={components}>
          <Component {...pageProps} />
        </MDXProvider>
      </HeadingProvider>
    </>
  )
}

export default App
