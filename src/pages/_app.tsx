import { Button, ChakraProvider, extendTheme } from "@chakra-ui/react";
import "@fontsource/inter";
import "@fontsource/jetbrains-mono";
import { MDXProvider } from "@mdx-js/react";
import type { AppProps } from "next/app";
import { components } from "../mdxComponents";

const theme = extendTheme({
  fonts: {
    body: `Inter, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, "Segoe UI", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
    mono: `"JetBrains Mono", SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`
  },
  components: {
    Button: {
      baseStyle: {
        letterSpacing: "wide"
      }
    }
  }
});

function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <MDXProvider components={{ ...components, Button }}>
        {/* @ts-expect-error bug in @mdx-js/react */}
        <Component {...pageProps} />
      </MDXProvider>
    </ChakraProvider>
  );
}

export default App;
