import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import '@fontsource/inter'
import '@fontsource/jetbrains-mono'
import type { AppProps } from 'next/app'
import Head from 'next/head'

const theme = extendTheme({
  fonts: {
    body: `Inter, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, "Segoe UI", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
    mono: `"JetBrains Mono", SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`
  },
  components: {
    Button: {
      baseStyle: {
        letterSpacing: 'wide'
      }
    }
  },
  styles: {
    global: {
      '.csl-entry': {
        lineHeight: '1.4em',
        marginBottom: '0.4em'
      },
      '.csl-entry:last-of-type': {
        marginBottom: 0
      },
      '.csl-left-margin': {
        float: 'left'
      },
      '.csl-right-inline': {
        marginLeft: '2.7em'
      }
    }
  }
})

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        {/* KaTeX styles */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.13.11/dist/katex.min.css"
          integrity="sha384-Um5gpz1odJg5Z4HAmzPtgZKdTBHZdw8S29IecapCSB31ligYPhHQZMIlWLYQGVoc"
          crossOrigin="anonymous"
        />
      </Head>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </>
  )
}

export default App
