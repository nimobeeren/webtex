import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import defaultTheme from '@chakra-ui/theme'
import '@fontsource/inter/400.css'
import '@fontsource/inter/700.css'
import '@fontsource/jetbrains-mono'
import { MDXProvider } from '@mdx-js/react'
import { FatalErrorBoundary, RedwoodProvider } from '@redwoodjs/web'
import { RedwoodApolloProvider } from '@redwoodjs/web/apollo'
import { Callout } from './components/Callout'
import { Embed } from './components/Embed'
import { components } from './components/mdxComponents'

import FatalErrorPage from 'src/pages/FatalErrorPage'
import Routes from 'src/Routes'

import './index.css'

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
    },
    Tabs: {
      parts: ['tab'],
      baseStyle: {
        tab: {
          _focus: {
            boxShadow: `inset ${defaultTheme.shadows.outline}`
          }
        }
      }
    }
  }
})

const App = () => (
  <FatalErrorBoundary page={FatalErrorPage}>
    <RedwoodProvider titleTemplate="%PageTitle | %AppTitle">
      <RedwoodApolloProvider>
        <ChakraProvider theme={theme}>
          {/* @ts-expect-error bug in @mdx-js/react, should be fixed in next release */}
          <MDXProvider components={{ ...components, Embed, Callout }}>
            <Routes />
          </MDXProvider>
        </ChakraProvider>
      </RedwoodApolloProvider>
    </RedwoodProvider>
  </FatalErrorBoundary>
)

export default App
